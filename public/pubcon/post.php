<?php

include_once('/var/www/pn/private/api/returndata.php');
$_r = new returnData();

// Check for empty data
if (empty($_POST)) {
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

$post_id = Helper::generateRandom(12);

$insert_data = array(
    'pid' => $post_id,
    'poster' => $_user->info['id'],
    'timestamp' => time()
);

if (!empty($_POST['text'])) {
    $insert_data['text'] = $_POST['text'];
}

if (!empty($_POST['media'])) {
    $insert_data['media_type'] = $_POST['media']['type'];
    $insert_data['media_file'] = $_POST['media']['file'];
}

// Insert into DB
$query = DB::insert('posts', $insert_data);

if (!$query) {
    $_r->error();
} else {
    $_r->data('post', array(
        'post_id' => $post_id
    ));
    $_r->data('success', true);
    $_r->data('message', 'Successfully posted content');
}

$_r->output();

?>
