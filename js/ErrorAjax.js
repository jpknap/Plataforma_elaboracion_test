$(function() {
	$( document ).ajaxError(function(jqXHR, textStatus, thrownError) {
		//console.log(textStatus);
		if( textStatus.statusText !="OK"){
			$('#notificacion_top_error').text(textStatus.statusText);  
			$('#notificacion_top_error').slideDown();               
	        $('#notificacion_top_error').delay(2000).fadeOut();  
	    }
	          
	});
});