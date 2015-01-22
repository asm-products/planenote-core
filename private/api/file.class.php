<?php

class File {
	
	public $file = array();
	public $name = '';
	public $ext = '';
	public $size = 0;
	
	public $tmp = '';
	public $hashed_name = '';
	
	public $ext_filter = array();
	public $max_size = 5242880; //5mb
	
	
	public function __construct($file=null) {
		if ($file === null || !isset($file) || empty($file))
			return;
		
		$this->file = $file;
		$this->name = $file['name'];
		$this->size = $file['size'];
		
		//File extension
		$ext = explode('.', $file['name']);
		$this->ext = end($ext);
		
		$this->tmp = $file['tmp_name'];
	}
	
	public function ext_allowed() {
		//Checks wether the file ext is allowed
		$ext = $this->ext;
		return (!empty($ext) && in_array($ext, $this->ext_filter) ? true : false);
	}
	
	public function hash_name($name=null) {
		$name = ($name === null ? $this->name : $name);
		$time = microtime();
		$size = $this->size;
		$r1 = uniqid(rand(0, 9999));
		$r2 = rand(9999, 999999);
		
		$this->hashed_name = hash('sha256', $name.$time.$size.$r1.$r2).'.'.$this->ext;
		return $this->hashed_name;
	}
	
	
	private $image = null; //Image class
	
	public function image($cmd, $param1=null, $param2=null) {
		if ($this->image === null)
			$this->image = new Image();
		
		switch ($cmd) {
			case 'load':
				//param1 = tmp image
				
				if ($param1 === null)
					return;
				
				$this->image->load($param1);
				
				break;
			case 'save':
				//param1 = base directory to save
				if ($param1 === null)
					return;
				
				$dir = '/backend/storage/';
				$n = ($this->hashed_name == '' ? $this->hash_name() : $this->hashed_name);
				$this->image->save($dir.$param1.'/'.$n);
				
				break;
			case 'clear':
				$this->image->clear();
				$this->image = null;
				
				break;
			case 'blur':
				$this->image->blur();
				
				break;
			case 'b64_decode':
				return $this->image->b64_decode($param1, $param2);
				break;
		}
		
		return false;
	}
	
}

?>