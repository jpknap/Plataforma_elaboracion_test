var listaPreguntas = [];
var listaTags = [];
var listaTagsBusqueda = [];
var paginaActual=1;
var idPrueba;
$(function()
	{
	//$.post('php/cargarPreguntas.php',{operacion:0,dat1:1,dat2:'',dat3:JSON.stringify(listaTags),dat4:localStorage.idUser } ,procesarLecturaXML,'json');
	//carga de prueba	
	idPrueba = sessionStorage['idPruebaEdit'];
	//sessionStorage.removeItem('idPruebaEdit');
	$.post('php/prueba.php',{operacion:4,dat1:''+idPrueba},function(data){
			 var codeTags='';
			 $.each(data, function(name, info){
			 	$("#tituloPregunta").val(info.titulo);
			 	$("#idTextoAdicional").val(info.descripcion);
			 });
		},'json');
	//carga Tags Prueba listaTags.push({id:idTag,nombre: nombreTag});
	$.post('php/prueba.php',{operacion:5,dat1:''+idPrueba},function(data){
			 var codeTags='';
			 $.each(data, function(name, info){
			 	listaTags.push({id:info.id,nombre: info.nombre});
			 });
			 reloadTag();

		},'json');
	//carga preguntas prueba listaPreguntas.push({id:id,titulo: titulo, url:url});
		$.post('php/prueba.php',{operacion:6,dat1:''+idPrueba},function(data){
			 var codeTags='';
			 $.each(data, function(name, info){
			 	listaPreguntas.push({id:info.id,titulo: info.titulo, url:info.url});
			 });
			 reloadPregunta();

		},'json');
	//carga de tags
	$.post('php/tag.php',{operacion:1,dat1:'',dat2:"prueba",dat3:'ALL',dat4:localStorage.idUser},function(data){
			 var codeTags='';
			 $.each(data, function(name, info){
				codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
			 });
			 $("#seleccionTag").html(codeTags);
		},'json');
		cargarTagsBusqueda();
});

function mensajeError(texto){
	if(!$("#notificacion_top_error").is(':visible')){
		$("#notificacion_top_error").text(texto);
		$("#notificacion_top_error").show(500).delay(1000).fadeOut();
	}
};
//generacion de prueba 
function generarPrueba(){
	cargarLoading();
	var titulo =$("#tituloPregunta").val();
	var descripcion= $("#idTextoAdicional").val();
	$.post('php/prueba.php',{operacion:7,dat1:localStorage.idUser,dat2:titulo,dat3:descripcion,dat4:JSON.stringify(listaTags),dat5:JSON.stringify(listaPreguntas),dat6:""+idPrueba },function(){
	  location.href = 'administrarPrueba.html';},'');
}
//fin funciones generacion de prueba
//funciones tag pruebas 
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
function removerTag(posTag){
	listaTags.splice(posTag,1);
	var codeTags='';
	for(var i =0 ;i<listaTags.length ; i++){
	 codeTags+= '<li><a onClick="removerTag('+i+')" class="tag">'+listaTags[i].nombre+'</a></li>';
	}
	$("#listaTags").html(codeTags)
}
function reloadTag(){
	var codeTags='';
	for(var i =0 ;i<listaTags.length ; i++){
	 codeTags+= '<li><a onClick="removerTag('+i+')" class="tag">'+listaTags[i].nombre+'</a></li>';
	}
	$("#listaTags").html(codeTags)
}
// fin funciones tag prueba
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
///funciones a la gestion y asignacion de preguntas de una prueba
function asignarPregunta(titulo,id, url){
	//valida que no se repita el id de un pregunta
	var result = $.grep(listaPreguntas, function(e){ return e.id == id; });
	if(result.length == 0){
		listaPreguntas.push({id:id,titulo: titulo, url:url});
		$("#preguntasAsig").append('<div style="background-color:yellow; margin-top:4px; height: 45px; width: 100%;"> <snap style=" margin-left:7px;  width:110px; float:left; ">'+decodeURI(titulo).substring(0,15)+'</snap> <a  style="cursor:pointer; margin-top:10px; float:left;" onClick=cargarVelo("'+url+'");><img height="25" width="25" src="images/lupa.png"> </img></a> <button style=" margin-left:5px;  margin-top:10px;float:left;" onclick=quitarPregunta('+(listaPreguntas.length-1)+')> X </button> </div>');
	}
	else{
		console.log("no se puede repetir pregunta");
	}
}

function quitarPregunta(posPregunta){
	listaPreguntas.splice(posPregunta,1);
	codePreguntaList ='';
	for(var i =0 ;i<listaPreguntas.length ; i++){
	 codePreguntaList+= '<div style="background-color:yellow; margin-top:4px; height: 45px; width: 100%;"> <snap style=" margin-left:7px;  width:110px; float:left; ">'+decodeURI(listaPreguntas[i].titulo).substring(0,15)+'</snap> <a  style="cursor:pointer; margin-top:10px; float:left;" onClick=cargarVelo("'+listaPreguntas[i].url+'");><img height="25" width="25" src="images/lupa.png"> </img></a> <button style=" margin-left:5px; margin-top:10px;float:left;" onclick="quitarPregunta('+i+')" > X </button> </div>';
	}
	$("#preguntasAsig").html(codePreguntaList)
}
function reloadPregunta(){
	codePreguntaList ='';
	for(var i =0 ;i<listaPreguntas.length ; i++){
	 codePreguntaList+= '<div style="background-color:yellow; margin-top:4px; height: 45px; width: 100%;"> <snap style=" margin-left:7px;  width:110px; float:left; ">'+decodeURI(listaPreguntas[i].titulo).substring(0,15)+'</snap> <a  style="cursor:pointer; margin-top:10px; float:left;" onClick=cargarVelo("'+listaPreguntas[i].url+'");><img height="25" width="25" src="images/lupa.png"> </img></a> <button style=" margin-left:5px; margin-top:10px;float:left;" onclick="quitarPregunta('+i+')" > X </button> </div>';
	}
	$("#preguntasAsig").html(codePreguntaList)
}
//fin funciones relacionadas con las preguntas contenidas de una prueba

//funciones tag busqueda
function cargarTagsBusqueda(){
	$.post('php/tag.php',{operacion:1,dat1:'',dat2:"pregunta",dat3:'ALL',dat4:localStorage.idUser},function(data){
		 var codeTags='';
		 $.each(data, function(name, info){
			codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
		 });
		 $("#tagPreguntaBuscar").html(codeTags);
	},'json');
}
function asignarTagBusqueda(){
	var id=$("#tagPreguntaBuscar").val();
	var nombreTag=$("#tagPreguntaBuscar option:selected").text();
	var result = $.grep(listaTagsBusqueda, function(e){ return e.id == id; });
	if(result.length == 0){
		listaTagsBusqueda.push({id:id,nombre: nombreTag});
		$("#listaTagsBusqueda").append('<li><a onClick="removerTagBusqueda('+(listaTagsBusqueda.length-1)+')" class="tag">'+listaTagsBusqueda[listaTagsBusqueda.length-1].nombre+'</a></li>');
	}
	else
		mensajeError("No puedes repetir el Tag a una misma pregunta.");
}
function removerTagBusqueda(posTag){
	listaTagsBusqueda.splice(posTag,1);
	var codeTags='';
	for(var i =0 ;i<listaTagsBusqueda.length ; i++){
	 codeTags+= '<li><a onClick="removerTagBusqueda('+i+')" class="tag">'+listaTagsBusqueda[i].nombre+'</a></li>';
	}
	$("#listaTagsBusqueda").html(codeTags)
}
//fin funciones tag busqueda


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