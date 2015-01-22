<?php

class User {
	
	public $logged_in = false;
	public $info = null;
	public $ip_address;
	public $user_agent;
	public $user_contacts = array();
	
	function __construct() {
		$this->ip_address = $_SERVER['REMOTE_ADDR'];
		$this->user_agent = $_SERVER['HTTP_USER_AGENT'];
		
		if (!$this->session_check())
			$this->session_persis_check();
	}
	
	function session_check() {
		//check if session exists
		
		if ($this->logged_in)
			return false;
		
		if (isset($_COOKIE['pnsession'])) {
			$cookie_sessid = $_COOKIE['pnsession'];
			$where = new WhereClause('and');
			$where->add('id=%s', $cookie_sessid);
			$where->add('ip_address=%s', $this->ip_address);
			$where->add('user_agent=%s', substr($this->user_agent, 0, 120));
			$where->add('active=%i', 1);
			$query = DB::query('select user_id, last_active from user_sessions where %l limit 1', $where);
			if ($query) {
				$now = time();
				$this->login($query[0]['user_id']);
				if ($now - $query[0]['last_active'] > 300)
					$this->session_renew();
				
				return true;
			}
		}
		
		return false;
	}
	
	function session_renew() {
		if (!$this->logged_in)
			return;
		
		// 1. remove session cookies
		if (isset($_COOKIE['pnsession'])) {
			$session_id = $_COOKIE['pnsession'];
			$this->unsetcookie('pnsession');
			
			// 2. invalidate session in db
			$where = new WhereClause('and');
			$where->add('id=%s', $session_id);
			$where->add('user_id=%s', $this->info['id']);
			$where->add('active=%i', 1);
			$query = DB::query('update user_sessions set active=0 where %l limit 1', $where);
		}
		
		// 3. generate new session cookie
		$session_id = $this->session_id_generate();
		$now = time();
		$expire = $now + 3600; //expire in an hour
		setcookie('pnsession', $session_id, $expire, '/');
		
		// 4. store new session in db
		$data = array(
			'id' => $session_id,
			'user_id' => $this->info['id'],
			'ip_address' => $this->ip_address,
			'user_agent' => $this->user_agent,
			'last_active' => $now
		);
		$query = DB::insert('user_sessions', $data);
	}
	
	function session_id_generate() {
		$mt = microtime();
		$rn = rand();
		$str = $mt.$rn;
		return hash('sha256', $str);
	}
	
	function session_persis_check() {
		if ($this->logged_in)
			return false;
		
		// 1. get persistent cookie
		if (isset($_COOKIE['pnperlog'])) {
			$cookie = $_COOKIE['pnperlog'];
			// 2. decrpty cookie
			$decrypted = $this->session_get_decrypt($cookie);
			$per_info = explode('|', $decrypted);
			$user_id = $per_info[0];
			$key_pair = $per_info[1];
			
			// 3. check username and key pair in db
			$where = new WhereClause('and');
			$where->add('user_id=%s', $user_id);
			$where->add('key_pair=%s', $key_pair);
			$where->add('active=%i', 1);
			$query = DB::query('select count(*) from user_login_cookies where %l limit 1', $where);
			if ($query) {
				$this->login($user_id);
				$this->session_renew();
				return true;
			}
		}
		
		return false;
	}
	
	public function session_persis_renew() {
		if (!$this->logged_in)
			return;
		
		// 1. generate
		$key = $this->session_get_encrypt_key();
		$key_pair = $this->session_id_generate();
		$str = $this->info['id'].'|'.$key_pair;
		$encrypted = $this->session_get_encrypt($str);
		$now = time();
		$expire = $now + (86400 * 7 * 26); //expire in 6 months
		setcookie('pnperlog', $encrypted, $expire, '/');
		
		// 2. store
		$data = array(
			'user_id' => $this->info['id'],
			'key_pair' => $key_pair,
			'timestamp' => $now
		);
		$query = DB::insert('user_login_cookies', $data);
	}
	
	function session_get_decrypt($str) {
		GibberishAES::size(256);
		$key = $this->session_get_encrypt_key();
		$decrypted = GibberishAES::dec($str, $key);
		return $decrypted;
	}
	
	function session_get_encrypt($str) {
		GibberishAES::size(256);
		$key = $this->session_get_encrypt_key();
		$encrypted = GibberishAES::enc($str, $key);
		return $encrypted;
	}
	
	function session_get_encrypt_key() {
		//TODO: store and retreive key via memory
		error_log(Config::$DB_KEY);
		return Config::$DB_KEY;
	}
	
	function unsetcookie($name=null) {
		if ($name===null)
			return;
		
		$expire = time() - 3600;
		setcookie($name, '', $expire, '/');
		unset($_COOKIE[$name]);
	}
	
	public function attemptLogin($creds=array(), $options=array()) {
		/**
		* Authenticate user login attempt
		* @param Array - username and password
		* @param Array - additional settings
		* @return Boolean
		*/
		
		$op = array_merge(array(
			'loginType' => 'email'
		), $options);
		
		if (!isset($creds['user']) || !isset($creds['password']))
			return false;
		
		$where = new WhereClause('and');
		if ($op['loginType']=='both') {
			$where_or = $where->addClause('or');
			$where_or->add('username=%s', $creds['user']);
			$where_or->add('email=%s', $creds['user']);
		} else
			$where->add($op['loginType'].'=%s', $creds['user']);
		
		// grab salt from db
		$query = DB::query('select salt from accounts where %l limit 1', $where);
		if (!$query)
			return false;
		$salt = $query[0]['salt'];
		
		// hash password with salt
		$password_hashed = User::bcrypt_hash($creds['password'], $salt);
		$where->add('password=%s', $password_hashed);
		
		$query = DB::query('select id from accounts where %l limit 1', $where);
		if (!$query)
			return false;
		
		// log user in
		$this->login($query[0]['id']);
		$this->session_renew();
		
		return true;
	}
	
	function login($user_id) {
		//Log user in
		$query = DB::query("select * from accounts where id=%s", $user_id);
		if (!$query) {
			$this->logged_in = false;
			$this->info = null;
			return false;
		}
		
		$this->logged_in = true;
		$this->info = $query[0];
		return true;
	}
	
	public function logout() {
		if (!$this->logged_in)
			return;
		
		if (isset($_COOKIE['pnsession'])) {
			$session_id = $_COOKIE['pnsession'];
			$now = time();
			$where = new WhereClause('and');
			$where->add('id=%s', $session_id);
			$where->add('user_id=%s', $this->info['id']);
			$where->add('active=%i', 1);
			$query = DB::query('update user_sessions set ended=%i, active=0 where %l limit 1', $now, $where);
			$this->unsetcookie('pnsession');
		}
		
		if (isset($_COOKIE['pnperlog']))
			$this->unsetcookie('pnperlog');
	}

	/**
		STATIC FUNCTION
	*/
	
	static public function bcrypt_hash($string=null, $salt=null) {
		include_once(__DIR__.'/../lib/password_hash.php');
		
		if ($string===null)
			$string = uniqid(mt_rand(), true);
		
		$options = array(
			'cost' => 11
		);
		if ($salt!==null)
			$options['salt'] = $salt;
		
		$hashed_string = password_hash($string, PASSWORD_BCRYPT, $options);
		return $hashed_string;
	}
	
	public static function createNewAccount($userInfo=null) {
		if ($userInfo===null || gettype($userInfo) != 'array')
			return false;
		
		// Generate salt and hash the password
		$password = $userInfo['password'];
		$salt = uniqid(mt_rand(), true);
		$password_hashed = User::bcrypt_hash($password, $salt);
		
		// Generate username
		// try Jeff Bocala -> jeffbocala
		$username = strtolower(trim($userInfo['name']));
		$username_temp = preg_replace('/\s+/', '', $username);
		
		// try Jeff Bocala -> jeff.bocala
		if (User::checkAccountExistence('username', $username_temp))
			$username_temp = preg_replace('/\s/', '.', $username);
		
		// try Jeff Bocala -> jeff_bocala
		if (User::checkAccountExistence('username', $username_temp))
			$username_temp = preg_replace('/\s/', '_', $username);
		
		// pretty names are taken,
		// generate random id as username
		if (User::checkAccountExistence('username', $username_temp)) {
			$username_temp = uniqid();
			while (User::checkAccountExistence('username', $username_temp)) {
				$username_temp = uniqid();
			}
		}
		
		$username = $username_temp;
		
		// Store account information to DB
		$now = time();
		
		$data = array(
			'pid' => DB::sqleval('UUID()'),
			'username' => $username,
			'email' => $userInfo['email'],
			'password' => $password_hashed,
			'salt' => $salt,
			'name' => $userInfo['name'],
			'timestamp' => $now
		);
		
		$query = DB::insert('accounts', $data);
		
		// Account insert to db unsuccessful,
		// TODO: Log error
		if (!$query)
			return false;
		
		// Send account creation email confirmation
		User::sendNewAccountEmail($userInfo['email']);
		
		return true;
	}
	
	public static function checkAccountExistence($type, $value) {
		// $type = preg_replace('/[^a-b0-9]+/', '', $type);
		
		$where = new WhereClause('and');
		$where->add($type.'=%s', $value);
		$where->add('active=%i', 1);
		
		$query = DB::query('select id from accounts where %l', $where);
		
		return !!$query;
	}
	
	// After a new account creation
	// Call this function to send a 'welcome' email
	public static function sendNewAccountEmail($email) {
		// TODO: make email then send to queue
		return true;
	}
	
	public function get_user_contacts($force=false) {
		//This function returns an array of the user's contacts
		if (!$this->logged_in)
			return array();
		
		if (count($this->user_contacts) > 0 && !$force)
			return $this->user_contacts;
		
		// $query = "SELECT accounts.name, accounts.uid FROM accounts INNER JOIN connections ON accounts.uid = connections.other_id WHERE connections.user_id='".$this->info['uid']."' AND connections.active='1'";
		// $result = $this->sql->query($query, 'multi array');
		$res = DB::query("select accounts.* from accounts inner join connections on accounts.id=connections.other_id where connections.user_id=%s and connections.active=1",
		                 $this->info['id']);
		
		if ($res) {
			$this->user_contacts = $res;
			return $res;
		}
		
		return array();
	}
	
	public static function get_user_info($user, $fromid=false) {
		if (empty($user))
			return false;
		
		$where = new WhereClause('and');
		if ($fromid)
			$where->add('id=%s', $user);
		else
			$where->add('username=%s', $user);
		
		$res = DB::query('select * from accounts where %l LIMIT 1', $where);
		
		if (!$res)
			return false;
		
		// if (count($res) > 1) {
		// 	error_log('Query return more than 1 result width user '.$user);
		// 	return false;
		// }

		return $res[0];
	}
	
	
	/**
	 * Get an array of IDs of friends
	 * @return Array
	 */
	public static function getFriends($user_id) {
		
		// Get users we've friended
		$friended = array();
		$query = DB::query('SELECT recipient_id from friends where user_id=%s and active=1', $user_id);
		if (!empty($query)) {
			foreach ($query as $key=>$value) {
				$friended[] = $value['recipient_id'];
			}
		}
		
		// Get connected friends
		$friends = array();
		if (count($friended) > 0) {
			$query = DB::query('SELECT user_id from friends where recipient_id=%s and user_id in %ls and active=1', $user_id, $friended);
			if (!empty($query)) {
				foreach ($query as $key=>$value) {
					$friends[] = $value['user_id'];
				}
			}
		}
		
		return $friends;
	}
	
}

?>