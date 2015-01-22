<?php
session_start();

include_once('/var/www/pn/private/config.php');
Config::configure();

$site_url = ($_SERVER['REMOTE_ADDR'] != '127.0.0.1') ? $_SERVER['HTTP_HOST']: 'localhost';
$site_url = ($_SERVER['SERVER_PORT'] != 80 ? $site_url.':'.$_SERVER['SERVER_PORT'] : $site_url);

include_once(__DIR__.'/meekrodb.2.2.class.php');
include_once(__DIR__.'/dbconnect.php');
// include_once(__DIR__.'/query.php');
include_once(__DIR__.'/../lib/moment/Moment.php');
include_once(__DIR__.'/../lib/aes/GibberishAES.php');

include_once('/var/www/pn/private/api/site.class.php');

include_once(__DIR__.'/res.class.php');
include_once(__DIR__.'/helper.class.php');
include_once(__DIR__.'/buildcode.class.php');
// include_once(__DIR__.'/sql.class.php');
include_once(__DIR__.'/user.class.php');
// include_once(__DIR__.'/session.class.php');
include_once(__DIR__.'/profile.class.php');
include_once(__DIR__.'/javascript.class.php');
include_once(__DIR__.'/file.class.php');
include_once(__DIR__.'/chat.class.php');
include_once(__DIR__.'/image.class.php');

$_helper = new Helper();
$_user = new User();
$_profile = new Profile();
$_buildcode = new Buildcode();

?>
