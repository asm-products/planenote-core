<?php

include_once(__DIR__.'/../private/api/init.php');

if (!isset($_SESSION['validation_key']))
    $_SESSION['validation_key'] = sha1(rand(100, 999).time().rand(1000, 9999));


/* --- Dynamic Page View --- */
$_page = explode('/', $_SERVER['REQUEST_URI']);
unset($_page[0]);
$_page = array_values($_page);
$_pages = array('profile', 'chat', 'contacts', 'settings', 'view', 'user', 'c');

if ($_user->logged_in) {
    // if (strlen($_page[0]) == 0 || in_array($_page[0], $_pages))
        include_once(__DIR__.'/viewer/dashboard.php');
    // else
    //     include_once(__DIR__.'/viewer/404.php');
    
    exit();
}

?>

<!DOCTYPE HTML>
<html>

<head>
    <link rel="stylesheet" type="text/css" href="/inc/styles/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="//code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="/inc/styles/min/home.css">
    
    <script type="text/javascript" src="/inc/lib/bower_components/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="/inc/lib/bower_components/jquery-ui/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/inc/scripts/jquery-ext.js"></script>
    <script type="text/javascript" src="/inc/lib/bower_components/underscore/underscore-min.js"></script>
    <!-- <script type="text/javascript" src="/js/helper.js"></script> -->
    <!-- <script type="text/javascript" src="/js/global_js.js"></script> -->
    <script type="text/javascript" src="/inc/scripts/min/home.js"></script>
</head>

<body>
    <div id="mainPageContainer">
        <div id="leftPanel">
            <div class="contentContainer">
                <div class="logo">Planenote</div>
                <div class="new-user-text box-sizing"><span class="new-user-icon"></span><span class="new-user-msg">Create a New Account</span></div>
                <div class="new-user-form">
                    <input type="text" id="regName" class="field-input box-sizing" placeholder="Name" style="margin-top:0px;"><span class="errMsg regNameErrMsg box-sizing"></span>
                    <div class="hidden-fields">
                        <input type="text" id="regEmail" class="field-input box-sizing" placeholder="Email"><span class="errMsg regEmailErrMsg box-sizing"></span>
                        <input type="password" id="regPass" class="field-input box-sizing" placeholder="Password"><span class="errMsg regPassErrMsg box-sizing"></span>
                    </div>
                    <button id="newUserGo" class="box-sizing"><span class="button_loader"></span><span class="button_check"></span><span class="button_fail"></span><span class="button_text">Sign Up</span></button>
                </div>
            </div>
        </div>
        <div id="rightContent">
            <div class="loginForm">
                <input type="email" name="email" id="loginEmail" class="box-sizing" placeholder="Email" tabindex="1" autocomplete="on">
                <input type="password" id="loginPass" class="box-sizing" placeholder="Password" tabindex="2">
            </div>
            <button id="loginButton" class="box-sizing" tabindex="3"><span class="button_loader"></span><span class="button_text">Log In</span></button>
            <ul class="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Contact</a></li>
                <li style="color:#737373;margin-left:10px;">&copy; 2015 Planenote</li>
            </ul>
        </div>
    </div>
    <div id="dimmer" style="display:none;"></div>
    <input type="hiddden" style="display:none;visibility:hidden;" value="<?php echo $_SESSION['validation_key']; ?>">
</body>

</html>