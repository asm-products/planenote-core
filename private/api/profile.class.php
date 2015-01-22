<?php

class Profile {
	
	function __construct() {
		global $_helper;
		global $_user;
		$this->_user = $_user;
		$this->_helper = $_helper;
	}
	
	public function get_connection_activities($limit=10) {
		$data = array();
		$ret = new RES(array(
			'status' => 'empty',
			'data' => $data
		));
		
		$contacts = $this->_user->get_user_contacts();
		if (count($contacts) == 0)
			return $res;
		
		//get connection changes
		$where = new WhereClause('or');
		foreach($contacts as $contact) {
			$where->add('user_id=%s', $contact['id']);
		}
		$res = DB::query('select * from user_updates where (%l) and active=1 limit %i', $where, $limit);
		if ($res) $data = array_merge($data, $res);
		
		//get connection friendship activities
		$res = DB::query('select * from connections where (%l) and active=1 limit %i', $where, $limit);
		if ($res) $data = array_merge($data, $res);
		
		$total = count($data);
		
		//order from new to old
		if ($total > 0) {
			usort($data, function($a, $b) {
				return $b['timestamp'] - $a['timestamp'];
			});
		}
		
		//limit by $limit
		$data = array_slice($data, 0, $limit);
		
		//return
		$ret->set(array(
			'status' => 'ok',
			'total' => $total,
			'data' => $data
		));
		
		return $ret->output();
	}
	
	public static function get_connection($user) {
		global $_user;
		$res = new RES([
			'connected' => false,
			'connection_type' => null
		]);
		
		$where = new WhereClause('and');
		$where->add('user_id=%s', $_user->info['id']);
		$where->add('other_id=%s', $user['id']);
		$query = DB::query('select type from connections where %l and active=1', $where);
		if (!$query) return $res->output();
		
		$res->set([
			'connected' => true,
			'connection_type' => $query[0]
		]);
		return $res->output();
	}
	
}

?>