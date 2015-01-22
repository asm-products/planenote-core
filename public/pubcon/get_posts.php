<?php

include_once('/var/www/pn/private/api/init.php');
include_once('/var/www/pn/private/api/posts.class.php');

$posts = array();
$amount = !empty($_GET['amount']) ? $_GET['amount'] : 10;

switch ($_GET['type']) {
	case 'subscribed':
		
        $friends = User::getFriends($_user->info['id']);
        
		if (count($friends) > 0) {
			$posts = DB::query('SELECT * from posts where poster in %ls and active=1
				order by timestamp desc', $friends);
			
			// Remove posts above the starting post
			if (!empty($_GET['last_post'])) {
				foreach ($posts as $key=>$val) {
					unset($posts[$key]);
					
					if ($val['pid'] == $_GET['last_post'])
						break;
				}
				
				if (count($posts) > 0)
					$posts = array_values($posts);
			}
			
			// Limit number of posts
			if (count($posts) > $amount)
				$posts = array_slice($posts, 0, $amount);
		}
		
		break;
}

echo Posts::showPostItems($posts);

?>