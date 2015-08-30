<?php
include "conexionBD.php";
		if($_POST['operacion'] !=""){
			switch($_POST['operacion']){
				case 0: generarXML($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4']); break;
				case 1: actualizarXML($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4'],$_POST['dat5'],$_POST['dat6']); break;
				case 2: compartirPregunta($_POST['dat1']); break;
				case 3: buscarPregCompartida ($_POST['dat1']);break;
				case 4: asignarPregunta ($_POST['dat1'],$_POST['dat2']);break;
				case 5: eliminarPregunta ($_POST['dat1'],$_POST['dat2']);break;
				case 6: agregarTagPregunta ($_POST['dat1'],$_POST['dat2'],$_POST['dat3']);break;
			}
		}

		function generarXML($dato,$titulo,$tags,$idUser){
		global $conexion;	

		$sql= 'INSERT INTO pregunta(fechaCreacion) VALUES ("'.date("Y-m-d H:i:s").'");';
		if (mysql_query($sql,$conexion)){
		
			$id = mysql_insert_id($conexion);
		
			$sql2='UPDATE pregunta SET titulo="'.$titulo.'" ,url="xmlPreguntas/'.$id.'.xml'.'" ,compartir=0, extension="xml" ,tipo="SimpleChoice" WHERE id='.$id.';';

			$query = mysql_query($sql2,$conexion);
			$pregunta=fopen("../xmlPreguntas/".$id.".xml","w+") or die ("No se puede crear el archivo");

			fwrite($pregunta,$dato);
			fclose($pregunta);
			$sql2='INSERT INTO pregunta_user(id_usuario,id_pregunta,eliminada,fechaUltima) VALUES('.$idUser.','.$id.', 0, "'.date("Y-m-d").'");';
			echo $sql2;
			$query = mysql_query($sql2,$conexion);	
			agregarTagPregunta($id,$tags);

			}
		}

		function actualizarXML($id,$urlXML,$xml,$tags,$titulo,$idUser){
			global $conexion;	
			$pregunta=fopen("../".$urlXML,"w+") or die ("No se puede crear el archivo");		
			fwrite($pregunta,$xml);
			fclose($pregunta);
			$sql2='UPDATE pregunta SET titulo="'.$titulo.'" WHERE id='.$id.';';
			mysql_query($sql2,$conexion);
			$sql2='UPDATE pregunta_user SET fechaUltima="'.date("Y-m-d").'" WHERE id_pregunta='.$id.' AND id_usuario='.$idUser.';';
			mysql_query($sql2,$conexion);
			agregarTagPregunta($id,$tags);			
		}


		function agregarTagPregunta($id,$tags,$idUser){
			global $conexion;	
			if(isset($idUser)){
				$sql2='UPDATE pregunta_user SET fechaUltima="'.date("Y-m-d").'" WHERE id_pregunta='.$id.' AND id_usuario='.$idUser.';';
				mysql_query($sql2,$conexion);
			}
			$sql='DELETE FROM pregunta_tag WHERE id_pregunta='.$id.';';
			$query = mysql_query($sql,$conexion);
			$data = json_decode($tags,true);
			$sql='';
			for($i=0;$i<count($data);$i++){
				$sql='INSERT INTO pregunta_tag(id_tag, id_pregunta) VALUES ('.$data[$i]['id'].','.$id.');';
				mysql_query($sql,$conexion);
			}
			
		}
		
		function encodeCode($i){
			$i++;
			$arrayCaracteres="1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
			$modI= $i% 62;
			$mondI2=($i+7) % 62;
			$code =hash('crc32b',(substr($arrayCaracteres,$modI,1).$i.substr($arrayCaracteres,$modI,1))).''.substr($arrayCaracteres,$modI,1);
			return $code;
		}
		
		
		function compartirPregunta($id){
			global $conexion;
			$sql='SELECT count(*) FROM  pregunta WHERE compartir=1;';
			$query = mysql_query($sql,$conexion) or die ("Error in query: $query. ".mysql_error());
			$nCom = mysql_result($query,0);
		
			$sql='SELECT url FROM  pregunta WHERE id='.$id.';';
			$query1 = mysql_query($sql,$conexion)or die ("Error in query: $query. ".mysql_error());
			$url='';
			$code=encodeCode($nCom);
			while ($row = mysql_fetch_assoc($query1, MYSQL_ASSOC)) {
					$url=$row['url'];
			}
			
			$sql2='UPDATE pregunta SET codigo="'.$code.'" ,url="xmlPreguntas/'.$code.'.xml'.'" ,compartir=1 WHERE id='.$id.';';
			mysql_query($sql2,$conexion)or die ("Error in query: $query. ".mysql_error());;

			rename("../".$url, "../xmlPreguntas/".$code.".xml");
			echo $code;
		}
		
		function buscarPregCompartida($code){
			global $conexion;
			$data=array();
			$sql_id = 'SELECT id as id , titulo as titulo, url as url, compartir as compartir, codigo as codigo FROM pregunta WHERE codigo="'.$code.'";';  // <---- OJO! 
			$query1 = mysql_query($sql_id,$conexion) or die ("Error in query: $query. ".mysql_error());
			//$resp=mysql_result($query1);
			while ($row = mysql_fetch_assoc($query1, MYSQL_ASSOC)) {
				$data[]=array("dirPreg"=>$row['url'],"id"=>$row['id'],"titulo"=>$row['titulo'],"compartir"=>$row['compartir'],"codigo"=>$row['codigo']);
			}
			header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
			header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
			Header("Content-type: application/json");
			echo json_encode($data);
		}
		function asignarPregunta($id, $idUser){
			global $conexion;
			$sql= "SELECT * FROM pregunta_user WHERE id_usuario = ".$idUser." AND id_pregunta = ".$id." AND eliminada = 0;";
			$num = mysql_num_rows(mysql_query($sql,$conexion));
			if ($num > 0) {
					header("HTTP/1.0 404 Not Found");
					echo "Error : Esta pregunta ya la tienes en tu lista de preguntas";
					die();
			}

			$sql_id = 'INSERT INTO pregunta_user (id_usuario,id_pregunta,eliminada, fechaUltima) VALUES ('.$idUser.','.$id.',0,"'.date("Y-m-d").'");';  // <---- OJO! 
			if(!mysql_query($sql_id,$conexion)){

				$sql_id = 'UPDATE pregunta_user set eliminada=0 where id_usuario='.$idUser.' AND id_pregunta='.$id.';';  // <---- OJO! 
				if(!mysql_query($sql_id,$conexion)){
					header("HTTP/1.0 404 Not Found");
					echo "Error al asignar pregunta";
					die();
			};
				die();
			};			
			mysql_close($conexion);
		
		}
		function eliminarPregunta($id, $idUser){
			global $conexion;
			$sql_id = 'UPDATE pregunta_user set eliminada=1 where id_usuario='.$idUser.' AND id_pregunta='.$id.';';  // <---- OJO! 
			if(!mysql_query($sql_id,$conexion)){
				header("HTTP/1.0 404 Not Found");
				echo "Error al Intentar eliminar pregunta";
				die();
			};
			mysql_close($conexion);
		
		}
		
?>
