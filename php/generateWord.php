<?php
$Letters= array('A','B','C','D','E','F','G','H','I','J','K','L','M','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z');
		include "conexionBD.php";
	if(isset($_GET['idTest'])){		
		pasarWord($_GET['idTest']);

	}

	function pasarWord($idPrueba){
	global $conexion;
	global $Letters;

	$dataPrueba = '';
	$dataPregunta = '';
	$sql_id ='SELECT titulo as titulo FROM `prueba` WHERE `id`='.$idPrueba;
	$query1 = mysql_query($sql_id,$conexion) or die ("Error in query: $query. ".mysql_error());
	while ($row = mysql_fetch_assoc($query1, MYSQL_ASSOC)) {

		$dataPrueba= $row['titulo'];
	}
	$sql_id ='SELECT url as url FROM `pregunta` a, pregunta_prueba b WHERE b.id_pregunta = a.id and b.id_prueba='.$idPrueba;
	$query1 = mysql_query($sql_id,$conexion) or die ("Error in query: $query. ".mysql_error());
	$cont = 0;
	while ($row = mysql_fetch_assoc($query1, MYSQL_ASSOC)) {
			$cont++;
			$dataPregunta .="<p>".$cont.".</p>";
			$respuestas .="<p> &#160;&#160;<b>".$cont.") ";
			$xml = simplexml_load_file("../".$row['url']) or die("Unable to load XML file!");			
			$dataPregunta .="<p>&#160;".$xml->itemBody->p."</p>";
			$dataPregunta .="<p>&#160;<b>".$xml->itemBody->choiceInteraction->prompt."</b></p>";
			$countAux =0;
			foreach($xml->itemBody->choiceInteraction->simpleChoice as $valor){
				$dataPregunta .="<p> &#160; &#160;".$Letters[$countAux].") ".$valor."</p>";
				$countAux++; 
			}
			$respuestas .= "".$xml->responseDeclaration->correctResponse->value."</b></p>";
			/*echo $xml->responseDeclaration->correctResponse->value;
			echo $xml->itemBody->p;
			echo $xml->itemBody->choiceInteraction->prompt;

			foreach ($xml->itemBody->choiceInteraction->simpleChoice as $value){
			   echo $value;
			} */

	}

	generarWord($dataPrueba,$dataPregunta,$respuestas);
}

function generarWord($dataPrueba,$dataPregunta,$respuestas){
header("Content-type: application/vnd.ms-word");
header("Content-Disposition: attachment;Filename=prueba_.doc");
	echo "<html>";
	echo "<meta http-equiv=\'Content-Type\'' content=\'text/html; charset='UTF-8'>";
	echo "<body>";
	echo "<h2 style='text-align: center;'>".$dataPrueba."</h2><br /><br/>";
	echo "<h4'> &#160;Nombre:................................................................................................................</h4><br />";
	echo $dataPregunta;
	echo '<br style="page-break-before: always">';
	echo "<h2 style='text-align: center;'>Respuestas Correctas</h2><br /><br/>";
	echo $respuestas;
	echo "</body>";
	echo "</html>";

}
?>