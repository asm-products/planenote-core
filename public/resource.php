<?php

$type = $_GET['type'];
$dir = $_GET['dir'];
$file = $_GET['file'];

if (empty($type) || empty($dir) || empty($file))
	exit('Resource does not exist.');

$file_path = $dir.'/'.$file;
$file_path = __DIR__.'/../storage/'.$file_path;

if (file_exists($file_path)) {
    header((phpversion() >= 5.4 ? 'HTTP/1.0 200 OK' : 'Status: 200 OK'));
    header('Content-type: image/jpeg');
    header('Content-Length: '.filesize($file_path));
    readfile($file_path);
    exit();
}

header("HTTP/1.0 404 Not Found");
// header('Content-type: image/jpeg');
echo 'Resource does not exist.';

?>