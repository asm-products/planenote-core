var _socket = null;
var _chat = {
	connected: false,
	started: false,
	connect: function() {
		if (_chat.connected)
			return;
		
		if (!_chat.started) {
			var url = '//chat.'+location.hostname;
			if (location.hostname == 'localhost')
				url += ':8888';
			_socket = io.connect(url, {
				'connect timeout': 1500,
				'reconnect ': true,
				'reconnection delay': 100,
				'reconnection limit': 10000,
				'max reconnection attempts': 3
			});
			
			//bind
			_socket.on('connection.init', function() {
				var data = {
					user: _user.username,
					sessid: jQuery.cookie('pnsession')
				};
				_socket.emit('connection.init.try', data);
			});
			
			_socket.on('connection.init.approve', function() {
				jQuery(document).trigger('chat.connect');
			});
			
			_socket.on('connection.drop', function() {
				console.log('Connection dropped by chat server.');
				jQuery(document).trigger('chat.disconnect');
			});
			
			_socket.on('disconnect', function() {
				jQuery(document).trigger('chat.disconnect');
			});
			
			_socket.on('chat.receive', function(data) {
				if (!data || data.length == 0)
					return;
				
				//TODO: notification
				
				var matches = window.location.pathname.match(/^\/*c\/+([^\/]+)/i);
				if (matches && data.chat_id == matches[1]) {
					var html = _chat.buildcode('chat_item', data);
					var item = jQuery(html);
					var page = _pg_hndlr.crnt_pg;
					page.find('.chat-items').append(item);
					_sw.timedisplay.update(page.find('.time_display'));
				}
			});
			
			_socket.on('chat.response', function(data) {
				if (!_chat.sentItem.queue[data.uid])
					return;
				
				_chat.sentItem.queue[data.uid].success(data);
				_chat.sentItem.queue[data.uid].complete();
				delete _chat.sentItem.queue[data.uid];
			});
			
			_chat.started = true;
		} else
			_socket.socket.reconnect();
	},
	disconnect: function(callback) {
		if (!_chat.connected)
			return;
		
		_socket.disconnect();
		jQuery(document).trigger('chat.disconnect', [false]);
	},
	send: function(data, cb) {
		var pass = true;
		if (!_chat.connected || !data || !data.chat_id || typeof data.content == 'undefined')
			pass = false;
		
		var callback = jQuery.extend({
			success: function() {},
			complete: function() {}
		}, cb);
		
		if (pass) {
			data.uid = uniqid();
			_socket.emit('chat.send', data);
			
			_chat.sentItem.queue[data.uid] = callback;
		}
	},
	sentItem: {
		queue: {}
	},
	buildcode: function(cmd, data) {
		if (!cmd)
			return '';
		
		var html = '';
		
		switch (cmd) {
			case 'chat_item':
				if (data) {
					if (data.user_disp == 'me')
						data.user_disp = '<span class="chat-name">'+data.sender.name+'</span>';
					else
						data.user_disp = '<a href="/user/'+data.sender.username+'" class="chat-name">'+data.sender.name+'</a>';
					
					html = 
						'<div class="item">\
							<div class="chat-dp-cont">\
								<div class="chat-dp" style="background-image:url(/img/profile/'+data.sender.profile_img.img+');"></div>\
							</div>\
							<div class="chat-content-cont">\
								<div class="chat-content-head">\
									'+data.user_disp+'\
									<span class="chat-time time_display" data-timestamp="'+data.timestamp+'"></span>\
								</div>\
								<div class="chat-content-body">\
									<div class="chat-content">\
										<span class="chat-all-text">'+data.content+'</span>\
									</div>\
								</div>\
							</div>\
						</div>';
				}
				
				break;
		}
		
		html = html.replace(/\s{2,}/g, ' ');
		return html;
	}
};

jQuery(document).ready(function() {
	var _doc = jQuery(this);
	
	_doc.on('chat.connect', function() {
		console.log('Connected to chat server.');
		_chat.connected = true;
	});
	
	_doc.on('chat.disconnect', function(event, reconnect) {
		console.log('Disconnected from chat server.');
		_chat.connected = false;
		if (reconnect)
			_chat.connect();
	});
	
	_chat.connect();
	
	//sending chat message
	_doc.on('click', '.msg_send_button', function() {
		var button = jQuery(this).disable();
		var msg_input = button.parents('.msg-write-container').find('.msg_content');
		var msg_content = msg_input.val();
		
		if (msg_content.length == 0)
			return;
		
		var matches = window.location.pathname.match(/^\/*c\/+([^\/]+)/i);
		var chat_id = matches && matches[1] ? matches[1] : matches;
		
		if (!chat_id)
			return;
		
		var page = button.parents('.chat_page');
		var data = {
			chat_id: chat_id,
			content: msg_content
		};
		
		_chat.send(data, {
			success: function(res) {
				var html = _chat.buildcode('chat_item', res);
				var item = jQuery(html);
				page.find('.chat-items').append(item);
				_sw.timedisplay.update(page.find('.time_display'));
				
				msg_input.val('');
			},
			complete: function() {
				button.enable();
				var chat_cntr = page.find('.content_wrapper');
				chat_cntr.scrollTop(chat_cntr.height());
			}
		});
	});
	
	_doc.on('keypress', '.msg_content', function(event) {
		if (event.which == 13)
			jQuery(this).parents('.msg-write-container').find('.msg_send_button').trigger('click');
	});
	
});