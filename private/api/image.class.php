<?php

include_once('/var/www/pn/private/lib/composer/vendor/autoload.php');
use Intervention\Image\ImageManagerStatic as Imager;

// Imager::configure(array('driver' => 'imagick'));

class Image {
	public $category = 'posts';
	public $dir;
	public $filename;
	public $info = array();
	public $time;
	public static $valid_thumbs = array(
		'posts' => array(
			array(
				'width' => 300,
				'height' => 200
			)
		),
		'profile' => array(
			array(
				'width' => 60,
				'height' => 60
			),
			array(
				'width' => 100,
				'height' => 100
			)
		),
		'cafe_profile' => array(
			array(
				'width' => 100,
				'height' => 100
			)
		)
	);
	
	public static function exist($path) {
		/**
		 * Check for the file in the system
		 * @return Boolean
		 */
		
		return file_exists($path);
	}
	
	public static function isThumbnail($path) {
		/**
		 * Checks if the filename is a thumbnail
		 * @return Boolean
		 */
		
		$file = basename($path);
		return preg_match('/_\d+x\d+\.[^\.]+$/i', $file);
	}
	
	public static function getOriginal($filepath, $type) {
		/**
		 * Get the original filepath
		 * @return String - original filepath
		 */
		
		// extraxt image file name
		$name = basename($filepath);
		$name = preg_replace('/_\d+x\d+\.[^\.]+$/i', '', $name);
		
		$table = 'contents';
		$col = 'content';
		if ($type=='profile') {
			$table = 'accounts';
			$col = 'profile_picture';
		} else if ($type == 'cafe_profile') {
			$table = 'cafes';
			$col = 'profile_img';
		}
		
		$query = DB::query('select %l from %l where %l0 LIKE%ss limit 1', $col, $table, $name);
		if (empty($query))
			return false;
		
		return '/var/www/kc/public_html/img/'.$type.'/'.$query[0][$col];
	}
	
	public static function getType($file) {
		$m;
		preg_match('/([^\/]+)\/[^\/]+$/i', $file, $m);
		return $m[1];
	}
	
	public static function getValidDimensions($file, $type) {
		$matches = array();
		preg_match('/_(\d+)x(\d+)\.[^\.]+$/i', $file, $matches);
		$res = array();
		$res['width'] = $matches[1];
		$res['height'] = $matches[2];
		
		// match valid
		$valid = Image::$valid_thumbs;
		$valid = $valid[$type];
		if (count($valid)==1) {
			$res['width'] = $valid[0]['width'];
			$res['height'] = $valid[0]['height'];
		}
		
		return $res;
	}
	
	function createThumbnail($img, $option=array()) {
		/**
		 * Create a thumbnail (300x200) image from the original image resource
		 * @param Resource|String - the original image resource or path-to-file
		 * @param Array - options
		 * @return Array - image resource and file path and other information
		 */
		
		$op = array_merge(array(
			'dimension' => array('width'=>300, 'height'=>200),
			'filename' => null,
			'type' => null,
			'mime' => 'jpeg'
		), $option);
		
		if (gettype($img) != 'object') {
			if (strpos($img, 'public_html/') === 0)
				$img = '/var/www/kc/' . $img;
			$img = Imager::make($img);
		}
		
		// resize
		$img->fit($op['dimension']['width'], $op['dimension']['height']);
		// save to system
		if ($op['filename']===null)
			$op['filename'] = $this->generateFilename();
		$full = '/var/www/kc/public_html/img/'.$op['type'].'/'.$op['filename'].'_'.$op['dimension']['width'].'x'.$op['dimension']['height'].'.'.$op['mime'];
		$img->save($full, 85);
		
		return array(
			'filename' => $op['filename'],
			'dimension' => $op['dimension'],
			'mime' => $op['mime'],
			'resource' => $img,
			'filepath' => $full
		);
	}
	
	public static function generateFilename() {
		/**
		 * Generate a random unique filename
		 * @return String - the filename
		 */
		
		$chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		$str;
	    while(1){
	        $str = '';
	        srand((double)microtime()*1000000);
	        for($i = 0; $i < 24; $i++){
	            $str .= substr($chars,(rand()%(strlen($chars))), 1);
	        }
	        break;
	    }
		
		return $str;
	}
	
	
	/**
	 * Get a thumbnail version of an image
	 * 
	 * @param string	Original image
	 * @param string	Dimension
	 * @return string	New image thumbnail
	 */
	public static function getImageThumbnail($img, $dimension) {
		$img = preg_replace('/\.[^\.]+$/i', '', $img);
		if (strpos($dimension, 'x') === false)
			$dimension = $dimension.'x'.$dimension;
		
		return $img.'_'.$dimension.'.jpeg';
	}
}

?>