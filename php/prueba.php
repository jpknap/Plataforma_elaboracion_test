<?php
include "conexionBD.php";
if($_POST['operacion'] !=""){
	switch($_POST['operacion']){
		case 0: generarPrueba($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4'],$_POST['dat5']); break;
		case 1: cargarPrueba($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4']); break;
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

function cargarPrueba($hoja,$titulo,$tags,$idUser){
		global $conexion;
		$dataTag = json_decode($tags,true);
		$tagSql='';
		$cantTag=count($dataTag);		
		$tagSql2='';
		if($cantTag>0){

			$tagSql2='having count(*)='.$cantTag;
			$tagSql='AND a.id=prueba_tag.id_prueba AND  prueba_tag.id_tag in (';
			for($i=0;$i<$cantTag;$i++){
				if($i <$cantTag-1)
					$tagSql .= ''.$dataTag[$i]['id'].',';
				else
					$tagSql .= ''.$dataTag[$i]['id'].') ';
			};
		}
		$data = array();
		$cant_Hoja=10;
		$sql_id = 'SELECT a.id as id FROM prueba a  left JOIN prueba_tag  on 1 WHERE a.id_usuario='.$idUser.' AND a.titulo LIKE "%'.$titulo.'%" '.$tagSql.' GROUP BY id '.$tagSql2;
		  // <---- OJO! 
	
		$query1 = mysql_query($sql_id,$conexion) or die ("Error in query: $query. ".mysql_error());
		$data['cantidad']=array("value"=>mysql_num_rows($query1));

		$sql_id = 'SELECT id as id , titulo as titulo, descripcion as descripcion ,date_format(fechaCreacion,"%d-%m-%Y") as fecha  FROM prueba a  left JOIN prueba_tag  on 1 WHERE a.id_usuario='.$idUser.'  and a.titulo LIKE "%'.$titulo.'%" '.$tagSql.'  GROUP BY id '.$tagSql2.' order by fechaCreacion DESC LIMIT '.$cant_Hoja*($hoja-1).','.$cant_Hoja.' ;';  // <---- OJO! 
		$query1 = mysql_query($sql_id,$conexion) or die ("Error in query: $query. ".mysql_error());
		//$resp=mysql_result($query1);
		while ($row = mysql_fetch_assoc($query1, MYSQL_ASSOC)) {
			$data[]=array("id"=>$row['id'],"titulo"=>$row['titulo'],"descripcion"=>$row['descripcion'],"fecha"=>$row['fecha']);
		}
		header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
		Header("Content-type: application/json");
		echo json_encode($data);
	}
?>