var paginaActual=1;
var tituloBuscar='';
var listaTags = [];
$(document).ready(function()
		{
			tituloBuscar=$("#tituloPreguntaBuscar").val();
			$.post('php/cargarPreguntas.php',{operacion:0,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser } ,procesarLecturaXML,'json');
			$.post('php/tag.php',{operacion:1,dat1:'',dat2:"pregunta",dat3:'ALL',dat4:localStorage.idUser},function(data){
				 var codeTags='';
				 $.each(data, function(name, info){
					codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
				 });
				 $("#tagPreguntaBuscar").html(codeTags);
			},'json');


});

function cargarPregCompartida(){
	var code = $("#codePregunta").val();
	$.post('php/insertXML.php',{operacion:3,dat1:code} ,cargaPregCompartida,'json');

}
function cargaPregCompartida(data){
		var preguntas="<tr><th>Titulo</th><th>Preview</th><th>Asignar</th></tr>";
		 $.each(data, function(name, info){
		 	preguntas +='<tr> <td>'+info.titulo+'</td><td><a  style="cursor:pointer;" onClick=cargarVelo("'+info.dirPreg+'");><img height="30" width="30" src="images/lupa.png"> </img></a></td><td> <button class="button_azul" onClick="asignarPreg('+info.id+')">Asignar</button></td> </tr>';
		 	
		});
		 $("#tablaPreguntas").html(preguntas);
}

function editarPreg(idPreg,url,compartir){
	sessionStorage.setItem('idPreguntaEdit',idPreg);
	sessionStorage.setItem('urlPreguntaEdit',url);
	sessionStorage.setItem('compartirPreguntaEdit',compartir);
	window.location.href='editarPregunta.html';
}
function cargarVelo(urlXML){

	$.post(urlXML, function(d)
	{
		$(d).find('assessmentItem').each(function(){
			$("#tituloPreview").html($(this).attr('title'));
			$('#preguntasPreview').html("");
			$('#textAdicionalPreview').html('');
			var respCorrecta=$(d).find('assessmentItem responseDeclaration correctResponse value').text();
			if($(d).find('assessmentItem itemBody p:nth-child(1)').length !== 0){
				var textadicional=$('#textAdicionalPreview').html($(d).find('assessmentItem itemBody p:nth-child(1)')[0].innerHTML);
			}
			$(d).find('assessmentItem itemBody choiceInteraction prompt').each(function(){

				$('#preguntaPreview').html($(this)[0].innerHTML);
			});
			$(d).find('assessmentItem itemBody choiceInteraction simpleChoice').each(function(){
				$('#preguntasPreview').append("<h3>"+$(this).attr('identifier')+") "+$(this).text()+'</h3>');
			});
				$('#respuestaPreview').html("Respuesta :"+respCorrecta+")  <br/>");

			

		});

	});
	$('#velo').fadeIn(500);
}
function filtrarPreg(){
	tituloBuscar=$("#tituloPreguntaBuscar").val();
	paginaActual=1;
	$.post('php/cargarPreguntas.php',{operacion:0,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser },procesarLecturaXML,'json');
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
		mensajeError("No puedes repetir el Tag a una misma pregunta.");
}
function removerTag(posTag){
	listaTags.splice(posTag,1);
	var codeTags='';
	for(var i =0 ;i<listaTags.length ; i++){
	 codeTags+= '<li><a onClick="removerTag('+i+')" class="tag">'+listaTags[i].nombre+'</a></li>';
	}
	$("#listaTags").html(codeTags)
}


function procesarLecturaXML(data){
		var preguntas="<tr><th>Titulo</th><th>Preview</th><th>Editar</th><th>compartir</th><th>Eliminar</th></tr>";
		 $.each(data, function(name, info){
		 	if(name != 'cantidad'){
		 		if(info.compartir==0)
		 			preguntas +='<tr id="row'+info.id+'"> <td>'+info.titulo+'</td><td><a   id="preview'+info.id+'" style="cursor:pointer;" onClick=cargarVelo("'+info.dirPreg+'");><img height="30" width="30" src="images/lupa.png"> </img></a></td><td><a  id="edit'+info.id+'" style="cursor:pointer;" onClick=editarPreg("'+info.id+'","'+info.dirPreg+'",'+info.compartir+');> <img  id="editImg'+info.id+'" height="30" width="30" src="images/edit.png"> </img></a></td> <td> <button class="button_azul" onClick="compartirPreg(this,'+info.id+')">Compartir</button></td><td><button class="button_rojo" onClick="eliminarPregunta('+info.id+')">Eliminar</button></td> </tr>';
		 		else
		 			preguntas +='<tr id="row'+info.id+'"> <td>'+info.titulo+'</td><td><a  style="cursor:pointer;" onClick=cargarVelo("'+info.dirPreg+'");><img height="30" width="30" src="images/lupa.png"> </img></a></td><td><a  id="edit'+info.id+'" style="cursor:pointer;" onClick=editarPreg("'+info.id+'","'+info.dirPreg+'",'+info.compartir+');> <img  id="editImg'+info.id+'" height="30" width="30" src="images/edit.png"> </img></a></td> <td> <h3><b>'+info.codigo+'</b></h3></td><td><button class="button_rojo" onClick="eliminarPregunta('+info.id+')">Eliminar</button></td> </tr>';

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
				codeHTML.push('<li><a href="#" onClick="llamadaPhpPagina('+j+');">'+j+'</a></li>');
	}
	string+= codeHTML.reverse().toString().replace(/,/g,'');
	string+= '<li class="active">'+paginaActual+'</li>';
	for(var i = 1; i <= 4-numero ; i++){
		string +='<li><a href="#" onClick="llamadaPhpPagina('+(i+paginaActual)+');">'+(i+paginaActual)+'</a></li>';
	}
	return string;
}

function paginador (cant){
	
	var htmlPag ='';
	var nPag= Math.ceil(cant/10);
	if(paginaActual > 1){
		htmlPag+='<li class="next"><a href="#"  onClick="llamadaPhpPagina(1);">««</a></li>';
		htmlPag+= '<li class="previous"><a href="#"  onClick="llamadaPhpPagina('+(paginaActual-1)+');"> «Anterior</a> </li>';
		
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
				htmlPag+= '<li><a href="#" onClick="llamadaPhpPagina('+i+');">'+i+'</li>';
	}
	if(paginaActual < nPag){
  		htmlPag+='<li class="next"><a href="#"  onClick="llamadaPhpPagina('+(paginaActual+1)+');">Siguiente» </a></li>';               
  		htmlPag+='<li class="next"><a  href="#" onClick="llamadaPhpPagina('+nPag+');">»»</a></li>';}
  	else {
  		htmlPag+='<li class="next-off">Siguiente» </li>';
  		htmlPag+='<li class="next-off">»»</li>';}               
  	

  $("ul#pagination-flickr").html(htmlPag);

}
function llamadaPhpPagina(numero){
	paginaActual=numero;
	$.post('php/cargarPreguntas.php',{operacion:0,dat1:numero,dat2:tituloBuscar,dat3:JSON.stringify(listaTags)},procesarLecturaXML,'json');

}
function mensajeError(texto){
	if(!$("#notificacion_top_error").is(':visible')){
		$("#notificacion_top_error").text(texto);
		$("#notificacion_top_error").show(500).delay(1000).fadeOut();
	}
};
function asignarPreg(id){
	$.post('php/insertXML.php',{operacion:4,dat1:id,dat2:localStorage.idUser},'','text').fail(function(XMLHttpRequest, textStatus, errorThrown) {
    mensajeError(""+XMLHttpRequest.responseText);

  });
}
function eliminarPregunta(id){
	$.post('php/insertXML.php',{operacion:5,dat1:id,dat2:localStorage.idUser},function(){
		$('#row'+id).remove();
	},'text').fail(function(XMLHttpRequest, textStatus, errorThrown) {
    mensajeError(""+XMLHttpRequest.responseText);

  });
}
function eliminarPregunta(id){
			$("#notificacion_top_confirmar_cambios p").text("Estas seguro que deseas eliminar esta pregunta, este cambio no se puede revertir (esta pregunta no sera eliminada de las pruebas que la contengan):");
		$("#notificacion_top_confirmar_cambios").show(500);
		var color = $("#row"+id).css("background-color");
		$("#row"+id).css("background-color","#FD94AC");
		$( "#Guardar" ).click(function() {
			$('#Guardar').off('click');
			$('#Cancelar').off('click');
			$("#notificacion_top_confirmar_cambios").hide(500);
			$.post('php/insertXML.php',{operacion:5,dat1:id,dat2:localStorage.idUser},function(){
			$('#row'+id).remove();
			},'text').fail(function(XMLHttpRequest, textStatus, errorThrown) {
	    	mensajeError(""+XMLHttpRequest.responseText);
		  
			});
		});
		$( "#Cancelar" ).click(function() {		  
		  $("#row"+id).css("background-color",color);
		  $('#Guardar').off('click');
		  $('#Cancelar').off('click');
		  $("#notificacion_top_confirmar_cambios").hide(500);
		
		});
}
function compartirPreg(element,id){

		$("#notificacion_top_confirmar_cambios p").text("Esta seguro que desea compartir esta pregunta, esta accion no se puede revertir y no podra seguir editando la pregunta");
		$("#notificacion_top_confirmar_cambios").show(500);
		var color = $("#row"+id).css("background-color");
		$("#row"+id).css("background-color","#1DA1F3");
		$( "#Guardar" ).click(function() {
			$('#Guardar').off('click');
			$('#Cancelar').off('click');
			$("#notificacion_top_confirmar_cambios").hide(500);
			
		  $("#row"+id).css("background-color",color);
			$.post('php/insertXML.php',{operacion:2,dat1:id},function(data){
				$(element).replaceWith("<h3><b>"+data+"</b></h3>");
				$('#edit'+id).removeAttr( "onClick" );
				$('#edit'+id).removeAttr( "style" );
				$('#editImg'+id).css({"opacity":"0.5","filter":"alpha(opacity=50)"});	
				$('#preview'+id).prop( "onClick", null );			
				$('#preview'+id).attr('onClick','cargarVelo("xmlPreguntas/'+data+'.xml")');
			},'text');
		});
		$( "#Cancelar" ).click(function() {		  
		  $("#row"+id).css("background-color",color);
		  $('#Guardar').off('click');
		  $('#Cancelar').off('click');
		  $("#notificacion_top_confirmar_cambios").hide(500);
		
		});
}