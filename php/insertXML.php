<?php
include "conexionBD.php";
		if($_POST['operacion'] !=""){
			switch($_POST['operacion']){
				case 0: generarXML($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4']); break;
				case 1: actualizarXML($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4'],$_POST['dat5']); break;
			}
		}

		function generarXML($dato,$titulo,$tags,$idUser){
		global $conexion;	

		$sql= 'INSERT INTO pregunta(fechaCreacion) VALUES ("'.date("Y-m-d H:i:s").'");';
		if (mysql_query($sql,$conexion)){
		
			$id = mysql_insert_id($conexion);
		
			$code=encodeCode($id);
			$sql2='UPDATE pregunta SET titulo="'.$titulo.'" ,url="xmlPreguntas/'.$code.'.xml'.'", codigo="'.$code.'" ,compartir=0, extension="xml" ,tipo="SimpleChoice" WHERE id='.$id.';';

			$query = mysql_query($sql2,$conexion);
			$pregunta=fopen("../xmlPreguntas/".$code.".xml","w+") or die ("No se puede crear el archivo");

			fwrite($pregunta,$dato);
			fclose($pregunta);
			$sql2='INSERT INTO pregunta_user(id_usuario,id_pregunta,eliminada) VALUES('.$idUser.','.$id.', 0 );';
			echo $sql2;
			$query = mysql_query($sql2,$conexion);	
			agregarTagPregunta($id,$tags);

			}
		}

		function actualizarXML($id,$urlXML,$xml,$tags,$titulo){
			global $conexion;	
			$pregunta=fopen("../".$urlXML,"w+") or die ("No se puede crear el archivo");
			fwrite($pregunta,$xml);
			fclose($pregunta);
			$sql='DELETE FROM pregunta_tag WHERE id_pregunta='.$id.';';
			$query = mysql_query($sql,$conexion);
			agregarTagPregunta($id,$tags);			
		}


		function agregarTagPregunta($id,$tags){
			global $conexion;
			$data = json_decode($tags,true);
			$sql='';
			for($i=0;$i<count($data);$i++){
				$sql='INSERT INTO pregunta_tag(id_tag, id_pregunta) VALUES ('.$data[$i]['id'].','.$id.');';
				mysql_query($sql,$conexion);
			}
			
		}
		
		function encodeCode($i){

			$arrayCaracteres="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
			$modI= $i% 62;
			$mondI2=($i+7) % 62;
			$code =hash('crc32b',(substr($arrayCaracteres,$modI,1).$i.substr($arrayCaracteres,$modI,1))).''.substr($arrayCaracteres,$modI,1);
			return $code;
		}
		
?>
