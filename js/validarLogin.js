$(function(){
	if(sessionStorage.idUser == null || sessionStorage.idUser === undefined){
		window.location.href="index.html";
	}
	else{
		$("#logout").html(
			   '<p><strong>Usuario:</strong><br>'+sessionStorage.nombre+' '+sessionStorage.apellido+'</p><a href="#"><button id="cerrar_sesion">Cerrar sesión</button></a>');
		localStorage.idUser = sessionStorage.idUser;
		$("#cerrar_sesion").click(function(){
			sessionStorage.removeItem("idUser");
			sessionStorage.removeItem("nombre");
			sessionStorage.removeItem("apellido");
			window.location.href ="index.html";
		});
	}
});