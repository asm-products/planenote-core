<?php

include_once('/var/www/pn/private/config.php');

DB::$dbName = Config::$db['db_name'];
DB::$user = Config::$db['user'];
DB::$password = Config::$db['password'];

?>