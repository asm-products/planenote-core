//configuration
var http = require('http');
	express = require('express.io');
	app = express();
	server = http.createServer(app); //var app = http.createServer().listen(8888);
	parseCookie = require('connect').utils.parseJSONCookie;
	jquery = require('jquery');
	_helper = require('./helper.js');

app.configure(function() {
	app.set('port', process.env.PORT || 8888);
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'shh',
		key: 'express.sid'
	}));
});

var io = require('socket.io').listen(server);
	io.set('log level', 1);
	// io.set('authorization', function(data, accept) {
	// 	if (data.headers.cookie) {
	// 		data.cookie = _helper.parseCookie(data.headers.cookie);
	// 		data.sessionID = data.cookie['PHPSESSID'];
	// 	} else {
	// 		console.log('else');
	// 		return accept('No cookie transmitted.', false);
	// 	}
		
	// 	accept(null, true);
	// });
	// io.set('browser client minification', true);

var _db = require('mysql').createConnection({
	host: 'localhost',
	user: 'root',
	database: 'bproject'
});

server.listen(app.get('port'), function() {
	console.log('Listening on port ' + app.get('port'));
});

/* --- Prototypes --- */
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
 		if (obj.hasOwnProperty(key)) size++;
 	}
 	return size;
 };

var _users = [];
var _clients = [];

io.sockets.on('connection', function(socket) {
	// socket.sessionID = socket.manager.handshaken[socket.id].sessionID;
	
	//client connection
	// socket.emit('req user info');
	socket.emit('connection.init');
	socket.on('connection.init.try', function(data) {
		if (!data || !data.user || !data.sessid) {
			_sys.connection.drop(socket);
			return;
		}
		
		//authentication
		var query = "select accounts.id,accounts.name from accounts inner join user_sessions on accounts.id=user_sessions.user_id where accounts.username="+_db.escape(data.user)+
			" and user_sessions.id="+_db.escape(data.sessid);
		
		_db.query(query, function(e,rows) {
			if (e) console.log(e);
			
			if (rows.length == 0) {
				_sys.connection.drop(socket);
				return;
			}
			
			//store client information
			if (!_users[rows[0]['id']]) {
				_users[rows[0]['id']] = {
					name: rows[0]['name'],
					socket_id: socket.id
				};
				
				_clients[socket.id] = {
					user_id: rows[0]['id'],
					socket: socket
				};
			}
			
			socket.emit('connection.init.approve');
		});
	});
	
	// socket.on('res user info', function(data) {
	// 	if (typeof data == 'undefined' || typeof data.info == 'undefined' || typeof data.info.sessid == 'undefined') {
	// 		deny_connection(socket);
	// 		return;
	// 	}
		
	// 	var sess = data.info.sessid;
		
	// 	if (sess in _users) {
	// 		console.log('[existing] ' + _users[sess].info.name + ' connected.');
	// 		_clients[socket.id];
	// 		_users[sess].clients[socket.id];
	// 	} else {
	// 		_users[sess] = {};
	// 		_users[sess].clients = {};
	// 		_users[sess].clients[socket.id] = socket.id;
	// 		_users[sess].info = {};
			
	// 		var q = "SELECT accounts.* FROM accounts INNER JOIN sessions ON accounts.uid=sessions.user_id WHERE sessions.session_id="+mysql.escape(sess);
	// 		mysql.query(q, function(e, rows) {
	// 			if (e)
	// 				console.log(e);
				
	// 			if (typeof rows != 'undefined') {
	// 				socket.emit('res user info confirm');
	// 				_users[sess].info = rows[0];
					
	// 				_clients[socket.id] = {};
	// 				_clients[socket.id].socket = socket;
	// 				_clients[socket.id].sessid = sess;
	// 				console.log('[new] ' + _users[sess].info.name + ' connected.');
	// 			} else
	// 				deny_connection(socket);
	// 		});
	// 	}
	// });
	
	//client disconnection
	socket.on('disconnect', function() {
		if (_clients[socket.id]) {
			var user_id = _clients[socket.id].user_id;
			if (_users[user_id])
				delete _users[user_id];
			
			delete _clients[socket.id];
		}
	});
	
	socket.on('chat.disconnect', function() {
		socket.disconnect();
	});
	
	//Client requests contact list
	// socket.on('fetch contact list', function() {
	// 	if (typeof _clients[socket.id] == 'undefined') {
	// 		deny_connection();
	// 		return;
	// 	}
		
	// 	var sessid = _clients[socket.id].sessid;
	// 	var id = _users[sessid].info.id;
	// 	var query = "SELECT accounts.name, accounts.uid FROM accounts INNER JOIN connections ON accounts.uid = connections.other_id WHERE connections.user_id="+mysql.escape(id)+" AND connections.active='1'";
	// 	mysql.query(query, function(err, rows) {
	// 		var list = new Array();
	// 		if (typeof rows != 'undefined') {
	// 			for (var i=0; i < rows.length; i++) {
	// 				list.push({
	// 					id: rows[i].uid,
	// 					label: rows[i].name,
	// 					value: rows[i].name
	// 				});
	// 			}
	// 		}
	// 		socket.emit('res contact list', {list: list});
	// 	});
	// });
	
	// socket.on('req start chat', function(data) {
	// 	if (!socket_auth(socket)) {
	// 		deny_connection();
	// 		return;
	// 	}
		
	// 	var sessid = _clients[socket.id].sessid;
	// 	var newChat = false;
	// 	var withUserId = data.id;
	// 	var roomId;

	// 	//If chat room exists continue where left off
	// 	var query = "SELECT room_id FROM chat_rooms WHERE room_id IN (SELECT room_id FROM chat_rooms WHERE user_id="+ mysql.escape(_users[sessid].info.id) +" OR user_id="+ mysql.escape(withUserId) +" GROUP BY room_id HAVING COUNT(*)=2) GROUP BY room_id HAVING COUNT(*)=2 LIMIT 1";
	// 	mysql.query(query, function(err, rows) {
	// 		if (rows.length > 0) {
	// 			//previous chat room does exist, continue where left off
	// 			roomId = rows[0].room_id;
	// 		} else {
	// 			//no existing chat room, create a new one
	// 			roomId = _helper.createUID(2);
				
	// 			var datetime = Math.floor(new Date().getTime() / 1000);
				
	// 			var query = "INSERT INTO chat_rooms (room_id, user_id, last_active, datetime) VALUES ('"+ roomId +"', "+ mysql.escape(_users[sessid].info.id) +", '"+ datetime +"', '"+ datetime +"'), ('"+ roomId +"', "+ mysql.escape(withUserId) +", '"+ datetime +"', '"+ datetime +"')";
	// 			mysql.query(query);
	// 			newChat = true;
	// 		}
			
	// 		//Respond with success
	// 		socket.emit('res start chat', {
	// 			info: {
	// 				new: newChat,
	// 				chatId: roomId,
	// 				chatWith: withUserId
	// 			}
	// 		});
	// 	});
	// });
	
	socket.on('chat.send', function(sendData) {
		// Check data
		if (!sendData || !sendData.uid || !sendData.chat_id || typeof sendData.content == 'undefined') {
			console.log('Bad data.');
			return;
		}
		
		// Authentication
		if (!_sys.connection.auth(socket)) {
			console.log('Client authentication failed.');
			_sys.connection.drop(socket);
			return;
		}
		
		var user_id = _clients[socket.id].user_id;
		_sys.chat.boardAuth(user_id, sendData.chat_id, function(result) {
			if (!result) {
				console.log('Board member authentication failed.');
				return;
			}
			
			//Fetch sender details
			_sys.chat.fetch_user_info(user_id, function(error,sender_info) {
				if (error) {
					console.log(error);
					return;
				}
				
				if (!sender_info || sender_info.length == 0) {
					console.log('User not found from database');
					return;
				}
				
				// Retreive board members
				var query = "select user_id from chat_members where board_id="+_db.escape(sendData.chat_id)+" and active=1";
				_db.query(query, function(error, rows) {
					if (error) {
						console.log('Database query failed.');
						console.log(error);
						return;
					}
					
					// Write to database
					var now = Math.round(new Date().getTime() / 1000);
					var query = "insert into chat_msg (id, board_id, user_id, content, timestamp) values (UUID(), "+_db.escape(sendData.chat_id)+", "+_db.escape(user_id)+", "+
						_db.escape(sendData.content)+", "+now+")";
					_db.query(query, function(error,rows) {
						if (error) console.log(error);
					});
					
					// Filter by online members
					if (rows.length > 0) {
						var sockets = [];
						for (var n=0; n<rows.length; n++) {
							var row = rows[n];
							if (row['user_id'] == user_id || !_users[row['user_id']])
								continue;
							var socket_id = _users[row['user_id']].socket_id;
							if (!_clients[socket_id])
								continue;
							var soc = _clients[socket_id].socket;
							sockets.push(soc);
						}
						
						// Emit to members
						if (sockets.length > 0) {
							for (var n=0; n<sockets.length;n++) {
								var data = {
									chat_id: sendData.chat_id,
									sender: sender_info,
									timestamp: now,
									content: sendData.content
								};
								
								sockets[n].emit('chat.receive', data);
							}
						}
					}
					
					sendData.timestamp = now;
					sendData.sender = sender_info;
					sendData.user_disp = 'me';
					
					socket.emit('chat.response', sendData);
				});
			});
		});

		
		
		// var sender_id = _users[_clients[socket.id].sessid].info.uid;
		// var room_id = data.chatid;
		// var time = Math.round(new Date().getTime() / 1000);
		
		//chat authentication
		// var query = "SELECT COUNT(*) FROM chat_rooms WHERE user_id=" + mysql.escape(sender_id) + " AND room_id=" + mysql.escape(room_id);
		// mysql.query(query, function(error, rows) {
		// 	if (error) {
		// 		console.log('mysql error 1');
		// 		return_server_error(socket);
		// 		return;
		// 	} else if (rows['COUNT(*)'] < 1) {
		// 		deny_connection(socket);
		// 		return;
		// 	}
			
		// 	//store content in db
		// 	var content_id = _helper.createUID();
		// 	var query = "INSERT INTO chat_contents (uid, room_id, user_id, content, datetime) VALUES ('"+content_id+"', "+mysql.escape(room_id)+", "+mysql.escape(sender_id)+", "+mysql.escape(data.content)+", '"+time.toString()+"')";
		// 	mysql.query(query, function(error, rows) {
		// 		if (error) {
		// 			console.log('mysql error 2');
		// 			return_server_error(socket);
		// 			return;
		// 		}
				
		// 		var query = "SELECT user_id FROM chat_rooms WHERE room_id="+mysql.escape(room_id);
		// 		mysql.query(query, function(error, rows) {
		// 			if (error) {
		// 				console.log('mysql error 3');
		// 				return_server_error(socket);
		// 				return;
		// 			}
					
		// 			//store unseen in db
		// 			var val = '';
		// 			var n = 0;
		// 			for (var i in rows) {
		// 				if (rows[i].user_id == sender_id)
		// 					continue;
						
		// 				val += "('" + _helper.createUID(1, n) + "', '" + rows[i].user_id + "', '" + content_id + "', '" + time.toString() + "')";
		// 				n++;
		// 			}
					
		// 			if (val != '') {
		// 				var query = "INSERT INTO chat_unseen (uid, user_id, chat_content_id, datetime) VALUES " + val;
		// 				mysql.query(query);
		// 			}
					
		// 			//broadcast
		// 			var res = {
		// 				chatid: room_id,
		// 				from: sender_id,
		// 				content: data.content,
		// 				time: time
		// 			};
					
		// 			for (user in _users) {
		// 				var online_user;
		// 				for (user_id in rows) {
		// 					var u = rows[user_id].user_id;
		// 					if (u == _users[user].info.uid && u != sender_id) {
		// 						online_user = user;
		// 						break;
		// 					}
		// 				}
						
		// 				if (online_user) {
		// 					for (client in _users[online_user].clients) {
		// 						var s = _clients[client].socket;
		// 						s.emit('rec chat msg', res);
		// 					}
		// 				}
		// 			}
		// 		});
		// 	});
		// });
	});
	
	
});

var _sys = {
	connection: {
		drop: function(socket) {
			if (socket)
				socket.emit('connection.drop');
			
		},
		auth: function(socket) {
			if (!socket || !_clients[socket.id])
				return false;
			
			var user_id = _clients[socket.id].user_id;
			if (!_users[user_id]) {
				console.log(2);
				return false;
			}
			
			return true;
		}
	},
	chat: {
		boardAuth: function(user_id, board_id, callback) {
			if (!board_id || !user_id) {
				if (typeof callback == 'function')
					callback();
				return;
			}
			
			var query = "select user_id from chat_members where user_id="+_db.escape(user_id)+" and board_id="+_db.escape(board_id)+" and active=1 limit 1";
			_db.query(query, function(error, rows) {
				var result = false
				if (error)
					console.log(error);
				
				if (rows) result = true;
				if (typeof callback == 'function')
					callback(result);
			});
		},
		fetch_user_info: function(userid, callback) {
			var data = false;
			
			var items = '';
			var i = ['username', 'name', 'profile_img'];
			for (var n=0; n<i.length; n++) {
				items += i[n];
				if (n != i.length-1)
					items += ', ';
			}
			
			var query = "select "+items+" from accounts where id="+_db.escape(userid)+" and active=1 limit 1";
			_db.query(query, function(error,rows) {
				if (!error) {
					data = rows[0];
					if (data) {
						data.profile_img = JSON.parse(data.profile_img);
					}
				}
				
				if (typeof callback == 'function')
					callback(error, data);
			});
		}
	}
};

function socket_auth(socket) {
	if (typeof _clients[socket.id] == 'undefined' || typeof _users[_clients[socket.id].sessid] == 'undefined')
		return false;
	
	return true;
}

function return_server_error(socket) {
	socket.emit('Server error');
}