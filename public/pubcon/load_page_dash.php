<?php

include_once(__DIR__.'/../../private/api/init.php');

//variables
$session_id = $_SESSION['session_id'];
$post_sess_id = $_POST['post_sess_id'];
$page = $_POST['page'];

/* --- Check if session id matches // loggin validation --- */
if ($session_id !== $post_sess_id || !$_user->logged_in) {
    $return['status'] = 'invalid sess_id';
    $return['message'] = 'Invalid session ID';
    return_data();
}

if (!is_array($page)) {
	$return['status'] = 'invalid data';
    $return['message'] = 'Invalid request data';
    return_data();
}

/* --- Fetch page content --- */
$fetch_page = true;
switch($page[0]) {
	case '':
	case 'profile':
		$un = (isset($page[1]) ? $page[1] : $_user->info['email']);
		$query = (isset($page[1]) ? query("SELECT * FROM `accounts` WHERE `username`='$un' AND `active`='1'", 'array') : query("SELECT * FROM `accounts` WHERE `email`='$un' AND `active`='1'", 'array'));
		
		if (isset($page[1]))
			$res = DB::queryFirstRow("select * from accounts where username=%s and active=1", $page[1]);
		else
			$res = $_user->info;
		
		if ($res) {
			$user_info = $res;
			$return['status'] = 'fetched page';
		    $return['message'] = 'Page content has been fetched';
		    $return['content'] = get_inc_contents(__DIR__.'/../viewer/profile.php');
		    return_data();
		} else {
			$return['status'] = 'user not found';
		    $return['message'] = 'That username does not exist';
		    $return['content'] = get_inc_contents(__DIR__.'/../viewer/404.php');
		    return_data();
		}
		
	    break;
	case 'chat':
		$pathname = '/'.implode('/', $page);
	
		$return['status'] = 'fetched page';
	    $return['message'] = 'Page content has been fetched';
	    $return['content'] = get_inc_contents(__DIR__.'/../viewer/chat.php');
		return_data();
	default:
		$return['status'] = '404';
	    $return['message'] = 'Page not found';
	    $return['content'] = get_inc_contents(__DIR__.'/../viewer/404.php');
	    return_data();
}

function get_inc_contents($file) {
	ob_start();
	include $file;
	$cnt = ob_get_contents();
	ob_end_clean();
	return $cnt;
}

/* --- return data --- */
function return_data() {
    global $return;
    $return = json_encode($return);
    echo $return;
    exit();
}

?>