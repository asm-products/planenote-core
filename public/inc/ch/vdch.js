var _vdch = {
	connected: false,
	connecting: false,
	request: {},
	call: function(options) {
		
		var op = _.extend({
			success: function(){},
			fail: function(){}
		}, options || {});
		
		var Err = {
			msg: 'Unknown error',
			type: 'unknown'
		};
		
		if (op.room===undefined) {
			Err.msg = 'Undefined room';
			op.fail(Err);
			return;
		}
		
		var call = function() {
			_vdch.connecting = true;
			_vdch.getIce({
				callback: function(res) {
					if (res.status) {
						_rt.run(function() {
							var connectionConfig = res.connection_config;
							_rt.socket.emit('vdch', {
								cmd: 'call',
								room: op.room
							});
						});
					}
				}
			});
		};
		
		if (_vdch.connected) {
			_vdch.end(function() {
				_vdch.request.room = op.room;
				call();
			});
			return;
		}
		
		call();
	},
	end: function(callback) {
		if (!_vdch.connected) {
			callback();
			return;
		}
		
		var end = function() {
			_rt.socket.emit('vdch', {
				cmd: 'end_call'
			});
		};
		
		_rt.run(end);
	},
	getIce: function(options) {
		/* Get ICE server object */
		var op = _.extend({
			callback: function(){}
		}, options || {});
		
		jQuery.ajax({
			url: '/pubcon/vdch/getICE.php',
			type: 'POST',
			dataType: 'json',
			success: function(res) {
				op.callback(res);
			}
		});
	},
	connectToRoom: function(options) {
		var op = jQuery.extend({
			localElem: _chat_msg.video.idname.local,
			remoteElem: _chat_msg.video.idname.remote
		}, options || {});
		
		if (!op.room || !op.ice) {
			console.log('invalid room or ice values');
			return false;
		}
		
		var webrtc = new SimpleWebRTC({
			localVideoEl: op.localElem,
			remoteVideosEl: op.remoteElem,
			autoRequestMedia: true,
			peerConnectionConfig: op.ice
		});
		
		webrtc.on('readyToCall', function () {
			webrtc.joinRoom(op.room);
		});
	},
	callAnswer: function(options) {
		var op = options || {};
		
		if (!(_vdch.connecting && _vdch.request.room==op.data.room)) {
			console.log('invalid answer');
			return;
		}
		
		var connect = function(i) {
			_vdch.connectToRoom({
				ice: i.ice,
				room: i.room
			});
		};
		
		// get ice object
		_vdch.getIce(function(ice) {
			connect({
				ice: ice,
				room: op.data.room
			});
		});
	}
};

jQuery(document).ready(function() {
	/* Bind vdch socket events */
	_rt.onConnect(function() {
		_rt.socket.on('_vdch', function(data) {
			
			switch (data.cmd) {
				case 'call.answer':
					_vdch.callAnswer({
						data: data
					});
					break;
			}
			
		});
	});
});