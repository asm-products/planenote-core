<?php

//Define classes
$chat = new Chat();

$unseen_chat_style = (count($chat->unseen_chats) > 0 ? 'defined' : '');

function include404() {
    return __DIR__.'/404.php';
}

if (!empty($_page[0]))
    Site::$pageName = $_page[0];

?>

<!DOCTYPE html>
<html>
    
    <head>
        <title>B Project</title>
        
        <!-- <link rel="stylesheet" type="text/css" href="/inc/styles/jqueryui-theme.css"> -->
        <link rel="stylesheet" type="text/css" href="/inc/lib/bower_components/uikit/css/uikit.almost-flat.min.css">
        <link rel="stylesheet" type="text/css" href="/inc/lib/bower_components/uikit/css/components/search.almost-flat.min.css">
        <link rel="stylesheet" type="text/css" href="/inc/lib/bower_components/uikit/css/components/notify.almost-flat.min.css">
        <!-- <link rel="stylesheet" type="text/css" href="/inc/styles/bootstrap.min.css"> -->
        <!-- <link rel="stylesheet" type="text/css" href="/inc/styles/fa/css/font-awesome.min.css"> -->
        <link rel="stylesheet" type="text/css" href="/inc/lib/bower_components/fontawesome/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="/inc/styles/alexwolfe_buttons/css/buttons.css">
        
        <link rel="stylesheet" type="text/css" href="/inc/styles/min/main.css">
        <!-- <link rel="stylesheet" type="text/css" href="/styles/dashboard.css"> -->
        <!-- <link rel="stylesheet" type="text/css" href="/styles/profile.css"> -->
        <!-- <link rel="stylesheet" type="text/css" href="/styles/chat.css"> -->
        <link rel="stylesheet" type="text/css" href="/inc/styles/chat_msg.css">
        <link rel="stylesheet" type="text/css" href="/styles/msg.css">
        <link rel="stylesheet" type="text/css" href="/styles/contacts.css">
        
        <script type="text/javascript" src="/inc/lib/bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="/inc/lib/bower_components/jquery-ui/jquery-ui.min.js"></script>
        <script type="text/javascript" src="/inc/lib/bower_components/uikit/js/uikit.min.js"></script>
        <script type="text/javascript" src="/inc/lib/bower_components/uikit/js/components/search.min.js"></script>
        <script type="text/javascript" src="/inc/lib/bower_components/uikit/js/components/notify.min.js"></script>
        <script type="text/javascript" src="/inc/scripts/min/main_lib.js"></script>
        <script type="text/javascript" src="//cdn.socket.io/socket.io-1.0.6.js"></script>
        <!-- <script type="text/javascript" src="/inc/scripts/lib/library.js"></script> -->
        <script type="text/javascript" src="/inc/scripts/jquery-ext.js"></script>
        <script type="text/javascript" src="/inc/styles/alexwolfe_buttons/js/buttons.js"></script>
        <script type="text/javascript" src="/inc/rt/rt.js"></script>
        <script type="text/javascript" src="/inc/ch/vdch.js"></script>
        <!-- <script type="text/javascript" src="/inc/ch/webrtc/latest.js"></script> -->
        
        <script type="text/javascript" src="/inc/scripts/base.js"></script>
        <script type="text/javascript" src="/inc/scripts/min/main.js"></script>
        <script type="text/javascript" src="/inc/scripts/chat_msg.js"></script>
        <script type="text/javascript" src="/inc/scripts/chat.js"></script>
        <!-- <script type="text/javascript" src="/inc/scripts/pages.js"></script> -->
        
        <!--
        <script type="text/javascript" src="/js/include/jQuery.js"></script>
        <script type="text/javascript" src="/js/include/jQuery-ui.js"></script>
        <script type="text/javascript" src="/js/include/jquery.cookie.js"></script>
        <script type="text/javascript" src="/js/include/bootstrap.min.js"></script>
        <script type="text/javascript" src="/js/include/moment.js"></script>
        <script type="text/javascript" src="/js/helper.js"></script>
        <script type="text/javascript" src="/js/sitewide.js"></script>
        <script type="text/javascript" src="/js/global_js.js"></script>
        <script type="text/javascript" src="/js/dashboard.js"></script>
        <script type="text/javascript" src="/js/include/blur.js"></script>
        <script type="text/javascript" src="/js/include/StackBlur.js"></script>
        <script type="text/javascript" src="/js/include/browserDetect.js"></script>
        <script type="text/javascript" src="/js/include/ta_auto_height.js"></script>
        <script type="text/javascript" src="/js/pages_handler.js"></script>
        <script type="text/javascript" src="/js/include/socket.io.js"></script>
        <script type="text/javascript" src="/js/profile_page.js" ></script>
        <script type="text/javascript" src="/js/chat.js" ></script>
        -->

        <?php
        
        $js = new Javascript();
        $js->add("_user.username = '".$_user->info['username']."'");
        $js->output();

        ?>
        
    </head>
    <body>
    	<!--<div class="dimmer"></div>
        <div id="dashDialog">
            <p class="diag-msg"></p>
        </div>-->
        <div id="main">
            <div id="topbar">
                <h1 class="page-name">Planenote</h1>
                <div class="top-search-cntr uk-search">
                    <input class="uk-search-field" type="search" placeholder="search...">
                </div>
            </div>
            
        	<div class="sidebar">
                <div class="sidebar_profile">
                    <div>
                        <a href="/profile"><div class="sidebar_profileimg img-thumbnail" style="background-image:url(/img/profile/<?=$_user->info['profile_image']?>)"></div></a>
                    </div>
                    <div>
                        <div><a href="/profile"><span class="sidebar_profilename"><?php echo $_user->info['name']; ?></span></a></div>
                        <div>
                            <select>
                                <option>Online</option>
                                <option>Away</option>
                                <option>Busy</option>
                                <option>Offline</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="sidebar_menu no-select">
                    <div>
                        <?php
                        
                        $nav = '';
                        $p = strtolower($_page[0]);
                        if (strlen($p) > 0)
                            $nav = $p;
                        else
                            $nav = 'home';
                        
                        ?>
                        <a href="/"class="sidebar_menu_item side_home <?php echo $nav == 'home' ? 'active' : '' ?>">
                            <div><i class="fa fa-home icon content-box"></i></div>
                            <div><span class="sidebar_menu_item_title">Home</span></div>
                        </a>
                        <a href="/profile"class="sidebar_menu_item side_profile <?php echo $nav == 'profile' ? 'active' : '' ?>">
                            <div><i class="fa fa-user icon content-box"></i></div>
                            <div><span class="sidebar_menu_item_title">Profile</span></div>
                        </a>
                        <a href="/chat" class="sidebar_menu_item side_chat <?php echo $nav=='chat' ? 'active' : '' ?>">
                            <div><i class="fa fa-comment icon content-box"></i></div>
                            <div><span class="sidebar_menu_item_title">Chat</span></div>
                        </a>
                        <a href="/contacts" class="sidebar_menu_item side_contacts <?php echo $nav == 'contacts' ? 'active' : '' ?>">
                            <div><i class="fa fa-group icon content-box"></i></div>
                            <div><span class="sidebar_menu_item_title">Contacts</span></div>
                        </a>
                        <a href="/settings" class="sidebar_menu_item side_settings <?php echo $nav == 'settings' ? 'active' : '' ?>">
                            <div><i class="fa fa-cog icon content-box"></i></div>
                            <div><span class="sidebar_menu_item_title">Settings</span></div>
                        </a>
                    </div>
                </div>
                
                <div class="sidebar_footer">
                    <div class="row uk-grid uk-grid-preserve no-select">
                        <div class="uk-width-1-4"><a href="/about">About</a></div>
                        <div class="uk-width-1-4"><a href="/terms">Terms</a></div>
                        <div class="uk-width-1-4"><a href="/privacy">Privacy</a></div>
                        <div class="uk-width-1-4" id="sidepane_logout"><a href="#">Logout</a></div>
                    </div>
                    <div class="row uk-grid">
                        <div class="uk-width-1-1">Planenote &copy; 2015</div>
                    </div>
                </div>
        	</div>
        	<div id="content" class="bg-color">
        		<?php
                $_PAGEPATH = '/'.implode('/', $_page);
				switch($_page[0]) {
                    case 'profile':
                        include_once __DIR__.'/profile.php';
                        break;
                    case 'chat':
                    case 'messages':
                        include_once __DIR__.'/msg.php';
                        break;
                    case 'c':
                        include_once __DIR__.'/chat.php';
                        break;
                    case 'contacts':
                        include_once __DIR__.'/contacts.php';
                        break;
                    case 'view':

                        $query = DB::query('SELECT count(*) as count from posts where pid=%s and active=1 limit 1', $_page[1]);
                        if ($query[0]["count"] > 0)
                            include_once "/var/www/pn/public/viewer/view.php";
                        else
                            include_once include404();

                        break;
                    // case 'user':
                    //     $_username = !isset($_page[1]) ? $_user->info['username'] : $_page[1];
                    //     $_ownprofile = $_username == $_user->info['username'];
                    //     $_userinfo = $_ownprofile ? $_user->info : $_user->get_user_info($_username);
                        
                    //     if (!$_userinfo)
                    //         include_once include404();
                        
                    //     include_once __DIR__.'/profile.php';
                    //     break;
                    case '':
                        // home
                        include_once('/var/www/pn/public/viewer/dashboard_home.php');
                        break;
					default:
                        include_once include404();
                        break;
				}
        		
        		?>
        	</div>
        </div>
        
        <!-- Dialog -->
        <div id="dialog">
            <p class="message">Are you sure you want to delete this element?</p>
            <ul class="dialog-buttons">
                <li><span class="yes red">Yes</span></li>
                <li><span class="no">No</span></li>
            </ul>
            <span class="dialog-close img-replace"></span>
        </div>
        <!-- Dialog -->
        
        <input id="post_validate" type="hiddden" style="display:none;visibility:hidden;" value="<?=$_SESSION['validation_key']?>">
    </body>
    
</html>
