function uniqid(a,b){"undefined"==typeof a&&(a="");var c,d=function(a,b){return a=parseInt(a,10).toString(16),b<a.length?a.slice(a.length-b):b>a.length?Array(1+(b-a.length)).join("0")+a:a};return this.php_js||(this.php_js={}),this.php_js.uniqidSeed||(this.php_js.uniqidSeed=Math.floor(123456789*Math.random())),this.php_js.uniqidSeed++,c=a,c+=d(parseInt((new Date).getTime()/1e3,10),8),c+=d(this.php_js.uniqidSeed,5),b&&(c+=(10*Math.random()).toFixed(8).toString()),c}function isNear(a,b,c){var d=a.offset().left-b,e=a.offset().top-b,f=d+a.width()+2*b,g=e+a.height()+2*b,h=c.pageX,i=c.pageY;return h>d&&f>h&&i>e&&g>i}function serverError(){alert("There was a problem with the server connection. Please try again later.")}!function(){window.jQuery.ajaxSetup({timeout:3e4,fail:function(){window._dialog({icon:"exclamation",message:"Uh Oh! Looks like we couldn't establish a connection with the server. Please try again."})},error:function(a,b){"timeout"==b?window.ajaxTimeout():"parsererror"==b?window.ajaxParserError():(window.ajaxUnknownError(),console.log(b))}}),window.ajaxSessionExpired=function(){window._dialog({icon:"times",message:"Your session has timed out. Please log in again."})},window.ajaxUnknownError=function(){window._dialog({icon:"question",message:"Hmm. An Unknown error has occured. Please try again."})},window.ajaxParserError=function(){window._dialog({icon:"exclamation",message:"Oops! Looks like the server responded with gibberish words. Please try again."})},window.ajaxTimeout=function(){window._dialog({icon:"time",message:"Oh No! Your request timed out. Please try again."})}}();var _cookie={get:function(a){for(var b=a+"=",c=document.cookie.split(";"),d=0;d<c.length;d++){var e=c[d].trim();if(0==e.indexOf(b))return e.substring(b.length,e.length)}return""}},_user={},_sw={timedisplay:{bind:function(a,b){a=arguments[0]||jQuery(".time_display"),a.each(function(){var a=jQuery(this);if(!b&&a.data("timedisplayBinded"))return!0;var c=a.attr("data-timestamp");if(!c)return!0;time_ts=parseInt(c),time_iso=new Date(1e3*time_ts);var d,e=new Date,f=e.getTime()/1e3,g=f-time_ts;if(d=14400>g||g>604800?moment(time_iso).from(e):moment(time_iso).calendar(),"undefined"==typeof a.attr("data-display-alias")){var h=moment(time_iso).format("h:mma Do MMM YYYY");a.attr("title",h)}a.text(d)})},update:function(a){a||(a=jQuery(".time_display")),_sw.timedisplay.bind(a,!0)}}};jQuery(function(){_sw.timedisplay.bind()});var _pg_hndlr={enabled:!0,crnt_pg:[],pages:[],popstates:[],getPages:function(){return $("#content > .content_page")},getpage:function(a){switch(typeof a){case"string":var b=a,a=_pg_hndlr.getPages().filter('[data-link="'+b+'"]');return a;case"object":return a=_pg_hndlr.getPages().filter(a)}},getlinktype:function(a){if(!a)return"home";var b=a.match(/^\/+([^\/]+)/i);return b&&b[1]?b[1]:"home"},getspecific:function(a){var b=null,c=a.match(/^\/+[^\/]+\/+([^\/]+)/i);return c&&c[1]&&(b=c[1]),b},getlink:function(a){var b=a.attr("data-url");return b},loadpage:function(a,b,c){function d(){_sw.timedisplay.update(),_pg_hndlr.popstates.push(a),_.defer(window.NProgress.done)}if(a){var e=_pg_hndlr.getlinktype(a),f=_pg_hndlr.getspecific(a),g=_pg_hndlr.getpage(a);if(c||history.pushState(null,null,a),!g.is(_pg_hndlr.crnt_pg)){var h={};void 0!=f&&(h.specific=f),window.NProgress.start(),0==g.length?jQuery.ajax({url:_pg_hndlr.typealias("file",e),type:"POST",data:h,success:function(c){var f=jQuery(c).hide();jQuery("#content").append(f),_pg_hndlr.showpage(f,a),b&&b(),d(),"home"==e&&window.bindScrollEvent.home(),_.each(_pg_hndlr.bindEvents,function(a){a.callback()})}}):(_pg_hndlr.showpage(g,a),b&&b(),d())}}},showpage:function(a,b){a&&(a=a.first(),0!=a.length&&(_pg_hndlr.crnt_pg=a,_pg_hndlr.getPages().hide(),a.show(),_pg_hndlr.activesidebar(b)))},typealias:function(a,b){var c={home:{name:"home_page",file:"/viewer/dashboard_home.php"},profile:{name:"profile_page",file:"/viewer/profile.php"},chat:{name:"msg_page",file:"/viewer/msg.php"},c:{name:"chat_page",file:"/viewer/chat.php"},contacts:{name:"contacts_page",file:"/viewer/contacts.php"},view:{name:"view_page",file:"/viewer/view.php"},settings:{name:"settings_page",file:"/viewer/settings.php"}};"user"==b&&(b="home");var d=c[b];return d[a]},bindEvents:[],addBindEvents:function(a,b){var c=window.uniqid("event-"),d=function(){var d=function(){return"home"==a?$(".content_page.home_page"):!1}();d&&!d.data(c+"-binded")&&d.length>0&&(b(),d.data(c+"-binded",!0))};_pg_hndlr.bindEvents.push({name:c,callback:d}),d()},activesidebar:function(a){if(a){var b=_pg_hndlr.getlinktype(a),c=b;"/"==a&&(c="home"),c=".side_"+c;var d=jQuery(".sidebar_menu_item");d.removeClass("active"),d.filter(c).addClass("active")}},events:{linkclick:function(a){a.preventDefault();var b=jQuery(this),c=b.attr("href"),d=null;if(/^\/+user\/+[^\/]+/i.test(c)){var e=c.match(/^\/+user\/+([^\/]+)/i);e&&e[1]&&(d=e[1])}_pg_hndlr.loadpage(c,function(){b.hasClass("sidebar_menu_item")&&jQuery(".sidebar_menu_item").removeClass("active").filter(b).addClass("active")})},popstate:function(){var a=location.pathname;_pg_hndlr.loadpage(a,null,"popstate")}}};jQuery(window).ready(function(){if(_pg_hndlr.enabled){if("function"!=typeof history.pushState)return _pg_hndlr.enabled=!1;var a=_pg_hndlr.getPages().filter(":visible").first();0==a.length&&(a=_pg_hndlr,a.length>1&&_pg_hndlr.getPages().hide(),a.show()),_pg_hndlr.crnt_pg=a,_pg_hndlr.popstates.push(location.pathname),jQuery(document).on("click",'a:not(*[target="_blank"])',_pg_hndlr.events.linkclick),jQuery(window).on("popstate",_pg_hndlr.events.popstate),setInterval(function(){_pg_hndlr.getPages().each(function(){var a=$(this),b=Math.round(new Date/1e3),c=a.attr("data-lastactive"),d=30;return void 0==c||_pg_hndlr.crnt_pg.is(a)?(a.attr("data-lastactive",b),!0):(c=parseInt(c),void(b-d>c&&a.remove()))})},1e3)}}),function(){window._notification=function(a){var b=_.extend({title:null,message:null,href:null,ttl:5e3},a||{});if(null==b.message)return!1;var c="<div></div>",d=$(c);if(null!=b.href){var c=d.html();d=$("<a></a>").html(c),d.attr("href",b.href)}if(d.attr({"class":"content"}),null!=b.title){var e='<div class="title">'+b.title.toString()+"</div>";d.append(e)}var f='<div class="message">'+b.message+"</div>";d.append(f),$.UIkit.notify({message:d,status:"info",timeout:b.ttl,pos:"bottom-right"})},$(function(){})}(),function(a){a.fn.bPopup=function(b,c){function d(){switch(q.contentContainer=a(q.contentContainer||C),q.content){case"iframe":var b=a('<iframe class="b-iframe" '+q.iframeAttr+"></iframe>");b.appendTo(q.contentContainer),y=C.outerHeight(!0),z=C.outerWidth(!0),e(),b.attr("src",q.loadUrl),n(q.loadCallback);break;case"image":e(),a("<img />").load(function(){n(q.loadCallback),h(a(this))}).attr("src",q.loadUrl).hide().appendTo(q.contentContainer);break;default:e(),a('<div class="b-ajax-wrapper"></div>').load(q.loadUrl,q.loadData,function(b,c){n(q.loadCallback,c),h(a(this))}).hide().appendTo(q.contentContainer)}}function e(){q.modal&&a('<div class="b-modal '+r+'"></div>').css({backgroundColor:q.modalColor,position:"fixed",top:0,right:0,bottom:0,left:0,opacity:0,zIndex:q.zIndex+K}).appendTo(q.appendTo).fadeTo(q.speed,q.opacity),o(),C.data("bPopup",q).data("id",r).css({left:"slideIn"==q.transition||"slideBack"==q.transition?"slideBack"==q.transition?D.scrollLeft()+H:-1*(x+z):l(!(!q.follow[0]&&u||v)),position:q.positionStyle||"absolute",top:"slideDown"==q.transition||"slideUp"==q.transition?"slideUp"==q.transition?D.scrollTop()+G:w+-1*y:m(!(!q.follow[1]&&t||v)),"z-index":q.zIndex+K+1}).each(function(){q.appending&&a(this).appendTo(q.appendTo)}),j(!0)}function f(){return q.modal&&a(".b-modal."+C.data("id")).fadeTo(q.speed,0,function(){a(this).remove()}),q.scrollBar||a("html").css("overflow","auto"),a(".b-modal."+r).unbind("click"),D.unbind("keydown."+r),F.unbind("."+r).data("bPopup",0<F.data("bPopup")-1?F.data("bPopup")-1:null),C.undelegate(".bClose, ."+q.closeClass,"click."+r,f).data("bPopup",null),clearTimeout(B),j(),!1}function g(b){G=E.innerHeight||F.height(),H=E.innerWidth||F.width(),(s=p())&&(clearTimeout(A),A=setTimeout(function(){o(),b=b||q.followSpeed,C.dequeue().each(function(){v?a(this).css({left:x,top:w}):a(this).animate({left:q.follow[0]?l(!0):"auto",top:q.follow[1]?m(!0):"auto"},b,q.followEasing)})},50))}function h(a){var b=a.width(),c=a.height(),d={};q.contentContainer.css({height:c,width:b}),c>=C.height()&&(d.height=C.height()),b>=C.width()&&(d.width=C.width()),y=C.outerHeight(!0),z=C.outerWidth(!0),o(),q.contentContainer.css({height:"auto",width:"auto"}),d.left=l(!(!q.follow[0]&&u||v)),d.top=m(!(!q.follow[1]&&t||v)),C.animate(d,250,function(){a.show(),s=p()})}function i(){F.data("bPopup",K),C.delegate(".bClose, ."+q.closeClass,"click."+r,f),q.modalClose&&a(".b-modal."+r).css("cursor","pointer").bind("click",f),I||!q.follow[0]&&!q.follow[1]||F.bind("scroll."+r,function(){s&&C.dequeue().animate({left:q.follow[0]?l(!v):"auto",top:q.follow[1]?m(!v):"auto"},q.followSpeed,q.followEasing)}).bind("resize."+r,function(){g()}),q.escClose&&D.bind("keydown."+r,function(a){27==a.which&&f()})}function j(a){function b(b){C.css({display:"block",opacity:1}).animate(b,q.speed,q.easing,function(){k(a)})}switch(a?q.transition:q.transitionClose||q.transition){case"slideIn":b({left:a?l(!(!q.follow[0]&&u||v)):D.scrollLeft()-(z||C.outerWidth(!0))-J});break;case"slideBack":b({left:a?l(!(!q.follow[0]&&u||v)):D.scrollLeft()+H+J});break;case"slideDown":b({top:a?m(!(!q.follow[1]&&t||v)):D.scrollTop()-(y||C.outerHeight(!0))-J});break;case"slideUp":b({top:a?m(!(!q.follow[1]&&t||v)):D.scrollTop()+G+J});break;default:C.stop().fadeTo(q.speed,a?1:0,function(){k(a)})}}function k(a){a?(i(),n(c),q.autoClose&&(B=setTimeout(f,q.autoClose))):(C.hide(),n(q.onClose),q.loadUrl&&(q.contentContainer.empty(),C.css({height:"auto",width:"auto"})))}function l(a){return a?x+D.scrollLeft():x}function m(a){return a?w+D.scrollTop():w}function n(b,c){a.isFunction(b)&&b.call(C,c)}function o(){w=t?q.position[1]:Math.max(0,(G-C.outerHeight(!0))/2-q.amsl),x=u?q.position[0]:(H-C.outerWidth(!0))/2,s=p()}function p(){return G>C.outerHeight(!0)&&H>C.outerWidth(!0)}a.isFunction(b)&&(c=b,b=null);var q=a.extend({},a.fn.bPopup.defaults,b);q.scrollBar||a("html").css("overflow","hidden");var r,s,t,u,v,w,x,y,z,A,B,C=this,D=a(document),E=window,F=a(E),G=E.innerHeight||F.height(),H=E.innerWidth||F.width(),I=/OS 6(_\d)+/i.test(navigator.userAgent),J=200,K=0;return C.close=function(){f()},C.reposition=function(a){g(a)},C.each(function(){a(this).data("bPopup")||(n(q.onOpen),K=(F.data("bPopup")||0)+1,r="__b-popup"+K+"__",t="auto"!==q.position[1],u="auto"!==q.position[0],v="fixed"===q.positionStyle,y=C.outerHeight(!0),z=C.outerWidth(!0),q.loadUrl?d():e())})},a.fn.bPopup.defaults={amsl:50,appending:!0,appendTo:"body",autoClose:!1,closeClass:"b-close",content:"ajax",contentContainer:!1,easing:"swing",escClose:!0,follow:[!0,!0],followEasing:"swing",followSpeed:500,iframeAttr:'scrolling="no" frameborder="0"',loadCallback:!1,loadData:!1,loadUrl:!1,modal:!0,modalClose:!0,modalColor:"#000",onClose:!1,onOpen:!1,opacity:.7,position:["auto","auto"],positionStyle:"absolute",scrollBar:!0,speed:250,transition:"fadeIn",transitionClose:!1,zIndex:9997}}(jQuery),function(){window._dialog=function(a){var b=_.extend({showOk:!0,okText:"Ok",okCallback:function(){},message:null,buttons:[]},a||{});if(null!=b.message){var c=$("#dialog");null!=b.message&&c.find(".message").html(b.message),void 0!==b.icon?!function(){var a="";switch(b.icon){case"frown":a='<i class="fa fa-frown-o"></i>';break;case"check":a='<i class="fa fa-check green"></i>';break;case"exclamation":a='<i class="fa fa-exclamation-triangle"></i>';break;case"time":a='<i class="fa fa-clock-o"></i>';break;case"question":a='<i class="fa fa-question-circle"></i>';break;case"times":a='<i class="fa fa-times-circle"></i>'}c.find(".message").prepend('<div class="icon">'+a+"</div>")}():c.find(".message .icon").remove();var d={closeClass:"dialog-close",opacity:.9,positionStyle:"fixed"};c.find(".dialog-buttons li").remove();var e=b.buttons;b.showOk&&0==e.length&&e.push({text:b.okText,callback:function(){b.okCallback(),window._dialog_obj.close()}}),e.length>2&&(e=e.splice(0,2)),_.each(e,function(a){var b=$("<li></li>");b.append("<span>"+a.text+"</span>"),void 0!=a.type&&b.find("span").addClass(a.type),b.click(function(){window._dialog_obj.close(),"function"==typeof a.callback&&a.callback()}),b.appendTo(c.find(".dialog-buttons"))}),c.find(".dialog-buttons").attr("data-button-count",e.length);var f=c.bPopup(d);return window._dialog_obj=f,f}},window._dialog_obj=null}();var sess_id,is_chrome=navigator.userAgent.indexOf("Chrome")>-1,is_ie=navigator.userAgent.indexOf("MSIE")>-1,is_ff=navigator.userAgent.indexOf("Firefox")>-1,is_safari=navigator.userAgent.indexOf("Safari")>-1,is_opera=navigator.userAgent.indexOf("Presto")>-1;is_chrome&&is_safari&&(is_safari=!1);var is_mobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),socket=!1,socketEventsBinded=new Object,contactList=[],dashPageEventsBinded=!1,URL_PATH=location.pathname,URL_ORIG=location.origin,_page="",dashboard={resizewindow:function(){return},bindevents:function(){if(!dashPageEventsBinded){jQuery(".sidebar-main-menu > ul > li").mouseenter(function(){jQuery(this).find(".sidebar-menu-text").css({color:"#FFFFFF"})}).mouseleave(function(){jQuery(this).find(".sidebar-menu-text").css({color:"#E8E8E8"})}),jQuery(".sidebar-main-menu a").click(function(a){a.preventDefault();var b=jQuery(this).attr("href");return"sidebarLogout"==jQuery(this).attr("id")?void dashboard.logout():void dashboard.loadpage(b)}),jQuery(document).on("click",".ui-widget-overlay",function(){dashboard.dialog.close()}),dashPageEventsBinded=!0}},pageexist:function(a){return jQuery('div[data-content-page-link="'+a+'"]').length>0?!0:!1},loadpage:function(a,b){"function"==typeof window.history.pushState?window.history.pushState(null,"",a):window.location=jQuery(this).attr("href");var c=a;if(a=0==a.indexOf("/")?a.substr(1):a,a="/"==a.substr(-1)?a.substr(0,a.length-1):a,a=a.split("/"),c="profile"==a[0]&&"undefined"==typeof a[1]?c+"/"+logUN:"/"==c?"/profile/"+logUN:c,dashboard.pageexist(c)){jQuery("div[data-content-page-link]").hide();var d=jQuery('div[data-content-page-link="'+c+'"]');_page=d,d.show(),dashboard.activepage(a[0]),URL_PATH=c,"function"==typeof b&&b()}else jQuery.ajax({url:"/pubcon/load_page_dash.php",type:"POST",data:{post_sess_id:sess_id,page:a}}).success(function(d){try{var e=jQuery.parseJSON(d)}catch(f){return console.log("---"),console.log("ERROR"),console.log("> "+f),console.log("> "+d),void console.log("---")}if("invalid sess_id"==e.status||"invalid data"==e.status)return console.log("error"),void console.log(e);if("404"==e.status&&dashboard.pageexist("/404"))return jQuery("#content > div").hide(),void jQuery('#content > div[data-content-page-link="/404"]').show();switch(jQuery("#content > div").hide(),jQuery("#content").append(e.content),_page=jQuery("#content > div:not(:hidden)"),dashboard.activepage(a[0]),a[0]){case"":case"profile":profilePage.bindevents(),profilePage.resizewindow();break;case"chat":chatPage.bindevents(),chatPage.resizewindow(),_page.find(".main_msg_content_area").length>0&&_page.find(".main_msg_content_area").scrollTop(_page.find(".main_msg_content_area")[0].scrollHeight)}URL_PATH=c,"function"==typeof b&&b()}).fail(function(){serverError()})},activepage:function(a){jQuery(".active-status").remove(),""==a?jQuery(".sidebar-main-menu > ul > li").first().prepend('<div class="active-status"></div>'):jQuery('.sidebar-main-menu > ul > li > a[href^="/'+a+'"]').before('<div class="active-status"></div>'),dashboard.resizewindow()},logout:function(){dashboard.dialog.set("Logout","Are you sure you want to logout?",[{text:"Logout","class":"dialog-button-blue",click:function(){dashboard.server.connected&&socket.emit("logout"),dashboard.dialog.close(),jQuery.ajax({url:"/pubcon/logout.php",type:"POST"}).success(function(){window.location.href="/"}).fail(function(){serverError()})}},{text:"Cancel",click:function(){dashboard.dialog.close()}}]),dashboard.dialog.open()},server:{userInfo:!1,connected:!1,fetchuserinfo:function(){jQuery.ajax({url:"/pubcon/user_crud.php",type:"POST",data:{post_sess_id:sess_id,request:"fetch user info"}}).success(function(a){try{var b=jQuery.parseJSON(a)}catch(c){return console.log("---"),console.log("ERROR"),console.log("> "+c),console.log("> "+a),void console.log("---")}"info fetched"==b.status&&(dashboard.server.userInfo=b.info)}).fail(function(){serverError()})},connect:function(){socket=io.connect("//localhost:8888",{"connect timeout":1500,"reconnect ":!0,"reconnection delay":100,"reconnection limit":1e4,"max reconnection attempts":999999999999}),dashboard.server.bindsocketevents()},bindsocketevents:function(){socketEventsBinded.dashboard||(socket.on("connect",function(){console.log("Connected to server"),dashboard.server.connected=!0,chatPage.bindsocketevents()}),socket.on("disconnect",function(){console.log("Disconnected from server"),dashboard.server.connected=!1}),socket.on("reconnecting",function(){console.log("Attempting to reconnect")}),socket.on("reconnect",function(){console.log("Successfully reconnected")}),socket.on("send user info",function(a){dashboard.server.userInfo=a}),socket.on("req user info",function(){console.log("Server is requesting user info");var a=_cookie.get("PNSESSID");if(""==a)return void dashboard.forcelogout();var b={info:{sessid:a}};socket.emit("res user info",b)}),socket.on("res user info confirm",function(){console.log("Server received user info")}),socket.on("connection denied",function(){console.log("connection denied from nodejs"),dashboard.forcelogout()}),socket.on("res contact list",function(){}),socketEventsBinded.dashboard=!0)}},updatecontactlist:function(){return dashboard.server.connected?void socket.emit("fetch contact list"):!1},dialog:{set:function(a,b,c,d){var e=jQuery(".dashDialog"),f=jQuery("#dashDialog");f.dialog("option","title",a),f.find(".diag-msg").html(b),f.dialog("option","buttons",c),e.find(".ui-dialog-titlebar-close").hide(),"undefined"!=typeof d&&"undefined"!=typeof d.closebutton&&d.closebutton&&e.find(".ui-dialog-titlebar-close").show()},open:function(){jQuery("#dashDialog").dialog("open")},close:function(){jQuery("#dashDialog").dialog("close")}},forcelogout:function(){console.log("You have been forced to log out!")}};jQuery(document).ready(function(){console.info("Welcome to Planenote!"),sess_id=jQuery("body > input").val(),jQuery(window).resize(function(){dashboard.resizewindow()});var a=0,b=setInterval(function(){dashboard.resizewindow(),a++,a>=5&&clearInterval(b)},400);dashboard.bindevents(),_page=jQuery(".contentPageContainer"),jQuery("#dashDialog").dialog({dialogClass:"dashDialog",autoOpen:!1,modal:!0,closeOnEscape:!0,draggable:!1,resizable:!1,open:function(){var a=jQuery(this).dialog("option","modal");a&&jQuery(".ui-widget-overlay").hide().fadeIn(250)}})}),function(a){window.postContent={uploadFile:{filePresent:!1,file:null,type:"img",reset:function(){window.postContent.uploadFile.file=null,window.postContent.uploadFile.type="img"},preview:{show:function(b){if(void 0==b)return!1;var c=new FileReader;c.readAsDataURL(b),c.onload=function(b){a(".post-img-placeholder img").attr("src",b.target.result),a(".post-img-placeholder").show()}},hide:function(){a(".post-img-placeholder img").attr("src",""),a(".post-img-placeholder").hide()}}},cleanup:function(){window.postContent.uploadFile.reset(),window.postContent.uploadFile.filePresent=!1,window.postContent.uploadFile.preview.hide(),a(".upload-image-controls").hide(),a(".upload-file-controls").css("display","inline-block"),window.postUploadFile.removeCurrent(),a(".postText").val("")}},window.bindScrollEvent={home:function(){a(".content_page.home_page").scroll(function(){var b=a(this),c=b[0].scrollHeight-1200,d=b[0].scrollHeight-1170,e=b.scrollTop();e>c&&d>e&&b.find(".loadMoreHome").click()})}},a(function(){var b=a("body");window.bindScrollEvent.home(),_pg_hndlr.addBindEvents("home",function(){a(".postText").textareaAutoSize().trigger("input")}),b.on("click",".postButton",function(){var b=a(this),c={},d=b.closest(".home-post-container").find(".postText").val();d=d.trim(),c.text=d;var e=function(){a.ajax({url:"/pubcon/post.php",type:"POST",dataType:"json",data:c,success:function(a){a.success?(window.postContent.cleanup(),window.location="/view/"+a.post.post_id):a.error&&401==a.error.code?window.ajaxSessionExpired():_dialog({okText:"Try again",icon:"frown",message:"Uh Oh! Something went wrong while uploading your post. Please try again."})},fail:function(){console.log("ajax failed!")}})};window.postContent.uploadFile.filePresent?(window.postUploadFile.setOptions({onComplete:function(a,b){if(b.success)window.postContent.uploadFile.file=b.file_name,window.postContent.uploadFile.type="img",c.media={file:window.postContent.uploadFile.file,type:window.postContent.uploadFile.type},e();else if(b.error&&401==b.error.code)window.ajaxSessionExpired();else{var d="Uh Oh! ";d+="invalid_ext"==b.error.code?"Image extension not supported. Please upload an image with an extension of JPEG, PNG or GIF.":"Something went wrong while uploading your image.",_dialog({okText:"Try again",icon:"frown",message:d})}}}),window.postUploadFile.submit()):0!=c.text.length&&e()});var c=function(){window.postUploadFile=new ss.SimpleUpload({button:[a(".uploadImg")],url:"/pubcon/upload_file.php",name:"uploadfile",data:{type:"img"},maxSize:15e3,allowedExtensions:["png","jpg","jpeg","gif"],responseType:"json",autoSubmit:!1,debug:!0,onChange:function(){window.postContent.uploadFile.preview.show(a('input[name="uploadfile"]')[0].files[0]),a(".upload-file-controls").hide(),a(".upload-image-controls").css("display","inline-block"),window.postContent.uploadFile.filePresent=!0},onError:function(){_dialog({okText:"Try again",icon:"frown",message:"Uh Oh! Something went wrong while choosing the image. Please try again."}),window.postContent.uploadFile.reset()}})};_pg_hndlr.addBindEvents("home",c),b.on("click",".uploadImageRemove",function(){window.postContent.uploadFile.reset(),window.postUploadFile.removeCurrent(),window.postContent.uploadFile.filePresent=!1,window.postContent.uploadFile.preview.hide(),a(".upload-image-controls").hide(),a(".upload-file-controls").css("display","inline-block"),window.postUploadFile.destroy(),c()}),b.on("click",".loadMoreHome",function(){var b=a(this);if(!b.attr("disabled")){b.attr("disabled","disabled");var c=a(".home-content-container.content-item-cntr .content-item").last(),d=c.attr("data-id");void 0!=d&&a.ajax({url:"/pubcon/get_posts.php",type:"GET",dataType:"html",data:{type:"subscribed",last_post:d},success:function(a){c.after(a),0==a.length&&b.hide()},complete:function(){_.delay(function(){b.removeAttr("disabled")},1e3)}})}})})}(jQuery),function(){var a={inView:!1,page:[],pages:[],homerefresh:function(a){var b=_pg_hndlr.crnt_pg;0!=b.length&&jQuery.ajax({url:"/pubcon/user_crud.php",type:"POST",data:{post_validate:jQuery("#post_validate").val(),request:"home_latest"},success:function(a){if(a=jQuery.parseJSON(a),a&&"ok"==a.status){var c=b.find(".content_cnt.profile .item").first(),d=c.attr("data-timestamp");d=parseInt(d);var e=jQuery(a.data).filter(".item"),f=jQuery();e.each(function(){var a=jQuery(this),b=a.attr("data-timestamp");b=parseInt(b),b>=d&&a.attr("data-timestamp")!=c.attr("data-timestamp")&&(f=f.add(a))}),0!=f.length&&jQuery(f.get().reverse()).each(function(){var a=jQuery(this);c.before(a),c=a})}},complete:function(){"function"==typeof a&&a()}})}};$(function(){var b=jQuery(".profile_page");a.pages=b,a.page=b.filter(":visible"),0!=a.page.length&&(a.inView=!0),$(document).on("click",".addFriend",function(){var a=$(this);if(void 0!=a.attr("disabled"))return!1;a.attr("disabled","disabled");var b={cmd:"add_remove_contact",contact_id:a.closest(".content_page.profile_page").attr("data-user-id")};$.ajax({url:"/pubcon/user_crud.php",type:"POST",dataType:"json",data:b,success:function(b){a.find(".icon").removeClass("fa-plus fa-check"),b.success&&"added"==b.action?b.connected?(a.find(".text").text("Friends"),a.find(".icon").addClass("fa-check"),a.attr("data-status","2")):(a.find(".text").text("Request Sent"),a.find(".icon").addClass("fa-plus"),a.attr("data-status","1")):b.success&&"removed"==b.action&&(b.friended_me?(a.find(".text").text("Accept Friend Request"),a.find(".icon").addClass("fa-plus"),a.attr("data-status","3")):(a.find(".text").text("Add as Friend"),a.find(".icon").addClass("fa-plus"),a.attr("data-status","0")))},complete:function(){a.removeAttr("disabled")}})})})}();