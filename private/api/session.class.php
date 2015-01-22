<?php

class Session {
	
	function __construct() {
		$user_agent = $this->get_useragent();
		
	}
	
	function get_useragent() {
		$ua = $_SERVER['REMOTE_ADDR'];
		return $ua;
	}
	
}

$_sess = new Session();

?>