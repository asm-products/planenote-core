<?php

include_once(__DIR__.'/../../private/api/init.php');

// POST variables
// $session_id = 'test123';//$_SESSION['session_id'];
// $post_sess_id = $_POST['browserAuth']['sessID'];

$name = $_POST['post_reg_name'];
$email = $_POST['post_reg_email'];
$password = $_POST['post_reg_pass'];

$returnObj = new RES(array(
        'status' => 'error',
        'message' => 'Unknown server error',
        'data' => array()
    ));

// Check if sessions matches
// if ($session_id !== $post_sess_id) {
//     $returnObj->set(array(
//             'status' => 'invalid_sess_id',
//             'message' => 'Invalid session ID'
//         ));

//     echo $returnObj->output(1);
//     exit();
// }

// Data validation

//name
if (strlen($name) < 3 || $name == '') {
    $returnObj->set(array(
            'status' => 'name_short',
            'message' => 'Name is too short'
        ));

    echo $returnObj->output(1);
    exit();

} else if (strlen($name) > 20) {
    $returnObj->set(array(
            'status' => 'name_long',
            'message' => 'Name is too long'
        ));

    echo $returnObj->output(1);
    exit();

} else if (strpos($name, ' ') == false) {
    $returnObj->set(array(
            'status' => 'invalid_name_format',
            'message' => 'Name needs to contain first and last names'
        ));

    echo $returnObj->output(1);
    exit();

}

//email
if ($email == '') {
    $returnObj->set(array(
            'status' => 'email_empty',
            'message' => 'Email is empty'
        ));

    echo $returnObj->output(1);
    exit();

} else {
    $email_exploded = explode('@', $email);

    if (
        strpos($email, '@') === false ||
        strpos($email, ' ') !== false ||
        $email_exploded[0] == '' ||
        end($email_exploded) == ''
    ) {
        $returnObj->set(array(
                'status' => 'invalid_email_format',
                'message' => 'Invalid email'
            ));

        echo $returnObj->output(1);
        exit();
    }
}

//password
if ($password == '') {
    $returnObj->set(array(
            'status' => 'password_empty',
            'message' => 'Password is empty'
        ));

    echo $returnObj->output(1);
    exit();

} else if (strlen($password) < 3) {
    $returnObj->set(array(
            'status' => 'password_short',
            'message' => 'Password is too short'
        ));

    echo $returnObj->output(1);
    exit();
}


//check email availablity
if (User::checkAccountExistence('email', $email)) {
    $returnObj->set(array(
            'status' => 'email_taken',
            'message' => 'Email is already in use'
        ));

    echo $returnObj->output(1);
    exit();
}

$result = User::createNewAccount(array(
    'email' => $email,
    'name' => $name,
    'password' => $password
));

if ($result) {
    // Success!
    // TODO: log user in
    $returnObj->set(array(
            'status' => 'success',
            'message' => 'Account successfully created'
        ));

    echo $returnObj->output(1);
    exit();
}

echo $returnObj->output(1);

?>
