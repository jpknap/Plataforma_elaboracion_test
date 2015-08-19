	<?php
		function encodeCode($i){

			$arrayCaracteres="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
			$modI= $i% 62;
			$mondI2=($i+7) % 62;
			$code =hash('crc32b',(substr($arrayCaracteres,$modI,1).$i.substr($arrayCaracteres,$modI,1))).''.substr($arrayCaracteres,$modI,1);
			return $code;
		}
		?>