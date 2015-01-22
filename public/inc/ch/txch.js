var txch = {
	broadcast: function(options) {
		/**
		 * Broadcast message to room
		 * - If not connected to rt-server, send after connection
		 * @return none
		 */
		
		var op = _.extend({}, options || {});
		
		if (op.data===undefined) {
			console.log('No data specified');
			return;
		}
		
		// set cmd
		op.data.cmd = 'broadcast';
		
		var send = function() {
			_rt.socket.emit('_txch', op.data);
		};
		
		// send data
		_rt.run(send);
	}
};