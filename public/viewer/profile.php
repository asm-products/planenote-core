<?php

include_once(__DIR__.'/../../private/api/init.php');

$user = $_user->info['username'];
$specific = '';
$url = '/profile';
global $_page;
if (!empty($_POST['specific'])) {
	$user = $_POST['specific'];
	$specific = 'data-page-uniq="'.$user.'"';
	$url = '/profile/'.$user;
} else if (!empty($_page) && isset($_page[1])) {
	$user = $_page[1];
	$url = '/profile/'.$user;
}

$_userinfo = $_user->get_user_info($user);
$ownprofile = $user==$_user->info['username'];
$nameverif = '';

// if (!$ownprofile) {
// 	$connection = Profile::get_connection($_userinfo);
	
// 	if ($connection['connected'])
// 		$nameverif = '<span class="profile_verfctn" title="Friends"><i class="fa fa-check-circle"></i></span>';
// }

?>

<div class="content_page profile_page" data-link="<?=$url?>" <?=$specific?> data-user-id="<?=$_userinfo['pid']?>" >
	<div class="content_wrapper">
		<div class="profile_img_wrapper">
			<div class="profile_img">
				<img src="/img/profile/<?=$_userinfo['profile_image']?>" >
			</div>
		</div>
		<div class="profile_name_cnt">
			<div class="profile_name"><span><?=$_userinfo['name']?></span><?=$nameverif?></div>
		</div>
		
		<?php if (!$ownprofile): ?>
		<div class="profile-actions">
			<div class="uk-button-group">
				<button class="uk-button"><i class="fa fa-comments"></i> Message</button>
				<button class="uk-button"><i class="fa fa-video-camera"></i> Call</button>
			</div>
			<?php
			$status = '0';
			$button_txt = 'Add as Friend';
			$button_icon = 'fa-plus';
			
			// Check if we have this user as a friend
			$friended = false;
			$query = DB::query('SELECT count(*) as c from friends where user_id=%s and recipient_id=%s and active=1',
				$_user->info['id'], $_userinfo['id']);
			if ($query && $query[0]['c']) {
				$friended = true;
				$button_txt = 'Request Sent';
				$status = '1';
			}
			
			// Check if this user has us as friend
			$query = DB::query('SELECT count(*) as c from friends where user_id=%s and recipient_id=%s and active=1',
				$_userinfo['id'], $_user->info['id']);
			if ($query && $query[0]['c']) {
				$button_txt = 'Accept Friend Request';
				$status = '3';
				
				if ($friended) {
					$button_txt = 'Friends';
					$button_icon = 'fa-check';
					$status = '2';
				}
			}
			
			?>
			<button class="addFriend uk-button" data-status="<?=$status?>"><i class="icon fa <?=$button_icon?>"></i> <span class="text"><?=$button_txt?></span></button>
		</div>
		<?php endif; ?>
		
		<div class="content_cnt profile content-card content-item-cntr">

			<?php

			// Display posts
            include_once('/var/www/pn/private/api/posts.class.php');

            $posts = DB::query('SELECT * FROM posts WHERE poster=%s AND active=1 ORDER BY timestamp DESC', $_userinfo['id']);
            if (!empty($posts)) {
                echo Posts::showPostItems($posts);
            }

			?>

		</div>
	</div>
</div>