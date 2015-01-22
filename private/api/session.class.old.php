<?php

class Session {
	
	public $id = null;
	public $status = null;
	public $sess_expire_old = 86400; //1 day
	public $sess_expire = 7862400; //3 months
	
	function __construct() {
		$this->id = isset($_COOKIE['PNSESSID']) ? $_COOKIE['PNSESSID'] : null;
		$this->status = $this->get_status();
	}
	
	public function new_session($user) {
		error_log('new session function executed');
		$this->id = $this->create_session_id();
		$time = time();
		
		// $query = "INSERT INTO sessions (session_id, user_id, ip_address, start_time, ua) VALUES ('".$this->id."', '".$user['uid']."', '".$user['ip_address']."', '".$time."', '".$user['ua']."')";
		// $result = $this->sql->query($query);
		DB::insert('sessions', array(
			'session_id' => $this->id,
			'user_id' => $user['id'],
			'ip_address' => $user['ip_address'],
			'start_time' => $time,
			'ua' => $user['ua']
		));
		
		$this->set_session_cookie($this->id);
		$this->status = 3;
	}
	
	public function destroy() {
		setcookie('PNSESSID', '', time()-3600, '/');
	}
	
	private function get_status($session_id=null) {
		/*	
			0 = Does not exist
			1 = Expired
			2 = Old
			3 = Good
		*/
		
		$session_id = ($session_id === null) ? $this->id : $session_id;
		if ($session_id === null)
			return 0;
		
		// $query = "SELECT * FROM sessions WHERE session_id='".$session_id."'";
		// $session = $this->sql->query($query, 'array');
		$res = DB::query("select * from sessions where session_id=%s", $session_id);
		$time = time();
		
		if (!$res)
			return 0;
		else if ($time < $res[0]['start_time'] + $this->sess_expire_old)
			return 3;
		else if ($time > $res[0]['start_time'] + $this->sess_expire_old && $time < $res[0]['start_time'] + $this->sess_expire)
			return 3; //2
		
		return 1;
	}
	
	private function create_session_id() {
		$id;
		$time = microtime();
		$rand_array = array();
		
		for ($x=0;$x<6;$x++) {
			$rand_array[] = mt_rand(100000, mt_getrandmax());
		}
		
		$id = $rand_array[mt_rand(0, 5)] . $rand_array[mt_rand(0, 5)] . $rand_array[mt_rand(0, 5)] . $time . $rand_array[mt_rand(0, 5)] . $rand_array[mt_rand(0, 5)] .$rand_array[mt_rand(0, 5)];
		$id = hash('sha256', $id);
		return $id;
	}
	
	private function set_session_cookie($id) {
		setcookie('PNSESSID', $id, time()+$this->sess_expire, '/');
	}
	
}

?>