<?php
include "conexionBD.php";
if($_POST['operacion'] !=""){
	switch($_POST['operacion']){
		case 0: generarPrueba($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4'],$_POST['dat5']); break;
	}
}
function generarPrueba($idUser, $titulo, $descripcion, $tags, $listaPreguntas){
		global $conexion;
	$sql= 'INSERT INTO prueba(id_usuario,titulo,descripcion,fechaCreacion) VALUES ('.$idUser.',"'.$titulo.'","'.$descripcion.'",'.'"'.date("Y-m-d H:i:s").'");';
	if (mysql_query($sql,$conexion)){
		$id = mysql_insert_id($conexion);
		agregarTagPrueba($id,$tags);
		agregarPreguntaPrueba($id,$listaPreguntas);

	}
}
function agregarTagPrueba($id,$tags){
		global $conexion;
		$data = json_decode($tags,true);
		$sql='';
		for($i=0;$i<count($data);$i++){
			$sql='INSERT INTO prueba_tag(id_tag, id_prueba) VALUES ('.$data[$i]['id'].','.$id.');';
			mysql_query($sql,$conexion);
		}
		
}
function agregarPreguntaPrueba($id,$listaPreguntas){
		global $conexion;
		$data = json_decode($listaPreguntas,true);
		$sql='';
		for($i=0;$i<count($data);$i++){
			$sql='INSERT INTO pregunta_prueba(id_pregunta, id_prueba) VALUES ('.$data[$i]['id'].','.$id.');';
			mysql_query($sql,$conexion);
		}
		
}
?>