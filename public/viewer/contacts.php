<?php

include_once(__DIR__.'/../../private/api/init.php');

?>

<div class="content_page contacts_page" data-link="/contacts">
	<div class="content_wrapper">
		<div class="pg_top_bar content_cnt content-box">
			<div class="row">
				<div class="col-xs-4 no-select">
					<span class="content_page_title">Contacts</span>
				</div>
				<div class="col-xs-8">
					<input type="text" class="search_input" placeholder="Search contacts">
				</div>
			</div>
		</div>
		<div class="content_cnt">
			<div class="contact_content_cnt">
				<div class="row item">
					<?php
					
					$limit = 12;
					$contacts = $_user->get_user_contacts();
					
					if (count($contacts) == 0) {
						$code = '
							<div class="col-xs-12">
								<div class="feed_empty">
									<span>You don\'t have any contacts yet.</span>
								</div>
							</div>
						';
						
						echo Helper::outputcode($code);
					}
					
					foreach ($contacts as $contact) {
						$res = Buildcode::contact_list($contact);
						if ($res['status'] == 'ok')
							echo $res['data'];
					}
					
					?>
					<!-- <div class="col-xs-4">
						<a class="contact_prof_img_cnt">
							<div class="df_img_view" style="background-image:url(https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-frc3/t1/1157733_10151619239928269_1142530447_n.jpg);"></div>
						</a>
						<div class="contact_name_cnt"><a>Jym Bocala</a></div>
					</div>
					<div class="col-xs-4">
						<a class="contact_prof_img_cnt">
							<div class="df_img_view" style="background-image:url(https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc3/t1/p160x160/1379203_10151993024721318_1929091042_n.jpg);"></div>
						</a>
						<div class="contact_name_cnt"><a>Den Bacabis</a></div>
					</div>
					<div class="col-xs-4">
						<a class="contact_prof_img_cnt">
							<div class="df_img_view" style="background-image:url(https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-prn1/t31/337579_10151002781976891_1579455962_o.jpg);"></div>
						</a>
						<div class="contact_name_cnt"><a>Prince Cabrera</a></div>
					</div>
					<div class="col-xs-4">
						<a class="contact_prof_img_cnt">
							<div class="df_img_view" style="background-image:url(https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-prn1/t1/1622844_712932758747590_165898128_n.jpg);"></div>
						</a>
						<div class="contact_name_cnt"><a>Ken Marin</a></div>
					</div>
					<div class="col-xs-4">
						<a class="contact_prof_img_cnt">
							<div class="df_img_view" style="background-image:url(https://fbcdn-sphotos-b-a.akamaihd.net/hphotos-ak-frc1/v/t1/1453392_10153586675735657_1579929933_n.jpg?oh=c7539b48221fab558f3d861d82a0dbdd&oe=5394946E&__gda__=1400102486_27873f0812459ad6fff6a35b60a5b221);"></div>
						</a>
						<div class="contact_name_cnt"><a>Janelle Bocala</a></div>
					</div>
					<div class="col-xs-4">
						<a class="contact_prof_img_cnt">
							<div class="df_img_view" style="background-image:url(https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-frc1/t1/222528_10151198567193153_1784987629_n.jpg);"></div>
						</a>
						<div class="contact_name_cnt"><a>Jared Bocala</a></div>
					</div>
					<div class="col-xs-4">
						<a class="contact_prof_img_cnt">
							<div class="df_img_view" style="background-image:url(https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-frc3/t1/1604742_10151888103911127_1886715238_n.jpg);"></div>
						</a>
						<div class="contact_name_cnt"><a>Ken Lozada</a></div>
					</div>
				</div> -->
			</div>
		</div>
	</div>
</div>