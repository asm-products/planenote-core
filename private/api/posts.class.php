<?php

class Posts {

	private $exists = true;
	private $posterInfo = array();
	public $info = array();

	
	function __construct($post_id, $id_type="id") {
		if ($id_type == "id")
			$query = DB::query('SELECT * from posts where id=%s and active=1', $post_id);
		else
			$query = DB::query('SELECT * from posts where pid=%s and active=1', $post_id);

		if (empty($query))
			$this->exists = false;

		$this->info = $query[0];
	}

	public function exists() {
		return $this->exists;
	}

	public function posterName() {
		if (empty($this->posterInfo))
			$this->getPosterInfo();

		return $this->posterInfo['name'];
	}

	public function posterUsername() {
		if (empty($this->posterInfo))
			$this->getPosterInfo();

		return $this->posterInfo['username'];
	}

	public function getPosterInfo() {
		$query = DB::query('SELECT * from accounts where id=%s', $this->info['poster']);
		if (!empty($query)) {
			$this->posterInfo = $query[0];
			return $query[0];
		}

		return false;
	}

	/**
		Static Functions
	*/

	// Create a new post object via post ID
	public static function createFromID($id) {
		$obj = new Posts($id, "id");
		if (!$obj->exists())
			return false;

		return $obj;
	}

	// Create a new post object via post PID
	public static function createFromPID($pid) {
		$obj = new Posts($pid, "pid");
		if (!$obj->exists())
			return false;

		return $obj;
	}
	
	public static $cache = array(
		'postInfo' => array()
	);
	
	public static function exist($pid) {
		/**
		* Checks whether a post content exists
		* @param String - Post public ID
		* @return Boolean
		*/
		
		$query = DB::query('select count(*) from posts where pid=%s and active=1', $pid);
		if (!$query)
			return false;
		return true;
	}
	
	public static function getInfo($pid) {
		/**
		* Fetch the post content's details
		* @param String - Post public ID
		* @return Array - Details
		*/
		
		// grab from cache if exists
		if (array_key_exists($pid, Posts::$cache['postInfo']))
			return Posts::$cache['postInfo'][$pid];
		
		$query = DB::query('select * from posts where pid=%s and active=1', $pid);
		if (!$query)
			return array();
		
		// cache post details
		Content::$cache['postInfo'][$pid] = $query[0];
		
		return $query[0];
	}
	
	public static function getLikes($postid) {
		/**
		* Get users who likes this post
		* @param String - Post ID
		* @return Array - An array of users who liked the post
		*/
		
		$query = DB::query('select user_id from content_likes where post_id=%s and active=1', $postid);
		
		if (!$query)
			return array();
		
		$users = array();
		foreach($query as $key=>$val) {
			$users[$val['user_id']] = array();
		}
		
		return $users;
	}
	
	public static function addView($postid) {
		/**
		* +1 view to post
		* @param String - Post ID
		*/
		
		global $_account;
		
		$time = time();
		$info = array(
			'post_id' => $postid,
			'user_agent' => $_account->user_agent,
			'ip_address' => $_account->ip_address,
			'timestamp' => $time
		);
		
		if ($_account->logged_in)
			$info['user_id'] = $_account->info['iid'];
		
		DB::insert('content_views', $info);
	}
	
	
	/**
	 * Warning! this function will be slow.
	 * It is adviced to run this in a fast dedicated server.
	 * 
	 * Each post will produce a "score" which is used to order
	 * the most popular posts.
	 * 
	 * Updates views,likes and popular_points in its row as "cached".
	 * 
	 * TODO: Store results in memory for caching
	 * TODO: Run this function as a cron
	 * TODO: Include comments as a score factor
	 * TODO: If posts have the same score value order them by timestamp
	 * 
	 * @param array		Calculation settings
	 */
	public static function calculatePopularPosts() {
		$contents;
		
		// calculate all
		$contents = DB::query('select t1.iid, t1.timestamp,
			(select count(*) from content_likes as t2 where t2.active=1 and t1.iid=t2.post_id) as likes,
			(select count(*) from content_views as t3 where t3.active=1 and t1.id=t3.post_id) as views
			from contents as t1
			where t1.active=1');
		
		foreach ($contents as $content) {
			$points = 0;
			$points = $points + ($content['likes']*6);
			$points = $points + $content['views'];
			$points = $points < 0 ? 0 : $points;
			
			$t = (time() - $content['timestamp']) / 3600;
			$t = $t+2;
			$t = number_format($t, 0, '', '');
			$t = (int) $t;
			
			// TODO: lower gravity incrementally based on time
			$g = 0.85;
			$score = $points / pow($t, $g);
			$score = $score * 1000000; // move numbers up
			
			// update posts' score, likes and views in db
			$query = DB::query('update contents set popular_score=%d, likes=%i, views=%i where iid=%s limit 1',
				$score, $content['likes'], $content['views'], $content['iid']);
		}
	}
	
	
	/**
	 * Return html of posts
	 * 
	 * @param array		Post infos
	 * @return string	All of the posts' html
	 */
	public static function showPostItems($posts) {
		$html = '';
		
		// include_once('/var/www/kc/web_files/database/classes/images.class.php');
		include_once('/var/www/pn/private/api/posts.class.php');
		
		foreach ($posts as $post) {
			$post_txt = '';
			if (!empty($post['text'])) {
				$text = $post['text'];
				
				// wrap links in anchors
				$urls = Helper::extractURLs($text, true);
				foreach ($urls as $url) {
					$anchor = '<a href="'.$url.'" target="_blank">'.$url.'</a>';
					$text = str_replace($url, $anchor, $text);
				}
				
				$post_txt = '
					<div class="content-txt">
						<span class="txt-wrapper">'.$text.'</span>
					</div>
				';
			}
			
			$post_media = '';
			if (!empty($post['media_file']) && $post['media_type']!='vid') {
				$post_media = '
					<div class="content-media">
						<a href="/view/'.$post['pid'].'">
							<img class="content-media-img" src="/img/post/'.$post['media_file'].'">
						</a>
					</div>
				';
			}
			
			// Skip this post if there is no content
			if (empty($post['text']) && empty($post['media_file']))
				continue;
			
			$poster_info = array();
			$query = DB::query('SELECT * from accounts where id=%s', $post['poster']);
			if ($query && !empty($query[0]))
				$poster_info = $query[0];
			else
				continue;

			// get 60x60 profile picture
			// $profile_picture = $post['profile_picture'];
			// $profile_picture = Image::getImageThumbnail($profile_picture, 60);
			$profile_picture = 'default_profile_image.png';
			
			$html .= '
				<div class="content-item" data-id="'.$post['pid'].'">
					<a class="left-content" href="/profile/'.$poster_info['username'].'">
	                    <img class="poster-img" src="/img/profile/'.$profile_picture.'">
	                </a>
	                <div class="main-content">
	                	<div class="main-content-cntr">
	                		<div class="poster-name"><a href="/profile/'.$poster_info['username'].'">'.$poster_info['name'].'</a></div>
	                		'.$post_txt.'
	                		'.$post_media.'
	                	</div>
	                </div>
				</div>
			';
		}
		
		return $html;
	}

}

?>
