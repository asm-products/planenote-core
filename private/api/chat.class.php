<?php

class Chat {
	public $unseen_chats = array();
	
	function __construct() {
		
		//Define external classes
		global $_sql;
		global $_user;
		$this->sql = $_sql;
		$this->account = $_user;
		
		$this->unseen_chats = $this->get_unseen_chats();
		
	}
	
	public function get_unseen_chats() {
		//This function fetches and returns an array of
		//"unseen" chats from db.
		
		if (!$this->account->logged_in)
			return array();
		
		// $query = "SELECT chat_unseen.*, chat_contents.room_id FROM chat_unseen INNER JOIN chat_contents ON chat_unseen.chat_content_id=chat_contents.uid WHERE chat_unseen.user_id='".$this->account->info['uid']."' AND chat_unseen.active='1'";
		// $result =  $this->sql->query($query, 'multi array');
		// $res = DB::query("select chat_unseen.*, chat_contents.room_id from chat_unseen inner join chat_contents on
		//                  chat_unseen.chat_content_id=chat_contents.uid where chat_unseen.user_id=%s and chat_unseen.active=1",
		//                  $this->account->info['id']);
		$res = array();
		if ($res)
			return $res[0];
		
		return array();
	}
	
	public function mark_as_seen($chat_content) {
		//This function marks CHAT_SEEN flags in db
		//as "seen". Parsed $chat_content is an array
		//of CHAT_CONTENT_ID. Returns nothing.
		
		if (!is_array($chat_content) || !$this->account->logged_in)
			return;
		
		$list = '';
		for ($i=0; $i < count($chat_content); $i++) {
			if ($i == 0)
				$list .= '(';
			
			$list .= "chat_content_id='".$chat_content[$i]['uid']."'";
			
			if ($i != count($chat_content) - 1)
				$list .= " OR ";
			else
				$list .= ") AND user_id='".$this->account->info['uid']."'";
		}
		
		if ($list == '' || count($chat_content) < 1)
			return;
		
		// $query = "UPDATE chat_unseen SET active='0' WHERE $list";
		// $this->sql->query($query);
		DB::query("update chat_unseen set active=0 where $list");
	}
	
	public static function get_msg_boards() {
		$res = new RES(array(
			'status' => 'empty',
			'data' => ''
		));
		
		global $_user;
		
		$boards = DB::query('select board_id from chat_msg where user_id=%s', $_user->info['id']);
		if (!$boards)
			return $res->output();
		
		$all_boards = array();
		foreach ($boards as $board) {
			$query = DB::query('select name,datetime from chat_boards where id=%s LIMIT 1', $board['board_id']);
			if (!$query)
				continue;
			
			$content = array(
				'id' => $board['board_id'],
				'name' => $query[0]['name'],
				'datetime' => $query[0]['datetime'],
				'members' => array()
			);
			
			$members = DB::query('select accounts.id,accounts.name from chat_members inner join accounts on accounts.id=chat_members.user_id where chat_members.board_id=%s', $board['board_id']);
			if (!$members)
				continue;
			
			foreach ($members as $member) {
				$content['members'][] = $member;
			}
			
			$all_boards[] = $content;
		}
		
		if (!$all_boards)
			return $res->output();
		
		$res->set(array(
			'status' => 'ok',
			'data' => $all_boards
		));
		
		return $res->output();
	}
	
	public static function get_msgs($boardid=null,$op=array()) {
		$res = new RES(array(
			'status' => 'empty',
			'data' => array()
		));
		
		if ($boardid === null)
			return $res->output();
		
		$option = array_merge(array(
			'start' => 0,
			'limit' => 20,
			'order' => 'earliest'
		), $op);
		
		$query = DB::query('select * from chat_msg where board_id=%s order by timestamp DESC limit %i,%i',
			$boardid,
			$option['start'],
			$option['limit']
		);
		
		if ($option['order'] == 'earliest')
			Helper::aasort($query, 'timestamp');
		
		if (!$query)
			return $res->output();
		
		$res->set(array(
			'status' => 'ok',
			'data' => $query
		));
		
		return $res->output();
	}
	
}

?>