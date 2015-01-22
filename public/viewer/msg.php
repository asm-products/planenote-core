<?php

include_once(__DIR__.'/../../private/api/init.php');

?>

<div class="content_page msg_page" data-link="/chat">
	<div class="msg_wrapper content_wrapper">
		<div class="pg_top_bar content_cnt content-box">
			<div class="row">
				<div class="col-xs-4 no-select">
					<span class="content_page_title">Chat List</span>
				</div>
				<div class="col-xs-8">
					<input type="text" class="search_input" placeholder="Search messages">
				</div>
			</div>
		</div>
		<div class="msg_content content_cnt">
			<div>
				<?php
				
				$boards = Chat::get_msg_boards();
				if ($boards['status'] == 'ok') {
					foreach ($boards['data'] as $board) {
						$content = Buildcode::msg_list($board);
						if ($content['status'] == 'ok')
							echo $content['data'];
					}
				} else {
					$code = '
						<div>
							<div class="feed_empty">
								<span>You don\'t have any messages yet.</span>
							</div>
						</div>
					';
					
					echo Helper::outputcode($code);
				}
				
				?>
				<!-- <a href="#" class="msg_content_item unread">
					<div class="row">
						<div class="col-xs-8">
							<div class="msg_content_title"><span>Jym, Ken, Prince</span><span> and 3 other people</span></div>
						</div>
						<div class="col-xs-4">
							<div class="msg_content_time"><span>3 hours ago</span></div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-8">
							<div class="msg_content_preview"><span>Prince: well that didnt turn out great, maybe we should plan it better next time aye?</span></div>
						</div>
						<div class="col-xs-4 msg_content_img_wrapper">
							<div class="msg_content_img" style="background-image:url(https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-frc3/t1/1157733_10151619239928269_1142530447_n.jpg);"></div>
							<div class="msg_content_img" style="background-image:url(https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-prn1/t1/1622844_712932758747590_165898128_n.jpg);"></div>
							<div class="msg_content_img" style="background-image:url(https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-prn1/t31/337579_10151002781976891_1579455962_o.jpg);"></div>
							<div class="msg_content_img_more"><!--<i class="fa fa-ellipsis-h"></i>--><!---</div>
						</div>
					</div>
				</a> -->
				<!-- <a href="#" class="msg_content_item">
					<div class="row">
						<div class="col-xs-8">
							<div class="msg_content_title"><span>Jared Bocala</span></div>
						</div>
						<div class="col-xs-4">
							<div class="msg_content_time"><span>2 days ago</span></div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-8">
							<div class="msg_content_preview"><span>are you guys at church already?</span></div>
						</div>
						<div class="col-xs-4 msg_content_img_wrapper">
							<div class="msg_content_img" style="background-image:url(https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-frc1/t1/222528_10151198567193153_1784987629_n.jpg);"></div>
						</div>
					</div>
				</a>
				<a href="#" class="msg_content_item">
					<div class="row">
						<div class="col-xs-8">
							<div class="msg_content_title"><span>Ken Lozada, Janelle Bocala</span></div>
						</div>
						<div class="col-xs-4">
							<div class="msg_content_time"><span>1 week ago</span></div>
						</div>
					</div>
					<div class="row">
						<div class="col-xs-8">
							<div class="msg_content_preview"><span>Janelle: Your just ghey ken lol</span></div>
						</div>
						<div class="col-xs-4 msg_content_img_wrapper">
							<div class="msg_content_img" style="background-image:url(https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-frc3/t1/1604742_10151888103911127_1886715238_n.jpg);"></div>
							<div class="msg_content_img" style="background-image:url(https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-frc1/v/t1/1453392_10153586675735657_1579929933_n.jpg?oh=c7539b48221fab558f3d861d82a0dbdd&oe=5394946E&__gda__=1400102486_27873f0812459ad6fff6a35b60a5b221);"></div>
						</div>
					</div>
				</a> -->
			</div>
		</div>
	</div>
</div>