<?php

class Config {

    // Is this environment non-production?
    public static $dev = true;
    
    // Databse config
    public static $db = array(
        'db_name' => 'planenote',
        'user' => 'root',
        'password' => ''
    );
    
    public static $DB_KEY = '';
    
    // Job server
    public static $useQueue = false;
    
    public static function configure() {
        if (file_exists('/var/www/pn/private/config.json')) {
            $config = json_decode(file_get_contents('/var/www/pn/private/config.json'), true);
            
            if (isset($confg['dev']))
                Config::$dev = $config['dev'];
            
            if (isset($config['db']))
                Config::$db = array_merge(Config::$db, $config['db']);
            
            if (isset($config['useQueue']))
                Config::$useQueue = $config['useQueue'];
            
            if (isset($config['DB_KEY']))
                Config::$DB_KEY = $config['DB_KEY'];
            
        }  
    }

}

?>
