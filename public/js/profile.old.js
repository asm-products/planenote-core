//set variables
var editMode = false,
	dpEditing = false,
	bgEditMode = false,
	mouseIsDown = false,
	USER = '',
	profilePageEventsBinded = false,
	dpImgObj = new Image(),
	dpImgObj_loaded = false;

var profilePage = {
	resizewindow: function() {
		var winWidth = jQuery(window).width();
		var winHeight = jQuery(window).height();
		
		//profile tweak diag
		var left = (winWidth / 2) - (jQuery('.profile-tweak-diag').width() / 2);
		var top = (winHeight / 2) - (jQuery('.profile-tweak-diag').height() / 2);
		jQuery('.profile-tweak-diag').css({
			'left': left.toString() + 'px',
			'top': top.toString() + 'px'
		});
		
		jQuery('.profile-tweak-diag > .first-child').height(jQuery('.profile-tweak-diag').height());

		//profile page
		var height = jQuery('.profile-container').outerHeight();
		var width = jQuery('.profile-container').outerWidth();
		var top = Math.floor((jQuery('.contentPageContainer').height() - height) / 2);
		var left = Math.floor((jQuery('.contentPageContainer').width() - width) / 2);

		jQuery('.profile-container').css({
			'position': 'absolute',
			'top': top.toString() + 'px'
		});

		if (!editMode) {
			jQuery('.profile-container').css({'left': left.toString() + 'px'});
		} else {
			left = left - 80;
			jQuery('.profile-container').css({'left': left.toString() + 'px'});
		}

		if (jQuery('.profile-container').length < 1) return;
		//tweak dialog
		var top = parseInt(jQuery('.profile-container').css('top').replace('px', '')) + jQuery('.profile-container').outerHeight() + 10;
		jQuery('.profile-tweak').css({'top':top.toString() + 'px'});
		
		//resize tweak sidebar
		//jQuery('.profile-tweak-side').width(jQuery('#sidebar').width()).height(winHeight);

		//reposition
		var top = jQuery('.profile-img-cont').height() + 2;
		jQuery('.dp-msg').css({
			'top': top.toString() + 'px'
		});

		//profile upload input
		if (is_ff) {
			jQuery('#dpFileUpload').css({'display':'none'});
		} else {
			jQuery('#dpFileUpload').css({
				'width':'0',
				'height':'0',
				'overflow':'hidden',
				'display': 'inline'
			});
		}

		//image zooming
		var zoomVal;
		var imgLongside = 'x';
		jQuery('.dp-edit-zoom').slider({
			orientation: 'vertical',
			range: 'min',
			min: 100,
			max: 500,
			value: 100,
			start: function(e,ui) {
				if (!dpEditing)
					return;
				
				zoomVal = jQuery('.profile-img').css('background-size');
				zoomVal = parseInt(zoomVal.replace('%', ''));
				/*var imgObj = new Image();
				var imgSrc = jQuery('.profile-img').css('background-image');
				imgSrc = imgSrc.replace('url(','').replace(')','');
				imgObj.src = imgSrc;
				var imgWidth = imgObj.width;
				var imgHeight = imgObj.height;*/
				var imgWidth = dpImgObj.width;
				var imgHeight = dpImgObj.height;
				imgLongside = (imgHeight > imgWidth ? 'y' : 'x');
			},
			slide: function(e,ui) {
				if (!dpEditing)
					return;
				
				var sliderVal = ui.value;
				if (imgLongside == 'x') {
					jQuery('.profile-img').css({
						'background-size': 'auto ' + sliderVal.toString() + '%'
					});
				} else {
					jQuery('.profile-img').css({
						'background-size': sliderVal.toString() + '%' + ' auto'
					});
				}
			},
			change: function(e, ui) {
				if (!dpEditing)
					return;
				
				var imgWidth = dpImgObj.width;
				var imgHeight = dpImgObj.height;
				imgLongside = (imgHeight > imgWidth ? 'y' : 'x');
				
				var sliderVal = ui.value;
				if (imgLongside == 'x') {
					jQuery('.profile-img').css({
						'background-size': 'auto ' + sliderVal.toString() + '%'
					});
				} else {
					jQuery('.profile-img').css({
						'background-size': sliderVal.toString() + '%' + ' auto'
					});
				}
			}
		});

		//bg zooming
		var zoomVal;
		var imgLongside = 'x';

		jQuery('.bg-edit-zoom').slider({
			orientation: 'horizontal',
			min: 100,
			max: 500,
			value: 100,
			start: function(e,ui) {
				if (!bgEditMode) return;

				zoomVal = jQuery('.contentPageContainer').css('background-size');
				zoomVal = parseInt(zoomVal.replace('%', ''));
				var imgObj = new Image();
				var imgSrc = jQuery('.contentPageContainer').css('background-image');
				imgSrc = imgSrc.replace('url(','').replace(')','');
				imgObj.src = imgSrc;
				var imgWidth = imgObj.width;
				var imgHeight = imgObj.height;
				imgLongside = (imgHeight > imgWidth ? 'y' : 'x');
			},
			slide: function(e, ui) {
				if (!bgEditMode) return;

				var sliderVal = ui.value;
				if (imgLongside == 'y') {
					jQuery('.contentPageContainer').css({
						'background-size': 'auto ' + sliderVal.toString() + '%'
					});
				} else {
					jQuery('.contentPageContainer').css({
						'background-size': sliderVal.toString() + '%' + ' auto'
					});
				}
			}
		});
	},
	bindevents: function() {
		if (profilePageEventsBinded)
			return;

		//open edit mode
		jQuery(document).on('click', '.profile-tweak', function() {
			if (!editMode) {
				//position profile menu
				var width = jQuery('.profile-edit-menu').width() + 5;
				jQuery('.profile-edit-menu').css({
					'right': '-' + width.toString() + 'px'
				});

				//animate profile container
				jQuery('.profile-container').animate({
					left: '-=80px'
				}, 350, resizewindow);

				jQuery('.profile-edit-menu > li').hide();
				jQuery('.profile-edit-menu').show();
				var duration = 600;
				jQuery('.profile-edit-menu > li').each(function() {
					var index = jQuery(this).index();
					duration = (index == 0 ? duration : duration + 80);
					jQuery(this).fadeIn(duration);
				});
				
				editMode = true;
			}
		});

		//dimmer close
		jQuery(document).on('click', '.dimmer', function() {
			jQuery(this).hide();
			jQuery('.profile-tweak-diag').hide();
		});

		/* --- Profile Edit --- */
		var origImgUrl = '';
		var origImgBgsize = '';
		var origImgBgpos = '';

		var dpOptionClick = false;
		var profileContainerClick = true;

		jQuery(document).on('click', '.dp-edit', function() {
			dpOptionClick = true;

			if (jQuery('.dp-edit-menu').is(':hidden'))
				jQuery('.dp-edit-menu').slideDown(50);
			else
				jQuery('.dp-edit-menu').slideUp(50);
		});

		jQuery(document).on('click', '.profile-container', function() {
			profileContainerClick = true;
		});

		jQuery(document).on('click', '.contentPageContainer', function() {
			if (dpOptionClick || profileContainerClick) {
				dpOptionClick = false;
				profileContainerClick = false;
				return;
			}
			
			if (jQuery('.dp-edit-menu').is(':visible'))
				jQuery('.dp-edit-menu').slideUp(50);

			if (dpEditing) {
				dpEditing = false;

				jQuery('.dp-upload, .dp-edit-zoom-container').fadeOut(100);
				jQuery('.profile-img').css({'cursor':'auto'});

				saveProfileImg();
			}
		});

		jQuery(document).on('click', '.dp-edit-dp', function() {
			if (dpEditing || !dpImgObj_loaded) {
				dpEditing = false;

				jQuery('.dp-upload, .dp-edit-zoom-container').fadeOut(100);
				jQuery('.profile-img').css({'cursor':'auto'});

				saveProfileImg();
				return;
			}

			jQuery('.dp-upload, .dp-edit-zoom-container').fadeIn(100);
			jQuery('.profile-img').css({'cursor':'move'});

			var imgObj = new Image();
			
			var src;
			src = jQuery('.profile-img').css('background-image');
			src = src.replace(/url\(['|"]*/i, '').replace(/['|"]*\)/i, '').trim();
			imgObj.src = src;
			
			var bgSize;
			bgSize = jQuery('.profile-img').css('background-size');
			bgSize = bgSize.replace('auto', '').replace('%', '').trim();
			bgSize = parseInt(bgSize);
			
			jQuery('.dp-edit-zoom').slider('value', bgSize);
			jQuery('#dpFileUpload').val('');
			
			zoomVal = jQuery('.profile-img').css('background-size');
			zoomVal = parseInt(zoomVal.replace('%', ''));
			
			dpEditing = true;
			
			origImgUrl = jQuery('.profile-img').css('background-image');
			origImgUrl = origImgUrl.replace(/url\(['|"]*/i, '').replace(/['|"]*\)/i, '').trim();
			origImgBgsize = jQuery('.profile-img').css('background-size');
			origImgBgpos = jQuery('.profile-img').css('background-position');
		});

		//image panning
		var startFrmImg = false;
		jQuery(document).mousedown(function() {
			mouseIsDown = true;
		}).mouseup(function() {
			mouseIsDown = false;
			startFrmImg = false;
			jQuery('body').removeClass('no-select');
			jQuery('body').css({'cursor':'auto'});
		});

		var startPosX = 0;
		var startPosY = 0;
		var bgImgPos = '';
		var bgImgPosX = '';
		var bgImgPosY = '';
		jQuery(document).on('mousedown', '.profile-img', function(e) {
			if (!dpEditing)
				return;

			startFrmImg = true;
			startPosX = e.pageX;
			startPosY = e.pageY;
			bgImgPos = jQuery('.profile-img').css('background-position');
			bgImgPosX = bgImgPos.split(' ')[0];
			bgImgPosX = parseInt(bgImgPosX.replace('%', ''));
			bgImgPosY = bgImgPos.split(' ')[1];
			bgImgPosY = parseInt(bgImgPosY.replace('%', ''));

			jQuery('body').css({'cursor':'move'});
			e.preventDefault();
		});
		
		jQuery(document).on('mousewheel', '.profile-img, .dp-edit-zoom-container, .dp-upload', function(e) {
			if (!dpEditing)
				return;
			
			var up = (e.originalEvent.wheelDelta < 0 ? false : true);
			var step = 10;
			var s = jQuery('.dp-edit-zoom');
			if (up)
				s.slider('value', s.slider('value') + step);
			else
				s.slider('value', s.slider('value') - step);
		});
		
		jQuery('.dp-edit-zoom-plus, .dp-edit-zoom-minus').click(function() {
			if (!dpEditing)
				return;
			
			var up = jQuery(this).hasClass('dp-edit-zoom-plus');
			var step = 2;
			var s = jQuery('.dp-edit-zoom');
			if (up)
				s.slider('value', s.slider('value') + step);
			else
				s.slider('value', s.slider('value') - step);
		});

		jQuery(document).mousemove(function(e) {
			if (!mouseIsDown || !startFrmImg || !dpEditing)
				return;
			
			jQuery('body').addClass('no-select');
			
			mousePosX = e.pageX;
			mousePosY = e.pageY;
			
			var zoomVal = jQuery('.dp-edit-zoom').slider('value');
			var zmp = ((zoomVal - 100) / 400) * 100;
				zmp = (zmp <= 0 ? 0.5 : zmp);
			var zoomDenser = 3 / 100 * zmp;
			
			var moveX = startPosX - mousePosX;
			var bgPosFinalX = bgImgPosX + moveX;
			bgPosFinalX = (bgPosFinalX > 100 ? 100 : bgPosFinalX);
			bgPosFinalX = (bgPosFinalX < 0 ? 0 : bgPosFinalX);

			var moveY = startPosY - mousePosY;
			var bgPosFinalY = bgImgPosY + moveY;
			bgPosFinalY = (bgPosFinalY > 100 ? 100 : bgPosFinalY);
			bgPosFinalY = (bgPosFinalY < 0 ? 0 : bgPosFinalY);

			jQuery('.profile-img').css({
				'background-position': bgPosFinalX.toString() + '% ' + bgPosFinalY.toString() + '%'
			});
		});

		//image uploading
		jQuery(document).on('click', '.dp-upload > button', function() {
			jQuery('#dpFileUpload').trigger('click');
		});

		jQuery(document).on('change', '#dpFileUpload', function() {
			if (jQuery(this).val() == '')
				return;

			if (window.FileReader) {
				//file type
				var filetype = document.getElementById('dpFileUpload').files[0].type;
				if (filetype != 'image/jpeg' && filetype != 'image/jpg' && filetype != 'image/png' && filetype != 'image/gif') {
					dpMsg('error', 'Only jpg, png and gif');
					return;
				}

				//file size
				var filesize = document.getElementById('dpFileUpload').files[0].size;
				if (filesize > 20971520) {
					dpMsg('error', 'File size is more than 20MB');
					return;
				}
			}

			if (window.FileReader && this.files && this.files[0]) {
		        var reader = new FileReader();
		        reader.onload = function(e) {
		        	imgSrc = e.target.result;
		        	var imgObj = new Image();
	        		imgObj.src = imgSrc;

	        		jQuery('.dp-edit-zoom').slider('value', 100);

		            jQuery('.profile-img').css({
		            	'background-image': 'url(' + e.target.result + ')',
		            	'background-size': (imgObj.height > imgObj.width ? '100% auto' : 'auto 100%')
					});
		        }
		        reader.readAsDataURL(this.files[0]);
		    }
		});

		function dpMsg(type, msg) {
			var col = '';
			if (type == 'error') {
				col = 'red'; pseudoClass = 'dp-msg-col-err';
			} else if (type == 'warning') {
				col = 'yellow'; pseudoClass = 'dp-msg-col-war';
			} else {
				col = 'green'; pseudoClass = 'dp-msg-col-suc';
			}

			jQuery('.dp-msg > span').css({'background-color':col}).removeClass('dp-msg-col-err dp-msg-col-war dp-msg-col-suc').addClass(pseudoClass);
			jQuery('.dp-msg > span').text(msg);
			jQuery('.dp-msg').fadeIn(200);
		}

		//image saving
		function saveProfileImg() {
			/* Image file validations */
			if (jQuery('#dpFileUpload').val() != '') {
				if (!window.FileReader) {
					alert('Unsupported version of your browser!');
				} else {
					//file type
					var filetype = document.getElementById('dpFileUpload').files[0].type;
					if (filetype != 'image/jpeg' && filetype != 'image/jpg' && filetype != 'image/png' && filetype != 'image/gif') {
						console.log('But that\'s not even an image!');
						resetDp();
						return;
					}

					//file size
					var filesize = document.getElementById('dpFileUpload').files[0].size;
					if (filesize > 20971520) {
						console.log('Image too big!');
						resetDp();
						return;
					}
				}
			}

			/* Proceed with upload */
			var formData = new FormData();
			if (jQuery('#dpFileUpload').val() != '') {
				var fileInput = document.getElementById('dpFileUpload');
				var file = fileInput.files[0];
				formData.append('img', file);
				formData.append('change_sett', 0);
			} else {
				formData.append('change_sett', 1);
			}

			formData.append('post_sess_id', sess_id);
			formData.append('request', 'change dp');
			formData.append('bg_size', jQuery('.profile-img').css('background-size'));
			formData.append('bg_pos', jQuery('.profile-img').css('background-position'));
			
			var xhr = new XMLHttpRequest();
		    jQuery.ajax({
		        url: '/pubcon/user_crud.php',
		        type: 'POST',
		        xhr: function() {
		            var myXhr = jQuery.ajaxSettings.xhr();
		            return myXhr;
		        },
		        data: formData,
		        contentType: false,
		        processData: false
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

				switch (data.status) {
					case 'image changed':
						bgImage = 'url(' + data.link + ')';
						jQuery('.profile-img, .sidebar-profile-img').css({
							'background-image': bgImage
						});
						console.log(data);
						break;
					default:
						console.log(data);
				}

				//reset
				jQuery('#dpFileUpload').val('');

				//set sidebar dp settings
				jQuery('.sidebar-profile-img').css({
					'background-size': jQuery('.profile-img').css('background-size'),
					'background-position': jQuery('.profile-img').css('background-position')
				});
		    }).fail(function() {
		    	serverError();
		    });
		}

		function resetDp() {
			jQuery('.profile-img').css({
				'background-image': 'url(' + origImgUrl + ')',
				'background-size': origImgBgsize,
				'background-position': origImgBgpos
			});
		}


		/* --- Wallpaper Edit --- */

		var origBgSrc = '';
		var origBgSize = '';
		var origBgPos = '';

		jQuery(document).on('click', '.dp-edit-bg', function() {
			if (bgEditMode) return;

			bgEditMode = true;
			jQuery('.profile-container').css({ 'pointer-events': 'none' }).animate({ opacity: 0.4 }, 450);
			jQuery('.dp-edit').fadeOut(100);
			jQuery('.bg-edit-cont').css({ 'cursor': 'auto' }).fadeIn(100);
			jQuery('.contentPageContainer').css({ 'cursor': 'move' });

			//store original settings
			origBgSrc = jQuery('.contentPageContainer').css('background-image');
			origBgSrc = origBgSrc.replace('url(', '').replace(')', '');
			origBgSize = jQuery('.contentPageContainer').css('background-size');
			origBgSize = (origBgSize.indexOf('auto') == -1 ? origBgSize + ' auto' : origBgSize);
			origBgPos = jQuery('.contentPageContainer').css('background-position');

			//sync
			var bgSize = parseInt(jQuery('.contentPageContainer').css('background-size').replace('auto','').replace('%','').trim());
				bgSize = (isNaN(bgSize) ? 100 : bgSize);
			jQuery('.bg-edit-zoom').slider('value', bgSize);
		});

		//bg panning
		var startFrmImg = false;
		var mouseInOption = false;
		jQuery(document).mousedown(function() {
			mouseIsDown = true;
		}).mouseup(function() {
			mouseIsDown = false;
			startFrmImg = false;
			mouseInOption = false;
			jQuery('body').removeClass('no-select');
			jQuery('body').css({'cursor':'auto'});
		});

		jQuery(document).on('mousedown', '.bg-edit-cont > div', function() {
			mouseInOption = true;
		});

		var startPosX = 0;
		var startPosY = 0;
		var bgImgPos = '';
		var bgImgPosX = '';
		var bgImgPosY = '';
		jQuery(document).on('mousedown', '.contentPageContainer', function(e) {
			if (!bgEditMode || mouseInOption) return;
			
			startFrmImg = true;
			startPosX = e.pageX;
			startPosY = e.pageY;
			bgImgPos = jQuery(this).css('background-position');
			bgImgPosX = bgImgPos.split(' ')[0];
			bgImgPosX = parseInt(bgImgPosX.replace('%', ''));
			bgImgPosY = bgImgPos.split(' ')[1];
			bgImgPosY = parseInt(bgImgPosY.replace('%', ''));

			jQuery('body').css({'cursor':'move'});
			e.preventDefault();
		});

		jQuery(document).mousemove(function(e) {
			if (!mouseIsDown || !startFrmImg || !bgEditMode) return;
			
			jQuery('body').addClass('no-select');
			
			mousePosX = e.pageX;
			mousePosY = e.pageY;
			
			var moveX = startPosX - mousePosX;
			var bgPosFinalX = bgImgPosX + moveX;
			bgPosFinalX = (bgPosFinalX > 100 ? 100 : bgPosFinalX);
			bgPosFinalX = (bgPosFinalX < 0 ? 0 : bgPosFinalX);

			var moveY = startPosY - mousePosY;
			var bgPosFinalY = bgImgPosY + moveY;
			bgPosFinalY = (bgPosFinalY > 100 ? 100 : bgPosFinalY);
			bgPosFinalY = (bgPosFinalY < 0 ? 0 : bgPosFinalY);

			jQuery('.contentPageContainer').css({
				'background-position': bgPosFinalX.toString() + '% ' + bgPosFinalY.toString() + '%'
			});
		});

		//cancel bg editing
		jQuery(document).on('click', '.bg-edit-cancel', function() {
			cancelBgEdit();
		});

		function cancelBgEdit() {
			jQuery('.contentPageContainer').css({
				'background-image': 'url(' + origBgSrc + ')',
				'background-size': origBgSize,
				'background-position': origBgPos
			});

			jQuery('.profile-container').css({ 'pointer-events': 'auto' }).animate({ opacity: 1 }, 450);
			jQuery('.dp-edit').fadeIn(100);
			jQuery('.bg-edit-cont').fadeOut(150);
			jQuery('.contentPageContainer').css({ 'cursor': 'auto' });
			bgEditMode = false;
		}

		//bg uploading
		if (is_ff) {
			jQuery('#bgFileUpload').css({'display':'none'});
		} else {
			jQuery('#bgFileUpload').css({
				'width':'0',
				'height':'0',
				'overflow':'hidden',
				'display': 'inline'
			});
		}

		jQuery(document).on('click', '.bg-edit-upload', function() {
			jQuery('#bgFileUpload').trigger('click');
		});

		jQuery(document).on('change', '#bgFileUpload', function() {
			if (jQuery(this).val() == '') return;

			if (window.FileReader) {
				//file type
				var filetype = document.getElementById('bgFileUpload').files[0].type;
				if (filetype != 'image/jpeg' && filetype != 'image/jpg' && filetype != 'image/png') {
					//dpMsg('error', 'Only jpg, png and gif');
					console.log('Only jpg, png and gif');
					return;
				}

				//file size
				var filesize = document.getElementById('bgFileUpload').files[0].size;
				if (filesize > 20971520) {
					//dpMsg('error', 'File size is more than 20MB');
					console.log('File size is more than 20MB');
					return;
				}
			}

			if (window.FileReader && this.files && this.files[0]) {
		        var reader = new FileReader();
		        reader.onload = function(e) {
		        	imgSrc = e.target.result;
		        	var imgObj = new Image();
	        		imgObj.src = imgSrc;

	        		jQuery('.bg-edit-zoom').slider('value', 100);

		            jQuery('.contentPageContainer').css({
		            	'background-image': 'url(' + e.target.result + ')',
		            	'background-size': (imgObj.height < imgObj.width ? '100% auto' : 'auto 100%')
					});
					
					//blur bg
					chatPage.blurbg(URL_PATH);
		        }
		        reader.readAsDataURL(this.files[0]);
		    }
		});

		//bg saving
		jQuery(document).on('click', '.bg-edit-save', function() {
			if (!bgEditMode) return;

			saveWallpaper();
		});

		function saveWallpaper() {
			//image file validations
			if (jQuery('#bgFileUpload').val() != '') {
				if (!window.FileReader) {
					alert('Unsupported version of your browser!');
				} else {
					//file type
					var filetype = document.getElementById('bgFileUpload').files[0].type;
					if (filetype != 'image/jpeg' && filetype != 'image/jpg' && filetype != 'image/png') {
						alert('Unsupported file type');
						cancelBgEdit();
						return;
					}

					//file size
					var filesize = document.getElementById('bgFileUpload').files[0].size;
					if (filesize > 20971520) {
						alert('Image size too big!');
						cancelBgEdit();
						return;
					}
				}
			}

			//proceed with upload
			var formData = new FormData();
			if (jQuery('#bgFileUpload').val() != '') {
				/*var fileInput = document.getElementById('bgFileUpload');
				var file = fileInput.files[0];*/
				var id = jQuery('.contentPageContainer[data-content-page-link="' + URL_PATH + '"]').find('canvas').attr('id');
				var c = document.getElementById(id);
				var file = c.toDataURL('image/png');
				formData.append('img', file);
				formData.append('change_sett', 0);
			} else {
				formData.append('change_sett', 1);
			}

			formData.append('post_sess_id', sess_id);
			formData.append('request', 'change bg');
			formData.append('bg_size', jQuery('.contentPageContainer').css('background-size'));
			formData.append('bg_pos', jQuery('.contentPageContainer').css('background-position'));
			
			var xhr = new XMLHttpRequest();
		    jQuery.ajax({
		        url: '/pubcon/user_crud.php',
		        type: 'POST',
		        xhr: function() {
		            var myXhr = jQuery.ajaxSettings.xhr();
		            return myXhr;
		        },
		        data: formData,
		        contentType: false,
		        processData: false
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

				switch (data.status) {
					case 'image changed':
						bgImage = 'url(' + data.link + ')';
						jQuery('.contentPageContainer').css({
							'background-image': bgImage
						});
						break;
					default:
						console.log(data);
				}

				//finish off
				jQuery('#bgFileUpload').val('');
				jQuery('.profile-container').css({ 'pointer-events': 'auto' }).animate({ opacity: 1 }, 450);
				jQuery('.dp-edit').fadeIn(100);
				jQuery('.bg-edit-cont').fadeOut(150);
				jQuery('.contentPageContainer').css({ 'cursor': 'auto' });
				bgEditMode = false;

		    }).fail(function() {
		    	serverError();
		    });
		}


		/* --- Add/remove user as contact --- */

		function fetchUser() {
			USER = location.pathname;
			USER = (USER.indexOf('/') == 0 ? USER.substr(1) : USER);
			USER = (USER.substr(-1) == '/' ? USER.substr(0, USER.length - 1) : USER);
			USER = USER.split('/');
			USER = (typeof USER[1] != 'undefined' ? USER[1] : logUN);
		}

		jQuery(document).on('click', '#prfl_add_cntact_btn', function() {
			var button = jQuery(this);
			fetchUser();

			jQuery.ajax({
				url: '/pubcon/user_crud.php',
				type: 'POST',
				data: {
					post_sess_id: sess_id,
					request: 'add/remove contact',
					contact: USER
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

				if (data.status == 'added') {
					button.text('Remove from Contacts');
				} else if (data.status == 'removed') {
					button.text('Add to Contacts');
				}

				console.log(jsonData);
			}).fail(function() {
				serverError();
			});
		});

		profilePageEventsBinded = true;
	}
};

jQuery(document).ready(function() {

	jQuery(window).resize(function() {
		profilePage.resizewindow();
	});

	for (x = 0; x < 5; x++) {
		profilePage.resizewindow();
	}

	profilePage.bindevents();
	
	//load dp image
	if (URL_PATH == '/' || URL_PATH == '/profile') {
		var src = jQuery('.profile-img').css('background-image');
			src = src.replace('url(','').replace(')','');
		
		dpImgObj.onload = function() {
			dpImgObj_loaded = true;
		};
		
		dpImgObj.src = src;
	}
});