(function($) {
    
    window.postContent = {
        uploadFile: {
            filePresent: false,
            file: null,
            type: "img",
            reset: function() {
                window.postContent.uploadFile.file = null;
                window.postContent.uploadFile.type = "img";
            },
            preview: {
                show: function(image) {
                    if (image == undefined)
                        return false;

                    var oFReader = new FileReader();
                    oFReader.readAsDataURL(image);

                    oFReader.onload = function (oFREvent) {
                        $('.post-img-placeholder img').attr('src', oFREvent.target.result);
                        $('.post-img-placeholder').show();
                    };
                },
                hide: function() {
                    $('.post-img-placeholder img').attr('src', '');
                    $('.post-img-placeholder').hide();
                }
            }
        },
        cleanup: function() {
            window.postContent.uploadFile.reset();
            window.postContent.uploadFile.filePresent = false;
            window.postContent.uploadFile.preview.hide();

            $('.upload-image-controls').hide();
            $('.upload-file-controls').css('display', 'inline-block');

            window.postUploadFile.removeCurrent();

            $('.postText').val('');
        }
    };
    
    window.bindScrollEvent = {
        home: function() {
            $('.content_page.home_page').scroll(function() {
                var $this = $(this);
                
                var loadAreaMin = $this[0].scrollHeight - 1200;
                var loadAreaMax = $this[0].scrollHeight - 1170;
                
                var location = $this.scrollTop();
                
                if (location > loadAreaMin && location < loadAreaMax)
                    $this.find('.loadMoreHome').click();
            });
        }
    };
    
    // document.ready
    $(function() {
        var _doc = $('body');
        
        // home scroll event
        window.bindScrollEvent.home();
        
        /* Post */
        _doc.on('click', '.postButton', function() {
            var btn = $(this);
            
            var data = {};

            var text = btn.closest('.home-post-container').find('.postText').val();
            text = text.trim();
            data.text = text;

            var upload = function() {
                $.ajax({
                    url: "/pubcon/post.php",
                    type: "POST",
                    dataType: "json",
                    data: data,
                    success: function(res) {
                        console.log(res);
                        window.postContent.cleanup();
                    },
                    fail: function() {
                        console.log('ajax failed!');
                    }
                });
            };

            if (window.postContent.uploadFile.filePresent) {
                window.postUploadFile.setOptions({
                    onComplete: function(filename, res) {
                        if (res.success) {
                            window.postContent.uploadFile.file = res.file_name;
                            window.postContent.uploadFile.type = "img";
                            
                            data.media = {
                                file: window.postContent.uploadFile.file,
                                type: window.postContent.uploadFile.type
                            };

                            upload();
                        } else {
                            console.log('failed to upload image');
                        }
                    }
                });

                window.postUploadFile.submit();
            } else if (data.text.length != 0) {
                upload();
            }
            
        });
        
        // Upload file event handler
        if ($(".uploadImg").length > 0) {
            window.postUploadFile = new ss.SimpleUpload({
                button: [$(".uploadImg"), $(".uploadImgChange")],
                url: "/pubcon/upload_file.php",
                name: "uploadfile",
                data: {
                    type: "img"
                },
                maxSize: 15000, //15MB
                allowedExtensions: ['png', 'jpg', 'jpeg', 'gif'],
                responseType: "json",
                autoSubmit: false,
                debug: true,
                onChange: function() {
                    window.postContent.uploadFile.preview.show($('input[name="uploadfile"]')[0].files[0]);
                    $('.upload-file-controls').hide();
                    $('.upload-image-controls').css('display', 'inline-block');
                    window.postContent.uploadFile.filePresent = true;
                },
                onError: function() {
                    console.log('error');
                    window.postContent.uploadFile.reset();
                }
            });
        }

        // Remove image
        _doc.on('click', '.uploadImageRemove', function() {
            window.postContent.uploadFile.reset();
            window.postUploadFile.removeCurrent();
            window.postContent.uploadFile.filePresent = false;
            window.postContent.uploadFile.preview.hide();
            $('.upload-image-controls').hide();
            $('.upload-file-controls').css('display', 'inline-block');
        });
        
        /* Load more posts */
        _doc.on('click', '.loadMoreHome', function() {
            var btn = $(this);
            if (btn.attr('disabled'))
                return;
            
            btn.attr('disabled', 'disabled');
            
            var last_post_elem = $('.home-content-container.content-item-cntr .content-item').last();
            var last_post = last_post_elem.attr('data-id');
            if (last_post == undefined)
                return;
            
            $.ajax({
                url: '/pubcon/get_posts.php',
                type: 'GET',
                dataType: 'html',
                data: {
                    type: 'subscribed',
                    last_post: last_post
                },
                success: function(res) {
                    last_post_elem.after(res);
                    if (res.length == 0)
                        btn.hide();
                },
                complete: function() {
                    _.delay(function() {
                        btn.removeAttr('disabled');
                    }, 1000);
                }
            });
        });
        
    });
    // end of document.ready
    
})(jQuery);
