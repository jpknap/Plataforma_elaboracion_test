<?php
/**
 * Plugin Name: Formulario de registro Mi Huerto Web
 * Plugin URI: http://mihuertoweb.cl
 * Description: Permite a los usuarios registrarse en la plataforma mi herto web para el pre-lanzamiento.
 * Version: 1.0
 * Author: Francisco Aguilera G. - Juan Pablo Muñoz Bouchard - Felipe Claude
 * Author URI: http://mihuertoweb.cl
 * License: GPL2
 */
 



/**
 * Creamos una función en particular
 * que nos permitirá mostrar el formulario
 * dentro del contenido de la página
 * creamos el formulario a partir de la variable $formulario
 *
 */


add_shortcode( 'mhw_registro', 'mhw_registro_shortcode' );

function mhw_registro_shortcode() {

	
	
	$formulario = '
	
		<div id="mhw-registro" class="mhw-registro et_pb_newsletter_form">
			<form action="">
			
				<div class="registro-mensaje"></div>
				
				<p>
					<label for="nombres" style="display: none;">Nombres</label>
					<input id="nombres" class="input" type="text" value="Nombres" name="nombres" required>
				</p>
				
				<p>
					<label for="apellidos" style="display: none;">Apellidos</label>
					<input id="apellidos" class="input" type="text" value="Apellidos" name="apellidos" required>
				</p>
				
				<p>
					<label for="email" style="display: none;">Email</label>
					<input id="email" class="input" type="text" value="Email" name="email" required>
				</p>
				
				<p>
					<label for="region" style="display: none;">región</label>
					<select name="region" id="region" class="select">
						<option value="">Selecciona una región</option>
						<option value="">I Región</option>
						<option value="">II Región</option>
						<option value="">III Región</option>
						<option value="">IV Región</option>
						<option value="">V Región</option>
						<option value="">VI Región</option>
						<option value="">VII Región</option>
						<option value="">VIII Región</option>
						<option value="">IX Región</option>
						<option value="">X Región</option>
						<option value="">XI Región</option>
						<option value="">XII Región</option>
						<option value="">Región Mtropolitana</option>
						<option value="">XIV Región</option>
					</select>
				</p>
				
				<p><a class="et_pb_newsletter_button et_pb_button" href="#"><span class="et_subscribe_loader"></span><span class="et_pb_newsletter_button_text">Inscríbete</span></a></p>
				
				<input type="hidden" value="" name="verificador">
			
			
			</form>
		</div>
	
	';
	
	
	
	
	// Code
	return $formulario;

}



/**
 * Cargar algunos estilos adicionales
 * y un poco de JS
 *
 */


add_action( 'wp_head', 'mhw_registro_estilos' );

function mhw_registro_estilos() { ?>
	
	<style type="text/css">
		.select {
			font-size: 14px;
		    border: none !important;
		    padding: 14px 4% !important;
		    font-size: 16px;
		    color: #666;
		    background-color: #fff;
		    width: 100%;
		    font-weight: 400;
		    -moz-border-radius: 3px !important;
		    -webkit-border-radius: 3px !important;
		    border-radius: 3px !important;
		    height: 47px;
		}
	</style>
	
	<script type="text/javascript">
		jQuery("document").ready(function($){
		
			$("#nombres").focus(function(){
				if( $(this).attr("value") == "Nombres" ) {
					$(this).attr("value", "");
				}
			})
			.blur(function(){
				if( $(this).attr("value") == "" ) {
					$(this).attr("value", "Nombres");
				}
			});
			
			
			$("#apellidos").focus(function(){
				if( $(this).attr("value") == "Apellidos" ) {
					$(this).attr("value", "");
				}
			})
			.blur(function(){
				if( $(this).attr("value") == "" ) {
					$(this).attr("value", "Apellidos");
				}
			});
			
			
			$("#email").focus(function(){
				if( $(this).attr("value") == "Email" ) {
					$(this).attr("value", "");
				}
			})
			.blur(function(){
				if( $(this).attr("value") == "" ) {
					$(this).attr("value", "Email");
				}
			});
			
		
		});
	</script>
	
<?php 
}
