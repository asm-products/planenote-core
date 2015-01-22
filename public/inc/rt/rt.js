var _rt = {
	socket: null,
	connected: false,
	connecting: false,
	connect: function() {
		if (_rt.connected)
			return;
		
		_rt.connecting = true;
		
		var url = window.location.hostname;
		if (window.location.hostname == 'localhost')
			url += ':8844';
		url += '/rt';
		_rt.socket = io.connect(url, {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 10000,
			timeout: 8000,
			autoConnect: true,
		});
		
		_rt.socket.on('connect', function() {
			console.log('Connected to RT server');
			_rt.connected = true;
			_rt.connecting = false;
		});
		
		_rt.socket.on('disconnect', function() {
			console.log('Disconnected from RT server');
			_rt.connected = false;
		});
		
		_rt.socket.on('reconnecting', function() {
			console.log('Reconnecting to RT server');
			_rt.connected = false;
			_rt.connecting = true;
		});
		
		// server wants to authenticate this account
		_rt.socket.on('rt.connection.requireAuth', function(res) {
			// send session cookie
			_rt.socket.emit('rt.connection.requireAuth', {
				c: jQuery.cookie()
			});
		});
		
		// this account has be authenticated, connection ready
		_rt.socket.on('rt.connection.ready', function() {
			console.log('Account authenticated');
			// bind socket events
			_.each(events, function(e) {
				_rt.socket.on(e.type, e.data);
			});
			// run queued socket emits
			_.defer(_rt.runOnConnectFn);
		});
	},
	onConnectQueue: [],
	onConnect: function(callback) {
		if (_rt.connected)
			callback();
		else
			_rt.onConnectQueue.push(callback);
	},
	run: function(callback) {
		/* _rt.onConnect alias */
		_rt.onConnect(callback);
	},
	runOnConnectFn: function() {
		// run queued callbacks
		_.each(_rt.onConnectQueue, function() {
			this();
		});
		
		// clear queued callbacks
		_rt.onConnectQueue = [];
	},
	events: []
};

// Connect to RT server on page load
jQuery(document).ready(function() {
	// _rt.connect();
});
