<?php

class Buildcode {
	
	function __construct() {
		global $_user;
		global $_helper;
		
		$this->_user = $_user;
		$this->_helper = $_helper;
	}
	
	public function home_updates($data=false) {
		$ret = new RES(array(
			'status' => 'empty',
			'data' => ''
		));
		
		if (!$data)
			return $ret->output();
		
		$types = ['friends', 'cover', 'profile_img', 'name'];
		if (!in_array($data['type'], $types))
			return $ret->output();
		
		$user_info = $this->_user->get_user_info($data['user_id'], true);
		$hisher = $this->_helper->gender2txt($user_info['gender']);
		
		//create html
		$head = '
			<div class="item" data-uiid="'.$data['id'].'" data-timestamp="'.$data['timestamp'].'">
				<div class="itm_orig_img_cnt">
					<a href="/user/'.$user_info['username'].'"><div class="itm_orig_img pr_img" style="background-image:url(/img/profile/'.$user_info['profile_img']['img'].');"></div></a>
				</div>
				<div class="itm_cnt">
		';
		
		switch ($data['type']) {
			case 'friends':
				$other_user_info = $this->_user->get_user_info($data['other_id'], true);
				$body = '
						<div><a href="/user/'.$user_info['username'].'">'.$user_info['name'].'</a> is now friends with
						<a href="/user/'.$other_user_info['username'].'">'.$other_user_info['name'].'</a>.</div>
				';
				break;
			case 'cover':
				$body = '
					<div><a href="/user/'.$user_info['username'].'">'.$user_info['name'].'</a> updated '.$hisher.' profile cover.</div>
					<div class="itm_prev_cnt prev_img prev_ban">
						<div class="item_prev_cnt_prof_ban" style="background-image:url(/img/bg/'.$user_info['bg_img']['img'].');"></div>
					</div>
				';
				break;
			case 'profile_img':
				$body = '
					<div><a href="/user/'.$user_info['username'].'">'.$user_info['name'].'</a> updated '.$hisher.' profile picture.</div>
					<div class="itm_prev_cnt prev_img">
						<div class="item_prev_cnt_prof_img" style="background-image:url(/img/profile/'.$user_info['profile_img']['img'].');"></div>
					</div>
				';
				break;
			case 'name':
				$body = '
					<div><span class="bold">'.$data['previous'].'</span> changed '.$hisher.' name to <a href="/user/'.$user_info['username'].'">'.$user_info['name'].'</a>.</div>
				';
		}
		
		$footer = '
				</div>
				<span class="time_display" data-timestamp="'.$data['timestamp'].'"></span>
			</div>
		';
		
		$code = $this->_helper->outputcode($head.$body.$footer);
		$ret->set(array(
			'status' => 'ok',
			'data' => $code
		));
		
		return $ret->output();
	}
	
	public static function contact_list($user=false) {
		$ret = new RES(array(
			'status' => 'empty',
			'data' => ''
		));
		
		if (!$user)
			return $ret->output();
		
		$user['profile_img'] = json_decode($user['profile_img'], true);
		
		$code = '
			<div class="col-xs-4">
				<a href="/user/'.$user['username'].'" class="contact_prof_img_cnt">
					<div class="df_img_view" style="background-image:url(/img/profile/'.$user['profile_img']['img'].');"></div>
				</a>
				<div class="contact_name_cnt"><a href="/user/'.$user['username'].'" >'.$user['name'].'</a></div>
			</div>
		';
		
		$code = Helper::outputcode($code);
		$ret->set(array(
			'status' => 'ok',
			'data' => $code
		));
		
		return $ret->output();
	}
	
	public static function msg_list($board=null) {
		$res = new RES(array(
			'status' => 'empty',
			'data' => ''
		));
		
		if (!$board)
			return $res->output();
		
		//get list of members
		$members = $board['members'];
		$disp_members = '';
		
		$view_limit = 3;
		$count = count($members) > $view_limit ? $view_limit : count($members);
		for ($n=0;$n<$count;$n++) {
			$name = $members[$n]['name'];
			$disp_members .= $name;
			
			if ($n < $count-2 || (count($members) > $view_limit && $n < $count-1))
				$disp_members .= ', ';
			else if ($n < $count-1 && $count <= $view_limit)
				$disp_members .= ' and ';
		}
		
		if (count($members) > $view_limit) {
			$other_count = count($members) - $view_limit;
			$disp_members .= ' and '.$other_count.' '.($other_count > 1 ? 'others':'other');
		}
		
		//get most recent message
		$query = DB::query('select chat_msg.*, accounts.name from chat_msg inner join accounts on accounts.id=chat_msg.user_id where board_id=%s ORDER BY timestamp DESC LIMIT 1', $board['id']);
		$recent_msg = array(
			'name' => $query[0]['name'],
			'content' => $query[0]['content'],
			'timeago' => Helper::timeago($query[0]['timestamp'])
		);
		
		//get member dp's
		$member_dp = array();
		
		$in = new INop();
		foreach($members as $member) {
			$in->add($member['id']);
		}
		$query = DB::query('select profile_img from accounts where id in '.$in->out());
		for ($n=0;$n<count($query);$n++) {
			$img = $query[$n]['profile_img'];
			$query[$n]['profile_img'] = json_decode($img, true);
			$member_dp[] = $query[$n]['profile_img']['img'];
		}
		
		$disp_dp = '';
		for ($n=0;$n<$view_limit;$n++) {
			$disp_dp .= '<div class="msg_content_img" style="background-image:url(/img/profile/'.$member_dp[$n].');"></div>';
		}
		
		if (count($member_dp) > $view_limit)
			$disp_dp .= '<div class="msg_content_img_more"><!--<i class="fa fa-ellipsis-h"></i>--></div>';
		
		$code = '
			<a href="/c/'.$board['id'].'" class="msg_content_item">
				<div class="row">
					<div class="col-xs-8">
						<div class="msg_content_title"><span>'.$disp_members.'</span></div>
					</div>
					<div class="col-xs-4">
						<div class="msg_content_time"><span>'.$recent_msg['timeago'].'</span></div>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-8">
						<div class="msg_content_preview"><span>'.$recent_msg['name'].': '.$recent_msg['content'].'</span></div>
					</div>
					<div class="col-xs-4 msg_content_img_wrapper">
						'.$disp_dp.'
					</div>
				</div>
			</a>
		';
		
		$code = Helper::outputcode($code);
		$res->set(array(
			'status' => 'ok',
			'data' => $code
		));
		
		return $res->output();
	}
	
	public static function chat_msg_items($data=null) {
		$res = new RES(array(
			'status' => 'empty',
			'data' => ''
		));
		
		if ($data == null)
			return $res->output();
		
		$code = '';
		Helper::aasort($data, 'timestamp');
		foreach($data as $msg) {
			$user = User::get_user_info($msg['user_id'], true);
			$timeago_disp = 1==1 ? '<span class="chat-time time_display" data-timestamp="'.$msg['timestamp'].'"></span>' : '';
			global $_user;
			if ($_user->info['id'] == $msg['user_id'])
				$user_disp = '<span class="chat-name">'.$user['name'].'</span>';
			else
				$user_disp = '<a href="/user/'.$user['username'].'" class="chat-name">'.$user['name'].'</a>';
			
			$c = '
				<div class="item">
					<div class="chat-dp-cont">
						<div class="chat-dp" style="background-image:url(/img/profile/'.$user['profile_img']['img'].');"></div>
					</div>
					<div class="chat-content-cont">
						<div class="chat-content-head">
							'.$user_disp.'
							'.$timeago_disp.'
						</div>
						<div class="chat-content-body">
							<div class="chat-content">
								<span class="chat-all-text">'.$msg['content'].'</span>
							</div>
						</div>
					</div>
				</div>
			';
			
			$code .= $c;
		}
		
		$code = Helper::outputcode($code);
		$res->set(array(
			'status' => 'ok',
			'data' => $code
		));
		
		return $res->output();
	}
	
}

?>