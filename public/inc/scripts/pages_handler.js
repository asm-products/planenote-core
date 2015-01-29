var _pg_hndlr = {
	enabled: true,
	crnt_pg: [],
	pages: [],
	popstates: [],
	getPages: function() {
		return $('#content > .content_page');
	},
	getpage: function(page) {
		switch (typeof page) {
			case 'string':
				var link = page;
				// type = _pg_hndlr.typealias('name', _pg_hndlr.getlinktype(page));
				// page = _pg_hndlr.pages.filter('.'+type).first();
				// var specific = _pg_hndlr.getspecific(link);
				// if (specific) page = page.filter('[data-page-uniq="'+specific+'"]');
				var page = _pg_hndlr.getPages().filter('[data-link="'+link+'"]');
				return page;
				break;
			case 'object':
				page = _pg_hndlr.getPages().filter(page);
				return page;
				break;
		}
	},
	getlinktype: function(link) {
		if (!link)
			return 'home';

		var matches = link.match(/^\/+([^\/]+)/i);
		if (!matches || !matches[1])
			return 'home';

		return matches[1];
	},
	getspecific: function(link) {
		var specific = null;

		var matches = link.match(/^\/+[^\/]+\/+([^\/]+)/i);
		if (matches && matches[1])
			specific = matches[1];

		return specific;
	},
	getlink: function(page) {
		var url = page.attr('data-url');
		return url;
	},
	loadpage: function(link,callback,cmd) {
		if (!link)
			return;

		var type = _pg_hndlr.getlinktype(link);
		var specific = _pg_hndlr.getspecific(link);
		var page = _pg_hndlr.getpage(link);
		
		if (!cmd)
			history.pushState(null,null,link);

		// Check if this page element already exists within the page
		if (page.is(_pg_hndlr.crnt_pg))
			return;
		
		var data = {};
		if (specific != undefined)
			data.specific = specific;

		window.NProgress.start();
		
		function alwaysrun() {
			_sw.timedisplay.update();
			_pg_hndlr.popstates.push(link);
			_.defer(window.NProgress.done);
		}
		
		if (page.length==0) {
			jQuery.ajax({
				url: _pg_hndlr.typealias('file',type),
				type: 'POST',
				data: data,
				success: function(res) {
					var page = jQuery(res).hide();
					jQuery('#content').append(page);
					_pg_hndlr.showpage(page,link);
					if (callback) callback();
					alwaysrun();
					
					if (type == 'home')
						window.bindScrollEvent.home();
					
					// bind events
					_.each(_pg_hndlr.bindEvents, function(events) {
						events.callback();
					});
				}
			});
		} else {
			_pg_hndlr.showpage(page,link);
			if (callback) callback();
			alwaysrun();
		}
	},
	showpage: function(page,link) {
		if (!page) return;
		page = page.first();
		if (page.length==0) return;
		_pg_hndlr.crnt_pg = page;
		_pg_hndlr.getPages().hide();
		page.show();
		_pg_hndlr.activesidebar(link);
	},
	typealias: function(type,name) {
		var names = {
			home: {
				name: 'home_page',
				file: '/viewer/dashboard_home.php'
			},
			profile: {
				name: 'profile_page',
				file: '/viewer/profile.php'
			},
			chat: {
				name: 'msg_page',
				file: '/viewer/msg.php'
			},
			c: {
				name: 'chat_page',
				file: '/viewer/chat.php'
			},
			contacts: {
				name: 'contacts_page',
				file: '/viewer/contacts.php'
			},
			view: {
				name: "view_page",
				file: "/viewer/view.php"
			},
			settings: {
				name: 'settings_page',
				file: '/viewer/settings.php'
			}
		};
		
		if (name=='user') name='home';
		var pick = names[name];
		return pick[type];
	},
	bindEvents: [],
	addBindEvents: function(type, callback) {
		var event_name = window.uniqid('event-');
        var event_bind = function() {
            var page = (function() {
            	if (type == 'home')
            		return $('.content_page.home_page');
            	
            	return false;
            })();
            
            if (!page || page.data(event_name+'-binded'))
                return;
            
            if (page.length > 0) {
                callback();
                page.data(event_name+'-binded', true);
            }
        };
        
        _pg_hndlr.bindEvents.push({
            name: event_name,
            callback: event_bind
        });
        
        // run the event now
        event_bind();
	},
	activesidebar: function(link) {
		if (!link) return;
		var type = _pg_hndlr.getlinktype(link);
		var activate = type;
		if (link=='/') activate = 'home';
		activate = '.side_'+activate;
		var items = jQuery('.sidebar_menu_item');
		items.removeClass('active');
		items.filter(activate).addClass('active');
	},
	events: {
		linkclick: function(event) {
			event.preventDefault();
			var a = jQuery(this);
			var link = a.attr('href');
			var specific = null;
			if (/^\/+user\/+[^\/]+/i.test(link)) {
				var matches = link.match(/^\/+user\/+([^\/]+)/i);
				if (matches && matches[1]) specific = matches[1];
			}
			
			_pg_hndlr.loadpage(link, function() {
				if (a.hasClass('sidebar_menu_item'))
					jQuery('.sidebar_menu_item').removeClass('active').filter(a).addClass('active');
			});
		},
		popstate: function(event) {
			var link = location.pathname;
			// var prev = _pg_hndlr.popstates[_pg_hndlr.popstates.length-2];
			_pg_hndlr.loadpage(link, null, 'popstate');
			// _pg_hndlr.popstates.pop();
		}
	}
};

jQuery(window).ready(function() {
	
	// Detect if the browser can support this feature
	if (!Modernizr.history) {
		_pg_hndlr.enabled = false;
		return;
	}
	
	if (typeof history.pushState != 'function')
		return _pg_hndlr.enabled = false;
	
	var current = _pg_hndlr.getPages().filter(':visible').first();
	if (current.length==0) {
		current = _pg_hndlr;
		if (current.length > 1)
			_pg_hndlr.getPages().hide();
		current.show();
	}
	_pg_hndlr.crnt_pg = current;
	_pg_hndlr.popstates.push(location.pathname);
	
	jQuery(document).on('click', 'a:not(*[target="_blank"])', _pg_hndlr.events.linkclick);
	jQuery(window).on('popstate', _pg_hndlr.events.popstate);
	
	// pages TTL
	setInterval(function() {
		
		_pg_hndlr.getPages().each(function() {
			var page = $(this);
			var now = Math.round(new Date() / 1000);
			var last_active = page.attr('data-lastactive');
			var ttl = 30;
			
			if (last_active == undefined || _pg_hndlr.crnt_pg.is(page)) {
				page.attr('data-lastactive', now);
				return true;
			}
			
			last_active = parseInt(last_active);
			if (last_active < now-ttl) {
				page.remove();
			}
		});
		
	}, 1000);
	
});
