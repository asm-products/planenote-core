
var _user = {};

var _time = {
	display: {
		bind: function(elements,update) {
			elements = arguments[0] || jQuery('.time_display');
			elements.each(function() {
				var element = jQuery(this);
				if (!update && element.data('timedisplayBinded')) return true;
				var timestamp = element.attr('data-timestamp');
				if (!timestamp) return true;
				time_ts = parseInt(timestamp);
				time_iso = new Date(time_ts * 1000);
				var now_iso = new Date();
				var now_ts = now_iso.getTime() / 1000;
				var display;
				var diff = now_ts - time_ts;
				if (diff < 14400 || diff > 604800) //4hours, 1week
					display = moment(time_iso).from(now_iso);
				else
					display = moment(time_iso).calendar();
				
				if (typeof element.attr('data-display-alias') == 'undefined') {
					var alias = moment(time_iso).format('h:mma Do MMM YYYY');
					element.attr('title', alias);
					// element.attr('data-display-alias', alias);
				}
				
				element.text(display);
			});
		},
		update: function(elements) {
			if (!elements)
				elements = jQuery('.time_display');
			_time.display.bind(elements, true);
		}
	}
};

var _profile = {
	inView: false,
	page: [],
	pages: [],
	homerefresh: function(callback) {
		var page = _pages.crnt_pg;
		if (page.length==0) return;
		
		jQuery.ajax({
			url: '/pubcon/user_crud.php',
			type: 'POST',
			data: {
				post_validate: jQuery('#post_validate').val(),
				request: 'home_latest'
			},
			success: function(res) {
				res = jQuery.parseJSON(res);
				if (!res || res.status != 'ok')
					return;
				
				var current_latest = page.find('.content_cnt.profile .item').first();
				var latest_timestamp = current_latest.attr('data-timestamp');
				latest_timestamp = parseInt(latest_timestamp);
				var items = jQuery(res.data).filter('.item');
				var newitems = jQuery();
				items.each(function() {
					var item = jQuery(this);
					var timestamp = item.attr('data-timestamp');
					timestamp = parseInt(timestamp);
					if (timestamp >= latest_timestamp && item.attr('data-timestamp') != current_latest.attr('data-timestamp'))
						newitems = newitems.add(item);
				});
				
				if (newitems.length==0) return;
				jQuery(newitems.get().reverse()).each(function() {
					var item = jQuery(this);
					current_latest.before(item);
					current_latest = item;
				});
			},
			complete: function() {
				if (typeof callback == 'function')
					callback();
			}
		});
	}
};

var _account = {
	logout: function(callback) {
		jQuery.ajax({
			url: '/pubcon/logout.php',
			type: 'POST',
			data: {
				cmd: 'logout'
			},
			complete: function() {
				if (typeof callback == 'function')
					callback();
			}
		});
	}
};

function uniqid (prefix, more_entropy) {
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +    revised by: Kankrelune (http://www.webfaktory.info/)
	// %        note 1: Uses an internal counter (in php_js global) to avoid collision
	// *     example 1: uniqid();
	// *     returns 1: 'a30285b160c14'
	// *     example 2: uniqid('foo');
	// *     returns 2: 'fooa30285b1cd361'
	// *     example 3: uniqid('bar', true);
	// *     returns 3: 'bara20285b23dfd1.31879087'
	if (typeof prefix === 'undefined') {
		prefix = "";
	}

	var retId;
	var formatSeed = function (seed, reqWidth) {
		seed = parseInt(seed, 10).toString(16); // to hex str
		if (reqWidth < seed.length) { // so long we split
			return seed.slice(seed.length - reqWidth);
		}
		if (reqWidth > seed.length) { // so short we pad
			return Array(1 + (reqWidth - seed.length)).join('0') + seed;
		}
		return seed;
	};

	// BEGIN REDUNDANT
	if (!this.php_js) {
		this.php_js = {};
	}
	// END REDUNDANT
	if (!this.php_js.uniqidSeed) { // init seed with big random int
		this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
	}
	this.php_js.uniqidSeed++;

	retId = prefix; // start with prefix, add current milliseconds hex string
	retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
	retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
	if (more_entropy) {
		// for more entropy we add a float lower to 10
		retId += (Math.random() * 10).toFixed(8).toString();
	}

	return retId;
}

jQuery(document).ready(function() {
	__DOC = jQuery(this);
	
	_time.display.bind();
	
	var pages = jQuery('.profile_page');
	_profile.pages = pages;
	_profile.page = pages.filter(':visible');
	if (_profile.page.length != 0)
		_profile.inView = true;
	
	__DOC.on('click', '.profile_refresh', function() {
		var link = jQuery(this);
		if (link.isDisabled()) return;
		
		var refresher = jQuery('.profile_refresh');
		refresher.disable();
		var spinner = jQuery('.profile_refresh i');
		spinner.addClass('fa-spin');
		
		_profile.homerefresh(function() {
			refresher.enable();
			spinner.removeClass('fa-spin');
		});
	});
	
	__DOC.on('click', '#sidepane_logout', function() {
		_account.logout(function() {
			window.location.href('/');
		});
	})
});