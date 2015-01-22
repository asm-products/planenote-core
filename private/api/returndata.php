<?php

class returnData {
    
    public $data = array();
    
    public function data($key, $data) {
        $this->data[$key] = $data;
    }
    
    public function bulkData($data) {
        foreach ($data as $key=>$val) {
            $this->data($key, $val);
        }
    }
    
    public function error($code) {
        $error = array(
            'code' => 500,
            'message' => 'Internal Server Error'
        );
        
        switch ($code) {
            case 200:
            $error['code'] = $code;
            $error['message'] = 'Ok';
            break;
            case 400:
            $error['code'] = $code;
            $error['message'] = 'Bad Request';
            break;
            case 401:
            $error['code'] = $code;
            $error['message'] = 'Unauthorized';
            break;
            case 412:
            $error['code'] = $code;
            $error['message'] = 'Precondition Failed';
            break;
            case 501:
            $error['code'] = $code;
            $error['message'] = 'Not Implemented';
            break;
        }
        
        $this->data['error'] = $error;
    }
    
    public function errorCode($code) {
        if (!isset($this->data['error']))
        $this->data['error'] = array();
        $this->data['error']['code'] = $code;
    }
    
    public function errorMessage($msg) {
        if (!isset($this->data['error']))
        $this->data['error'] = array();
        $this->data['error']['message'] = $msg;
    }
    
    public function output($asArray=0) {
        if ($asArray)
        return $this->data;
        else
        echo json_encode($this->data);
    }
    
}

?>
