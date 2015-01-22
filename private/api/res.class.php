<?php

class RES {
	
	private $res = array(
		'status' => 'failed',
		'success' => false,
		'message' => null,
		'data' => null
	);
	
	function __construct() {
		$args = func_get_args();
		if (isset($args[0]))
			$this->set($args[0]);
	}
	
	public function set() {
		$args = func_get_args();
		if (isset($args[0]) && gettype($args[0]) == 'array')
			$this->res = array_merge($this->res, $args[0]);
	}
	
	public function output($encode=true) {
		return $encode ? json_encode($this->res) : $this->res;
	}
	
}

?>