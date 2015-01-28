function serverError() {
	alert('There was a problem with the server connection. Please try again later.');
	//location.reload(); //dev
}

var sess_id;

var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_ie = navigator.userAgent.indexOf('MSIE') > -1;
var is_ff = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_opera = navigator.userAgent.indexOf("Presto") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}
var is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

var socket = false;
var socketEventsBinded = new Object();
var contactList = [];
var dashPageEventsBinded = false;

var URL_PATH = location.pathname;
var URL_ORIG = location.origin;
var _page = '';

var dashboard = {
	resizewindow: function() {
		return; //test
		var winWidth = jQuery(window).width();
		var winHeight = jQuery(window).height();
		
		//resize content container
		var width = (winWidth <= 1000 ? 1000 : winWidth);
		var height = (winHeight <= 600 ? 600 : winHeight);
		jQuery('#main').width(width).height(height);
		
		//content width
		var contentWidth = (winWidth <= 1000 ? 1000 : winWidth) - 70;
		jQuery('#content').width(contentWidth);
		
		//dimmer
		jQuery('.dimmer').width(winWidth).height(winHeight);

		//sidebar profile image
		/*var height = jQuery('.sidebar-profile-img').width();
		jQuery('.sidebar-profile-img').height(height);*/
		
		//resize all page
		profilePage.resizewindow();
		chatPage.resizewindow();
	},
	bindevents: function() {
		if (dashPageEventsBinded)
			return;
		
		//sidebar
		var mouseInSidebar = false;
		/*jQuery('#sidebar').mouseenter(function() {
			mouseInSidebar = true;
			if (!is_ff) {
				jQuery(this).animate({width:270}, 50, function() {
					showSidebarContent();
				});
			} else {
				jQuery(this).width(270);
				showSidebarContent();
			}
			function showSidebarContent() {
				if (!mouseInSidebar)
					return;

				jQuery('.sidebar-menu-text').fadeIn(100);
				jQuery('.sidebar-footer').show();
			}
		}).mouseleave(function() {
			mouseInSidebar = false;
			jQuery('.sidebar-menu-text, .sidebar-footer').hide(0);
			//if (!is_ff)
				jQuery(this).animate({width:70}, 200);
			/*else
				jQuery(this).width(70);*/
		//});

		jQuery('.sidebar-main-menu > ul > li').mouseenter(function() {
			jQuery(this).find('.sidebar-menu-text').css({'color':'#FFFFFF'});
		}).mouseleave(function() {
			jQuery(this).find('.sidebar-menu-text').css({'color':'#E8E8E8'});
		});

		/* --- Sidebar menu links --- */
		jQuery('.sidebar-main-menu a').click(function(e) {
			e.preventDefault();
			var href = jQuery(this).attr('href');

			//logout
			if (jQuery(this).attr('id') == 'sidebarLogout') {
				dashboard.logout();
				return;
			}
			
			dashboard.loadpage(href);
		});

		/*window.addEventListener("popstate", function(e) {
			dashboard.loadpage(location.pathname);
		});*/
		
		jQuery(document).on('click', '.ui-widget-overlay', function() {
			dashboard.dialog.close();
		});
		
		dashPageEventsBinded = true;
	},
	pageexist: function(page) {
		if (jQuery('div[data-content-page-link="'+page+'"]').length > 0)
			return true;
		else
			return false;
	},
	loadpage: function(page, callback) {
		//Go to url
		if (typeof(window.history.pushState) == 'function')
			window.history.pushState(null, '', page);
		else
			window.location = jQuery(this).attr('href');
		
		//check if page stack exists
		var fullPage = page;
		page = (page.indexOf('/') == 0 ? page.substr(1) : page);
		page = (page.substr(-1) == '/' ? page.substr(0, page.length - 1) : page);
		page = page.split('/');

		fullPage = (page[0] == 'profile' && typeof page[1] == 'undefined' ? fullPage+'/'+logUN : (fullPage == '/' ? '/profile/'+logUN : fullPage));

		if (dashboard.pageexist(fullPage)) {
			jQuery('div[data-content-page-link]').hide();
			var p = jQuery('div[data-content-page-link="'+fullPage+'"]');
			_page = p;
			p.show();
			dashboard.activepage(page[0]);
			URL_PATH = fullPage;
			
			if (typeof callback == 'function')
				callback();
		} else {
			jQuery.ajax({
				url: '/pubcon/load_page_dash.php',
				type: 'POST',
				data: {
					post_sess_id: sess_id,
					page: page
				}
			}).success(function(jsonData) {
				try {
					var data = jQuery.parseJSON(jsonData);
				} catch (error) {
					console.log('---');
					console.log('ERROR');
					console.log('> '+error);
					console.log('> '+jsonData);
					console.log('---');
					return;
				}

				if (data.status == 'invalid sess_id' || data.status == 'invalid data') {
					console.log('error');
					console.log(data);
					return;
				}

				//404 page
				if (data.status == '404' && dashboard.pageexist('/404')) {
					jQuery('#content > div').hide();
					jQuery('#content > div[data-content-page-link="/404"]').show();
					return;
				}

				jQuery('#content > div').hide();
				jQuery('#content').append(data.content);
				_page = jQuery('#content > div:not(:hidden)');

				dashboard.activepage(page[0]);

				switch (page[0]) {
					case '':
					case 'profile':
						profilePage.bindevents();
						profilePage.resizewindow();
						break
					case 'chat':
						chatPage.bindevents();
						chatPage.resizewindow();
						//chatPage.blurbg();
						if (_page.find('.main_msg_content_area').length > 0)
							_page.find('.main_msg_content_area').scrollTop(_page.find('.main_msg_content_area')[0].scrollHeight);
						break;
				}
				
				URL_PATH = fullPage;
				
				if (typeof callback == 'function')
					callback();

			}).fail(function() {
				serverError();
			});
		}
	},
	activepage: function(page) {
		jQuery('.active-status').remove();
		if (page == '')
			jQuery('.sidebar-main-menu > ul > li').first().prepend('<div class="active-status"></div>');
		else
			jQuery('.sidebar-main-menu > ul > li > a[href^="/'+page+'"]').before('<div class="active-status"></div>');
		
		dashboard.resizewindow();
	},
	logout: function() {
		/*var confirm = window.confirm('Are you sure you want to logout?');
		if (!confirm)
			return;*/
		
		dashboard.dialog.set('Logout', 'Are you sure you want to logout?', [{
			//buttons
			text: 'Logout',
			'class': 'dialog-button-blue',
			click: function() {
				if (dashboard.server.connected)
					socket.emit('logout');
				
				dashboard.dialog.close();
				
				jQuery.ajax({
			        url: '/pubcon/logout.php',
			        type: 'POST'
			    }).success(function(res) {
			    	window.location.href = '/';
			    }).fail(function() {
			    	serverError();
			    });
			}
		}, {
			text: 'Cancel',
			click: function() {
				dashboard.dialog.close();
			}
		}]);
		
		dashboard.dialog.open();
	},
	server: {
		userInfo: false,
		connected: false,
		fetchuserinfo: function() {
			jQuery.ajax({
				url: '/pubcon/user_crud.php',
				type: 'POST',
				data: {
					post_sess_id: sess_id,
					request: 'fetch user info'
				}
			}).success(function(jsonData) {
				try {
					var data = jQuery.parseJSON(jsonData);
				} catch (error) {
					console.log('---');
					console.log('ERROR');
					console.log('> '+error);
					console.log('> '+jsonData);
					console.log('---');
					return;
				}

				if (data.status == 'info fetched') {
					dashboard.server.userInfo = data.info;
				}

			}).fail(function() {
				serverError();
			});
		},
		connect: function() {
			//Connect to the server.
			/*if (typeof io == 'undefined') {
				var src = jQuery('#socketIO').attr('src');
				jQuery('#socketIO').remove();
				jQuery('head').append('<script type="text/javascript" src="'+src+'" id="socketIO"></script>');
				return false;
			}*/

			socket = io.connect('//localhost:8888', {
				'connect timeout': 1500,
				'reconnect ': true,
				'reconnection delay': 100,
				'reconnection limit': 10000,
				'max reconnection attempts': 999999999999 //999 billion times ;)
			});

			dashboard.server.bindsocketevents();
		},
		bindsocketevents: function() {
			if (socketEventsBinded.dashboard)
				return;
			
			socket.on('connect', function() {
				console.log('Connected to server');
				dashboard.server.connected = true;
				
				//Bind socket events for other pages
				chatPage.bindsocketevents();
			});

			socket.on('disconnect', function() {
				console.log('Disconnected from server');
				dashboard.server.connected = false;
			});

			socket.on('reconnecting', function () {
				console.log('Attempting to reconnect');
			});

			socket.on('reconnect', function () {
				console.log('Successfully reconnected');
			});
			
			socket.on('send user info', function(data) {
				dashboard.server.userInfo = data;
			});

			//Server is requesting user info
			socket.on('req user info', function() {
				console.log('Server is requesting user info');
				
				var sess = _cookie.get('PNSESSID');
				if (sess == '') {
					dashboard.forcelogout();
					return;
				}
				
				var data = {
					info: {
						sessid: sess
					}
				};
				socket.emit('res user info', data);
			});
			
			socket.on('res user info confirm', function() {
				console.log('Server received user info');
			});
			
			socket.on('connection denied', function() {
				console.log('connection denied from nodejs');
				dashboard.forcelogout();
			})

			//Global events
			socket.on('res contact list', function(data) {
				//contactList = data.list;
				//chatPage.resizewindow();
			});

			socketEventsBinded.dashboard = true;
		}
	},
	updatecontactlist: function() {
		if (!dashboard.server.connected)
			return false;

		socket.emit('fetch contact list');
	},
	dialog: {
		set: function(title, message, buttons, options) {
			var diagCont = jQuery('.dashDialog');
			var diag = jQuery('#dashDialog');
			
			diag.dialog('option', 'title', title);
			diag.find('.diag-msg').html(message);
			diag.dialog('option', 'buttons', buttons);
			diagCont.find('.ui-dialog-titlebar-close').hide();
			
			if (typeof options == 'undefined')
				return;
			
			if (typeof options.closebutton != 'undefined' && options.closebutton)
				diagCont.find('.ui-dialog-titlebar-close').show();
		},
		open: function() {
			jQuery('#dashDialog').dialog('open');
		},
		close: function() {
			jQuery('#dashDialog').dialog('close');
		}
	},
	forcelogout: function() {
		console.log('You have been forced to log out!');
	}
};

jQuery(document).ready(function() {
	console.info('Welcome to Planenote!');
	
	sess_id = jQuery('body > input').val();
	
	jQuery(window).resize(function() {
		dashboard.resizewindow();
	});
	
	var c = 0;
	var i = setInterval(function() {
		dashboard.resizewindow();
		c++;
		if (c >= 5)
			clearInterval(i);
	}, 400);

	dashboard.bindevents();
	_page = jQuery('.contentPageContainer');

	//Connect to the server
	// dashboard.server.connect();
	// var connect = setInterval(function() {
	// 	if (!socket.socket.connected)
	// 		socket.socket.connect();
	// 	else
	// 		clearInterval(connect);
	// }, 1000);
	
	//dialog
	jQuery('#dashDialog').dialog({
		dialogClass: 'dashDialog',
		autoOpen: false,
		modal: true,
		closeOnEscape: true,
		draggable: false,
		resizable: false,
		open: function() {
			var modal = jQuery(this).dialog('option', 'modal');
			if (modal)
				jQuery('.ui-widget-overlay').hide().fadeIn(250);
		}
	});
	
	/* Keep the user logged in */
	setInterval(function() {
		$.ajax({
			url: '/pubcon/ping.php',
			timeout: 10000,
			error: function(){},
			fail: function(){}
		});
	}, 90000);
});
