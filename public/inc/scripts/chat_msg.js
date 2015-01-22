var _chat_msg = {
	video: {
		idname: {
			local: 'localVideoElement',
			remote: 'remoteVideoElement'
		},
		setElements: function(options) {
			// _chat_msg.video.setElements
			var op = jQuery.extend({
				page: _pages.crnt_pg
			}, options || {});
			
			// others
			jQuery('#'+_chat_msg.video.idname.remote).removeAttr('id');
			op.page.find('.dvch_remote').attr('id', _chat_msg.video.idname.remote);
			// local
			jQuery('#'+_chat_msg.video.idname.local).removeAttr('id');
			op.page.find('.dvch_local').attr('id', _chat_msg.video.idname.local);
		}
	},
	ui: {
		video: {
			container: {
				open: function(options) {
					// _chat_msg.ui.video.container.open
					
					var op = jQuery.extend({
						height: '75%',
						page: _pages.crnt_pg
					}, options || {});
					
					var vd_cnt = op.page.find('.chat-video-container');
					if (vd_cnt.length==0)
						return;
					var chat_cnt = op.page.find('.chat-items-container');
					if (chat_cnt.length==0)
						return;
					
					//show and animate
					vd_cnt.show();
					
					var anim_options = {
						duration: 360,
						queue: false
					};
					
					vd_cnt.animate({
						height: op.height
					}, anim_options);
					
					var chat_cnt_height = (100 - parseInt(op.height.replace(/\D+/g, ''))).toString() + '%';
					var chat_anim_options = jQuery.extend({
						complete: function() {
							// re-scroll chat messages to bottom
							op.page.find('.chat-items-container').scrollTop(999999);
							
							if (typeof op.complete == 'function')
								op.complete();
						}
					}, Object.create(anim_options));
					
					chat_cnt.animate({
						height: chat_cnt_height
					}, chat_anim_options);
				},
				close: function(options) {
					// _chat_msg.ui.video.container.close
					
					var op = jQuery.extend({
						page: _pages.crnt_pg
					}, options || {});
					
					var vd_cnt = op.page.find('.chat-video-container');
					if (vd_cnt.length==0)
						return;
					var chat_cnt = op.page.find('.chat-items-container');
					if (chat_cnt.length==0)
						return;
					
					//animate and hide
					var anim_options = {
						duration: 360,
						queue: false
					};
					
					var vd_anim_options = jQuery.extend({
						complete: function() {
							vd_cnt.hide();
							// re-scroll chat messages to bottom
							op.page.find('.chat-items-container').scrollTop(999999);
						}
					}, Object.create(anim_options));
					vd_cnt.animate({
						height: '0%'
					}, vd_anim_options);
					
					chat_cnt.animate({
						height: '100%'
					}, anim_options);
				}
			}
		}
	}
};

var _test = {
	go: function() {
		_chat_msg.ui.video.container.open({
			complete: function() {
				_chat_msg.video.setElements();
				// connect
			}
		});
	}
};

jQuery(document).ready(function() {
	var doc = jQuery(this);
});
