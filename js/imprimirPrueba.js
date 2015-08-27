var paginaActual=1;
var tituloBuscar='';
var listaTags = [];
$(document).ready(function()
		{
			tituloBuscar=$("#tituloPreguntaBuscar").val();
			$.post('php/prueba.php',{operacion:1,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser } ,procesarLecturaXML,'json');
			$.post('php/tag.php',{operacion:1,dat1:'',dat2:"prueba",dat3:'ALL',dat4:localStorage.idUser},function(data){
				 var codeTags='';
				 $.each(data, function(name, info){
					codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
				 });
				 $("#tagPreguntaBuscar").html(codeTags);
			},'json');


});

function printPrueba(idPrueba){
	localStorage['idPruebaPrint'] = idPrueba;
	var win = window.open('baseTest.html', '_blank');
	if(win){
	    //Browser has allowed it to be opened
	    win.focus();
	}
}
function genWord(idPrueba){
		window.location.href = 'php/generateWord.php?idTest='+idPrueba;
}
function cargarDescripcion(titulo,descripcion){

	$("#textAdicionalPreview").html(decodeURIComponent(titulo));
	$('#preguntaPreview').html(decodeURIComponent(descripcion));
	$('#velo').fadeIn(500);
}
function filtrarPreg(){
	tituloBuscar=$("#tituloPreguntaBuscar").val();
	paginaActual=1;
	$.post('php/prueba.php',{operacion:1,dat1:1,dat2:tituloBuscar,dat3:JSON.stringify(listaTags),dat4:localStorage.idUser },procesarLecturaXML,'json');
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

function procesarLecturaXML(data){
		var preguntas="<tr><th>Titulo</th><th>Descripcion</th><th>Fecha</th><th>ver Online</th><th>ver Word</th></tr>";
		 $.each(data, function(name, info){
		 	if(name != 'cantidad'){
		 		preguntas +='<tr><td width=350 >'+info.titulo+'</td><td><a  style="cursor:pointer;" onClick=cargarDescripcion("'+encodeURIComponent(info.titulo)+'","'+encodeURIComponent(info.descripcion)+'");><img height="30" width="30" src="images/lupa.png"> </img></a><td>'+info.fecha+'</td></td><td><a  style="cursor:pointer;" onClick=printPrueba("'+info.id+'");> <img height="40" width="40" src="images/paper.png"> </img></a></td><td><a  style="cursor:pointer;" onClick=genWord("'+info.id+'");><img height="30" width="30" src="images/word.png"></a></td> </tr>';}
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
	$.post('php/prueba.php',{operacion:1,dat1:numero,dat2:tituloBuscar,dat3:JSON.stringify(listaTags)},procesarLecturaXML,'json');

}
function mensajeError(texto){
	if(!$("#notificacion_top_error").is(':visible')){
		$("#notificacion_top_error").text(texto);
		$("#notificacion_top_error").show(500).delay(1000).fadeOut();
	}
};
