<?php

		ini_set('max_execution_time', 120000);
		include "conexionBD.php";
		$arrayCaracteres="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
		for($i =625102 ; $i < 10000000000 ; $i++){
			$modI= $i% 62;
			$mondI2=($i+7) % 62;
			$code =hash('crc32b',(substr($arrayCaracteres,$modI,1).$i.substr($arrayCaracteres,$modI,1))).''.substr($arrayCaracteres,$modI,1);
			$sql= 'INSERT INTO pruebamd5(code) VALUES ("'.$code.'")';
			$query = mysql_query($sql,$conexion);	
			if(!$query){
			    echo "error :".(mysql_error())."</br>";
			    break;
			}
		}


		
?>
