var paginaActual=1;
var tituloBuscar='';
var listaTags = [];
var orden="DESC"
$(document).ready(function()
		{
			tituloBuscar=$("#tituloPreguntaBuscar").val();
	$.post('php/prueba.php',{operacion:1,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser,dat5:orden },procesarLecturaXML,'json');
			$.post('php/tag.php',{operacion:1,dat1:'',dat2:"prueba",dat3:'ALL',dat4:localStorage.idUser},function(data){
				 var codeTags='';
				 $.each(data, function(name, info){
					codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
				 });
				 $("#tagPreguntaBuscar").html(codeTags);
			},'json');


});
function eliminarPrueba(idPrueba){
		$("table button").attr("disabled","true");

		$("#notificacion_top_confirmar_cambios").show(500);
		var color = $("#row"+idPrueba).css("background-color");
		$("#row"+idPrueba).css("background-color","#FD94AC");
		$( "#Guardar" ).click(function() {
						$("table button").removeAttr('disabled');

		  $('#Guardar').off('click');
		  $('#Cancelar').off('click');
		  $("#row"+idPrueba).remove();
		  $("#notificacion_top_confirmar_cambios").hide(500);
		$.post('php/prueba.php',{operacion:8,dat1:idPrueba},'','');
		  
		});
		$( "#Cancelar" ).click(function() {	
					$("table button").removeAttr('disabled');
	  
		  $("#row"+idPrueba).css("background-color",color);
		  $('#Guardar').off('click');
		  $('#Cancelar').off('click');
		  $("#notificacion_top_confirmar_cambios").hide(500);
		
		});
}

function editarPrueba(idPrueba){
	sessionStorage.setItem('idPruebaEdit',idPrueba);
	window.location.href='editarPrueba.html';
}
function cargarDescripcion(titulo,descripcion){

	$("#textAdicionalPreview").html(decodeURIComponent(titulo));
	$('#preguntaPreview').html(decodeURIComponent(descripcion));
	$('#velo').fadeIn(500);
}
function filtrarPreg(){
	tituloBuscar=$("#tituloPreguntaBuscar").val();
	paginaActual=1;
	$.post('php/prueba.php',{operacion:1,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser,dat5:orden },procesarLecturaXML,'json');
}

function asignarTag(){
	var idTag=$("#tagPreguntaBuscar").val();
	var nombreTag=$("#tagPreguntaBuscar option:selected").text();
	var result = $.grep(listaTags, function(e){ return e.id == idTag; });
	if(result.length == 0){
		listaTags.push({id:idTag,nombre: nombreTag});
		$("#listaTags").append('<li><a onClick="removerTag('+(listaTags.length-1)+')" class="tag">'+listaTags[listaTags.length-1].nombre+'</a></li>');
	}
	else
		mensajeError("No puedes repetir el Tag a un mismo filtro.");
}
function removerTag(posTag){
	listaTags.splice(posTag,1);
	var codeTags='';
	for(var i =0 ;i<listaTags.length ; i++){
	 codeTags+= '<li><a onClick="removerTag('+i+')" class="tag">'+listaTags[i].nombre+'</a></li>';
	}
	$("#listaTags").html(codeTags)
}
var lastIMGorden="images/arrowDown.png";
function ordenamientoFechas(element){
	var imagen = $(element).find('img').attr('src');
	if(imagen == "images/arrowDown.png"){
		lastIMGorden ='images/arrowUp.png';
		orden="ASC";
	}
	else{	
		orden="DESC";
		lastIMGorden ='images/arrowDown.png';
	}
	$.post('php/prueba.php',{operacion:1,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser,dat5:orden },procesarLecturaXML,'json');

}

function procesarLecturaXML(data){
		var preguntas="<tr><th>Titulo</th><th><a onclick='ordenamientoFechas(this)' style='cursor:pointer;'>Fecha <img  height='15' width='20' src="+lastIMGorden+"></img></a></th><th>Descripcion</th><th>Editar</th><th>Eliminar</th></tr>";
		 $.each(data, function(name, info){
		 	if(name != 'cantidad'){
		 		preguntas +='<tr id="row'+info.id+'"><td width=350 >'+info.titulo+'</td><td>'+info.fecha+'</td><td><a  style="cursor:pointer;" onClick=cargarDescripcion("'+encodeURIComponent(info.titulo)+'","'+encodeURIComponent(info.descripcion)+'");><img height="30" width="30" src="images/lupa.png"> </img></a></td><td><a  style="cursor:pointer;" onClick=editarPrueba("'+info.id+'");> <img height="30" width="30" src="images/edit.png"> </img></a></td><td><button onclick="eliminarPrueba('+info.id+');" class="button_rojo">Eliminar</button></td> </tr>';
		 	}
		 	else{
		 		paginador(info.value);
		 	}
		 });
		 $("#tablaPreguntas").html(preguntas);
}
function ultimasPaginas(numero,nPag){
	var string='';
	var codeHTML=[]
		for(var j = nPag-(5-numero); j > 0 && j >= paginaActual-numero; j--){
				codeHTML.push('<li><a href="#pagination-flickr" onClick="llamadaPhpPagina('+j+');">'+j+'</a></li>');
	}
	string+= codeHTML.reverse().toString().replace(/,/g,'');
	string+= '<li class="active">'+paginaActual+'</li>';
	for(var i = 1; i <= 4-numero ; i++){
		string +='<li><a href="#pagination-flickr" onClick="llamadaPhpPagina('+(i+paginaActual)+');">'+(i+paginaActual)+'</a></li>';
	}
	return string;
}

function paginador (cant){
	
	var htmlPag ='';
	var nPag= Math.ceil(cant/10);
	if(paginaActual > 1){
		htmlPag+='<li class="next"><a href="#pagination-flickr"  onClick="llamadaPhpPagina(1);">««</a></li>';
		htmlPag+= '<li class="previous"><a href="#pagination-flickr"  onClick="llamadaPhpPagina('+(paginaActual-1)+');"> «Anterior</a> </li>';
		
	}
	else{

		htmlPag+='<li class="next-off">««</li>';
		htmlPag+= '<li class="previous-off"> «Anterior </li>';
	}
	
	
	//htmlPag+= '<li class="active">'+paginaActual+'</li>';
	for(var i =paginaActual; i <= (paginaActual+4) && i <= nPag ; i++){

		if((nPag-paginaActual)<5)  {			
			htmlPag+= ultimasPaginas(4-(nPag-paginaActual),nPag);
			break;
		}
		else
			if(i == paginaActual)		
				htmlPag+= '<li class="active">'+i+'</li>';
			else
				htmlPag+= '<li><a href="#pagination-flickr" onClick="llamadaPhpPagina('+i+');">'+i+'</li>';
	}
	if(paginaActual < nPag){
  		htmlPag+='<li class="next"><a href="#pagination-flickr"  onClick="llamadaPhpPagina('+(paginaActual+1)+');">Siguiente» </a></li>';               
  		htmlPag+='<li class="next"><a  href="#pagination-flickr" onClick="llamadaPhpPagina('+nPag+');">»»</a></li>';}
  	else {
  		htmlPag+='<li class="next-off">Siguiente» </li>';
  		htmlPag+='<li class="next-off">»»</li>';}               
  	

  $("ul#pagination-flickr").html(htmlPag);

}
function llamadaPhpPagina(numero){
	paginaActual=numero;
	$.post('php/prueba.php',{operacion:1,dat1:numero,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser,dat5:orden },procesarLecturaXML,'json');
	$('#pagination-flickr').scrollView();
}
function mensajeError(texto){
	if(!$("#notificacion_top_error").is(':visible')){
		$("#notificacion_top_error").text(texto);
		$("#notificacion_top_error").show(500).delay(1000).fadeOut();
	}
};
