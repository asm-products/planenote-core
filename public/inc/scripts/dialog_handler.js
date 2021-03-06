(function() {
	
	window._dialog = function(options) {
		var op = _.extend({
			showOk: true,
			okText: 'Ok',
			okCallback: function() {},
			
			message: null,
			buttons: []
		}, options || {});
		
		if (op.message == null)
			return;
		
		var dialog = $('#dialog');
		
		if (op.message != null)
			dialog.find('.message').html(op.message);
		
		// Add icon
		if (op.icon !== undefined) {
			(function() {
				var icon = '';
				
				switch(op.icon) {
					case 'frown':
						icon = '<i class="fa fa-frown-o"></i>'; break;
					case 'check':
						icon = '<i class="fa fa-check green"></i>'; break;
					case 'exclamation':
						icon = '<i class="fa fa-exclamation-triangle"></i>'; break;
					case 'time':
						icon = '<i class="fa fa-clock-o"></i>'; break;
					case 'question':
						icon = '<i class="fa fa-question-circle"></i>'; break;
					case 'times':
						icon = '<i class="fa fa-times-circle"></i>'; break;
				}
				
				dialog.find('.message').prepend('<div class="icon">'+icon+'</div>');
			})();
		} else
			dialog.find('.message .icon').remove();
		
		var dialogOptions = {
			closeClass: 'dialog-close',
			opacity: 0.9,
			positionStyle: 'fixed'
		};
		
		// Remove existing buttons first that have event handlers attached
		dialog.find('.dialog-buttons li').remove();
		
		// Add buttons
		var buttons = op.buttons;
		
		if (op.showOk && buttons.length == 0) {
			buttons.push({
				text: op.okText,
				callback: function() {
					op.okCallback();
					window._dialog_obj.close();
				}
			});
		}
		
		if (buttons.length > 2)
			buttons = buttons.splice(0,2);
		
		// Build button elements
		_.each(buttons, function(button) {
			var button_elem = $('<li></li>');
			button_elem.append('<span>'+button.text+'</span>');
			
			if (button.type != undefined)
				button_elem.find('span').addClass(button.type);
			
			button_elem.click(function() {
				window._dialog_obj.close();
				
				if (typeof button.callback == 'function')
					button.callback();
			});
			
			button_elem.appendTo(dialog.find('.dialog-buttons'))
		});
		
		
		dialog.find('.dialog-buttons').attr('data-button-count', buttons.length);
		
		// Do it
		var dialog_obj = dialog.bPopup(dialogOptions);
		window._dialog_obj = dialog_obj;
		
		return dialog_obj;
	};
	
	window._dialog_obj = null;
	
})();