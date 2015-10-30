$(function(){
	if(localStorage.idUser != null || localStorage.idUser != undefined){
		//localStorage.idUser =sessionStorage.idUser;
		window.location.href="menu.html";
	}
});
function identificar (){
	var user = $("#userName").val();
	var pass = $("#password").val();

	if(localStorage.idUser == null || localStorage.idUser == undefined)
		$.post('php/user.php',{operacion:0,dat1:user ,dat2: pass},procesarRespuesta,'json');

	else
			window.location.href="index.html";
}
function procesarRespuesta(data) {
		var id;
		var nombre;
		var apellido;
		 $.each(data, function(name, info){
		 	id = info.id
		 	nombre = info.nombre
		 	apellido = info.apellido
		 });
		 if (window.localStorage) {
 			if (id != -1){
				localStorage.idUser = id;
				localStorage.nombre = nombre;
				localStorage.apellido = apellido;
				localStorage.page = 1;
				$("#submit_button").click()
				window.location.href = 'menu.html';
			}
			else{
				$("#notificacion_top_error").show(500).delay(1000).hide(500);
			}
			 
			}
		else {
		  console.log('Tu Browser no soporta LocalStorage!');
		}
	
		
}