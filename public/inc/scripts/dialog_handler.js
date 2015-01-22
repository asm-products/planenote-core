(function() {
	
	window._dialog = function(options) {
		var op = _.extend({
			showCancel: true,
			cancelText: 'Ok',
			title: null,
			message: null,
			allowClose: false
		}, options || {});
		
		if (op.message == null)
			return;
		
		var dialog = $('#dialog');
		
		// Remove existing dialog
		if (op.title != null)
			dialog.find('.title').html(op.title);
		if (op.message != null)
			dialog.find('.message').html(op.message);
		
		var dialogOptions = {
			closeClass: 'dialog-close',
			opacity: 0.9,
			positionStyle: 'fixed'
		};
		
		// Add cancel buttons
		var buttons = [];
		
		if (op.showCancel) {
			// buttons.push({
			// 	text: op.cancelText,
			// 	click: function() {
			// 		dialog.dialog('close');
			// 		if (typeof op.cancelCallback == 'function')
			// 			op.cancelCallback();
			// 	}
			// });
		}
		
		dialogOptions.buttons = buttons;
		
		// Do it
		var dialog_obj = dialog.bPopup(dialogOptions);
		return dialog_obj;
	};
	
})();