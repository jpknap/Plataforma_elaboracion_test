$(function() {
	if(sessionStorage['idUser']!= null){
		if(sessionStorage['idUser']=='0'){
			window.location.href = "administrador_asignaturas.html";
		}
		else{
			window.location.href = "profesor_notas_seleccion_curso.html";
		}

	}	

});
$(function() {
	
	$("#botonIngresar").click(function(){
		console.log("procesar");
		$.post('PHP/configuracion.php',{operacion:'6',param0:''+$("#userName").val(),param1:''+$("#password").val()},process_login,'');	

	});


});

function process_login (data){
	var res = data.split("|");
	if(res[0]=='-1'){
		$('#notificacion_top_error').slideDown();               
        $('#notificacion_top_error').delay(1000).fadeOut();
        }    
	else{
		if(res[0]=='0'){
			sessionStorage.setItem('idUser', res[0]);
			sessionStorage.setItem('nameUser', res[1]);
			window.location.href = "administrador_asignaturas.html";
		}
		else{
			if(res[0]>=1){
			sessionStorage.setItem('idUser', res[0]);
			sessionStorage.setItem('nameUser', res[1]);
			window.location.href = "profesor_notas_seleccion_curso.html";
			}
		}

	}

}