<?php

$conexion = mysql_connect("localhost","root","") or die(mysql_error()) ;
$db = mysql_select_db("BaseDatosTesis",$conexion) or die(mysql_error());

?>