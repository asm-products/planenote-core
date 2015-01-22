<?php

include_once('/var/www/pn/private/api/returndata.php');
$_r = new returnData();

// Check for empty data
if (empty($_GET)) {
    $_r->errorCode(400);
    $_r->errorMessage('No data posted');
    $_r->output();
    exit();
}

include_once('/var/www/pn/private/api/init.php');

// Check if we're logged in
if (!$_user->logged_in) {
    $_r->error(401);
    $_r->output();
    exit();
}

$valid_file_types = array('img', 'vid');

// Check if we've posted a valid file
if (!in_array($_GET['type'], $valid_file_types)) {
    $_r->error(400);
    $_r->errorMessage('Invalid file type');
    $_r->output();
    exit();
}

$valid_ext;
$upload_dir;
if ($_GET['type'] == 'img') {
    $valid_ext = array('png', 'jpg', 'jpeg', 'gif');
    $upload_dir = '/var/www/pn/public/img/post/';
} else {
    $valid_ext = array('mp4');
    $upload_dir = '/var/www/pn/public/vid/post/';
}

include_once('/var/www/pn/private/lib/simple_ajax_uploader/Uploader.php');
$file_upload = new FileUpload('uploadfile');

// Check if the file extension is valid
$file_ext = $file_upload->getExtension();
if (!in_array($file_ext, $valid_ext)) {
    $_r->error(400);
    $_r->errorMessage('Invalid file extension');
    $_r->output();
    exit();
}

// Settings
$file_name = Helper::generateRandom(24) . '.' . $file_ext;
$file_upload->newFileName = $file_name;
$file_upload->sizeLimit = 15000000; //15MB
$file_upload->uploadDir = $upload_dir;
$file_upload->allowedExtensions = $valid_ext;

// Store file in storage
$upload_result = $file_upload->handleUpload();

if (!$upload_result) {
    $_r->error();
    $_r->errorMessage($file_upload->getErrorMsg());
} else {
    $_r->data('file_name', $file_name);
    $_r->data('success', true);
    $_r->data('message', 'Successfully uploaded file');
}

$_r->output();

?>
