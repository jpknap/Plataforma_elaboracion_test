// .button_crear
$(function() {
	$('.button_crear').click(function() {
		$('.button_crear').fadeOut();
		$('.creacion').delay(400).fadeIn();
	});
});

// #crear_alumno .botones_de_accion
$(function() {
	$('.crear .botones_de_accion').click(function() {
		$('.creacion').fadeOut();
		$('.button_crear').delay(400).fadeIn();
		$('#notificacion_top_ok').slideDown();
		$('#notificacion_top_ok').delay(4000).fadeOut();
	});
});

// botón pasar de curso
$(function() {
	$('#pasar_de_curso #boton_de_accion button').click(function() {
		$('#notificacion_top_ok').slideDown();
		$('#notificacion_top_ok').delay(4000).fadeOut();
	});
});

// #notificacion_top_confirmar_cambios
$(function() {
	$('.tabla_alumnos_y_profesores input').click(function() {
		$('#notificacion_top_confirmar_cambios').slideDown();
	});
	$('.tabla_alumnos_y_profesores select').click(function() {
		$('#notificacion_top_confirmar_cambios').slideDown();
	});
	$('.creacion input[type=number]').click(function() {
		$('#notificacion_top_confirmar_cambios').slideDown();
	});
});

// #notificacion_top_confirmar_cambios .botones_de_accion
$(function() {
	$('#notificacion_top_confirmar_cambios .botones_de_accion').click(function() {
		$('#notificacion_top_confirmar_cambios').fadeOut();
	});
});

// mostrar #velo
$(function() {
	$('#cursos .item').click(function() {
		$('#velo').fadeIn(500);
	});
	$('#asignaturas .item').click(function() {
		$('#velo').fadeIn(500);
	});
});

// ocultar #velo
$(function() {
	$('#cerrar_pop_up').click(function() {
		$('#velo').fadeOut();
	});
});

// #velo .botones_de_accion
$(function() {
	$('.botones_de_accion').click(function() {
		$('#velo').fadeOut();
	});
});

// Activar .semestre_1
$(function() {
	$('.semestre_1').click(function() {
		$('.semestre_1').addClass("semestre_activo");
		$('.semestre_2').removeClass("semestre_activo");
	});
});

// Activar .semestre_2
$(function() {
	$('.semestre_2').click(function() {
		$('.semestre_2').addClass("semestre_activo");
		$('.semestre_1').removeClass("semestre_activo");
	});
});

// Pestañas y contenidos "profesor_notas_alumno"
$(document).ready(function () {
    $('#pestanas').each(function () {

        var $active, $content, $links = $(this).find('a');

        $active = $($links.filter('[href="' + location.hash + '"]')[0] || $links[0]);
        $active.addClass('pestana_activa');
        $content = $($active.attr('href'));

        $links.not($active).each(function () {
            $($(this).attr('href')).hide();
        });

        $(this).on('click', 'a', function (e) {
            $active.removeClass('pestana_activa');
            $content.hide();

            $active = $(this);
            $content = $($(this).attr('href'));

            $active.addClass('pestana_activa');
            $content.fadeIn();

            e.preventDefault();
        });
    }).find('a.pestana_activa').click();
});

// Selector de checkbox grupal 1

