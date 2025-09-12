-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 10-09-2025 a las 01:25:58
-- Versión del servidor: 8.0.30
-- Versión de PHP: 8.1.10

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
(0, 0.5, 7),
(0, 0.5, 8),
(0, 0.5, 9),
(0, 0.5, 10),
(5, 250, 17),
(6, 250, 18),
(0, 500, 19),
(0, 500, 20);

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

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`categoriaid`, `nombre`, `tipo`) VALUES
(1, 'Hamburguesas', 'PLATO'),
(2, 'Papas Fritas', 'PLATO'),
(3, 'Postres', 'PLATO'),
(4, 'Combos', 'PLATO'),
(5, 'Gaseosas', 'BEBIDA'),
(6, 'Aguas', 'BEBIDA'),
(7, 'Cafes', 'BEBIDA'),
(8, 'Cerveza', 'BEBIDA'),
(9, 'Vino', 'BEBIDA'),
(10, 'Licuados', 'BEBIDA'),
(11, 'Sin TACC', 'PLATO'),
(12, 'Vegetariano', 'PLATO'),
(13, 'Vegano', 'PLATO'),
(14, 'Bebidas Alcoholicas', 'BEBIDA'),
(15, 'Infusiones', 'BEBIDA'),
(16, 'Panificados', 'PLATO'),
(17, 'Sin azucar', 'BEBIDA');

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
(1, b'1', 'Kraft', -31.6540529, -60.708886171428574, 20422635204, 'San Martín 1863, General Belgrano, S3000 Santa Fe, Argentina', 'juan@mail.com.ar', 'Juan Cruz', '$2a$10$2mxRLLHfgGjqt/788/tWqecta52d6ig2ha2uhzpBHm3oASYabZVUS', 'jkraft');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `item_categoria`
--

CREATE TABLE `item_categoria` (
  `itemid` bigint NOT NULL,
  `categoriaid` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `item_categoria`
--

INSERT INTO `item_categoria` (`itemid`, `categoriaid`) VALUES
(1, 1),
(2, 1),
(3, 1),
(11, 1),
(4, 2),
(14, 2),
(6, 3),
(16, 3),
(7, 5),
(8, 5),
(9, 5),
(19, 5),
(10, 6),
(20, 6),
(17, 8),
(18, 8),
(5, 11),
(6, 11),
(15, 11),
(16, 11),
(6, 12),
(16, 12),
(17, 14),
(18, 14),
(12, 16),
(13, 16),
(10, 17);

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
('PLATO', 1, b'1', 'Hamburguesa doble carne con queso cheddar y pan con semillas de sésamo', b'0', 'Doble Cheeseburger', 250, 7500, 50, 1),
('PLATO', 2, b'1', 'Hamburguesa con dos medallones de carne, queso cheddar, lechuga, pepinos, cebolla y salsa especial', b'0', 'Big Mac', 300, 6900, 45, 1),
('PLATO', 3, b'1', 'Hamburguesa simple con carne, queso, ketchup y mostaza', b'0', 'Hamburguesa Simple con Queso', 180, 4500, 60, 1),
('PLATO', 4, b'1', 'Papas fritas medianas crujientes con sal', b'0', 'Papas Fritas Medianas', 150, 3000, 80, 1),
('PLATO', 5, b'1', 'Nuggets de pollo crocantes x10 unidades', b'0', 'Chicken McNuggets 10u', 200, 6500, 70, 1),
('PLATO', 6, b'1', 'Helado con cobertura de chocolate caliente', b'0', 'Sundae de Chocolate', 120, 3800, 40, 1),
('BEBIDA', 7, b'1', 'Gaseosa Coca-Cola vaso 500ml', b'1', 'Coca-Cola 500ml', 500, 1500, 100, 1),
('BEBIDA', 8, b'1', 'Gaseosa Sprite vaso 500ml', b'1', 'Sprite 500ml', 500, 1500, 100, 1),
('BEBIDA', 9, b'1', 'Gaseosa Fanta vaso 500ml', b'1', 'Fanta 500ml', 500, 1500, 150, 1),
('BEBIDA', 10, b'1', 'Agua mineral sin gas 500ml', b'1', 'Agua Mineral 500ml', 500, 900, 90, 1),
('PLATO', 11, b'1', 'Hamburguesa doble carne con queso cheddar y pan con semillas de sésamo', b'0', 'Doble Cheeseburger', 250, 9500, 50, 3),
('PLATO', 12, b'1', 'Pizza para compartir', b'0', 'Pizza especial XL', 500, 9900, 45, 3),
('PLATO', 13, b'1', 'Sandwich tostado de jamon y queso', b'0', 'Sandwich tostado JyQ con pan artesanal', 180, 4500, 60, 3),
('PLATO', 14, b'1', 'Papas fritas  crujientes con salsa de cheddar', b'0', 'Papas Fritas con Cheddar', 150, 3000, 80, 3),
('PLATO', 15, b'1', 'Pizza apta para celiacos', b'0', 'Pizza Sin TACC individual', 200, 6500, 70, 3),
('PLATO', 16, b'1', 'Helado de 3 gustos', b'0', 'Copa de Helado 3 sabores', 120, 3800, 40, 3),
('BEBIDA', 17, b'1', 'Liso santafesino', b'1', 'Liso', 250, 500, 1000, 3),
('BEBIDA', 18, b'1', 'Liso negro santafesino', b'1', 'Liso Negro', 250, 800, 1000, 3),
('BEBIDA', 19, b'1', 'Coca cola  botella 500ml', b'1', 'Coca Cola 500ml', 500, 1900, 50, 3),
('BEBIDA', 20, b'1', 'Agua mineral sin gas 500ml', b'1', 'Agua Mineral 500ml', 500, 1000, 120, 3);

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
) ;

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
) ;

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
(850, 1),
(1100, 2),
(500, 3),
(320, 4),
(900, 5),
(280, 6),
(850, 11),
(1200, 12),
(600, 13),
(500, 14),
(750, 15),
(450, 16);

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
(1, b'1', NULL, -31.6509282, -60.7080422, 'San Martín 2139, S3000 Santa Fe de la Vera Cruz, Santa Fe', 'McDonalds'),
(2, b'1', NULL, -31.6156198, -60.6733385, 'Cngo. Echagüe 6209, S3006DHE Santa Fe de la Vera Cruz, Santa Fe', 'La Cazuela'),
(3, b'1', NULL, -31.6355818, -60.7045688, 'San Jerónimo 3498, S3000 Santa Fe de la Vera Cruz, Santa Fe', 'Chopería Santa Fe'),
(4, b'1', NULL, -31.6373096, -60.7163403, 'Av. Gdor. Freyre 3101, S3000EPW Santa Fe de la Vera Cruz, Santa Fe', 'Bar El Parque'),
(5, b'1', NULL, -31.6385389, -60.6948274, 'Balcarce 2000, 3000 Santa Fe de la Vera Cruz, Santa Fe', 'Bowie Bar'),
(6, b'1', NULL, -31.6396609, -60.6784425, 'Costanera Este S/N, S3000 Santa Fe de la Vera Cruz, Santa Fe', '1980 Costanera Este'),
(7, b'1', NULL, -31.6222509, -60.6875415, 'Av. Gral. Paz 5201, S3002 Santa Fe de la Vera Cruz, Santa Fe', 'Zulma Ale Café'),
(8, b'1', NULL, -31.5963536, -60.7119866, 'Av. Ángel V. Peñaloza 7350, S3000 Santa Fe de la Vera Cruz, Santa Fe', 'La Braseria'),
(9, b'1', NULL, -31.6384583, -60.6909624, 'Mitre, S3002 Santa Fe de la Vera Cruz, Santa Fe', 'Pastelería de Gladys'),
(10, b'1', NULL, -31.6439124, -60.7141171, 'Francia 2599, S3000FCH Santa Fe de la Vera Cruz, Santa Fe', 'Kiosco de Empanadas');

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
  MODIFY `categoriaid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `clienteid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `item_menu`
--
ALTER TABLE `item_menu`
  MODIFY `itemid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `item_pedido`
--
ALTER TABLE `item_pedido`
  MODIFY `itempedidoid` bigint NOT NULL AUTO_INCREMENT;

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
  MODIFY `pedidoid` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vendedor`
--
ALTER TABLE `vendedor`
  MODIFY `vendedorid` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
