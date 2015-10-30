$(function(){

});
function velo (titulo, texto , urlVideo){
	 $('#velo').fadeIn(500);
	 $('#velo #tituloPreview').text(titulo);
	 $('#velo #preguntaPreview').text(texto);
	 $('#velo #youtube').attr("src",urlVideo);

}
$(document).keyup(function(e) {
  if (e.keyCode == 13) $('#velo').fadeOut(500);     // enter
  if (e.keyCode == 27) $('#velo').fadeOut(500);  // esc
});