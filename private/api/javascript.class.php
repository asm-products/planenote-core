<?php

class Javascript {
	public $output = array();
	
	public function add($js) {
		$code = $js;
		if (substr($code, -1) != ';')
			$code .= ';';
		$this->output[] = $code;
	}
	
	public function output() {
		if (count($this->output) < 1)
			return '';
		
		$js_string = '';
		for ($i=0; $i < count($this->output); $i++) {
			if ($i == 0)
				$js_string = '<script>';
			
			$js = $this->output[$i];
			$s = str_replace('\n', ' ', $js);
			$s = preg_replace('/\s\s+/', ' ', $s);
			
			$s = (substr($s, 0, 1) != ' ' ? ' '.$s : $s);
			$s = (substr($s, -1) != ' ' ? $s.' ' : $s);
			$js_string .= $s;
			
			if ($i == count($this->output) - 1)
				$js_string .= '</script>';
		}
		
		$this->output = array();
		echo $js_string;
		// return $js_string;
	}
	
}

?>