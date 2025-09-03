-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 03-09-2025 a las 20:09:53
-- Versión del servidor: 8.4.3
-- Versión de PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `seminario-integrador`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bebida`
--

CREATE TABLE `bebida` (
  `graduacion_alcoholica` double DEFAULT NULL,
  `tamanio` double DEFAULT NULL,
  `itemid` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `bebida`
--

INSERT INTO `bebida` (`graduacion_alcoholica`, `tamanio`, `itemid`) VALUES
(43, 432, 4),
(6, 52, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calificacion`
--

CREATE TABLE `calificacion` (
  `calificacionid` bigint NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `fecha_calificacion` datetime(6) NOT NULL,
  `puntaje` int NOT NULL,
  `pedidoid` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `categoriaid` bigint NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo` enum('BEBIDA','PLATO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `clienteid` bigint NOT NULL,
  `activo` bit(1) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `latitud` double DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `cuit` bigint NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`clienteid`, `activo`, `apellido`, `latitud`, `longitud`, `cuit`, `direccion`, `email`, `nombre`, `password`, `username`) VALUES
(1, b'1', 'Perez', -31.640438548138597, -60.703048474972384, 20345678901, 'Suipacha 1234, Ex-Plaza España, S3000 Santa Fe, Argentina', 'juan.perez@example.com', 'Juan', 'ClaveSegura1', 'juanperez'),
(2, b'1', 'hola', NULL, NULL, 25544588544, 'direccionfalsa 123', 'example@mail.com', 'prueba', 'ClaveSegura2', 'pruebauser'),
(3, b'1', 'Prueba', NULL, NULL, 12345678999, 'calle 123', 'jkraft@frsf.utn.edu.ar', 'Pepe', 'Clave1234', 'pruebapepe'),
(4, b'1', 'Cruz', NULL, NULL, 99887744556, 'calle 13', 'kraft.juancruz@gmail.com', 'Juan', 'Jkraft2025', 'jkraft'),
(5, b'1', 'Perez', NULL, NULL, 25444589402, 'calle 123s', 'example@mimail.com', 'Marcos', 'ClaveSegura1', 'marcosp'),
(6, b'1', 'hola', NULL, NULL, 25544588544, '', 'jkrafdsadast@frsf.utn.edu.ar', 'proj1', 'Clave1234', 'prueba1234'),
(7, b'1', 'Prueba', NULL, NULL, 12345678999, '', 'juankrdsadasuz.rik@live.com', 'Pepe', 'Clave11111', 'user11111'),
(8, b'1', 'hola', NULL, NULL, 12345678999, '', 'jkdsdsfraft@frsf.utn.edu.ar', 'Pepe', 'Prueba2222', 'prueba2222'),
(9, b'1', 'hola', NULL, NULL, 12345678999, '', 'kraft.juasfasffancruz@gmail.com', 'Pepe', 'Prueba3333', 'prueba3333'),
(10, b'1', 'hola', -31.6540529, -60.708886171428574, 12345678999, 'San Martín 1863, Centro, S3000 Santa Fe, Argentina', 'jkraft@frsf.utnfa.edu.arf', 'Pepe', 'Prueba4444', 'prueba4444'),
(11, b'1', 'Prueba', NULL, NULL, 20422635204, '', 'mail@ejemplo.com.ar', 'Prueba', 'Prueba123456', 'prueba123456'),
(12, b'1', 'gadsgsad', NULL, NULL, 99887744556, '', 'gasdgsadg@live.com', 'fdsagsd', 'Prueba987', 'prueba987'),
(13, b'1', 'cruz', -31.660582573469387, -60.71215492040817, 12345678911, 'San Jerónimo 1245, Centro, S3000 Santa Fe, Argentina', 'juan@mail.com.ar', 'juan', 'Prueba2608', 'jckraft'),
(14, b'1', 'juan', -34.75614254166667, -58.33743189583333, 12457896311, 'belgrano 504', 'mi@email.com', 'prueba1', 'Prueba2608', 'prueba2508'),
(16, b'1', 'Pepito', -31.608314204081633, -60.676391342857144, 12345678988, 'Boneo 950, San José, S3000 Santa Fe, Argentina', 'nico@mail.com', 'Nicolas', 'Hola1234', 'Nc707'),
(24, b'1', 'ara', NULL, NULL, 12345678901, '', 'tuu@gmail.com', 'celi', '$2a$10$vVjlCaXt.dsfJML72GlvHe.TPh4Qu5XVgreTWLThlnBr62oCzrnha', 'celi123'),
(26, b'1', 'Marchese', -31.61087763066281, -60.69615185761915, 20452174457, 'San Martín 6165, General Belgrano, S3000 Santa Fe, Argentina', 'luciano.marchese25@gmail.com', 'Luciano', '$2a$10$zku2ThEC1kR/SrKS8XZONe8sK.PX6HhfMOO.Ijcfe/8tlJX86ErWG', 'luchomarche');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_categoria`
--

CREATE TABLE `item_categoria` (
  `itemid` bigint NOT NULL,
  `categoriaid` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_menu`
--

CREATE TABLE `item_menu` (
  `tipo_item` varchar(31) NOT NULL,
  `itemid` bigint NOT NULL,
  `activo` bit(1) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `es_bebida` bit(1) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `peso` double NOT NULL,
  `precio` double NOT NULL,
  `stock` int NOT NULL,
  `vendedorid` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `item_menu`
--

INSERT INTO `item_menu` (`tipo_item`, `itemid`, `activo`, `descripcion`, `es_bebida`, `nombre`, `peso`, `precio`, `stock`, `vendedorid`) VALUES
('PLATO', 1, b'1', 'Empanadas de carne cortada a cuchillo', b'0', 'Empanada de Carne', 120, 1.5, 100, 1),
('PLATO', 2, b'1', 'Pizza grande de muzzarella con orégano', b'0', 'Pizza Muzzarella', 800, 6, 50, 2),
('PLATO', 3, b'1', 'Parrillada completa para dos personas', b'0', 'Parrillada', 1200, 15, 20, 3),
('BEBIDA', 4, b'1', 'Gaseosa cola 500ml', b'1', 'Coca-Cola 500ml', 0.5, 1.2, 80, 1),
('BEBIDA', 5, b'1', 'Cerveza rubia artesanal 330ml', b'1', 'Cerveza Artesanal', 0.33, 2.5, 40, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_pedido`
--

CREATE TABLE `item_pedido` (
  `itempedidoid` bigint NOT NULL,
  `cantidad` int NOT NULL,
  `subtotal` double NOT NULL,
  `itemid` bigint DEFAULT NULL,
  `pedidoid` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id` bigint NOT NULL,
  `archivo_facturapdf` varchar(255) DEFAULT NULL,
  `estado` tinyint DEFAULT NULL,
  `fecha_emision` datetime(6) DEFAULT NULL,
  `metodo_pago` enum('TARJETA_CREDITO','TARJETA_DEBITO','TRANSFERENCIA') DEFAULT NULL,
  `monto` double DEFAULT NULL,
  `numero_factura` varchar(255) DEFAULT NULL,
  `resumen` varchar(255) DEFAULT NULL,
  `pedido_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_credito`
--

CREATE TABLE `pago_credito` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_debito`
--

CREATE TABLE `pago_debito` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago_transferencia`
--

CREATE TABLE `pago_transferencia` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `pedidoid` bigint NOT NULL,
  `calificado` bit(1) DEFAULT NULL,
  `costo_envio` double DEFAULT NULL,
  `distancia_envio` double DEFAULT NULL,
  `estado` tinyint NOT NULL,
  `fecha_confirmacion` datetime(6) DEFAULT NULL,
  `fecha_modificacion` datetime(6) DEFAULT NULL,
  `modificado` bit(1) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `clienteid` bigint NOT NULL,
  `vendedorid` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`pedidoid`, `calificado`, `costo_envio`, `distancia_envio`, `estado`, `fecha_confirmacion`, `fecha_modificacion`, `modificado`, `precio`, `clienteid`, `vendedorid`) VALUES
(3, b'0', 0, 0, 0, NULL, NULL, b'0', NULL, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plato`
--

CREATE TABLE `plato` (
  `calorias` float DEFAULT NULL,
  `itemid` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `plato`
--

INSERT INTO `plato` (`calorias`, `itemid`) VALUES
(2354, 1),
(2354, 2),
(52345, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedor`
--

CREATE TABLE `vendedor` (
  `vendedorid` bigint NOT NULL,
  `activo` bit(1) NOT NULL,
  `calificacion_promedio` double DEFAULT NULL,
  `latitud` double DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `vendedor`
--

INSERT INTO `vendedor` (`vendedorid`, `activo`, `calificacion_promedio`, `latitud`, `longitud`, `direccion`, `nombre`) VALUES
(1, b'1', NULL, -31.4167, -64.1833, 'Av. Colón 1234, Córdoba', 'Don Empanada'),
(2, b'1', NULL, -34.6037, -58.3816, 'Calle Florida 456, CABA', 'Pizza Planet'),
(3, b'0', NULL, -32.9478, -60.6303, 'Bv. Oroño 789, Rosario', 'La Parrilla de Juan'),
(4, b'1', NULL, -34.9205, -57.9536, 'Calle 7 N° 321, La Plata', 'Hamburguesas El Rey'),
(5, b'1', NULL, -38.0055, -57.5426, 'Av. Colón 999, Mar del Plata', 'Sushi Mar'),
(6, b'0', NULL, -27.4606, -58.9839, 'Mitre 1111, Resistencia', 'Comidas del Norte');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bebida`
--
ALTER TABLE `bebida`
  ADD PRIMARY KEY (`itemid`);

--
-- Indices de la tabla `calificacion`
--
ALTER TABLE `calificacion`
  ADD PRIMARY KEY (`calificacionid`),
  ADD UNIQUE KEY `UK2s6c4qn1ncr821x4el1yt8d6u` (`pedidoid`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`categoriaid`),
  ADD UNIQUE KEY `UK35t4wyxqrevf09uwx9e9p6o75` (`nombre`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`clienteid`);

--
-- Indices de la tabla `item_categoria`
--
ALTER TABLE `item_categoria`
  ADD PRIMARY KEY (`itemid`,`categoriaid`),
  ADD KEY `FK1o6svfk40p5qp4ggyn2p7dxap` (`categoriaid`);

--
-- Indices de la tabla `item_menu`
--
ALTER TABLE `item_menu`
  ADD PRIMARY KEY (`itemid`),
  ADD KEY `FK610dcydjoedftpkevh6t6ue0x` (`vendedorid`);

--
-- Indices de la tabla `item_pedido`
--
ALTER TABLE `item_pedido`
  ADD PRIMARY KEY (`itempedidoid`),
  ADD KEY `FK9cj94ewem4t1bi8j8n4efsspr` (`itemid`),
  ADD KEY `FK4d55x4on6qtjfwd8qkjx1geda` (`pedidoid`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK8fojprqy7kv7k3d192m91e027` (`pedido_id`);

--
-- Indices de la tabla `pago_credito`
--
ALTER TABLE `pago_credito`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pago_debito`
--
ALTER TABLE `pago_debito`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pago_transferencia`
--
ALTER TABLE `pago_transferencia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`pedidoid`),
  ADD KEY `FKbd1gamksts2v8e7gus6weqn4c` (`clienteid`),
  ADD KEY `FKl1w58rnuvc2pw53w37ia7h46n` (`vendedorid`);

--
-- Indices de la tabla `plato`
--
ALTER TABLE `plato`
  ADD PRIMARY KEY (`itemid`);

--
-- Indices de la tabla `vendedor`
--
ALTER TABLE `vendedor`
  ADD PRIMARY KEY (`vendedorid`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calificacion`
--
ALTER TABLE `calificacion`
  MODIFY `calificacionid` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `categoriaid` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `clienteid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `item_menu`
--
ALTER TABLE `item_menu`
  MODIFY `itemid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `item_pedido`
--
ALTER TABLE `item_pedido`
  MODIFY `itempedidoid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago_credito`
--
ALTER TABLE `pago_credito`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago_debito`
--
ALTER TABLE `pago_debito`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago_transferencia`
--
ALTER TABLE `pago_transferencia`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `pedidoid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `vendedor`
--
ALTER TABLE `vendedor`
  MODIFY `vendedorid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bebida`
--
ALTER TABLE `bebida`
  ADD CONSTRAINT `FK5nn3y0x7vnnsty3eoydlwgyd9` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`);

--
-- Filtros para la tabla `calificacion`
--
ALTER TABLE `calificacion`
  ADD CONSTRAINT `FKmocp6nyyq4fspgbghpeddyrta` FOREIGN KEY (`pedidoid`) REFERENCES `pedido` (`pedidoid`);

--
-- Filtros para la tabla `item_categoria`
--
ALTER TABLE `item_categoria`
  ADD CONSTRAINT `FK1o6svfk40p5qp4ggyn2p7dxap` FOREIGN KEY (`categoriaid`) REFERENCES `categoria` (`categoriaid`),
  ADD CONSTRAINT `FKcjxvbnivlp9o3lhawbcpdtub8` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`);

--
-- Filtros para la tabla `item_menu`
--
ALTER TABLE `item_menu`
  ADD CONSTRAINT `FK610dcydjoedftpkevh6t6ue0x` FOREIGN KEY (`vendedorid`) REFERENCES `vendedor` (`vendedorid`);

--
-- Filtros para la tabla `item_pedido`
--
ALTER TABLE `item_pedido`
  ADD CONSTRAINT `FK4d55x4on6qtjfwd8qkjx1geda` FOREIGN KEY (`pedidoid`) REFERENCES `pedido` (`pedidoid`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK9cj94ewem4t1bi8j8n4efsspr` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `FK8fojprqy7kv7k3d192m91e027` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`pedidoid`);

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `FKbd1gamksts2v8e7gus6weqn4c` FOREIGN KEY (`clienteid`) REFERENCES `cliente` (`clienteid`),
  ADD CONSTRAINT `FKl1w58rnuvc2pw53w37ia7h46n` FOREIGN KEY (`vendedorid`) REFERENCES `vendedor` (`vendedorid`);

--
-- Filtros para la tabla `plato`
--
ALTER TABLE `plato`
  ADD CONSTRAINT `FK65vxagg2p1lygsc6w1gn2m410` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
