(function() {
	
	var _profile = {
		inView: false,
		page: [],
		pages: [],
		homerefresh: function(callback) {
			var page = _pg_hndlr.crnt_pg;
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
	
	
	// document.ready
	$(function() {
		var pages = jQuery('.profile_page');
		_profile.pages = pages;
		_profile.page = pages.filter(':visible');
		if (_profile.page.length != 0)
			_profile.inView = true;
		
		// Add/remove friend
		$(document).on('click', '.addFriend', function() {
			var btn = $(this);
			
			if (btn.attr('disabled') != undefined)
				return false;
			
			// Disable button
			btn.attr('disabled', 'disabled');
			
			var data = {
				cmd: 'add_remove_contact',
				contact_id: btn.closest('.content_page.profile_page').attr('data-user-id')
			};
			
			$.ajax({
				url: '/pubcon/user_crud.php',
				type: 'POST',
				dataType: 'json',
				data: data,
				success: function(res) {
					btn.find('.icon').removeClass('fa-plus fa-check');
					
					if (res.success && res.action == 'added') {
						if (res.connected) {
							btn.find('.text').text('Friends');
							btn.find('.icon').addClass('fa-check');
							btn.attr('data-status', '2');
						} else {
							btn.find('.text').text('Request Sent');
							btn.find('.icon').addClass('fa-plus');
							btn.attr('data-status', '1');
						}
					} else if (res.success && res.action == 'removed') {
						if (res.friended_me) {
							btn.find('.text').text('Accept Friend Request');
							btn.find('.icon').addClass('fa-plus');
							btn.attr('data-status', '3');
						} else {
							btn.find('.text').text('Add as Friend');
							btn.find('.icon').addClass('fa-plus');
							btn.attr('data-status', '0');
						}
					} else  {
						// TODO: error handler
					}
				},
				complete: function() {
					// Enable button
					btn.removeAttr('disabled');
				}
			});
		});
		
	});
	
	
})();