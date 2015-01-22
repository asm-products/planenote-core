
var _user = {};

var _sw = {
	timedisplay: {
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
			_sw.timedisplay.bind(elements, true);
		}
	}
};

jQuery(function() {
	_sw.timedisplay.bind();
	
	// jQuery(document).on({
	// 	click: function() {
	// 		var element = jQuery(this);
	// 		var alias = element.attr('data-display-alias');
	// 		var orig = element.text();
			
	// 		element.attr('data-display-alias-orig', orig);
	// 		element.text(alias);
	// 	},
	// 	mouseleave: function() {
	// 		var element = jQuery(this);
	// 		var orig = element.attr('data-display-alias-orig');
	// 		if (typeof orig == 'undeinfed') return;
			
	// 		element.text(orig);
	// 		element.removeAttr('data-display-alias-orig');
	// 	}
	// }, '*[data-display-alias]');
});

