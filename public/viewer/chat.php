<?php

include_once(__DIR__.'/../../private/api/init.php');

global $_page;
$uid = uniqid();

?>

<div class="content_page page__chat_msg" data-link="/c/<?=$_page[1]?>">
	<div class="chat-video-container">
		<div class="video-items-cnt">
			<div class="dvch_remote remote-container items"></div>
			<div class="dvch_local local-container"></div>
		</div>
	</div>
	
	<div class="content_wrapper chat-items-container" data-uid="<?=$uid?>">
		<div class="chat-wrapper-inner">
			<div class="chat-items">
				<script>
					jQuery(function() {
						var  item_cntr = jQuery('*[data-uid="<?=$uid?>"]');
						// item_cntr.scrollTop(item_cntr.height());
						item_cntr.scrollTop(999999);
					});
				</script>
				
				<?php
								
				$board_id = $_page[1];
				$messages = Chat::get_msgs($board_id);
				
				if ($messages['status'] != 'empty' && count($messages['data']) > 0) {
					// echo Buildcode::chat_msg_items($messages['data'])['data'];
					foreach($messages['data'] as $msg) {
						$user = User::get_user_info($msg['user_id'], true);
						global $_user;
						$isMe = $_user->info['id'] == $msg['user_id'];
						if ($isMe)
							$user_disp = '<span class="chat-name">'.$user['name'].'</span>';
						else
							$user_disp = '<a href="/user/'.$user['username'].'" class="chat-name">'.$user['name'].'</a>';
						
						$c = '
							<div class="item">
								<div class="chat-dp-cont">
									<div class="chat-dp" style="background-image:url(/img/profile/'.$user['profile_img']['img'].');"></div>
								</div>
								<div class="chat-content-cont">
									<div class="chat-content-head">
										'.$user_disp.'
										<span class="chat-time time_display" data-timestamp="'.$msg['timestamp'].'"></span>
									</div>
									<div class="chat-content-body">
										<div class="chat-content">
											<span class="chat-all-text">'.$msg['content'].'</span>
										</div>
									</div>
								</div>
							</div>
						';
						
						echo $c;
					}
				}
				
				?>
				
				<!--<div class="chat-date bg-color">
					<span>Yesterday</span>
				</div>
				<div class="item">
					<div class="chat-dp-cont">
						<a href="/user/jaybocala">
							<div class="chat-dp" style="background-image:url(https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/t1.0-1/c41.0.160.160/p160x160/1797388_10152116625628153_317049725_n.jpg);"></div>
						</a>
					</div>
					<div class="chat-content-cont">
						<div class="chat-content-head">
							<a href="/user/jaybocala" class="chat-name">Jared Bocala</a>
						</div>
						<div class="chat-content-body">
							<div class="chat-content">
								<span class="chat-all-text">Jeff</span>
							</div>
						</div>
					</div>
				</div>
				<div class="chat-date bg-color" style="bottom:-1px;">
					<span>Today</span>
				</div>
				<div class="item">
					<div class="chat-dp-cont">
						<div class="chat-dp" style="background-image:url(https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/t1.0-1/c41.0.160.160/p160x160/1797388_10152116625628153_317049725_n.jpg);"></div>
					</div>
					<div class="chat-content-cont">
						<div class="chat-content-head">
							<a href="#" class="chat-name">Jared Bocala</a>
							<span class="chat-time">5 mins ago</span>
						</div>
						<div class="chat-content-body">
							<div class="chat-content">
								<span class="chat-all-text">Hey Jeff</span>
							</div>
						</div>
					</div>
				</div>
				<div class="item">
					<div class="chat-dp-cont">
						<div class="chat-dp" style="background-image:url(https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1.0-1/c41.0.160.160/p160x160/1185226_10152215756399278_1057930104_n.jpg)"></div>
					</div>
					<div class="chat-content-cont">
						<div class="chat-content-head">
							<span class="chat-name">Me</span>
							<span class="chat-time">3 mins ago</span>
						</div>
						<div class="chat-content-body">
							<div class="chat-content">
								<span class="chat-all-text">Yo whats up?</span>
							</div>
						</div>
					</div>
				</div>
				<div class="item">
					<div class="chat-dp-cont">
						<div class="chat-dp" style="background-image:url(https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash3/t1.0-1/c41.0.160.160/p160x160/1797388_10152116625628153_317049725_n.jpg);"></div>
					</div>
					<div class="chat-content-cont">
						<div class="chat-content-head">
							<a href="#"><span class="chat-name">Jared Bocala</span></a>
							<span class="chat-time">1 min ago</span>
						</div>
						<div class="chat-content-body">
							<div class="chat-content">
								<span class="chat-all-text">Can you tell mama to call me?</span>
							</div>
						</div>
					</div>
				</div>-->
			</div>
		</div>
	</div>
	<div class="msg-write-container bg-color">
		<div class="msg-write-main">
			<div class="msg-input-container">
				<input class="msg_content form-control" placeholder="Enter your message..">
			</div>
			<div class="msg-button-container">
				<button class="msg-button button button-circle button-flat-royal" title="Send file"></button>
				<button class="msg-button button button-circle button-flat-caution" title="Start video"></button>
				<button class="msg_send_button msg-button button button-circle button-flat-primary" title="Send"></button>
			</div>
		</div>
	</div>
</div>