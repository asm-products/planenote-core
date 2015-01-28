(function() {
	
	window.jQuery.ajaxSetup({
		timeout: 30000, // 30 seconds
		fail: function() {
			// This error is caused when the browser
			// can't establish a connection with the
			// server. Because reasons.
			
			window._dialog({
				icon: 'exclamation',
				message: 'Uh Oh! Looks like we couldn\'t establish a connection with the server. Please try again.'
			});
		},
		error: function(info, error) {
			if (error == 'timeout')
				window.ajaxTimeout();
			else if (error == 'parsererror')
				window.ajaxParserError();
			else {
				window.ajaxUnknownError();
				console.log(error);
			}
		}
	});
	
	window.ajaxSessionExpired = function() {
		// The user isn't logged in anymore
		
		window._dialog({
			icon: 'times',
			message: 'Your session has timed out. Please log in again.'
		});
	};
		
	window.ajaxUnknownError = function() {
		// Who knows what happend?
		
		window._dialog({
			icon: 'question',
			message: 'Hmm. An Unknown error has occured. Please try again.'
		});
	};
	
	window.ajaxParserError = function() {
		// This error is caused by the server fucking up
		// so we should show a "server" error
		
		window._dialog({
			icon: 'exclamation',
			message: 'Oops! Looks like the server responded with gibberish words. Please try again.'
		});
	};
	
	window.ajaxTimeout = function() {
		// When the ajax takes to long to respond throw
		// this error in the air.
		
		window._dialog({
			icon: 'time',
			message: 'Oh No! Your request timed out. Please try again.'
		});
	};
	
})();