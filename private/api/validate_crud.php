<?php

/*
 * Validation for AJAX calls
 */

include_once(__DIR__.'/init.php');

$validation_key = $_SESSION['validation_key'];
$post_key = $_POST['post_validate'];

if (!$_user->logged_in) {
	$res = new RES(array(
		'status' => false,
		'message' => 'Invalid session'
	));
	
	exit($res->output(true));
}

if (empty($post_key) || $validation_key != $post_key) {
	$res = new RES(array(
		'status' => false,
		'message' => 'Validation error'
	));
	
	exit($res->output(true));
}

?>