<?php
include "conexionBD.php";
		$data = array();
		$cant_Hoja=15;
		$hoja=$_POST['pagina'];

		$sql_id = "SELECT * FROM Pregunta WHERE 1;";  // <---- OJO! 
		$query1 = mysql_query($sql_id,$conexion);		
		$data['cantidad']=array("value"=>mysql_num_rows($query1));

		$sql_id = "SELECT id,dirPregunta FROM Pregunta WHERE 1 LIMIT ".$cant_Hoja*($hoja-1).",".$cant_Hoja.";";  // <---- OJO! 
		$query1 = mysql_query($sql_id,$conexion);
		//$resp=mysql_result($query1);
		while ($row = mysql_fetch_assoc($query1, MYSQL_ASSOC)) {
			$data[$row['id']]=array("dirPreg"=>$row['dirPregunta']);
		}
		header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
		Header("Content-type: application/json");
		echo json_encode($data);


?>