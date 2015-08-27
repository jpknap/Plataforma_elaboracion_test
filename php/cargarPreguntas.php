<?php
include "conexionBD.php";
if($_POST['operacion'] !=""){
	switch($_POST['operacion']){
		case 0: cargarPreguntas($_POST['dat1'],$_POST['dat2'],$_POST['dat3'],$_POST['dat4']); break;
	}
}
function cargarPreguntas($hoja,$titulo,$tags,$idUser){
		global $conexion;
		$dataTag = json_decode($tags,true);
		$tagSql='';
		$cantTag=count($dataTag);		
		$tagSql2='';
		if($cantTag>0){

			$tagSql2='having count(*)='.$cantTag;
			$tagSql='AND a.id=pregunta_tag.id_pregunta AND  pregunta_tag.id_tag in (';
			for($i=0;$i<$cantTag;$i++){
				if($i <$cantTag-1)
					$tagSql .= ''.$dataTag[$i]['id'].',';
				else
					$tagSql .= ''.$dataTag[$i]['id'].') ';
			};
		}
		$data = array();
		$cant_Hoja=10;
		$sql_id = 'SELECT a.id as id FROM  pregunta_user z, pregunta a  left JOIN pregunta_tag  on 1 WHERE z.id_usuario='.$idUser.' AND z.id_pregunta = a.id and a.titulo LIKE "%'.$titulo.'%" '.$tagSql.' GROUP BY id '.$tagSql2;  // <---- OJO! 
		$query1 = mysql_query($sql_id,$conexion) or die ("Error in query: $query. ".mysql_error());
		$data['cantidad']=array("value"=>mysql_num_rows($query1));

		$sql_id = 'SELECT a.id as id , a.titulo as titulo, a.url as url, a.compartir as compartir, a.codigo as codigo FROM pregunta_user z,pregunta a  left JOIN pregunta_tag  on 1 WHERE z.id_usuario='.$idUser.' AND z.eliminada=0  AND z.id_pregunta = a.id and a.titulo LIKE "%'.$titulo.'%" '.$tagSql.' GROUP BY id '.$tagSql2.' LIMIT '.$cant_Hoja*($hoja-1).','.$cant_Hoja.';';  // <---- OJO! 
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
