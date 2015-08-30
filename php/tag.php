<?php
include "conexionBD.php";
if($_POST['operacion'] !=""){
	switch($_POST['operacion']){
		case 0: agregarTag($_POST['dat1'],$_POST['dat2'],$_POST['dat3']); break;
		case 1: listaTags($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4']); break;
		case 2: eliminarTag($_POST['dat1']); break;
		case 3: getTagsPregunta($_POST['dat1'],$_POST['dat2']); break;
		case 4: editarTag($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4']); break;
	}
}
function getTagsPregunta($idPreg, $idUser){
	global $conexion;
	$data=array();
	$sql= 'SELECT a.id as id, a.nombre as nombre from tag a, pregunta_tag b where a.id_usuario='.$idUser.' and  b.id_tag = a.id and b.id_pregunta ='.$idPreg;
	$query = mysql_query($sql,$conexion)or die ("Error in query: $query. ".mysql_error());
		while ($row = mysql_fetch_assoc($query, MYSQL_ASSOC)) {
		$data[]=array("id"=>$row['id'],"nombre"=>$row['nombre']);
	}
	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
	Header("Content-type: application/json");
	echo json_encode($data);
}

function agregarTag($nombre,$tipo,$idUser){
	global $conexion;	
	$sql= 'SELECT *  FROM tag WHERE id_usuario='.$idUser.' AND nombre="'.$nombre.'" AND tipo="'.$tipo.'";';
	$num = mysql_num_rows(mysql_query($sql,$conexion));
	
	if($num > 0 ){
			header("HTTP/1.0 404 Not Found");
			echo "No puedes repetir el nombre, para un mismo tipo";
			die();
	}
	else{	
		$sql= 'INSERT INTO tag(id_usuario,nombre,tipo) VALUES ('.$idUser.',"'.$nombre.'","'.$tipo.'");';
		$query = mysql_query($sql,$conexion)or die ("Error in query: $query. ".mysql_error());	
	}

}

function editarTag($id,$nombre,$tipo,$idUser){
	global $conexion;	
	$sql= 'SELECT *  FROM tag WHERE id_usuario='.$idUser.' AND nombre="'.$nombre.'" AND tipo="'.$tipo.'";';
	$num = mysql_num_rows(mysql_query($sql,$conexion));
	
	if($num > 0 ){
			header("HTTP/1.0 404 Not Found");
			echo "No puedes repetir el nombre, para un mismo tipo";
			die();
	}
	else{	
		$sql= 'UPDATE tag SET nombre="'.$nombre.'" WHERE id='.$id.';';
		$query = mysql_query($sql,$conexion)or die ("Error in query: $query. ".mysql_error());	
	}

}
function listaTags($nombre,$tipo,$pagina,$idUser){
	global $conexion;
	$data=array();
	$tipo_code=' AND tipo="'.$tipo.'"';
	if($tipo==3){
		$tipo_code=' ';
	}
	if($pagina != 'ALL'){
		$sql_id = "SELECT * FROM tag WHERE 1;";  // <---- OJO! 
		$query1 = mysql_query($sql_id,$conexion);		
		$data['cantidad']=array("value"=>mysql_num_rows($query1));
		$cant_Hoja=7;
		$sql= 'SELECT id,nombre,tipo FROM tag where id_usuario='.$idUser.$tipo_code.' AND nombre LIKE "%'.$nombre.'%" ORDER by nombre LIMIT '.$cant_Hoja*($pagina-1).",".$cant_Hoja.";";
	}
	else{
		$sql= 'SELECT id,nombre,tipo FROM tag where id_usuario='.$idUser.$tipo_code.' AND nombre LIKE "%'.$nombre.'%" ORDER by nombre;';
	
	}
	$query = mysql_query($sql,$conexion);
	while ($row = mysql_fetch_assoc($query, MYSQL_ASSOC)) {
		$data[]=array("nombre"=>$row['nombre'],"tipo"=>$row['tipo'],"id"=>$row['id']);
	}
	header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
	header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
	Header("Content-type: application/json");
	echo json_encode($data);
}
function eliminarTag($id){
	global $conexion;
	$sql= 'DELETE FROM `tag` WHERE id='.$id.';';
	$query = mysql_query($sql,$conexion);
}

?>