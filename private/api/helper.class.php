<?php

Class Helper {
	
	public function group_array($array, $col, $assoc=false) {
		$grouped = array();
		foreach($array as $a) {
			$key = $a[$col];
			
			if (!isset($grouped[$key]))
				$grouped[$key] = array();
			
			$grouped[$key][] = $a;
		}
		
		if ($assoc)
			$grouped = array_values($grouped);
		
		return $grouped;
	}
	
	public static function aasort(&$array, $key) {
	    $sorter=array();
	    $ret=array();
	    reset($array);
	    foreach ($array as $ii => $va) {
	        $sorter[$ii]=$va[$key];
	    }
	    asort($sorter);
	    foreach ($sorter as $ii => $va) {
	        $ret[$ii]=$array[$ii];
	    }
	    $array=$ret;
	}
	
	public static function get_user_agent() {
		$u_agent = $_SERVER['HTTP_USER_AGENT']; 
	    $bname = 'Unknown';
	    $platform = 'Unknown';
	    $version= "";

	    //First get the platform?
	    if (preg_match('/linux/i', $u_agent)) {
	        $platform = 'linux';
	    }
	    elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
	        $platform = 'mac';
	    }
	    elseif (preg_match('/windows|win32/i', $u_agent)) {
	        $platform = 'windows';
	    }
	    
	    // Next get the name of the useragent yes seperately and for good reason
	    if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)) 
	    { 
	        $bname = 'Internet Explorer'; 
	        $ub = "MSIE"; 
	    } 
	    elseif(preg_match('/Firefox/i',$u_agent)) 
	    { 
	        $bname = 'Mozilla Firefox'; 
	        $ub = "Firefox"; 
	    } 
	    elseif(preg_match('/Chrome/i',$u_agent)) 
	    { 
	        $bname = 'Google Chrome'; 
	        $ub = "Chrome"; 
	    } 
	    elseif(preg_match('/Safari/i',$u_agent)) 
	    { 
	        $bname = 'Apple Safari'; 
	        $ub = "Safari"; 
	    } 
	    elseif(preg_match('/Opera/i',$u_agent)) 
	    { 
	        $bname = 'Opera'; 
	        $ub = "Opera"; 
	    } 
	    elseif(preg_match('/Netscape/i',$u_agent)) 
	    { 
	        $bname = 'Netscape'; 
	        $ub = "Netscape"; 
	    } 
	    
	    // finally get the correct version number
	    $known = array('Version', $ub, 'other');
	    $pattern = '#(?<browser>' . join('|', $known) .
	    ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
	    if (!preg_match_all($pattern, $u_agent, $matches)) {
	        // we have no matching number just continue
	    }
	    
	    // see how many we have
	    $i = count($matches['browser']);
	    if ($i != 1) {
	        //we will have two since we are not using 'other' argument yet
	        //see if version is before or after the name
	        if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
	            $version= $matches['version'][0];
	        }
	        else {
	            $version= $matches['version'][1];
	        }
	    }
	    else {
	        $version= $matches['version'][0];
	    }
	    
	    // check if we have a number
	    if ($version==null || $version=="") {$version="?";}
	    
	    $return = array(
	        'userAgent' => $u_agent,
	        'name'      => $bname,
	        'version'   => $version,
	        'platform'  => $platform,
	        'pattern'    => $pattern
	    );
	    
	    $return = implode(',', $return);
	    return $return;
	}
	
	function respond() {
		$res = array(
			'status' => 'failed',
			'message' => ''
		);
		
		$params = func_get_args();
		if (count($params) > 0)
			$res = array_merge($res, $params[0]);
		
		return $res;
	}
	
	public static function outputcode($code='') {
		$code = preg_replace('/(\n|\s{2,})/', ' ', $code);
		return $code;
	}
	
	function gender2txt($gender='male', $type='his/her') {
		switch ($type) {
			case 'his/her':
				return ($gender == 'female') ? 'her' : 'his';
		}
	}
	
	public static function timeago($cmd,$time=null) {
		if ($time === null) {
			$time = $cmd;
			$cmd = 'timeago';
		}
		
		$now = time();
		
		switch ($cmd) {
			case 'timeago':
				$dif = $now - $time;
				return $dif . ' seconds ago';
				break;
			case 'istoday':
				return true;
		}
	}
	
	/**
	* Generate a random unique string eg. ID
	* @param integer	String length (optional)
	* @return string
	*/
	public static function generateRandom($length=24) {
		$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$str;
		while(1){
			$str = '';
			srand((double)microtime()*1000000);
			for($i = 0; $i < $length; $i++){
				$str .= substr($chars,(rand()%(strlen($chars))), 1);
			}
			break;
		}
		
		return $str;
	}

	public static function extractURLs($string, $unique=false) {
		$urls = array();
		
		if (empty($string))
			return $urls;
		
		$matches;
		preg_match_all('/(([\w-]+:\/\/|www[.])[^\s()<>]+)/', $string, $matches);
		
		if (!empty($matches[1]))
			$urls = $matches[1];
		
		if ($unique && !empty($urls))
			$urls = array_unique($urls);
		
		return $urls;
	}
	
}

?>
