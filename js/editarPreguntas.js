var textotitulo = '';
var textoAdicional = '';
var textoPregunta = '';
var barajar= true;
var listAlternativas = [];
var listaTags =[];
var respuesta='';
var idPreg='';
var urlPreg='';
var compartirPreg='';
var ultimoNombreBusqueda='';

var Letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
$(function(){

		cargarLoading();
		if((sessionStorage['idPreguntaEdit'] !=undefined || sessionStorage['urlPreguntaEdit']!=undefined)){
			idPreg = sessionStorage['idPreguntaEdit'];
			urlPreg = sessionStorage['urlPreguntaEdit'];
			compartirPreg = sessionStorage['compartirPreguntaEdit'];
			 sessionStorage.removeItem('compartirPreguntaEdit');
			sessionStorage.removeItem('idPreguntaEdit');
			sessionStorage.removeItem('urlPreguntaEdit');
			$.post('php/tag.php',{operacion:1,dat1:ultimoNombreBusqueda,dat2:"pregunta",dat3:'ALL',dat4:localStorage.idUser},function(data){
			 var codeTags='';
			 $.each(data, function(name, info){
				codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
			 });
			 $("#seleccionTag").html(codeTags);
			},'json');

			$.post('php/tag.php',{operacion:3,dat1:idPreg,dat2:localStorage.idUser},obtenerTagsPregunnta,'json');
			if(compartirPreg==1){
				$('#tituloPregunta').attr("disabled",true);
				$('#idTextoAdicional').attr("disabled",true);
				$('#textPregunta').attr("disabled",true);
				$('#botonAgregar').attr("disabled",true);


			}
		}
		else{
			window.location.replace('administrarPregunta.html');
		}

	
});

function cargarXML(urlXML){
	$.post(urlXML, function(data){
		procesarXML(data);
	});

}
function obtenerTagsPregunnta(data){
 		$.each(data, function(name, info){
			listaTags.push({id:info.id,nombre:info.nombre});
		 });

		cargarXML(urlPreg);

}
function procesarXML(d){
	$(d).find('assessmentItem').each( function(){
			 textotitulo= $(this).attr('title');
		
			barajar=$(d).find('assessmentItem choiceInteraction').attr('shuffle');
			var respCorrecta=$(d).find('assessmentItem responseDeclaration correctResponse value').text();
			if($(d).find('assessmentItem itemBody p:nth-child(1)').length !== 0){
				textoAdicional=$(d).find('assessmentItem itemBody p:nth-child(1)')[0].innerHTML;
			}
		

			$(d).find('assessmentItem itemBody choiceInteraction prompt').each(function(){

				textoPregunta=$(this)[0].innerHTML;
			
			});
			$(d).find('assessmentItem itemBody choiceInteraction simpleChoice').each(function(){
				listAlternativas.push({id:$(this).attr("identifier"),text:$(this).text(), valor: 0});
			});
			var i =0;
			$(d).find('assessmentItem responseDeclaration mapping mapEntry').each(function(){
				listAlternativas[i].valor=$(this).attr('mappedValue');
				i++;
			});
				respuesta = respCorrecta;
			

		});

	cargarDatos();
	
}

function cargarAlternativas(){
	var largoLista = listAlternativas.length;
	var addToTable='<tr><th>Nº</th><th>Alternativa</th><th>Respuesta</th><th>Eliminar</th></tr>';
	for(var i =0 ;i<largoLista ; i++){
		if(respuesta == listAlternativas[i].id){
			 addToTable+= '<tr><td>'+Letters[i]+'</td><td>'+listAlternativas[i].text+'</td><td><input type="radio" id="radioRespuesta" name="group1" value="'+Letters[i]+'" checked> <br></td> <td><button onclick=eliminarElemento('+i+') class="button_rojo"> Eliminar </button> <br></td></tr>';
		}
		else{
			 addToTable+= '<tr><td>'+Letters[i]+'</td><td>'+listAlternativas[i].text+'</td><td><input type="radio" id="radioRespuesta" name="group1" value="'+Letters[i]+'"> <br></td> <td><button onclick=eliminarElemento('+i+') class="button_rojo"> Eliminar </button> <br></td></tr>';
		}
	}
	$("#tablaAlternativas").html(addToTable);
	if(compartirPreg==1){

		$('#tablaAlternativas *').attr('disabled', true);
	}
}
function cargarTags(){
	var codeTags='';
	for(var i =0 ;i<listaTags.length ; i++){
	 codeTags+= '<li><a onClick="removerTag('+i+')" class="tag">'+listaTags[i].nombre+'</a></li>';
	}
	$("#listaTags").html(codeTags);
}
function inversaCaracteresEspeciales(texto) {
	texto =texto.replace(/&amp;/g,"&");
	texto =texto.replace(/&quot;/g,'"');
	texto =texto.replace(/&apos;/g,"'");

	texto =texto.replace(/<br[^>]+>/g,'\n');
	texto =texto.replace(/&lt;/g,"<");
	texto =texto.replace(/&gt;/g,">");	

	return texto;
}
function cargarDatos(){
	$("#tituloPregunta").val(textotitulo);
	$("#idTextoAdicional").val(inversaCaracteresEspeciales(textoAdicional));
	$("#textPregunta").val(inversaCaracteresEspeciales(textoPregunta));

	if(barajar=="true"){
		$('#idBarajar[value="true"]').prop("checked",true);
	}
	else{
		$('#idBarajar[value="false"]').prop("checked",true);
	}
	cargarAlternativas();
	cargarTags();
	cerrarLoading();

}

function cargarTag(){
	ultimoNombreBusqueda=$('#nombreBusquedaTag').val();

	$.post('php/tag.php',{operacion:1,dat1:ultimoNombreBusqueda,dat2:1,dat3:'ALL'},'','json');

};
function asignarTag(){
	var idTag=$("#seleccionTag").val();
	if(idTag>0){
		var nombreTag=$("#seleccionTag option:selected").text();
		var result = $.grep(listaTags, function(e){ return e.id == idTag; });
		if(result.length == 0){
			listaTags.push({id:idTag,nombre: nombreTag});
			$("#listaTags").append('<li><a onClick="removerTag('+(listaTags.length-1)+')" class="tag">'+listaTags[listaTags.length-1].nombre+'</a></li>');
		}
		else
			mensajeError("No puedes repetir el Tag a una misma pregunta.");
	}
	else
		mensajeError("No puedes asignar un tag vacio.");
}
function removerTag(posTag){
	listaTags.splice(posTag,1);
	var codeTags='';
	for(var i =0 ;i<listaTags.length ; i++){
	 codeTags+= '<li><a onClick="removerTag('+i+')" class="tag">'+listaTags[i].nombre+'</a></li>';
	}
	$("#listaTags").html(codeTags)
}
function agregarAlternativa(){
	var texto = $("#textAlternativaAgregar").val();
	if(texto !="" && texto !=" "){
		var valor = $("#valorAlternativaAgregar").val();
		var result = $.grep(listAlternativas, function(e){ return e.text == texto; });
		if(result.length == 0){	
			listAlternativas.push({text: texto, valor: valor});
			var posicionLetra = listAlternativas.length-1;
			var addToTable= '<tr><td>'+Letters[posicionLetra]+'</td><td>'+texto+'</td><td><input type="radio" id="radioRespuesta" name="group1" value="'+Letters[posicionLetra]+'"> <br></td> <td><button class="button_rojo" onclick=eliminarElemento('+posicionLetra+')> Eliminar </button> <br></td></tr>';
			$("#tablaAlternativas").append(addToTable);
		}		
		else{
			mensajeError("No puedes agregar la misma alternativa");
		}
	}
	else{
		mensajeError("La alternativa debe contener texto");
	}
}

function eliminarElemento(posicion){
	listAlternativas.splice(posicion,1);
	var largoLista = listAlternativas.length;
	var addToTable='<tr><th>Nº</th><th>Alternativa</th><th>Respuesta</th><th>Eliminar</th></tr>';
	for(var i =0 ;i<largoLista ; i++){
	 addToTable+= '<tr><td>'+Letters[i]+'</td><td>'+listAlternativas[i].text+'</td><td><input type="radio" id="radioRespuesta" name="group1" value="'+Letters[i]+'"> <br></td> <td><button onclick=eliminarElemento('+i+') class="button_rojo"> Eliminar </button> <br></td></tr>';
	}
	$("#tablaAlternativas").html(addToTable)
}
function mensajeError(texto){
	if(!$("#notificacion_top_error").is(':visible')){
		$("#notificacion_top_error").text(texto);
		$("#notificacion_top_error").show(500).delay(1000).fadeOut();
	}
};
function remplazarCaracteresEspeciales(texto){
	texto =texto.replace(/&/g,"&amp;");
	texto =texto.replace(/"/g,"&quot;");
	texto =texto.replace(/“/g,"&quot;");
	texto =texto.replace(/”/g,"&quot;");	
	texto =texto.replace(/'/g,"&apos;");
	texto =texto.replace(/</g,"&lt;");
	texto =texto.replace(/>/g,"&gt;");	
	texto =texto.replace(/\r\n|\r|\n/g,'<br/>');		
	texto =texto.replace(/ /g,"&#160;");
	
	return texto;
}
function editarXMLSimpleChoice(){
		var titulo = $("input#tituloPregunta").val();
		var pregunta = $("textarea#textPregunta").val();		
		var correct =  $("input#radioRespuesta:checked").val();
		if(titulo == "" || titulo ==" "){
			mensajeError("Debes ingresar un titulo a la pregunta");
			return false;
		}
		if(pregunta == "" || pregunta ==" "){
			mensajeError("Debes ingresar el texto de la pregunta principal");
			return false;
		}
		if(listAlternativas.length < 2){
			mensajeError("Debes ingresar almenos dos alternativas");
			return false;
		}
		if(correct == "" || correct ==" " || typeof correct === "undefined"){
			mensajeError("Debes ingresar la respuesta de la pregunta");
			return false;
		}
	if(compartirPreg==1){

			cargarLoading();
		editarPregCompartida();
	}
	else{

			cargarLoading();
		editarPregSimple();
	}

}
function editarPregCompartida(){
	$.post('php/insertXML.php',{operacion:6,dat1:idPreg,dat2:JSON.stringify(listaTags)},function(){
		window.location.replace('administrarPregunta.html');
	},'');

}
function editarPregSimple(){
			var size = 0;
			var largoLista = listAlternativas.length;
		
			var sizechoices = 0
			var titulo = $("input#tituloPregunta").val();
			var pregunta = $("textarea#textPregunta").val();
			var textoAdicional = $("textarea#idTextoAdicional").val();
				


			//transformacion de caracteres especiales
			pregunta = remplazarCaracteresEspeciales(pregunta);
			textoAdicional = remplazarCaracteresEspeciales(textoAdicional);
		

			var correct =  $("input#radioRespuesta:checked").val();
			var shuffle = $("input#idBarajar:checked").val();			
			
			var cH = new XMLWriter('UTF-8','1.0');
			cH.formatting = 'indented';//add indentation and newlines
			cH.indentChar = ' ';//indent witd spaces
			cH.indentation = 3;//add 2 spaces per level

			cH.writeStartDocument( );
			cH.writeStartElement('assessmentItem');

				cH.writeAttributeString('adaptive','false');
				cH.writeAttributeString('timeDependent','false');
				cH.writeAttributeString('label','mylabel');				
				cH.writeAttributeString('title',titulo);
				cH.writeAttributeString('identifier','choice');
				cH.writeAttributeString('xsi:schemaLocation','http://www.imsglobal.org/xsd/imsqti_v2p1 imsqti_v2p1.xsd');
				cH.writeAttributeString('xmlns', 'http://www.imsglobal.org/xsd/imsqti_v2p1');
				cH.writeAttributeString('xmlns:xi', 'http://www.w3.org/2001/XInclude');
				cH.writeAttributeString('xmlns:lip', 'http://www.imsglobal.org/xsd/imslip_v1p0');
				cH.writeAttributeString('xmlns:xlink', 'http://www.w3.org/1999/xlink');
				cH.writeAttributeString('xmlns:m', 'http://www.w3.org/1998/Matd/MatdML');
				cH.writeAttributeString('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance');
				

				cH.writeStartElement('responseDeclaration');	
					cH.writeAttributeString('identifier','RESPONSE');
					cH.writeAttributeString('cardinality','single');
					cH.writeAttributeString('baseType','identifier');

					cH.writeStartElement('correctResponse');
						cH.writeStartElement('value');
							cH.writeString(''+correct);
						cH.writeEndElement('value');
					cH.writeEndElement('correctResponse');
				
					cH.writeStartElement('mapping');
						cH.writeAttributeString('defaultValue','0');
						for(var i =0 ;i<largoLista ; i++){
									
										cH.writeStartElement('mapEntry');
											cH.writeAttributeString('mapKey',''+Letters[i]);
											cH.writeAttributeString('mappedValue',listAlternativas[i].valor);
										cH.writeEndElement('mapEntry');
						}
					
					cH.writeEndElement('mapping');
					
				cH.writeEndElement('responseDeclaration'); //fin response declaration
	
				
				cH.writeStartElement('outcomeDeclaration');
					cH.writeAttributeString('identifier','SCORE');
					cH.writeAttributeString('cardinality','single');
					cH.writeAttributeString('baseType','float');			
				cH.writeEndElement('outcomeDeclaration');// fin outcome declaration


					cH.writeStartElement('itemBody');
					if(textoAdicional.length > 1){
						cH.writeStartElement('p');
						cH.writeAttributeString('class','');
						cH.writeString(textoAdicional);
						cH.writeEndElement('p');
					}
						cH.writeStartElement('choiceInteraction');
							cH.writeStartElement('prompt');
								cH.writeString(pregunta);
							cH.writeEndElement('prompt');
						
						
							cH.writeAttributeString('responseIdentifier','RESPONSE');
							cH.writeAttributeString('shuffle',shuffle);
							cH.writeAttributeString('maxChoices',1);	
							for(var i =0 ;i<largoLista ; i++){
								cH.writeStartElement('simpleChoice');

									cH.writeAttributeString('fixed','false');
									cH.writeAttributeString('identifier',''+Letters[i]);
									cH.writeString(remplazarCaracteresEspeciales(listAlternativas[i].text));
								cH.writeEndElement('simpleChoice');
							
							}
						cH.writeEndElement('choiceInteraction');
					
					cH.writeEndElement('itemBody');//fin item body

					cH.writeStartElement('responseProcessing');
					cH.writeAttributeString('template','http://www.imsglobal.org/question/qti_v2p1/rptemplates/map_response');
					cH.writeEndElement('responseProcessing');
			

			cH.writeEndElement('assessmentItem');//fin assessment item
			
			var xml = cH.flush();
			console.log(xml);
		
			
			
			var envio = 'operacion=1&dat1='+idPreg+'&dat2='+urlPreg+'&dat3='+encodeURIComponent(xml)+'&dat4='+JSON.stringify(listaTags)+'&dat5='+titulo;	//	alert(envio);
			
			
			
			
			$.ajax({
					type: "POST",
					url:"php/insertXML.php",
					data: envio,
					async: false,
					success: function(respuesta){
						$("#notificacion_top_ok").show(100).delay(1000).fadeOut(function(){ window.location.replace('administrarPregunta.html');});								
					},
					error: function(e) {
						cerrarLoading();
						console.log('Error :'+e);
						
					}
					
					
			});
				
			 
		};

