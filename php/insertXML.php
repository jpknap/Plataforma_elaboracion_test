<?php
		include "conexionBD.php";
	
		$dato = $_POST['archivo'];
		$titulo = $_POST['title'];
		$tags = $_POST['tags'];

		$idUser=1000000;
		$code=randomID($idUser);
		$sql= 'INSERT INTO Pregunta(code) VALUES ("'.$code.'")';
		if (mysql_query($sql,$conexion))
			$id = mysql_insert_id($conexion);

		$sql='UPDATE Pregunta SET dirPregunta="xmlPreguntas/'.$code.'.xml'.'" WHERE id='.$id.';';
		$query = mysql_query($sql,$conexion);
		$pregunta=fopen("../xmlPreguntas/".$code.".xml","w+") or die ("No se puede crear el archivo");

		fwrite($pregunta,$dato);
		fclose($pregunta);		
		agregarTagPregunta($id,$tags);

		function agregarTagPregunta($id,$tags){
			global $conexion;
		$data = json_decode($tags,true);
		$sql='';
		for($i=0;$i<count($data);$i++){

			$sql='INSERT INTO tagpregunta(id_tag, id_pregunta) VALUES ('.$data[$i]['id'].','.$id.');';
			mysql_query($sql,$conexion);
		}
		
		}
		
		function randomID($idUser){

			$caracteres="0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			$largo_Pass=6;
			$passwordRand ='';
			for ($i=0; $i<$largo_Pass; $i++) {
				$nRand = rand(0,strlen($caracteres)-1);
				$passwordRand .=substr($caracteres, $nRand, 1);
			}

			$passwordRand .=substr(md5($idUser), 0, 4);

			return $passwordRand;
		}
		
?>
