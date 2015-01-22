<?php

function query($query, $type='query', $row=0) {
    switch ($type) {
        case 'query':
            return mysqli_query($query);
            break;
        case 'result':
            return mysql_result(mysql_query($query), $row);
            break;
        case 'array':
            return mysql_fetch_array(mysql_query($query), MYSQL_ASSOC);
            break;
        case 'multi array':
            $result = mysql_query($query);
            $row_num = mysql_num_rows($result);
            $array = [];
            
            for($i=0; $i < $row_num; $i++) {
                $row = mysql_fetch_array($result, MYSQL_ASSOC);
                $array[] = $row;
            }
            
            return $array;
            break;
    }
}

?>