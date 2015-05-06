var paginaActual=1;
$(document).ready(function()
		{
			$.post('php/cargarPreguntas.php',{pagina:1},procesarLecturaXML,'json');


});

function procesarLecturaXML(data){
		var preguntas="<tr><th>CODE</th><th>Titulo</th><th>Preview</th><th>Editar</th><th>compartir</th><th>Eliminar</th></tr>";
		 $.each(data, function(name, info){
		 	if(name != 'cantidad'){
		 		preguntas +='<tr> <td>'+name+'</td><td>'+info.dirPreg+'</td><td><img height="30" width="30" src="images/lupa.png"> </img></td><td><img height="30" width="30" src="images/edit.png"> </img></td> <td><button class="button_azul">Compartir</button></td><td><button class="button_rojo">Eliminar</button></td> </tr>';
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
	var nPag= Math.ceil(cant/15);
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
	$.post('php/cargarPreguntas.php',{pagina:numero},procesarLecturaXML,'json');

}

	/*	function procesarPregunta(idPreg){
			$("#contenido").hide();
			$("#contenido2").show();
			var urlXML = "xmlPreguntas/"+idPreg+".xml";
			$.post(urlXML, function(d)
			{

				$(d).find('assessmentItem').each(function(){
					var pregunta = $(this).attr('title');
					console.log(pregunta);
					$('#tituloPreg').html(pregunta);
					var respCorrecta=$(d).find('assessmentItem responseDeclaration correctResponse value').text();
					$('#respuestas').html(respCorrecta);
					$(d).find('assessmentItem itemBody choiceInteraction simpleChoice').each(function(){
						$('#preguntas').append($(this).text()+'<p>');
					});

					console.log(respCorrecta);
					

				});
			});
		}*/
