<?php

include_once(__DIR__.'/../../private/api/init.php');

// POST variables
// $session_id = 'test123';
// $post_sess_id = $_POST['post_sess_id'];

$user = $_POST['user'];
$password = $_POST['password'];

$returnObj = new RES(array(
        'status' => 'error',
        'message' => 'Unknown server error',
        'data' => array()
    ));

/* --- Check if session id matches --- */
// if ($session_id !== $post_sess_id) {
//     $return['status'] = 'invalid sess_id';
//     $return['message'] = 'Invalid session ID';
//     return_data();
// }

/* --- check if email exists --- */
// $account_info = query("SELECT * FROM `accounts` WHERE `email`='".mysql_real_escape_string($email)."' AND `active`='1' LIMIT 1", 'array');
// $account_info = DB::query("select * from accounts where email=%s and active=1", $email);
// $account_info = $account_info ? $account_info[0] : $account_info;

// if (!$account_info) {
//     $return['status'] = 'wrong login details';
//     $return['message'] = 'Incorrect email or password';
//     return_data();
// }


/* --- check if password matches --- */
// $salted_pass = $account_info['salt'].$pass.$account_info['salt'];
// $encrypted_pass = hash('sha256', $salted_pass);

// if ($account_info['password'] !== $encrypted_pass) {
//     $return['status'] = 'wrong login details';
//     $return['message'] = 'Incorrect email or password';
//     return_data();
// }

/* --- Log user in --- */
//last_active
// $datetime = time();
// query("UPDATE `accounts` SET `last_active`='$datetime' WHERE `email`='".mysql_real_escape_string($email)."' LIMIT 1");
// DB::query("update accounts set last_active=%i where email=%s", $datetime, $email);

// Log user in
$login_attempt = $_user->attemptLogin(array(
        'user' => $user,
        'password' => $password
    ));

//login failed
if (!$login_attempt) {
    $returnObj->set(array(
            'status' => 'fail',
            'message' => 'Login attempt failed'
        ));
    
    echo $returnObj->output(1);
    exit();
}

$returnObj->set(array(
        'result' => true,
        'status' => 'success',
        'message' => 'Login attempt success'
    ));

echo $returnObj->output(1);

?>