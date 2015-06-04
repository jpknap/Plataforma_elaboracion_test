<?php
include "conexionBD.php";
if($_POST['operacion'] !=""){
	switch($_POST['operacion']){
		case 0: login($_POST['dat1'],$_POST['dat2']); break;
	}
}

function login($user, $pass){	
		global $conexion;
		$data= array();
		$data[0]=array("id"=>'-1');
		$sql_id = 'SELECT id FROM usuario WHERE email="'.$user.'" AND password="'.$pass.'"';
		
		
		$query = mysql_query($sql_id,$conexion);	
		while ($row = mysql_fetch_assoc($query, MYSQL_ASSOC)) {
			$data[0]=array("id"=>$row['id']);
		}
		header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
		Header("Content-type: application/json");
		echo json_encode($data);
}
?>