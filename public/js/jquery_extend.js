jQuery.fn.disable = function(timeout,callback) {
	var elements = this;
	elements.data({
		'disabled': true
	}).addClass('disabled');
	
	if (typeof timeout == 'number') {
		setTimeout(function() {
			elements.enable();
			if (callback) callback();
		}, timeout);
	}
	
	return elements;
};

jQuery.fn.enable = function(timeout,callback) {
	var elements = this;
	jQuery.each(elements, function() {
		var element = jQuery(this);
		element
			.removeData('disabled from')
			.removeClass('disabled');
		
		if (typeof timeout == 'number') {
			setTimeout(function() {
				elements.enable();
				if (callback) callback();
			}, timeout);
		}
	});
	
	return elements;
};

jQuery.fn.isDisabled = function() {
	var element = this.first();
	if (element.length==0) return false;
	return element.data('disabled') ? true : false;
}