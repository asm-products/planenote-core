function resizeWindow() {
	var winWidth = jQuery(window).width();
	var winHeight = jQuery(window).height();
	//jQuery('#mainPageContainer').width(winWidth).height(winHeight);
	jQuery('#leftPanel, #rightContent').height(winHeight);
	jQuery('#dimmer').width(winWidth).height(winHeight);
	
	if (winHeight <= 360) {
		jQuery('#leftPanel .contentContainer').css({'bottom':'0'});
	} else {
		var thisHeight = jQuery('#leftPanel .contentContainer').height();
		var thisBottom = Math.floor(10 / (Math.pow((thisHeight / winHeight), 2.8)));
		var thistop = winHeight - (thisHeight + thisBottom);
		if (thisBottom > thistop)
			thisBottom = Math.floor((winHeight / 2) - thisHeight);
		
		jQuery('#leftPanel .contentContainer').css({'bottom': thisBottom.toString() + 'px'});
	}
	
	var thisRight = jQuery('#leftPanel .contentContainer .new-user-form').width() + 30;
	jQuery('#leftPanel .contentContainer .new-user-form').css({'right': '-' + thisRight.toString() + 'px'});
}

function serverError() {
	alert('There was a problem with the server connection. Please try again later.');
}

var _home = {
	reg: {
		validate: function(fields) {
			var res = {
				name: {
					value: fields.name,
					pass: true
				},
				email: {
					value: fields.email,
					pass: true
				},
				password: {
					value: fields.password,
					pass: true
				}
			};
			
			//name
			var name = res.name.value.trim();
			if (name.length==0) {
				res.name.value = name;
				res.name.pass = false;
				res.name.reason = 'Empty';
				return res;
			}
			
			if (name.split(' ').length < 2) {
				res.name.pass = false;
				res.name.reason = 'First and last name required';
				return res;
			}
			
			//email
			var email = res.email.value.trim();
			if (email.length==0) {
				res.email.value = email;
				res.email.pass = false;
				res.email.reason = 'Empty';
				return res;
			}
			
			if (!/[^@]+@[^@]+/i.test(email)) {
				res.email.pass = false;
				res.email.reason = 'Invalid';
				return res;
			}
			
			//password
			var password = res.password.value;
			if (/[^`~\!@#\$%\^&\*\(\)_\+\-=\[\]{}\\|;':",\.\/<>\?a-z0-9]/i.test(password)) {
				res.password.pass = false;
				res.password.reason = 'Contains invalid characters';
				return res;
			}
			
			return res;
		},
		create: function(info, callback) {
			var validation = _home.reg.validate(info);
			var res = {
				pass: true,
				info: validation
			};
			
			if (!res.info.name.pass || !res.info.email.pass || !res.info.password.pass) {
				res.pass = false;
				return callback(res);
			}
			
			jQuery.ajax({
				url: '',
				type: 'POST',
				data: res.info,
				dataType: 'json',
				success: function(data) {
					//TODO: handle results
					console.log(data);
					callback(res);
				},
				fail: function() {
					//TODO: connection error handler
				},
				success: function(more, result) {
					//TODO: parsererror handler
				}
			});
		}
	},
	login: function(options) {
		if (!options)
			return;
		
		options = jQuery.extend({
			success: function(){},
			complete: function(){}
		}, options);
		
		jQuery.ajax({
			url: '/pubcon/login.php',
			type: 'POST',
			dataType: 'json',
			data: {
				user: options.user,
				password: options.password
			},
			success: function(res) {
				options.success(res);
			},
			fail: function() {
				// TODO: server fail handler
			},
			complete: function(more, status) {
				// TODO: parsererror handler
				
				if (typeof options.callback == 'function')
					options.callback();
			}
		});
	}
};

jQuery(document).ready(function() {
	resizeWindow();
	jQuery(window).resize(function() { resizeWindow(); });
	
	//constant window resize on page load
	var rc = 0;
	var ri = setInterval(function() {
		resizeWindow();
		rc++;
		
		if (rc >= 15)
			clearInterval(ri);
	}, 1000);
	
	var sess_id = jQuery('body > input').val();
	
	/* --- Register form handlers --- */
	
	jQuery('#regName').focus(function() {
		jQuery('#leftPanel .contentContainer .new-user-form .hidden-fields').slideDown(250);
		errorStyle();
		jQuery(this).unbind('focus');
	});
	
	jQuery('#regPass').keyup(function() {
		if (jQuery('#regName').val().length < 1 || jQuery('#regEmail').val().length < 1 || jQuery('#regPass').val().length < 1)
			return;
		
		//validate registration form
		if (jQuery('#regName').val().length > 20) {
			//console.log('name too long');
		} else {
			//console.log('name is ok');
		}
		
		if (jQuery('#regEmail').val().indexOf('@') == -1) {
			//console.log('invalid email');
		} else {
			if (jQuery('#regEmail').val().split('@')[0].length > 0 && jQuery('#regEmail').val().split('@')[1].length > 0) {
				//console.log('valid email!');
			} else {
				//console.log('invalid email');
			}
		}
	});
	
	function validateRegFrom() {
		var regName = jQuery('#regName').val();
		var regEmail = jQuery('#regEmail').val();
		var regPass = jQuery('#regPass').val();
		var pass = true;
		
		function regFormFailed() {
			jQuery('#newUserGo').children('.button_loader').hide();
			jQuery('#newUserGo').children('.button_text').hide();
			jQuery('#newUserGo').children('.button_check').hide();
			jQuery('#newUserGo').children('.button_fail').css({'display':'block'});
			jQuery('#newUserGo').removeAttr('disabled');
			pass = false;
		}
		
		//check name
		function nameError(msg) {
			jQuery('.regNameErrMsg').text(msg);
			jQuery('.regNameErrMsg').css('display','block');
			errorStyle();
			regFormFailed();
		}
		
		if (regName.length < 3) {
			nameError('Name is too short');
		} else if (regName.length > 20) {
			nameError('Name is too long');
		} else if (regName.indexOf(' ') == -1) {
			nameError('Invalid name');
		}
		
		//check email
		function emailError(msg) {
			jQuery('.regEmailErrMsg').text(msg);
			jQuery('.regEmailErrMsg').css('display','block');
			errorStyle();
			regFormFailed();
		}
		
		if (regEmail.length == 0) {
			emailError('Email is empty');
		} else if (regEmail.indexOf('@') == -1) {
			emailError('Invalid email');
		} else if (regEmail.indexOf(' ') > 0) {
			emailError('Invalid email');
		} else {
			if (!regEmail.split('@')[0].length > 0) {
				emailError('Invalid email');
			} else if (!regEmail.split('@')[1].length > 0) {
				emailError('Invalid email');
			}
		}
		
		//check password
		function passError(msg) {
			jQuery('.regPassErrMsg').text(msg);
			jQuery('.regPassErrMsg').css('display','block');
			errorStyle();
			regFormFailed();
		}
		
		if (regPass.length < 1) {
			passError('Password is empty');
		} else if (regPass.length < 3) {
			passError('Password is too short');
		} else if (regPass == 'password') {
			passError('"password"? Really?');
		}
		
		if (!pass)
			return false;
		
		//make ajax call
		jQuery.ajax({
			url: '/pubcon/new.php',
			type: 'POST',
			data: {
				post_sess_id: sess_id,
				post_reg_name: regName,
				post_reg_email: regEmail,
				post_reg_pass: regPass,
			}
		}).success(function(jsonData) {
			try {
				var data = jQuery.parseJSON(jsonData);
			} catch (error) {
				console.log('---');
				console.log('ERROR');
				console.log('> '+error);
				console.log('> '+jsonData);
				console.log('---');
				return;
			}
			
			if (data.status == 'invalid sess_id') {
				serverError();
				return;
			} else if (data.status == 'email taken') {
				console.log(data.message);
				emailError(data.message);
				return;
			}
			
			//success registration! proceed.
			jQuery('#newUserGo').children('.button_loader').hide();
			jQuery('#newUserGo').children('.button_text').hide();
			jQuery('#newUserGo').children('.button_fail').hide();
			jQuery('#newUserGo').children('.button_check').css({'display':'block'});
			location.reload();
		}).fail(function() {
			serverError();
		});
	}
	
	jQuery('#newUserGo').click(function() {
		var button = jQuery(this);
		if (button.is(':disabled'))
			return;
		
		jQuery('.errMsg').hide();
		button.attr('disabled', 'disabled');
		button.children('.button_fail').hide();
		button.children('.button_check').hide();
		button.children('.button_text').hide();
		button.children('.button_loader').css({'display': 'block'});
		
		validateRegFrom();
	});
	
	jQuery('#regName, #regEmail, #regPass').keypress(function(e) {
		if (e.which == 13) {
			if (jQuery('#newUserGo').is(':disabled'))
				return;
			
			jQuery('.errMsg').hide();
			jQuery('#newUserGo').attr('disabled', 'disabled');
			jQuery('#newUserGo').children('.button_fail').hide();
			jQuery('#newUserGo').children('.button_check').hide();
			jQuery('#newUserGo').children('.button_text').hide();
			jQuery('#newUserGo').children('.button_loader').css({'display': 'block'});
			
			validateRegFrom();
		}
	});
	
	function errorStyle() {
		var right = jQuery('.new-user-form > .regNameErrMsg').innerWidth() + 20;
		jQuery('.new-user-form > .regNameErrMsg').css({'right': '-' + right + 'px'});
		
		var right = jQuery('.new-user-form .regEmailErrMsg').innerWidth() + 20;
		jQuery('.new-user-form .regEmailErrMsg').css({'right': '-' + right + 'px'});
		
		var right = jQuery('.new-user-form .regPassErrMsg').innerWidth() + 20;
		jQuery('.new-user-form .regPassErrMsg').css({'right': '-' + right + 'px'});
	}
	
	
	/* --- Login handlers --- */
	// jQuery('.loginForm').show('slide', {direction: 'right'}, 500);
	
	// jQuery('#loginEmail, #loginPass').focus(function() {
	// 	jQuery(this).animate({'border-color': '#C4C4C4'}, 250);
	// });
	
	function validateLogin() {
		console.log('login');
		var loginEmail = jQuery('#loginEmail').val();
		var loginPass = jQuery('#loginPass').val();
		
		if (loginEmail.length == 0 || loginPass.length == 0) {
			if (loginEmail.length == 0)
				jQuery('#loginEmail').css({'border-color': '#B5627E'});
			
			if (loginPass.length == 0)
				jQuery('#loginPass').css({'border-color': '#B5627E'});
			
			return;
		}
		
		//display loading
		jQuery('#loginButton > .button_text').hide();
		jQuery('#loginButton > .button_loader').css({'display':'block'});
		
		return;
		//server call
		jQuery.ajax({
			url: '/pubcon/login.php',
			type: 'POST',
			data: {
				post_sess_id: sess_id,
				post_login_email: loginEmail,
				post_login_pass: loginPass
			}
		}).success(function(jsonData) {
			try {
				var data = jQuery.parseJSON(jsonData);
				console.log(data);
			} catch (error) {
				console.log('---');
				console.log('ERROR');
				console.log('> '+error);
				console.log('> '+jsonData);
				console.log('---');
				return;
			}
			
			if (data.status == 'invalid sess_id') {
				console.log(data);
				serverError();
				return;
			} else if (data.status == 'wrong login details') {
				jQuery('#loginEmail, #loginPass').css({'border-color': '#B5627E'});
				jQuery('#loginButton > .button_loader').hide();
				jQuery('#loginButton > .button_text').show();
				return;
			}
			
			//success login! proceed.
			location.reload();
		}).fail(function() {
			serverError();
		});
	}
	
	jQuery('#loginButton').click(function() {
		var button = jQuery(this);
		if (button.isDisabled())
			return;
		
		button.disable();
		
		button.find('.button_text').hide();
		button.find('.button_loader').css('display', 'block');
		
		var user = jQuery('#loginEmail').val();
		var pass = jQuery('#loginPass').val();
		
		_home.login({
			user: user,
			password: pass,
			success: function(res) {
				if (res.result)
					window.location.reload();
			},
			callback: function() {
				button.enable();
				button.find('.button_loader').hide();
				button.find('.button_text').show();
			}
		});
	});
	
	jQuery('#loginEmail, #loginPass').keypress(function(event) {
		if (event.which == 13)
			jQuery('#loginButton').trigger('click');
	});
	
});