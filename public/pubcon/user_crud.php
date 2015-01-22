<?php

include_once(__DIR__.'/../../private/api/init.php');

$cmd = $_POST['cmd'];
$res = new RES(array(
	'success' => false,
	'code' => 600,
	'message' => 'Unknown error'
));


switch ($cmd) {
	case 'change name':
		$post_name = $_POST['post_name'];

		//validate name
		if (strlen($post_name) < 3 || strlen($post_name) > 20 || strpos($post_name, ' ') == false) {
			$return['status'] = 'invalid name';
			$return['message'] = 'That name is invalid';
			return_data();
		}
		
		//check if name stayed the same
		// $old_name = query("SELECT `name` FROM `accounts` WHERE `email`='$logged_user' LIMIT 1", 'result');
		$old_name = DB::query("select name from accounts where uid=%s", $_user->info['uid']);
		if ($old_name && $post_name == $old_name[0]) {
			$return['status'] = 'same name';
			$return['message'] = 'Your name stayed the same';
			return_data();
		}
		
		//change name
		// $query = query("UPDATE `accounts` SET `name`='".mysql_real_escape_string($post_name)."' WHERE `email`='$logged_user'");
		$query = DB::update('accounts', array(
			'name' => $post_name
		), 'uid=%s', $_user->info['uid']);
		
		if ($query) {
			$return['status'] = 'name changed';
			$return['message'] = 'Your name has been changed';
			return_data();
		}

		break;
	case 'change dp':
		$profile_sett = array(
	          'bg_size' => $_POST['bg_size'],
	          'bg_pos' => $_POST['bg_pos']
	    );

		/* --- Settings change only --- */
		if ($_POST['change_sett'] == 1) {
			//Grab saved settings from db
			// $query = "SELECT profile_img FROM accounts WHERE email='".$account->user."'";
			// $result = $sql->query($query, 'result');
			$res = DB::query("select profile_img from accounts where uid=%s", $_user->info['uid']);
			if ($res)
				 $profile_sett['img'] = json_decode($res[0], true)['img'];
			else break;
			
			//Update settings in db
			// $query = "UPDATE accounts SET profile_img='".json_encode($profile_sett)."' WHERE email='".$account->user."'";
			// $result = $sql->query($query);
			$res = DB::update('accounts', array(
				'profile_img' => json_encode($profile_sett)
			), 'uid=%s', $_user->info['uid']);
			
			if ($res) {
				$return['status'] = 'image updated';
				$return['message'] = 'Successfully updated profile image';
				return_data();
			}
			
			break;
		}

		/* --- Upload new profile --- */
		
		
		$file = new File($_FILES['img']);
		
		$file->ext_filter = array('jpeg', 'jpg', 'png', 'gif');
		$file->max_size = 8388608; //8mb
		
		/*$file_name = $_FILES['img']['name'];
		$file_ext = explode('.', $file_name); $file_ext = end($file_ext);
		$allowed_files = array('jpeg', 'jpg', 'png', 'gif');
		$file_temp = $_FILES['img']['tmp_name'];*/

		//extension validation
		//if (!in_array($file_ext, $allowed_files)) {
		if (!$file->ext_allowed()) {
			$return['status'] = 'not allowed';
			$return['message'] = 'File type not allowed';
			return_data();
		}
		
		//size validation
		//if ($_FILES['img']['size'] > 20971520) {
		if ($file->size > $file->max_size) {
			$return['status'] = 'too big';
			$return['message'] = 'Image size to big';
			return_data();
		}
		
		//Proceed
		
		//$hashed_name = hash('sha256', $logged_user.$file_name.time().$_FILES['img']['size']).'.'.$file_ext;
		$file->hash_name();
		
		//if (move_uploaded_file($file_temp, $main_dir.'/backend/storage/profile/'.$hashed_name)) {
		if (move_uploaded_file($file->tmp, __DIR__.'/../../storage/profile/'.$file->hashed_name)) {
			$profile_sett['img'] = $file->hashed_name;
			// $query = "UPDATE accounts SET profile_img='".json_encode($profile_sett)."' WHERE email='".$account->user."'";
			// $result = $sql->query($query);
			$res = DB::update('accounts', array(
				'profile_img' => json_encode($profile_sett)
			), 'uid=%s', $_user->info['uid']);
			
			if ($res) {
				$return['status'] = 'image changed';
				$return['message'] = 'Successfully changed profile image';
				$return['link'] = '/img/profile/'.$file->hashed_name;
				return_data();
			}
		}

		break;
	case 'change bg':
		$bg_sett = array(
	          'bg_size' => (isset($_POST['bg_size']) ? $_POST['bg_size'] : '100%'),
	          'bg_pos' => (isset($_POST['bg_pos']) ? $_POST['bg_pos'] : '50% 50%')
	    );
		
		/* --- Settings change only --- */
		if ($_POST['change_sett'] == 1) {
			//Grab saved settings from db
			// $query = "SELECT bg_img FROM accounts WHERE email='".$account->user."'";
			// $result = $sql->query($query, 'result');
			$res = DB::query('select bg_img from accounts where uid=%s', $_user->info['uid']);
			if ($res)
				 $bg_sett['img'] = json_decode($res[0], true)['img'];
			else break;
			
			//Update settings in db
			// $query = "UPDATE accounts SET bg_img='".json_encode($bg_sett)."' WHERE email='".$account->user."'";
			// $result = $sql->query($query);
			$res = DB::update('accounts', array(
				'bg_img' => json_encode($bg_sett)
			), 'uid=%s', $_user->info['uid']);
			if ($res) {
				$return['status'] = 'bg updated';
				$return['message'] = 'Successfully updated wallpaper';
				return_data();
			}
			
			break;
		}

		/* --- Upload new bg --- */
		
		if (isset($_FILES['img'])) {
			$img = $_FILES['img'];
			$file = new File($img);
			
			$file->ext_filter = array('jpeg', 'jpg', 'png', 'gif');
			$file->max_size = 8388608; //8mb
			
			//extension validation
			if (!$file->ext_allowed()) {
				$return['status'] = 'not allowed';
				$return['message'] = 'File type not allowed';
				return_data();
			}
			
			//size validation
			if ($file->size > $file->max_size) {
				$return['status'] = 'too big';
				$return['message'] = 'Image size to big';
				return_data();
			}
			
			$file->hash_name();
		
			if (move_uploaded_file($file->tmp, __DIR__.'/../../storage/bg/'.$file->hashed_name)) {
				$bg_sett['img'] = $file->hashed_name;
				// $query = "UPDATE accounts SET bg_img='".json_encode($bg_sett)."' WHERE email='".$account->user."'";
				// $result = $sql->query($query);
				$res = DB::update('accounts', array(
					'bg_img' => json_encode($bg_sett)
				), 'uid=%s', $_user->info['uid']);
				if ($res) {
					$return['status'] = 'image changed';
					$return['message'] = 'Successfully changed profile image';
					$return['link'] = '/img/bg/'.$file->hashed_name;
					return_data();
				}
			}
		} else {
			/*$img = $_POST['img'];
			$file = new File();
			$t = $file->image('b64_decode', $img);*/
			
			$img = new Image();
			
			$img_data = $_POST['img'];
			$b64 = explode(',', $img_data);
			$b64 = $b64[1];
			
			$img->load($b64, true);
			
			$file = new File();
			$name = $file->hash_name($b64).'jpeg';
			$img->save(__DIR__.'/../../storage/bg/'.$name);
			
			$bg_sett['img'] = $name;
			// $query = "UPDATE accounts SET bg_img='".json_encode($bg_sett)."' WHERE email='".$account->user."'";
			// $result = $sql->query($query);
			$res = DB::update('accounts', array(
				'bg_img' => json_encode($bg_sett)
			), 'uid=%s', $_user->info['uid']);
			
			if ($res) {
				$return['status'] = 'image changed';
				$return['message'] = 'Successfully changed profile image';
				$return['link'] = '/img/bg/'.$name;
				return_data();
			}
		}
		
		//Proceed
		/*$hashed_name = hash('sha256', $logged_user.$file_name.time().$_FILES['img']['size']).'.'.$file_ext;
		if (move_uploaded_file($file_temp, $main_dir.'/backend/storage/bg/'.$hashed_name)) {
			$query = query("UPDATE `accounts` SET `bg_img`='".$hashed_name."', `bg_sett`='".json_encode($bg_sett)."' WHERE `email`='$logged_user'");
			if ($query) {
				$return['status'] = 'image changed';
				$return['message'] = 'Successfully changed profile image';
				$return['link'] = '/img/bg/'.$hashed_name;
				return_data();
			}
		}*/

		break;
	case 'add_remove_contact':
		// Check if contact exists nad grab their details
		$contact_id = $_POST['contact_id'];
		$recipient = DB::query('SELECT id from accounts where pid=%s and active=1 limit 1', $contact_id);

		if ($recipient) {
			//check if already connected
			$recipient = $recipient[0];
			$query = DB::query('SELECT count(*) as count from friends where user_id=%s and recipient_id=%s and active=1 limit 1',
				$_user->info['id'], $recipient['id']);
			
			if ($query[0]['count'] > 0) {
				// Remove recipient
				$query = DB::update('friends', array(
					'active' => 0
				), 'user_id=%s and recipient_id=%s and active=1',
					$_user->info['id'],
					$recipient['id']
				);
				
				// Check if recipient has added us
				$friended_me = false;
				$query = DB::query('SELECT count(*) as c from friends where user_id=%s and recipient_id=%s and active=1',
						$recipient['id'], $_user->info['id']);
				if ($query && $query[0]['c'] > 0)
					$friended_me = true;
				
				$res->set(array(
					'success' => true,
					'code' => 200,
					'action' => 'removed',
					'friended_me' => $friended_me,
					'message' => 'Successfully removed recipient'
				));
				
			} else {
				// Add recipient
				$query = DB::insert('friends', array(
					'user_id' => $_user->info['id'],
					'recipient_id' => $recipient['id'],
					'timestamp' => time()
				));
				
				if ($query) {
					
					// Check if recipient has also added us
					$query = DB::query('SELECT count(*) as c from friends where user_id=%s and recipient_id=%s and active=1',
						$recipient['id'], $_user->info['id']);
					
					$connected = false;
					if ($query && $query[0]['c'] > 0)
						$connected = true;
					
					$res->set(array(
						'success' => true,
						'code' => 200,
						'action' => 'added',
						'connected' => $connected,
						'message' => 'Successfully added recipient'
					));
				}
			}
		} else {
			// Recipient does not exist
			$res->set(array(
				'success' => false,
				'code' => 404,
				'message' => 'That user does not exist'
			));
		}

		break;
	case 'fetch user info':
		//Get $_SESSION info
		$prfl_img = json_decode($_user->info['profile_img'], true);
		$img = $prfl_img['img'];
		
		$return['status'] = 'info fetched';
		$return['info'] = array(
			'sessId' => $session_id,
			'id' => $_user->info['uid'],
			'name' => $_user->info['name'],
			'username' => $_user->info['username'],
			'email' => $_user->info['email'],
			'profile_img' => $img,
			'profile_sett' => $prfl_img
		);
		return_data();
		break;
	case 'home_latest':
		$res->set(['status'=>'ok']);
		$updates = $_profile->get_connection_activities();
		if ($updates['status']=='ok') {
			$code = '';
			foreach($updates['data'] as $item) {
				$u = $_buildcode->home_updates($item);
				if ($u['status'] == 'ok')
					$code .= $u['data'];
			}
			
			$res->set(array(
				'message' => 'Fetched latest updates',
				'data' => $code
			));
		} else
			$res->set(['message'=>'No items fetched']);
		
		exit($res->output(true));
		break;
}

echo $res->output();

?>