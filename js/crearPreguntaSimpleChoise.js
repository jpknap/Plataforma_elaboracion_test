var listaPreguntas = [];
var listaTags = [];
var ultimoNombreBusqueda='';
var Letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
$(function() {
	$.post('php/tag.php',{operacion:1,dat1:ultimoNombreBusqueda,dat2:1,dat3:'ALL'},function(data){
		 var codeTags='';
		 $.each(data, function(name, info){
			codeTags+='<option value="'+info.id+'">'+info.nombre+'</option>';
		 });
		 $("#seleccionTag").html(codeTags);
	},'json');
});
function cargarTag(){
	ultimoNombreBusqueda=$('#nombreBusquedaTag').val();

	$.post('php/tag.php',{operacion:1,dat1:ultimoNombreBusqueda,dat2:1,dat3:'ALL'},'','json');

};
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
function agregarAlternativa(){
	var texto = $("#textAlternativaAgregar").val();
	var valor = $("#valorAlternativaAgregar").val();	
	listaPreguntas.push({text: texto, valor: valor});
	var posicionLetra = listaPreguntas.length-1;
	var addToTable= '<tr><td>'+Letters[posicionLetra]+'</td><td>'+texto+'</td><td>'+valor+'</td><td><input type="radio" id="radioRespuesta" name="group1" value="'+Letters[posicionLetra]+'"> <br></td> <td><button onclick=eliminarElemento('+posicionLetra+')> Eliminar </button> <br></td></tr>';
	$("#tablaAlternativas").append(addToTable);
	}

function eliminarElemento(posicion){
	listaPreguntas.splice(posicion,1);
	var largoLista = listaPreguntas.length;
	var addToTable='<tr><th>Nº</th><th>Alternativa</th><th>Valor</th><th>Respuesta</th><th>Eliminar</th></tr>';
	for(var i =0 ;i<largoLista ; i++){
	 addToTable+= '<tr><td>'+Letters[i]+'</td><td>'+listaPreguntas[i].text+'</td><td>'+listaPreguntas[i].valor+'</td><td><input type="radio" id="radioRespuesta" name="group1" value="'+Letters[i]+'"> <br></td> <td><button onclick=eliminarElemento('+i+')> Eliminar </button> <br></td></tr>';
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
	
	return texto;
}


function generarXMLSimpleChoice(){
			var size = 0;

			var largoLista = listaPreguntas.lengtd;
			var sizechoices = 0
			var titulo = $("input#tituloPregunta").val();
			var pregunta = $("textarea#textPregunta").val();
			var textoAdicional = $("textarea#idTextoAdicional").val();


			//transformacion de caracteres especiales
			pregunta = remplazarCaracteresEspeciales(pregunta);
			textoAdicional = remplazarCaracteresEspeciales(textoAdicional);
			//textoAdicional.replace(/\r\n|\r|\n/g,'<br/>');
			//var itemBody = "sssss";

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
							cH.writeString('ID'+correct);
						cH.writeEndElement('value');
					cH.writeEndElement('correctResponse');
				
					cH.writeStartElement('mapping');
						cH.writeAttributeString('defaultValue','0');
						for(var i =0 ;i<largoLista ; i++){
									
										cH.writeStartElement('mapEntry');
											cH.writeAttributeString('mapKey','ID'+Letters[i]);
											cH.writeAttributeString('mappedValue',listaPreguntas[i].valor);
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
					if(textoAdicional.lengtd > 1){
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
									cH.writeAttributeString('identifier','ID'+Letters[i]);
									cH.writeString(remplazarCaracteresEspeciales(listaPreguntas[i].text));
								cH.writeEndElement('simpleChoice');
							
							}
						cH.writeEndElement('choiceInteraction');
					
					cH.writeEndElement('itemBody');//fin item body

					cH.writeStartElement('responseProcessing');
					cH.writeAttributeString('template','http://www.imsglobal.org/question/qti_v2p0/rptemplates/map_response');
					cH.writeEndElement('responseProcessing');
			

			cH.writeEndElement('assessmentItem');//fin assessment item
			
			var xml = cH.flush();
		
			
			
			var envio = 'archivo='+encodeURIComponent(xml)+'&title='+titulo+'&tags='+JSON.stringify(listaTags);	//	alert(envio);
			
			
			
			
			$.ajax({
					type: "POST",
					url:"php/insertXML.php",
					data: envio,
					async: false,
					success: function(respuesta){
						$("#notificacion_top_ok").show(100).delay(1000).fadeOut(function(){ location.href = 'crearPregunta.html';});								
					},
					error: function(e) {
						console.log('Error :'+e);
						
					}
					
					
			});
				
			 
		};
