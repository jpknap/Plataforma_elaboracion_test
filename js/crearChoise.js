$(function()
	{
		
		var Letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
				
		var Choices = new Array(3);//ancho
		count = 0;
		
		$('#addChoice').click(function()
			{
				Choices[count] = new Array(2);
				var Name="Alternativa"+Letters[count];
				var sname="Alternativa "+Letters[count];
				Choices[count][0] = Name;
				Choices[count][1] = $("input#choiceEntry").val();
				Choices[count][2] = $("input#choiceEntryScore").val();
				
			
				
				var id = Choices[count][0];
				var choiceText = Choices[count][1];
				var puntaje = Choices[count][2];
				
				var option = '<option value="'+Name+'">'+sname+'</option>';
				
				
				$("#list h5").append('<li>'+id+'     - '+choiceText+'    -'+puntaje+'</li>');
				
				$("#correctChoice").append(option).selectmenu("refresh", true);
				
				$("#choiceEntry").attr('value','');
				$("#choiceEntryScore").attr('value','');
				
				count=count+1;
				
				return false;
			
			
			});
			
			
		$('#delChoice').click(function()
			{
				if(count==0)
				{
					alert("no existen alternativas");
				
				}
				
				else
					{
					
						$("#list li:last-child").remove();
						
						
						$("#correctChoice :last-child").remove();
												
						var menuSelect = $("#correctChoice");
						menuSelect.selectmenu('refresh');
						Choices[count-1][0] = '';
						Choices[count-1][1] = '';
						Choices[count-1][2] = '';
						count=count-1;
					
					}
				
				
				return false;
			
			
			});
		
		
		
		
		
		
			
		$('#choicesubmitbtn').click('click',function()
			{
				//alert("hola mundooooo");
				
				var size = 0;
				var sizechoices = 0
				var titulo = $("input#choiceTitle").val();
				var pregunta = $("input#choicePregunta").val();
				var itemBody = $("#choiceDesarrollo").val();
				var correct = $("#correctChoice option:selected").val();
				var shuffle = $("input[name='shuffle_choice']:checked").val();
				
				
				var cH = new XMLWriter('UTF-8','1.0');
				cH.formatting = 'indented';//add indentation and newlines
				cH.indentChar = ' ';//indent with spaces
				cH.indentation = 3;//add 2 spaces per level

				cH.writeStartDocument( );
				cH.writeStartElement('assessmentItem');

					cH.writeAttributeString('xmlns', 'http://www.imsglobal.org/xsd/imsqti_v2p0');
					cH.writeAttributeString('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance');
					cH.writeAttributeString('xsi:schemaLocation','http://www.imsglobal.org/xsd/imsqti_v2p0imsqti_v2p0.xsd');
					cH.writeAttributeString('identifier','choice');
					cH.writeAttributeString('title',titulo);
					cH.writeAttributeString('adaptive','false');
					cH.writeAttributeString('timeDependent','false');

					cH.writeStartElement('responseDeclaration');	
						cH.writeAttributeString('identifier','RESPONSE');
						cH.writeAttributeString('cardinality','single');
						cH.writeAttributeString('baseType','identifier');

						cH.writeStartElement('correctResponse');
							cH.writeStartElement('value');
								cH.writeString(correct);
							cH.writeEndElement('value');
						cH.writeEndElement('correctResponse');
						
						cH.writeStartElement('mapping');
							while(size<=count-1)
										{
											cH.writeStartElement('mapEntry');
												cH.writeAttributeString('mapKey',Choices[size][0]);
												cH.writeAttributeString('mappedValue',Choices[size][2]);
											cH.writeEndElement('mapEntry');
											size=size+1;
										}
						
						cH.writeEndElement('mapping');
						
					cH.writeEndElement('responseDeclaration'); //fin response declaration
		
					
					cH.writeStartElement('outcomeDeclaration');
						cH.writeAttributeString('identifier','SCORE');
						cH.writeAttributeString('cardinality','single');
						cH.writeAttributeString('baseType','float');
						
						cH.writeStartElement('defaultValue');
							cH.writeStartElement('value');
								cH.writeString('0');
							cH.writeEndElement('value');
						cH.writeEndElement('defaultValue');
					cH.writeEndElement('outcomeDeclaration');// fin outcome declaration
								cH.writeStartElement('itemBody');
									cH.writeStartElement('choiceInteraction');
										cH.writeStartElement('prompt');
											cH.writeString(pregunta);
										cH.writeEndElement('prompt');
									
									
										cH.writeAttributeString('responseIdentifier','RESPONSE');
										cH.writeAttributeString('shuffle',shuffle);
										cH.writeAttributeString('maxChoices',1);
										while(sizechoices<=count-1)
										{
											cH.writeStartElement('simpleChoice');
												cH.writeAttributeString('identifier',Choices[sizechoices][0]);
												cH.writeString(Choices[sizechoices][1]);
											cH.writeEndElement('simpleChoice');
											sizechoices=sizechoices+1;
										}
									cH.writeEndElement('choiceInteraction');
								
								cH.writeEndElement('itemBody');//fin item body

						cH.writeStartElement('responseProcessing');
						cH.writeAttributeString('template','http://www.imsglobal.org/question/qti_v2p0/rptemplates/map_response');
						cH.writeEndElement('responseProcessing');
				

				cH.writeEndElement('assessmentItem');//fin assessment item
				
				var xml = cH.flush();
			//	alert(xml);
				
				
				var envio = 'archivo='+xml+'&title='+titulo;
			//	alert(envio);
				var cDiv= $('#choiceContentDiv');
				
				
				
				
				$.ajax({
						type: "POST",
						url:"ajax.php",
						data: envio,
						async: false,
						success: function(respuesta){
							var file=respuesta;
							alert(file);
							
							$('#choiceFinalDialog').remove();
							$('<div data-role="page" id="choiceFinalDialog"></div>').insertAfter('#choiceDiv');
							
							var header='<div data-role="header" id="choiceFinalDialogHeader" data-theme="e"><h3>Generando pregunta</h3></div>';
							var cgroup='<div data-role="controlgroup"><a href="preguntas/'+file+'" data-theme="b" id="enlace" data-ajax="false" data-role="button">Descargar Archivo QTI</a></div>';
							var content='<div data-role="content" id="choiceFinalDialogContent" data-theme="e"><h5>'+titulo+'</h5>'+cgroup+'<a href="index.html" data-theme="b" id="enlaceInitchoice" data-role="button">Volver a Selección de Respuesta Correcta</a><a href="../" data-theme="b" id="enlaceInit" data-role="button">Volver al Inicio</a></div>';
							var footer='<div data-role="footer" id="choiceFinalDialogFooter" data-theme="e"><h4>Selección de Respuesta Correcta</h4></div>'
							$('#choiceFinalDialog').empty().append(header+content+footer);
						
										
						},
						error: function() {
							alert('Error');
							
						}
						
						
				});
			
			});
			
			
			
		//======================================= PREVIEW =============================================================



		$('#choicepreviewbtn').click(function()	
					{
					
					
					//var probando=Choices[0][0];
					
					var aux=0;
					var numPreguntas=count-1;
					var item='<fieldset data-role="controlgroup" id="myChoices" data-mini="true">';
					//alert(numPreguntas);
					
					while(aux<=numPreguntas)
						{
							text=Choices[aux][1];
							letra=Letters[aux];
							alt=letra+')'+'      '+text;
							nombre='radio-'+aux;
							//jump='<br/>'
							
							item=item+'<input name="myRadio" id="'+nombre+'" type="radio"><label for="'+nombre+'">'+alt+'</label>';
							
							//alert(item);
							
							aux=aux+1;
						}
					item=item+'</fieldset>';
					
					var titulo = $("input#choiceTitle").val();
					var pregunta = $("input#choicePregunta").val();
					var desarrollo = $("#choiceDesarrollo").val();
					var correctAnswer = $("#correctChoice option:selected").val();
					
					$('#choicePreview').remove();
					
					$('<div data-role="page" id="choicePreview"></div>').insertAfter('#choiceDiv');		
					
					
					var header='<div data-role="header" id="choicePreviewHeader" data-theme="e"><h3>'+titulo+'</h3></div>';
					var fraseCorrecta='<h5><strong>La alternativa correcta es : '+correctAnswer+'</strong></h5>';
					var content='<div data-role="content" id="choicePreviewContent" data-theme="e"><div>'+desarrollo+'</div><h5>'+pregunta+'</h5><div>'+item+'</div>'+fraseCorrecta+'</div>';
					var footer=	'<div data-role="footer" id="choicePreviewFooter" data-theme="e"><h4>Selección de Respuesta Correcta</h4></div>';
					
			//		alert(header+content+footer);
			
					$('#choicePreview').empty().append(header+content+footer);
					
					});
		
		
	});
