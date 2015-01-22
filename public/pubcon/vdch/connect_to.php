<?php

require_once(__DIR__.'/../../../private/api/init.php');

$returnObj = new RES();

// Get ICE server object
$iceserver = '{"p":"/getIceServers","s":200,"d":{"iceServers":[{"url":"stun:turn1.xirsys.com"},{"username":"1fc6ae18-5c09-4d25-aa90-68d0c5cd05f4","url":"turn:turn1.xirsys.com:443?transport=udp","credential":"13c451f3-66e3-44eb-bbd8-a93cf060acd3"},{"username":"1fc6ae18-5c09-4d25-aa90-68d0c5cd05f4","url":"turn:turn1.xirsys.com:443?transport=tcp","credential":"13c451f3-66e3-44eb-bbd8-a93cf060acd3"}]},"e":null}';
$return_data['connection_config'] = json_decode($iceserver);



$returnObj->set(array(
	'status' => true,
	'data' => $return_data
));

echo $returnObj->output(1);

?>