(function() {

	window._notification = function(options) {
		var op = _.extend({
			title: null,
			message: null,
			href: null,
			ttl: 5000,
		}, options || {});

		if (op.message == null)
			return false;

		var html = '<div></div>';
		var content = $(html);

		if (op.href != null) {
			var html = content.html();
			content = $('<a></a>').html(html);
			content.attr('href', op.href);
		}

		// add attributes
		content.attr({
			'class': 'content'
		});

		// title
		if (op.title != null) {
			var title = '<div class="title">'+op.title.toString()+'</div>';
			content.append(title);
		}

		// message
		var message = '<div class="message">'+op.message+'</div>';
		content.append(message);

		$.UIkit.notify({
		    message: content,
		    status: 'info',
		    timeout: op.ttl,
		    pos: 'bottom-right'
		});
	};

	// document.ready
	$(function() {



	});

})();