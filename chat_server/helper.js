// GLOBAL FUNCTIONS LIBRARY
// ================

module.exports = {
	arrayExist: function(id, clients) {
		for (key in clients) {
			var check = clients[key].id;
		
			if (typeof byRealID != 'undefined' && byRealID === true) {
				id = byRealID;
				check = clients[key].realId;
			}
			
			if (check == id)
				return true; //return (returnSID ? clients[key].id : true);
		}

		return false;
	},
	createUID: function(preCount, customPre) {
		var preCount = (typeof preCount == 'undefined'? 2 : preCount);
		var prePre = (typeof customPre == 'undefined' ? '' : customPre.toString() + '-');
		
		var pre = '';
		if (preCount > 0) {
			for (var i=0; i < preCount; i++) {
				var n = Math.floor((Math.random()*9999)+1000);
				pre += n.toString();
				pre += '-';
			}
		}
		
		var UID = func.uniqid(prePre + pre);
		return UID;
	},
	uniqid: function(prefix, more_entropy) {
		// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +    revised by: Kankrelune (http://www.webfaktory.info/)
		// %        note 1: Uses an internal counter (in php_js global) to avoid collision
		// *     example 1: uniqid();
		// *     returns 1: 'a30285b160c14'
		// *     example 2: uniqid('foo');
		// *     returns 2: 'fooa30285b1cd361'
		// *     example 3: uniqid('bar', true);
		// *     returns 3: 'bara20285b23dfd1.31879087'
		if (typeof prefix === 'undefined') {
			prefix = "";
		}

		var retId;
		var formatSeed = function (seed, reqWidth) {
			seed = parseInt(seed, 10).toString(16); // to hex str
			if (reqWidth < seed.length) { // so long we split
				return seed.slice(seed.length - reqWidth);
			}
			if (reqWidth > seed.length) { // so short we pad
				return Array(1 + (reqWidth - seed.length)).join('0') + seed;
			}
			return seed;
		};

		// BEGIN REDUNDANT
		if (!this.php_js) {
			this.php_js = {};
		}
		// END REDUNDANT
		if (!this.php_js.uniqidSeed) { // init seed with big random int
			this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
		}
		this.php_js.uniqidSeed++;

		retId = prefix; // start with prefix, add current milliseconds hex string
		retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
		retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
		if (more_entropy) {
			// for more entropy we add a float lower to 10
			retId += (Math.random() * 10).toFixed(8).toString();
		}

		return retId;
	},
	array2string: function(array) {
		var string = '';
		for (var i=0; i < array.length; i++) {
			if (i == 0)
				string = '[';

			string = string + '"' + array[i] + '"';

			if (i == array.length - 1)
				string = string + ']';
			else
				string = string + ', ';
		}
		return string;
	},
	objVal: function(index, obj, key) {
		for (var a in obj) return a;
	},
	parseCookie: function(_cookies) {
		var cookies = {};

		_cookies && _cookies.split(';').forEach(function( cookie ) {
			var parts = cookie.split('=');
			cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
		});

		return cookies;
	}
};