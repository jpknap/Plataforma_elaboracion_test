var listaPreguntas = [];
var listaTags = [];
var listaTagsBusqueda = [];
var paginaActual=1;
$(function()
	{
	//$.post('php/cargarPreguntas.php',{operacion:0,dat1:1,dat2:'',dat3:JSON.stringify(listaTags),dat4:localStorage.idUser } ,procesarLecturaXML,'json');
	$.post('php/tag.php',{operacion:1,dat1:'',dat2:"prueba",dat3:'ALL',dat4:localStorage.idUser},function(data){
			 var codeTags='';
			 $.each(data, function(name, info){
				codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
			 });
			 $("#seleccionTag").html(codeTags);
		},'json');
});
function asignarTag(){
	var idTag=$("#seleccionTag").val();
	var nombreTag=$("#seleccionTag option:selected").text();
	var result = $.grep(listaTags, function(e){ return e.id == idTag; });
	if(result.length == 0){
		listaTags.push({id:idTag,nombre: nombreTag});
		$("#listaTags").append('<li><a onClick="removerTag('+(listaTags.length-1)+')" class="tag">'+listaTags[listaTags.length-1].nombre+'</a></li>');
	}
	else
		mensajeError("No puedes repetir el Tag a una misma pregunta.");
}
function mensajeError(texto){
	if(!$("#notificacion_top_error").is(':visible')){
		$("#notificacion_top_error").text(texto);
		$("#notificacion_top_error").show(500).delay(1000).fadeOut();
	}
};
function removerTag(posTag){
	listaTags.splice(posTag,1);
	var codeTags='';
	for(var i =0 ;i<listaTags.length ; i++){
	 codeTags+= '<li><a onClick="removerTag('+i+')" class="tag">'+listaTags[i].nombre+'</a></li>';
	}
	$("#listaTags").html(codeTags)
}

function procesarLecturaXML(data){
		var preguntas='<tr><th width="20%" >CODE</th><th width="50%">Titulo</th><th width="10%">Preview</th><th width="20%">Asignar</th></tr>';
		 $.each(data, function(name, info){
		 	if(name != 'cantidad'){
		 		preguntas +='<tr> <td>'+info.id+'</td><td>'+info.titulo+'</td><td><a  style="cursor:pointer;" onClick=cargarVelo("'+info.dirPreg+'");><img height="30" width="30" src="images/lupa.png"> </img></a></td><td><a  style="cursor:pointer;" onClick=asignarPregunta("'+encodeURI(info.titulo)+'","'+info.id+'","'+info.dirPreg+'");> <img height="30" width="30" src="images/edit.png"> </img></a></td></tr>';
		 	}
		 	else{
		 		paginador(info.value);
		 	}
		 });
		 $("#tablaPreguntas").html(preguntas);
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
	$.post('php/cargarPreguntas.php',{operacion:0,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTagsBusqueda),dat4:localStorage.idUser },procesarLecturaXML,'json');
}
function asignarPregunta(titulo,id, url){
	console.log(id);
	$("#preguntasAsig").append('<div style="background-color:yellow; margin-top:4px; height: 45px; width: 100%;"> <snap style=" margin-left:7px;  width:110px; float:left; ">'+decodeURI(titulo).substring(0,15)+'</snap> <a  style="cursor:pointer; margin-top:10px; float:left;" onClick=cargarVelo("'+url+'");><img height="25" width="25" src="images/lupa.png"> </img></a> <button style=" margin-left:5px;  margin-top:10px;float:left;"> X </button> </div>');
	
}
//paginacion de elementos pregunta


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