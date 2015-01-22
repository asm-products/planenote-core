
var chatPageEventsBinded = false;
socketEventsBinded.chat = false;

var contactAutoSearch;

var chatPage = {
	resizewindow: function() {
		var conWidth = jQuery('.contentContainer').width();
		var conHeight = jQuery('.chat_list_container').parent().height();

		//chat list container
		jQuery('.chat_list').height(conHeight / 100 * 80);
		var padding = (conHeight - jQuery('.chat_list').height()) / 2;
		jQuery('.chat_list_container').css({
			'padding-top': padding.toString() + 'px'
		});

		/* Initial events */

		//contacts search autocomplete
		if (jQuery('.card_list_search_con').find('.ui-autocomplete').length < 1) {
			jQuery('#cardSearchContacts').autocomplete({
				delay: 0,
				minLength: 1,
				autoFocus: true,
				source: [],
				select: function(e, ui) {
					if (!dashboard.server.connected) {
						console.log('Not connected to the server');
						return;
					}
					
					socket.emit('req start chat', {
						id: ui.item.id,
						name: ui.item.value
					});
					
					jQuery('#cardSearchContacts').blur();
					jQuery(this).parents('.chat_list').first().find('.card_list_search_con').hide();
					setTimeout(function() {
						jQuery('#cardSearchContacts').val('');
					}, 500);
				}
			});
		}
		
		chatPage.bindsocketevents();
		jQuery('#cardSearchContacts').autocomplete('option', 'source', contactList);
		
		//bind auto height on CHAT TEXTAREA
		jQuery('.chat_msg_input textarea').each(function() {
			if (typeof jQuery(this).attr('data-ta-auto-h') == 'undefined') {
				jQuery(this).elastic();
				jQuery(this).attr('data-ta-auto-h', 1);
			}
		});
		
		//Blurred overlay
		
	},
	blurbg: function (cont, fade, duration) {
		if (typeof cont == 'undefined')
			return;
		
		if (jQuery('.contentPageContainer[data-content-page-link="'+cont+'"]').length < 1)
			return;
		
		var cont = jQuery('.contentPageContainer[data-content-page-link="'+cont+'"]');
		
		//Check if bg is already blurred
		if (cont.find('canvas.blur_overlay_canvas').length > 0)
			return;
		
		var src = cont.css('background-image').replace('url(', '').replace(')', '').replace(URL_ORIG, '');
		var bgSize = cont.css('background-size');
		var bgPos = cont.css('background-position');
		var blurid = 'blur_'+uniqid();
		
		var bgSizeA = bgSize.split(' ');
		var bgPosA = bgPos.split(' ');
		
		var img = new Image();
		img.onload = function(e) {
			var imgOri = (img.width >= img.height ? 'h' : 'v'); //img orientation Horizontal/Vertical
			var imgSizeP = parseInt(bgSize.replace('%', '').trim());
				imgSizeP = (imgSizeP < 100 ? 100 : imgSizeP);
			
			var w = 'auto';
			var h = 'auto';
			if (imgOri == 'h') {
				w = cont.width() * imgSizeP / 100;
				w = w.toString() + 'px';
			} else {
				h = cont.height() * imgSizeP / 100;
				h = h.toString() + 'px';
			}
			
			var pos = {
				left: bgPos.split(' ')[0],
				top: bgPos.split(' ')[1]
			};
			
			pos.left = (pos.left == 'auto' ? '50%' : pos.left);
			pos.left = parseInt(pos.left.replace('%', '').trim());
			pos.left = (pos.left > 100 ? 100 : (pos.left < 0 ? 0 : pos.left));
			
			pos.top = (pos.top == 'auto' ? '50%' : pos.top);
			pos.top = parseInt(pos.top.replace('%', '').trim());
			pos.top = (pos.top > 100 ? 100 : (pos.top < 0 ? 0 : pos.top));
			
			//left/top position
			var left = 0;
			var top = 0;
			if (imgOri == 'h') {
				var remPerc = (img.width - cont.width()) / cont.width() * 100;
				var remPx = img.height / 100 * remPerc;
				var imgH = img.height - remPx;
				
				var tRem = imgH - jQuery(window).height();
				var top = tRem / 100 * pos.top;
					top = top + Math.pow(pos.top, 0.177);
					top = Math.round(top < 0 ? 0 : top);
			} else {
				var remPerc = (img.height - jQuery(window).height()) / jQuery(window).height() * 100;
				var remPx = img.width / 100 * remPerc;
				var imgW = img.width - remPx;
				
				var tRem = imgW - cont.width();
				var left = tRem / 100 * pos.left;
					left = left + Math.pow(pos.left, 0.177);
					left = Math.round(left < 0 ? 0 : left);
			}
			
			left = (left > 0 ? '-' : '') + left.toString() + 'px';
			top = (top > 0 ? '-' : '') + top.toString() + 'px';
			
			//Append content
			cont.prepend('<div class="blur_cont" id="'+blurid+'" style="display:none;"><img id="img_'+blurid+'" src="'+src+'" class="blur_img_underlay" style="width:'+w+';height:'+h+';left:'+left+';top:'+top+';"><canvas id="canv_'+blurid+'" class="blur_overlay_canvas" style="width:'+w+';height:'+h+';left:'+left+';top:'+top+';"></canvas></div>');
			
			//Blur and fade in
			setTimeout(function() {
				stackBlurImage('img_'+blurid, 'canv_'+blurid, 145);
				duration = (typeof duration == 'number' ? duration : 600);
				jQuery('#'+blurid).fadeIn(duration);
			}, 500);
		};
			
		img.src = src;
	},
	unblurbg: function(elem, fade, duration) {
		if (typeof elem == 'string') {
			elem = jQuery(elem).find('.blur_cont');
			if (typeof fade != 'undefined' && fade) {
				duration = (typeof duration == 'number' ? duration : 600);
				elem.fadeOut(duration, function() {elem.remove();});
			} else {
				elem.remove();
			}
		} else if (typeof elem == 'object') {
			if (typeof fade != 'undefined' && fade) {
				duration = (typeof duration == 'number' ? duration : 600);
				elem.fadeOut(duration, function() {elem.remove();});
			} else {
				elem.remove();
			}
		}
	},
	bindevents: function() {
		if (chatPageEventsBinded)
			return;

		jQuery(document).on('click', '.card_btn_add_con', function() {
			jQuery(this).parents('.chat_list').first().find('.card_list_search_con').toggle('blind', {
				duration: 190,
				queue: false,
				complete: function() {
					if (jQuery(this).css('display') != 'none')
						jQuery(this).find('input').focus();
					else
						jQuery(this).find('input').blur();
				}
			});
		});
		
		jQuery('#cardSearchContacts').focus(function() {
			jQuery(this).autocomplete('search', jQuery(this).val());
			contactAutoSearch = setInterval(function() {
				if (jQuery('.card_list_search_con .ui-autocomplete').html() == '') {
					if (jQuery('#cardSearchContacts').val() != '')
						jQuery('#cardSearchContacts').autocomplete('search', jQuery('#cardSearchContacts').val());
				} else {
					clearInterval(contactAutoSearch);
				}
			}, 1);
		}).blur(function() {
			clearInterval(contactAutoSearch);
		}).keyup(function(e) {
			if (e.which != 13 && e.which != 38 && e.which != 40 && e.which != 37 && e.which != 39)
				jQuery(this).autocomplete('search', jQuery(this).val());
		});
		
		jQuery('.card_list_search_con .ui-autocomplete').mouseenter(function() {
			clearInterval(contactAutoSearch);
		}).mouseout(function() {
			contactAutoSearch = setInterval(function() {
				if (jQuery('.card_list_search_con .ui-autocomplete').html() == '') {
					if (jQuery('#cardSearchContacts').val() != '')
						jQuery('#cardSearchContacts').autocomplete('search', jQuery('#cardSearchContacts').val());
				} else {
					clearInterval(contactAutoSearch);
				}
			}, 1);
		});
		
		/* --- Main Chat --- */
		jQuery(document).on('click', '.chat_list > ul > li', function() {
			jQuery('#cardSearchContacts').blur();
			jQuery(this).parents('.chat_list').first().find('.card_list_search_con').hide();
			setTimeout(function() {
				jQuery('#cardSearchContacts').val('');
			}, 500);
			
			var id = jQuery(this).attr('data-cht-li-identify');
			chatPage.startchat(id);
		});
		
		jQuery(document).on('keypress', '.chat_msg_input textarea', function(e) {
			if (e.which == 13 && !e.shiftKey) {
				sendMsg(jQuery(this));
				e.preventDefault();
			}
		});
		
		jQuery(document).on('click', '.chat_msg_send button', function(e) {
			sendMsg(jQuery(this).parents('.chat_msg_input_area').first().find('.chat_msg_input textarea'));
		});
		
		function sendMsg(inpt) {
			if (inpt.val() == '')
				return;
			
			
			if (!dashboard.server.connected)
				serverError();
			
			var val = '';
			var chatId = (inpt.parents('div[data-chat-identify]').first().length > 0 ? inpt.parents('div[data-chat-identify]').first().attr('data-chat-identify') : false);
			
			if (chatId === false) {
				console.log('Dev error: no chat_room_id');
				return;
			}
			
			val = inpt.val();
			inpt.val('');
			
			var data = {
				chatid: chatId,
				content: val,
				datetime: new Date().getTime()
			};
			
			socket.emit('send chat msg', data);
			
			//inpt.parents('.chat_msg_container').first().find('.main_msg_content_area ul').append('<li class="msg_cont_right chat_li_cont box-sizing"><div class="chat_main_dp_thumb" style="background-image:url(/img/profile/'+ dashboard.server.userInfo.profile_img +');background-size:'+ dashboard.server.userInfo.profile_sett.bg_size +';background-position:'+ dashboard.server.userInfo.profile_sett.bg_pos +';"></div><div class="chat_main_content_box"><div class="chat_main_name">'+ dashboard.server.userInfo.name +'</div><div class="chat_main_msg">'+ val +'</div></div></li>');
			
		}
		
		chatPageEventsBinded = true;
	},
	bindsocketevents: function() {
		if (socketEventsBinded.chat || !dashboard.server.connected)
			return;
		//start chat
		socket.on('res start chat', function(data) {
			chatPage.startchat(data.info.chatId);
		});
		
		//Received new chat from server
		socket.on('rec chat msg', function(data) {
			if (chatPage.appendChat(data) === false) {
				//show notification if not on chat page
				console.log(data);
				chatPage.notify(data);
			}
		});
		
		socketEventsBinded.chat = true;
	},
	startchat: function(id) {
		dashboard.loadpage('/chat/'+id, function() {
			/*setTimeout(function() {
				chatPage.blurbg('/chat/'+id);
			}, 100);*/
		});
	},
	appendChat: function(info) {
		//Check if MSG is open
		if (jQuery('.chat_msg_container[data-chat-identify="'+info.chatId+'"]').length < 1)
			return false;
		
		var chat = jQuery('.chat_msg_container[data-chat-identify="'+info.chatId+'"]');
		
		chat.find('.main_msg_content_area > ul').append(chatPage.buildChatLi(info.from.options.profile_img, info.from.options.profile_sett, info.from.name, info.content));
	},
	buildChatLi: function(img, img_sett, name, content) {
		return '<li class="msg_cont_left box-sizing"><div class="chat_main_dp_thumb" style="background-image:url(/img/profile/'+ img +');background-size:'+ img_sett.bg_size +';background-position:'+ img_sett.bg_pos +';"></div><div class="chat_main_content_box"><div class="chat_main_name">'+ name +'</div><div class="chat_main_msg">'+ content +'</div></div></li>';
	},
	notify: function(data) {
		if (typeof data != 'object')
			return;
		
		if (URL_PATH != '/chat/'+data.chatId) {
			console.log('New message from: ' + data.from.name);
			console.log('Message: ' + data.content);
		}
	}
};

jQuery(document).ready(function() {
	//chatPage.blurbg();

	jQuery(window).resize(function() {
		chatPage.resizewindow();
	});

	for (x = 0; x < 5; x++) {
		chatPage.resizewindow();
	}

	chatPage.bindevents();
	
	//blur visible main chat
	/*if (typeof URL_PATH != 'undefined' && URL_PATH != '' && URL_PATH != '/') {
		var path = (URL_PATH.substr(0, 1) == '/' ? URL_PATH.substr(1) : URL_PATH);
			path = path.split('/');
		if (typeof path[1] != 'undefined' && path[0] == 'chat') {
			chatPage.blurbg('/'+path[0]+'/'+path[1]);
		}
	}*/
});