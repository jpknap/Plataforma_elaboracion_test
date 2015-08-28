var Letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var nPreg=1;
var urlPreg = [];
$(document).ready(function()
		{

			cargarLoading();
			var idPrueba = localStorage['idPruebaPrint'];
			localStorage.removeItem('idPruebaPrint');
			$.post('php/prueba.php',{operacion:2,dat1:idPrueba } ,asignar,'json');

		

});

function asignar(data){
	var tituloPrueba='';
	 $.each(data, function(name, info){
	 	$.each(info.prueba, function(namePrueba, infoPrueba){
	 		tituloPrueba=infoPrueba.titulo;
	 	});
	 	$.each(info.pregunta, function(namePregunta, infoPregunta){		
			urlPreg.push({url:infoPregunta.url});
			console.log(urlPreg[0].url);
	 			 		
	 	
	 	});
	 });

	 $("#TituloPrueba").text(tituloPrueba);
	 	$.post(urlPreg[0].url, function(data){
							procesarXML(data);
			});
}
function procesarXML(d){
	var listAlternativas = [];
	var npregunta = nPreg;
	nPreg++;
	var respCorrecta;

	var htmlPreg='<div class="pregunta"> <h5 id="numeracion">'+npregunta+'. </h5>';		
	$(d).find('assessmentItem').each( function(){
			 respCorrecta=$(d).find('assessmentItem responseDeclaration correctResponse value').text();

			if($(d).find('assessmentItem itemBody p:nth-child(1)').length !== 0){
				var textoAdicional=$(d).find('assessmentItem itemBody p:nth-child(1)')[0].innerHTML;
				htmlPreg+='<p>'+textoAdicional+'</p>';
			}

			$(d).find('assessmentItem itemBody choiceInteraction prompt').each(function(){

				var textoPregunta=$(this)[0].innerHTML;
				htmlPreg+='<h4>'+textoPregunta+'</h4>';
			
			});
			var intLetra=0;
			$(d).find('assessmentItem itemBody choiceInteraction simpleChoice').each(function(){
				var textoAlternativa = $(this).text();
				htmlPreg+='<p>'+Letters[intLetra]+') '+textoAlternativa+'</p>'
				intLetra++;
			});

				htmlPreg +='</div>';
			

		});
	$("#preguntas").append(htmlPreg);
	$("#solucion").append('<h4 >'+npregunta+' - '+respCorrecta+') </h4>');
	urlPreg.splice(0,1);
	if (urlPreg.length > 0){
		$.post(urlPreg[0].url, function(data){
				procesarXML(data);
		});
	}
	else
	 	cerrarLoading();
}