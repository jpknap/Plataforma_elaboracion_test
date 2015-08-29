$(function(){
	if(localStorage.idUser != null || localStorage.idUser != undefined){
		window.location.href="menu.html";
	}
});
function identificar (){
	var user = $("#userName").val();
	var pass = $("#password").val();
	$.post('php/user.php',{operacion:0,dat1:user ,dat2: pass},procesarRespuesta,'json');
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
				window.location.href = 'menu.html';
			}
			else{
				console.log("error logeo");
			}
			 
			}
		else {
		  console.log('Tu Browser no soporta LocalStorage!');
		}

		
}