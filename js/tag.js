var paginaActual=1;
var idTagEliminar=-1;
var colorEliminar="";
var ultimoNombreBusqueda='';
var ultimoTipoBusqueda='';
$(document).ready(function()
		{
			//$.post('php/cargarPreguntas.php',{pagina:1},procesarLecturaXML,'json');


});

function mensajeError(texto){
	if(!$("#notificacion_top_error").is(':visible')){
		$("#notificacion_top_error").text(texto);
		$("#notificacion_top_error").show(500).delay(1000).fadeOut();
	}
};
function agregarTag(){
	if($('#nombreAgregar').val()!="" && $('#nombreAgregar').val()!=" " ){
	$.post('php/tag.php',{operacion:0,dat1:''+$('#nombreAgregar').val(),dat2:''+$('#tipoAgregar').val(), dat3:localStorage.idUser},function(){
		if(!$("#notificacion_top_ok").is(':visible')){
			$("#notificacion_top_ok").show(500).delay(1000).fadeOut();
		}
	cargarTag(paginaActual)},'').fail(function(XMLHttpRequest, textStatus, errorThrown) {
		mensajeError(""+XMLHttpRequest.responseText);
		});

		$('#nombreAgregar').val('');
	}
	else{
		mensajeError("No puedes agregar un tag con nombre vacio");
	}

};
function editarTag(id,tipo){
		$("table button").attr("disabled","true");
		$("#notificacion_edicion").show(500);
		var color = $("#row"+id).css("background-color");
		$("#row"+id).css("background-color","#1DA1F3");
		$( "#GuardarEdicion" ).click(function() {
		var nombre = $("#nombreEdicion").val();
		 $("#nombreEdicion").val("");
		if(nombre != ""){
			$.post('php/tag.php',{operacion:4,dat1:id ,dat2:nombre, dat3:tipo,dat4:localStorage.idUser},function(){
					if(!$("#notificacion_top_ok").is(':visible')){
						$("#notificacion_top_ok").show(500).delay(1000).fadeOut();
					}
				cargarTag(paginaActual)},'').fail(function(XMLHttpRequest, textStatus, errorThrown) {
					mensajeError(""+XMLHttpRequest.responseText);
					});
			}
			else{
				mensajeError("No puedes agregar un tag con nombre vacio");

			}

			$("table button").removeAttr('disabled');
			$('#GuardarEdicion').off('click');
			$('#CancelarEdicion').off('click');
			$("#notificacion_edicion").hide(500);			
		 	$("#row"+id).css("background-color",color);
		
		});
		$( "#CancelarEdicion" ).click(function() {	

		  $("table button").removeAttr('disabled');	  
		  $("#row"+id).css("background-color",color);
		  $('#GuardarEdicion').off('click');
		  $('#CancelarEdicion').off('click');
		  $("#notificacion_edicion").hide(500);		
		});
}
function cargarTag(pag){

	ultimoNombreBusqueda=$('#nombreBusqueda').val();
	ultimoTipoBusqueda=$('#tipoBusqueda').val();
	paginaActual=pag;
	$.post('php/tag.php',{operacion:1,dat1:ultimoNombreBusqueda,dat2:ultimoTipoBusqueda,dat3:paginaActual, dat4:localStorage.idUser},procesarLecturaTag,'json');

};
function confirmarAccionTag(idEliminar,nombre){
			$("table button").attr("disabled","true");

	colorEliminar = $("#row"+idEliminar).css("background-color");
	$("#row"+idEliminar).css("background-color","#FD94AC");
	$("#notificacion_top_confirmar_cambios snap").text("Estas seguro que deseas elimnar el tag : "+decodeURI(nombre)+", esta accion no se podra deshacer:");
	$("#notificacion_top_confirmar_cambios").show(500);
	idTagEliminar=idEliminar;
};

function procesarLecturaTag(data){
		var preguntas="<tr><th>Nombre</th><th>Tipo</th><th>Editar</th><th>Eliminar</th></tr>";
		 $.each(data, function(name, info){
		 	if(name != 'cantidad'){
		 		preguntas +='<tr id="row'+info.id+'"> <td>'+info.nombre+'</td><td>'+info.tipo+'</td><td><button class="button_azul" onClick=editarTag('+info.id+',"'+info.tipo+'");>Editar</button></td><td><button onClick=confirmarAccionTag('+info.id+',"'+encodeURI(info.nombre)+'"); class="button_rojo">'+"Eliminar"+'</button></td> </tr>';
		 	}
		 	else{
		 		paginador(info.value);
		 	}
		 });
		 $("#tablaTags").html(preguntas);
};
function deshacerEliminar(){

	$("table button").removeAttr('disabled');	 
	$("#row"+idTagEliminar).css("background-color",colorEliminar);
	idTagEliminar=-1;
	$("#notificacion_top_confirmar_cambios").hide(500);
}
function eliminar(){

	$("table button").removeAttr('disabled');	 
	$("#row"+idTagEliminar).css("background-color",colorEliminar);
	$("#notificacion_top_confirmar_cambios").hide(100);
	$.post('php/tag.php',{operacion:2,dat1:''+idTagEliminar},'').done(function(){cargarTag(paginaActual)});
}

function ultimasPaginas(numero,nPag){
	var string='';
	var codeHTML=[]
	for(var j = nPag-(5-numero); j > 0 && j >= paginaActual-numero; j--){
		codeHTML.push('<li><a href="#pagination-flickr" onClick="cargarTag('+j+');">'+j+'</a></li>');
	}
	string+= codeHTML.reverse().toString().replace(/,/g,'');
	string+= '<li class="active">'+paginaActual+'</li>';
	for(var i = 1; i <= 4-numero ; i++){
		string +='<li><a href="#pagination-flickr" onClick="cargarTag('+(i+paginaActual)+');">'+(i+paginaActual)+'</a></li>';
	}
	return string;
}

function paginador (cant){
	var htmlPag ='';
	var nPag= Math.ceil(cant/7);
	if(paginaActual > 1){
		htmlPag+='<li class="next"><a href="#pagination-flickr"  onClick="cargarTag(1);">««</a></li>';
		htmlPag+= '<li class="previous"><a href="#pagination-flickr"  onClick="cargarTag('+(paginaActual-1)+');"> «Anterior</a> </li>';
		
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
		else{
			if(i == paginaActual)		
				htmlPag+= '<li class="active">'+i+'</li>';
			else
				htmlPag+= '<li><a href="#pagination-flickr" onClick="cargarTag('+i+');">'+i+'</li>';
		}
	}

	if(paginaActual < nPag){
  		htmlPag+='<li class="next"><a href="#pagination-flickr"  onClick="cargarTag('+(paginaActual+1)+');">Siguiente» </a></li>';               
  		htmlPag+='<li class="next"><a  href="#pagination-flickr" onClick="cargarTag('+nPag+');">»»</a></li>';
  	}
  	else {
  		htmlPag+='<li class="next-off">Siguiente» </li>';
  		htmlPag+='<li class="next-off">»»</li>';
  	}               
  	

  $("ul#pagination-flickr").html(htmlPag);

}
