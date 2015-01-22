var _pages = {
	enabled: true,
	crnt_pg: [],
	pages: [],
	popstates: [],
	getpage: function(page) {
		switch (typeof page) {
			case 'string':
				var link = page;
				// type = _pages.typealias('name', _pages.getlinktype(page));
				// page = _pages.pages.filter('.'+type).first();
				// var specific = _pages.getspecific(link);
				// if (specific) page = page.filter('[data-page-uniq="'+specific+'"]');
				var page = _pages.pages.filter('[data-link="'+link+'"]');
				return page;
				break;
			case 'object':
				page = _pages.pages.filter(page);
				return page;
				break;
		}
		
		return jQuery();
	},
	getlinktype: function(link) {
		if (!link) return 'home';
		var matches = link.match(/^\/+([^\/]+)/i);
		if (!matches || !matches[1]) return 'home';
		return matches[1];
	},
	getspecific: function(link) {
		var specific = null;
		var matches = link.match(/^\/+[^\/]+\/+([^\/]+)/i);
		if (matches && matches[1]) specific = matches[1];
		return specific;
	},
	getlink: function(page) {
		var url = page.attr('data-url');
		return url;
	},
	loadpage: function(link,callback,cmd) {
		if (!link) return;
		var type = _pages.getlinktype(link);
		var specific = _pages.getspecific(link);
		var page = _pages.getpage(link);
		
		if (!cmd) history.pushState(null,null,link);
		if (page.is(_pages.crnt_pg)) return;
		
		var data = {};
		if (type=='user' && specific)
			data.user = specific;
		
		function alwaysrun() {
			_time.display.update();
			_pages.popstates.push(link);
		}
		
		if (page.length==0) {
			jQuery.ajax({
				url: _pages.typealias('file',type),
				type: 'POST',
				data: data,
				success: function(data) {
					var page = jQuery(data).hide();
					jQuery('#content').append(page);
					_pages.pages = _pages.pages.add(page);
					_pages.showpage(page,link);
					if (callback) callback();
					alwaysrun();
				},
				error: function(error) {
					console.log('error');
				},
				fail: function() {
					console.log('failed');
				}
			});
		} else {
			_pages.showpage(page,link);
			if (callback) callback();
			alwaysrun();
		}
	},
	showpage: function(page,link) {
		if (!page) return;
		page = page.first();
		if (page.length==0) return;
		_pages.crnt_pg = page;
		_pages.pages.hide();
		page.show();
		_pages.activesidebar(link);
	},
	typealias: function(type,name) {
		var names = {
			home: {
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
			settings: {
				name: 'settings_page',
				file: '/viewer/settings.php'
			}
		};
		
		if (name=='user') name='home';
		var pick = names[name];
		return pick[type];
	},
	activesidebar: function(link) {
		if (!link) return;
		var type = _pages.getlinktype(link);
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
			
			_pages.loadpage(link, function() {
				if (a.hasClass('sidebar_menu_item'))
					jQuery('.sidebar_menu_item').removeClass('active').filter(a).addClass('active');
			});
		},
		popstate: function(event) {
			var link = location.pathname;
			// var prev = _pages.popstates[_pages.popstates.length-2];
			_pages.loadpage(link, null, 'popstate');
			// _pages.popstates.pop();
		}
	}
};

jQuery(window).ready(function() {
	
	if (!_pages.enabled) return;
	
	if (typeof history.pushState != 'function')
		return _pages.enabled = false;
	
	_pages.pages = jQuery('.content_page');
	var current = _pages.pages.filter(':visible').first();
	if (current.length==0) {
		current = _pages;
		if (current.length > 1) _pg_handlr.pages.hide();
		current.show();
	}
	_pages.crnt_pg = current;
	_pages.popstates.push(location.pathname);
	
	jQuery(document).on('click', 'a:not(*[target="_blank"])', _pages.events.linkclick);
	jQuery(window).on('popstate', _pages.events.popstate);
	
});