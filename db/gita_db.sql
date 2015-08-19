-- phpMyAdmin SQL Dump
-- version 4.4.7
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 19-08-2015 a las 19:41:23
-- Versión del servidor: 5.6.12-log
-- Versión de PHP: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `gita_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE IF NOT EXISTS `pregunta` (
  `id` int(11) NOT NULL,
  `titulo` varchar(30) NOT NULL,
  `tipo` varchar(20) NOT NULL,
  `fechaCreacion` datetime NOT NULL,
  `compartir` tinyint(1) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `url` varchar(40) NOT NULL,
  `extension` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id`, `titulo`, `tipo`, `fechaCreacion`, `compartir`, `codigo`, `url`, `extension`) VALUES
(14, 'aaaa', 'SimpleChoice', '2015-06-04 01:27:17', 0, '0cf221a2t', 'xmlPreguntas/0cf221a2t.xml', 'xml'),
(15, 'pregunta con un tag', 'SimpleChoice', '2015-06-06 03:54:43', 0, '9932b483y', 'xmlPreguntas/9932b483y.xml', 'xml'),
(16, 'pregunta con un tag', 'SimpleChoice', '2015-06-06 03:54:53', 0, 'f17f14d3u', 'xmlPreguntas/f17f14d3u.xml', 'xml'),
(17, 'pregunta doble tag', 'SimpleChoice', '2015-06-06 04:01:15', 0, 'e6aa91fai', 'xmlPreguntas/e6aa91fai.xml', 'xml'),
(18, 'primera pregunta', 'SimpleChoice', '2015-06-06 04:20:10', 0, 'ad3a77dco', 'xmlPreguntas/ad3a77dco.xml', 'xml'),
(19, 'pregunta', 'SimpleChoice', '2015-06-06 04:21:43', 0, '31530ca1p', 'xmlPreguntas/31530ca1p.xml', 'xml'),
(20, 'NÃºmeros Primos', 'SimpleChoice', '2015-06-13 17:47:06', 0, '60c219b9a', 'xmlPreguntas/60c219b9a.xml', 'xml'),
(21, 'NÃºmeros pares', 'SimpleChoice', '2015-06-13 17:47:14', 0, '7070c6a4s', 'xmlPreguntas/7070c6a4s.xml', 'xml'),
(22, 'titulo gita', 'SimpleChoice', '2015-06-17 23:53:55', 0, '15407f86d', 'xmlPreguntas/15407f86d.xml', 'xml');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta_prueba`
--

CREATE TABLE IF NOT EXISTS `pregunta_prueba` (
  `id` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `id_prueba` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pregunta_prueba`
--

INSERT INTO `pregunta_prueba` (`id`, `id_pregunta`, `id_prueba`) VALUES
(1, 21, 2),
(2, 20, 2),
(3, 21, 3),
(4, 20, 3),
(5, 22, 3),
(6, 19, 3),
(7, 18, 3),
(8, 18, 5),
(9, 19, 5),
(10, 20, 5),
(12, 18, 10),
(14, 20, 10),
(16, 21, 10),
(18, 22, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta_tag`
--

CREATE TABLE IF NOT EXISTS `pregunta_tag` (
  `id_pregunta` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pregunta_tag`
--

INSERT INTO `pregunta_tag` (`id_pregunta`, `id_tag`) VALUES
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 2),
(14, 3),
(17, 3),
(20, 5),
(21, 5),
(22, 7),
(22, 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta_user`
--

CREATE TABLE IF NOT EXISTS `pregunta_user` (
  `id_usuario` int(11) NOT NULL,
  `id_pregunta` int(11) NOT NULL,
  `eliminada` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `pregunta_user`
--

INSERT INTO `pregunta_user` (`id_usuario`, `id_pregunta`, `eliminada`) VALUES
(1, 14, 0),
(1, 15, 0),
(1, 16, 0),
(1, 17, 0),
(2, 18, 0),
(2, 19, 0),
(2, 20, 0),
(2, 21, 0),
(2, 22, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prueba`
--

CREATE TABLE IF NOT EXISTS `prueba` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `titulo` varchar(30) NOT NULL,
  `descripcion` varchar(300) NOT NULL,
  `fechaCreacion` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `prueba`
--

INSERT INTO `prueba` (`id`, `id_usuario`, `titulo`, `descripcion`, `fechaCreacion`) VALUES
(1, 2, 'peneee', 'pene2', '2015-06-24 02:05:47'),
(2, 2, 'pene3', 'pene4', '2015-06-24 02:10:12'),
(3, 2, 'pene3', 'pene4', '2015-06-24 02:12:46'),
(5, 2, 'Prueba con tag 2', 'esta es una descripcion de la prueba ', '2015-07-20 01:12:36'),
(6, 2, 'Prueba Matematicas', '', '2015-07-25 17:40:37'),
(7, 2, 'Prueba Ciencias', '', '2015-07-25 17:41:04'),
(8, 2, 'Prueba Ciencias Microbiologia', '', '2015-07-25 17:41:18'),
(9, 2, 'Prueba Libro El Principito', '', '2015-07-25 17:41:36'),
(10, 2, 'Prueba Matematicas Basica', 'Esta prueba corresponde a una evaluacion de reforsamiento a los alumnos del ramo de matematicas.', '2015-07-31 15:16:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prueba_tag`
--

CREATE TABLE IF NOT EXISTS `prueba_tag` (
  `id_tag` int(11) NOT NULL,
  `id_prueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `prueba_tag`
--

INSERT INTO `prueba_tag` (`id_tag`, `id_prueba`) VALUES
(11, 1),
(11, 2),
(11, 3),
(11, 5),
(12, 5),
(12, 6),
(12, 7),
(12, 8),
(12, 9),
(12, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

CREATE TABLE IF NOT EXISTS `tag` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `tipo` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tag`
--

INSERT INTO `tag` (`id`, `id_usuario`, `nombre`, `tipo`) VALUES
(1, 1, 'primer tag', 'pregunta'),
(2, 2, 'primer tag test', 'pregunta'),
(3, 1, 'segundo tag', 'pregunta'),
(4, 1, 'tag_prueba', 'prueba'),
(5, 2, 'Matematicas', 'pregunta'),
(6, 2, 'Ciencias', 'pregunta'),
(7, 2, '3Âº Basico', 'pregunta'),
(8, 2, '4Âº Medio', 'pregunta'),
(11, 2, 'prueba1', 'prueba'),
(12, 2, 'prueba 2', 'prueba'),
(13, 2, 'nuevo tag', 'pregunta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `fechaCreacion` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `email`, `password`, `nombre`, `apellido`, `fechaCreacion`) VALUES
(1, 'jp.knap@gmail.com', '1234', 'Juan', 'Muñoz', '2015-06-03 00:00:00'),
(2, 'test', 'test', 'teste', 'test', '0000-00-00 00:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pregunta_prueba`
--
ALTER TABLE `pregunta_prueba`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pregunta` (`id_pregunta`),
  ADD KEY `id_prueba` (`id_prueba`);

--
-- Indices de la tabla `pregunta_tag`
--
ALTER TABLE `pregunta_tag`
  ADD PRIMARY KEY (`id_pregunta`,`id_tag`),
  ADD KEY `id_tag` (`id_tag`);

--
-- Indices de la tabla `pregunta_user`
--
ALTER TABLE `pregunta_user`
  ADD PRIMARY KEY (`id_usuario`,`id_pregunta`),
  ADD KEY `id_pregunta` (`id_pregunta`);

--
-- Indices de la tabla `prueba`
--
ALTER TABLE `prueba`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `prueba_tag`
--
ALTER TABLE `prueba_tag`
  ADD PRIMARY KEY (`id_tag`,`id_prueba`),
  ADD KEY `id_prueba` (`id_prueba`);

--
-- Indices de la tabla `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT de la tabla `pregunta_prueba`
--
ALTER TABLE `pregunta_prueba`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT de la tabla `prueba`
--
ALTER TABLE `prueba`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pregunta_prueba`
--
ALTER TABLE `pregunta_prueba`
  ADD CONSTRAINT `pregunta_prueba_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`),
  ADD CONSTRAINT `pregunta_prueba_ibfk_2` FOREIGN KEY (`id_prueba`) REFERENCES `prueba` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pregunta_tag`
--
ALTER TABLE `pregunta_tag`
  ADD CONSTRAINT `pregunta_tag_ibfk_1` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`),
  ADD CONSTRAINT `pregunta_tag_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tag` (`id`);

--
-- Filtros para la tabla `pregunta_user`
--
ALTER TABLE `pregunta_user`
  ADD CONSTRAINT `pregunta_user_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `pregunta_user_ibfk_2` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id`);

--
-- Filtros para la tabla `prueba`
--
ALTER TABLE `prueba`
  ADD CONSTRAINT `prueba_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `prueba_tag`
--
ALTER TABLE `prueba_tag`
  ADD CONSTRAINT `prueba_tag_ibfk_1` FOREIGN KEY (`id_tag`) REFERENCES `tag` (`id`),
  ADD CONSTRAINT `prueba_tag_ibfk_2` FOREIGN KEY (`id_prueba`) REFERENCES `prueba` (`id`);

--
-- Filtros para la tabla `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
