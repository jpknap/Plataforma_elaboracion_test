<?php
include "conexionBD.php";
if($_POST['operacion'] !=""){
	switch($_POST['operacion']){
		case 0: cargarPreguntas($_POST['dat1'],$_POST['dat2'],$_POST['dat3']); break;
	}
}
function cargarPreguntas($hoja,$titulo,$tags){
		global $conexion;
		$dataTag = json_decode($tags,true);
		$tagSql='';
		$cantTag=count($dataTag);		
		$tagSql2='';
		if($cantTag>0){

			$tagSql2='having count(*)='.$cantTag;
			$tagSql='AND a.id=b.id_pregunta AND  b.id_tag in (';
			for($i=0;$i<$cantTag;$i++){
				if($i <$cantTag-1)
					$tagSql .= ''.$dataTag[$i]['id'].',';
				else
					$tagSql .= ''.$dataTag[$i]['id'].') ';
			};
		}
		$data = array();
		$cant_Hoja=15;
		$sql_id = 'SELECT a.id as id FROM Pregunta a, tagpregunta b WHERE a.dirPregunta LIKE "%'.$titulo.'%" '.$tagSql.' GROUP BY id '.$tagSql2;  // <---- OJO! 
		$query1 = mysql_query($sql_id,$conexion);		
		$data['cantidad']=array("value"=>mysql_num_rows($query1));

		$sql_id = 'SELECT id as id , dirPregunta as dirPregunta FROM Pregunta a, tagpregunta b WHERE a.dirPregunta LIKE "%'.$titulo.'%" '.$tagSql.' GROUP BY id '.$tagSql2.' LIMIT '.$cant_Hoja*($hoja-1).','.$cant_Hoja.';';  // <---- OJO! 
		$query1 = mysql_query($sql_id,$conexion);
		//$resp=mysql_result($query1);
		while ($row = mysql_fetch_assoc($query1, MYSQL_ASSOC)) {
			$data[]=array("dirPreg"=>$row['dirPregunta'],"id"=>$row['id']);
		}
		header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
		header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Fecha en el pasado
		Header("Content-type: application/json");
		echo json_encode($data);
	}
	/*
	-----codigo para la consulta de multiples tags-------
			SELECT id as id , dirPregunta as dirPregunta
			FROM Pregunta a, tagpregunta b 
			WHERE  a.id=b.id_pregunta and  b.id_tag in (58,40)
			GROUP BY id 
			having count(*)=2
			LIMIT 0,15;
	*/

?>
