$(function(){
	if(localStorage.idUser == null || localStorage.idUser === undefined){
		window.location.href="index.html";
	}
	else{
		$("#logout").html('<p><strong>Usuario:</strong><br>'+localStorage.nombre+' '+localStorage.apellido+'</p><a href="#"><button id="cerrar_sesion">Cerrar sesión</button></a>');
		var user = localStorage.idUser;
		var nombre = localStorage.nombre;
		var apellido = localStorage.apellido;

		$("#cerrar_sesion").click(function(){
			localStorage.removeItem("idUser");
			localStorage.removeItem("nombre");
			localStorage.removeItem("apellido");
			window.location.href ="index.html";
		});
	}


	

/*
window.onbeforeunload = function (e) {
// Your logic to prepare for 'Stay on this Page' goes here 
 if (window.localLinkClicked ) {
 		localStorage.idUser = user;
		localStorage.nombre = nombre;
		localStorage.apellido = apellido;
    } 
else {
	  	
    localStorage.removeItem("idUser");
	localStorage.removeItem("nombre");
	localStorage.removeItem("apellido");
    }
	
};*/


});