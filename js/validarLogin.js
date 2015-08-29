$(function(){
	if(localStorage.idUser == null || localStorage.idUser === undefined){
		window.location.href="index.html";
	}
	else{
		$("#logout").html(
			   '<p><strong>Usuario:</strong><br>'+localStorage.nombre+' '+localStorage.apellido+'</p><a href="#"><button id="cerrar_sesion">Cerrar sesión</button></a>');
		$("#cerrar_sesion").click(function(){
			localStorage.removeItem("idUser");
			localStorage.removeItem("nombre");
			localStorage.removeItem("apellido");
			window.location.href ="index.html";
		});
	}
});