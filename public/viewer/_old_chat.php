<?php

global $fetch_page;
if (isset($fetch_page) && $fetch_page === true) {
	include_once(__DIR__.'/../../private/api/init.php');
	global $user_info;
}

global $_helper;
global $_user;

$bg_img = json_decode($_user->info['bg_img'], true);
$bg_img = $bg_img['img'];
$bg_sett = json_decode($_user->info['bg_img'], true);

$chat = new Chat();
$js = new Javascript();

?>

<?php

/* SHOW CHAT LIST */

//get all ongoing/previous chats
$all_chats = query("SELECT chat_contents.*, accounts.name, accounts.profile_img, accounts.username FROM chat_contents AS chat_contents JOIN accounts AS accounts ON chat_contents.user_id = accounts.uid WHERE room_id IN (SELECT room_id FROM chat_rooms WHERE user_id='".$_user->info['uid']."') ORDER BY datetime", 'multi array');

//group chats
$grouped_chats = false;

if ($all_chats) {
	$templevel = $all_chats[0]['room_id'];   
	$newkey = 0;
	$grouped_chats[$templevel] = '';

	foreach ($all_chats as $key => $val) {
		if ($templevel == $val['room_id'])
			$grouped_chats[$templevel][$newkey] = $val;
		else
			$grouped_chats[$val['room_id']][$newkey] = $val;
		
		$newkey++;
	}
}

$chat_id = false;

global $pathname;
global $page;
if (isset($pathname) && $pathname != '') {
	if (isset($page[1]) && $page[1] != '')
		$chat_id = $page[1];
} else {
	$pathname = '/'.implode('/', $page);
	
	//Try get MESSAGE ID from url
	$l = (substr($pathname, 0, 1) == '/' ? substr($pathname, 1) : $pathname);
	$l = explode('/', $l);
	
	if (isset($l[1]) && $l[1] != '')
		$chat_id = $l[1];
}

$search_con_disp = ($grouped_chats !== false && count($grouped_chats) > 0 ? 'display:none;' : '');

?>

<div id="chatPageBg" class="contentPageContainer" data-content-page-link="<?php echo $pathname; ?>" style="background-image:url('/img/bg/<?php echo $bg_img; ?>');background-size:<?php echo $bg_sett['bg_size'].' '.$bg_sett['bg_size']; ?>;background-position:<?php echo $bg_sett['bg_pos']; ?>;background-repeat:no-repeat;">
	<div class="contentContainer bg-blur">
		<?php
		
		if ($pathname == '/chat' || $pathname == '/chat/') {
			
		/* MAIN CHAT PAGE */
		
		//Set CONTACT_LIST
		$contacts = $_user->get_user_contacts();
		if (count($contacts) > 0) {
			$js->add("contactList = [];");
			foreach ($contacts as $c) {
				$js->add("
					contactList.push({
						id: '".$c['uid']."',
						label: '".$c['name']."',
						value: '".$c['name']."'
					});
				");
			}
		}
		
		//Remove sidebar unseen chat flag
		$js->add("
		     jQuery(document).ready(function() {
		     	jQuery('#sidebarChat i').removeClass('defined');
		     });
		");
		
		?>
		<div class="chat_list_container">
			<div class="chat_list">
				<div class="card_tb_con box-sizing"><span class="card_tb_title no-select">Chat</span><span class="card_btn_add_con"><span class="box-sizing"><i class="icon-plus"></i></span></span></div>
				<div class="card_list_search_con ui-front" style="<?php echo $search_con_disp; ?>"><input id="cardSearchContacts" type="text" placeholder="Search your contacts to start a chat"></div>
				<ul class="no-select">
					<?php
					
					$unseen_chats = $_helper->group_array($chat->unseen_chats, 'room_id');
					
					if ($grouped_chats) {
						foreach ($grouped_chats as $chat_room) {
							$chat_room = array_values($chat_room);
							
							$u_list = [];
							$u_list['names'] = [];
							$u_list['usernames'] = [];
							$u_list['ids'] = [];
							$u_list['dp'] = [];
							for ($i=0; $i < count($chat_room); $i++) {
								//skip if user was already added, else add to list
								if (array_search($chat_room[$i]['user_id'], $u_list['ids']) === false) {
									$u_list['names'][$i] = $chat_room[$i]['name'];
									$u_list['usernames'][$i] = $chat_room[$i]['username'];
									$u_list['ids'][$i] = $chat_room[$i]['user_id'];
									$u_list['dp'][$i] = json_decode($chat_room[$i]['profile_img'], true);
								}
							}
							
							//refresh array keys
							$u_list['names'] = array_values($u_list['names']);
							$u_list['usernames'] = array_values($u_list['usernames']);
							$u_list['ids'] = array_values($u_list['ids']);
							$u_list['dp'] = array_values($u_list['dp']);
							
							//Remove LOGGED_USER from NAMES
							foreach ($u_list['names'] as $key => $value) {
								if ($u_list['ids'][$key] == $_user->info['uid']) {
									unset($u_list['names'][$key]);
									unset($u_list['usernames'][$key]);
									unset($u_list['ids'][$key]);
									unset($u_list['dp'][$key]);
									break;
								}
							}
							
							//If U_LIST is empty, it means LOGGED_USER was the only one that has CHAT_CONTENT
							//So now we'll fetch the list of people involved in the CHAT_ROOM
							if (count($u_list['ids']) <= 0) {
								$query = "SELECT chat_rooms.*, accounts.name, accounts.profile_img, accounts.username FROM chat_rooms AS chat_rooms JOIN accounts AS accounts ON chat_rooms.user_id = accounts.uid WHERE room_id = '".$chat_room[0]['room_id']."'";
								$result = query($query, 'multi array');
								
								//Remove LOGGED_USER from RESULT
								foreach ($result as $key => $value) {
									if ($result[$key]['user_id'] == $_user->info['uid']) {
										unset($result[$key]);
										break;
									}
								}
								
								$result = array_values($result);
								
								for ($i=0; $i < count($result); $i++) {
									$u_list['names'][] = $result[$i]['name'];
									$u_list['usernames'][] = $result[$i]['username'];
									$u_list['ids'][] = $result[$i]['user_id'];
									$u_list['dp'][] = json_decode($result[$i]['profile_img'], true);
								}
							}
							
							//refresh array keys
							$u_list['names'] = array_values($u_list['names']);
							$u_list['usernames'] = array_values($u_list['usernames']);
							$u_list['ids'] = array_values($u_list['ids']);
							$u_list['dp'] = array_values($u_list['dp']);
							
							$disp_i = [];
							//Display name list
							$disp_i['names'] = '';
							for ($i=0; $i < count($u_list['names']); $i++) {
								$disp_i['names'] .= /*'<a href="/profile/'.$u_list['usernames'][$i].'">'.*/$u_list['names'][$i]/*.'</a>'*/;
								if ($i < count($u_list['names']) - 1)
									$disp_i['names'] .= ', ';
							}
							
							//Display picture thumbnails
							$disp_i['thumbs'] = '';
							foreach ($u_list['dp'] as $key => $value) {
								$disp_i['thumbs'] .= '<li style="background-image:url(/img/profile/'.$value['img'].');background-size:'.$value['bg_size'].';background-position:'.$value['bg_pos'].';"></li>';
							}
							
							//Get latest chat content
							$lst_chat = end($chat_room);
							$lst_chat_i['id'] = $lst_chat['uid'];
							$lst_chat_i['name'] = $lst_chat['name'];
							$lst_chat_i['content'] = $lst_chat['content'];
							$lst_chat_i['dp'] = json_decode($lst_chat['profile_img'], true);
							
							if (count($u_list['names']) > 1)
								$content_prev = ($lst_chat_i['id'] == $_user->info['uid'] ? 'Me' : $lst_chat_i['name']).': '.$lst_chat_i['content'];
							else
								$content_prev = $lst_chat_i['content'];
							
							$li_unseen_class = '';
							if (isset($unseen_chats[$chat_room[0]['room_id']]))
								$li_unseen_class = 'chat_new ';
							
							echo '
								<li data-cht-li-identify="'.$chat_room[0]['room_id'].'" class="'.$li_unseen_class.'box-sizing">
									<div class="chat_list_li_names">'.$disp_i['names'].'</div>
									<div class="chat_list_li_txt">'.$content_prev.'</b></div>
									<ul class="chat_list_li_img box-sizing">'.$disp_i['thumbs'].'</ul>
								</li>
							';
						}
					}
					
					?>
				</ul>
			</div>
		</div>
		<?php
		
		} else {
		
		/* CHAT ROOM PAGE */
		
		//Get message content
		$query = "SELECT chat_contents.*, accounts.name, accounts.profile_img FROM chat_contents AS chat_contents JOIN accounts AS accounts ON chat_contents.user_id = accounts.uid WHERE chat_contents.room_id='".mysql_real_escape_string($chat_id)."' ORDER BY datetime DESC";
		$chat_content = query($query, 'multi array');
		$chat_content = array_reverse($chat_content);
		$chat_content = array_values($chat_content);
		
		//Deactivate CHAT_SEEN flag in db
		$chat->mark_as_seen($chat_content);
		
		?>
		
		<div class="chat_msg_container" data-chat-identify="<?php echo ($chat_id !== false ? $chat_id : ''); ?>">
			<div class="chat_msg_content_area box-sizing">
				<div class="main_msg_content_area">
					<script>
						jQuery(document).ready(function() {
							if (_page.find('.main_msg_content_area').length > 0) {
								_page.find('.main_msg_content_area').scrollTop(_page.find('.main_msg_content_area')[0].scrollHeight);
							}
						});
					</script>
					<ul>
						<?php
						global $_user;
						foreach($chat_content as $msg) {
							$owner = ($msg['user_id'] == $_user->info['uid'] ? true : false);
							
							$msg_float_cl = ($owner ? 'msg_cont_right' : 'msg_cont_left');
							$profile_img = json_decode($msg['profile_img'], true);
							$img = $profile_img['img'];
							
							echo '
								<li class="'.$msg_float_cl.' chat_li_cont box-sizing">
									<div class="chat_main_dp_thumb" style="background-image:url(/img/profile/'.$img.');background-size:'.$profile_img['bg_size'].';background-position:'.$profile_img['bg_pos'].';"></div>
									<div class="chat_main_content_box">
										<div class="chat_main_name">'.$msg['name'].'</div>
										<div class="chat_main_msg">'.$msg['content'].'</div>
									</div>
								</li>
							';
						}
						?>
					</ul>
				</div>
			</div>
			
			<div class="chat_msg_input_area box-sizing">
				<div class="chat_msg_input box-sizing"><textarea class="box-sizing" placeholder="Enter your message here.." spellcheck="false" tabindex="1"></textarea></div>
				<div class="chat_msg_send"><button>Send</button></div>
			</div>
		</div>
		
		<?php
		
		}
		
		echo $js->output();
		
		?>
	</div>
</div>