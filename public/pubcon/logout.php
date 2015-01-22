<?php

include_once(__DIR__.'/../../private/api/init.php');

$CMD = $_POST['cmd'];

if ($CMD == 'logout')
	$_user->logout();

?>