-- MySQL dump 10.13  Distrib 8.4.5, for Linux (x86_64)
--
-- Host: localhost    Database: seminario-integrador
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bebida`
--

DROP TABLE IF EXISTS `bebida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bebida` (
  `graduacion_alcoholica` double DEFAULT NULL,
  `tamanio` double DEFAULT NULL,
  `itemid` bigint NOT NULL,
  PRIMARY KEY (`itemid`),
  CONSTRAINT `FK5nn3y0x7vnnsty3eoydlwgyd9` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bebida`
--

LOCK TABLES `bebida` WRITE;
/*!40000 ALTER TABLE `bebida` DISABLE KEYS */;
INSERT INTO `bebida` VALUES (5,0.5,2),(0,0.5,4);
/*!40000 ALTER TABLE `bebida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calificacion`
--

DROP TABLE IF EXISTS `calificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calificacion` (
  `calificacionid` bigint NOT NULL AUTO_INCREMENT,
  `comentario` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_calificacion` datetime(6) NOT NULL,
  `puntaje` int NOT NULL,
  `pedidoid` bigint NOT NULL,
  PRIMARY KEY (`calificacionid`),
  UNIQUE KEY `UK2s6c4qn1ncr821x4el1yt8d6u` (`pedidoid`),
  CONSTRAINT `FKmocp6nyyq4fspgbghpeddyrta` FOREIGN KEY (`pedidoid`) REFERENCES `pedido` (`pedidoid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calificacion`
--

LOCK TABLES `calificacion` WRITE;
/*!40000 ALTER TABLE `calificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `calificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `categoriaid` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('BEBIDA','PLATO') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`categoriaid`),
  UNIQUE KEY `UK35t4wyxqrevf09uwx9e9p6o75` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `clienteid` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `latitud` double DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `cuit` bigint NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`clienteid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,_binary '','Pérez',NULL,NULL,20333444556,'Calle Falsa 123','juan.perez@example.com','Juan','Abcdefg1','juanperez');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_categoria`
--

DROP TABLE IF EXISTS `item_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_categoria` (
  `itemid` bigint NOT NULL,
  `categoriaid` bigint NOT NULL,
  PRIMARY KEY (`itemid`,`categoriaid`),
  KEY `FK1o6svfk40p5qp4ggyn2p7dxap` (`categoriaid`),
  CONSTRAINT `FK1o6svfk40p5qp4ggyn2p7dxap` FOREIGN KEY (`categoriaid`) REFERENCES `categoria` (`categoriaid`),
  CONSTRAINT `FKcjxvbnivlp9o3lhawbcpdtub8` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_categoria`
--

LOCK TABLES `item_categoria` WRITE;
/*!40000 ALTER TABLE `item_categoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_menu`
--

DROP TABLE IF EXISTS `item_menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_menu` (
  `tipo_item` varchar(31) COLLATE utf8mb4_unicode_ci NOT NULL,
  `itemid` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `es_bebida` bit(1) DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `peso` double NOT NULL,
  `precio` double NOT NULL,
  `stock` int NOT NULL,
  `vendedorid` bigint DEFAULT NULL,
  PRIMARY KEY (`itemid`),
  KEY `FK610dcydjoedftpkevh6t6ue0x` (`vendedorid`),
  CONSTRAINT `FK610dcydjoedftpkevh6t6ue0x` FOREIGN KEY (`vendedorid`) REFERENCES `vendedor` (`vendedorid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_menu`
--

LOCK TABLES `item_menu` WRITE;
/*!40000 ALTER TABLE `item_menu` DISABLE KEYS */;
INSERT INTO `item_menu` VALUES ('Plato',1,_binary '','Milanesa de carne con papas fritas',_binary '\0','Milanesa con papas',0.5,2500,20,1),('Bebida',2,_binary '','Cerveza artesanal 500ml',_binary '','Cerveza rubia',0.5,1200,50,1),('Plato',3,_binary '','Pizza con salsa de tomate, queso y albahaca',_binary '\0','Pizza napolitana',0.8,3000,15,2),('Bebida',4,_binary '','Jugo exprimido natural 500ml',_binary '','Jugo de naranja',0.5,800,30,2);
/*!40000 ALTER TABLE `item_menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_pedido`
--

DROP TABLE IF EXISTS `item_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_pedido` (
  `itempedidoid` bigint NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `subtotal` double NOT NULL,
  `itemid` bigint DEFAULT NULL,
  `pedidoid` bigint DEFAULT NULL,
  PRIMARY KEY (`itempedidoid`),
  KEY `FK9cj94ewem4t1bi8j8n4efsspr` (`itemid`),
  KEY `FK4d55x4on6qtjfwd8qkjx1geda` (`pedidoid`),
  CONSTRAINT `FK4d55x4on6qtjfwd8qkjx1geda` FOREIGN KEY (`pedidoid`) REFERENCES `pedido` (`pedidoid`) ON DELETE CASCADE,
  CONSTRAINT `FK9cj94ewem4t1bi8j8n4efsspr` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_pedido`
--

LOCK TABLES `item_pedido` WRITE;
/*!40000 ALTER TABLE `item_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `archivo_facturapdf` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` tinyint DEFAULT NULL,
  `fecha_emision` datetime(6) DEFAULT NULL,
  `metodo_pago` enum('TARJETA_CREDITO','TARJETA_DEBITO','TRANSFERENCIA') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto` double DEFAULT NULL,
  `numero_factura` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resumen` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pedido_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK8fojprqy7kv7k3d192m91e027` (`pedido_id`),
  CONSTRAINT `FK8fojprqy7kv7k3d192m91e027` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`pedidoid`),
  CONSTRAINT `pago_chk_1` CHECK ((`estado` between 0 and 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago_credito`
--

DROP TABLE IF EXISTS `pago_credito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago_credito` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago_credito`
--

LOCK TABLES `pago_credito` WRITE;
/*!40000 ALTER TABLE `pago_credito` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago_credito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago_debito`
--

DROP TABLE IF EXISTS `pago_debito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago_debito` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago_debito`
--

LOCK TABLES `pago_debito` WRITE;
/*!40000 ALTER TABLE `pago_debito` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago_debito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago_transferencia`
--

DROP TABLE IF EXISTS `pago_transferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago_transferencia` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago_transferencia`
--

LOCK TABLES `pago_transferencia` WRITE;
/*!40000 ALTER TABLE `pago_transferencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `pago_transferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `pedidoid` bigint NOT NULL AUTO_INCREMENT,
  `calificado` bit(1) NOT NULL,
  `costo_envio` double NOT NULL,
  `distancia_envio` double NOT NULL,
  `estado` tinyint NOT NULL,
  `fecha_confirmacion` datetime(6) NOT NULL,
  `fecha_modificacion` datetime(6) NOT NULL,
  `modificado` bit(1) NOT NULL,
  `precio` double NOT NULL,
  `clienteid` bigint NOT NULL,
  `vendedorid` bigint NOT NULL,
  PRIMARY KEY (`pedidoid`),
  KEY `FKbd1gamksts2v8e7gus6weqn4c` (`clienteid`),
  KEY `FKl1w58rnuvc2pw53w37ia7h46n` (`vendedorid`),
  CONSTRAINT `FKbd1gamksts2v8e7gus6weqn4c` FOREIGN KEY (`clienteid`) REFERENCES `cliente` (`clienteid`),
  CONSTRAINT `FKl1w58rnuvc2pw53w37ia7h46n` FOREIGN KEY (`vendedorid`) REFERENCES `vendedor` (`vendedorid`),
  CONSTRAINT `pedido_chk_1` CHECK ((`estado` between 0 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plato`
--

DROP TABLE IF EXISTS `plato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plato` (
  `calorias` float DEFAULT NULL,
  `itemid` bigint NOT NULL,
  PRIMARY KEY (`itemid`),
  CONSTRAINT `FK65vxagg2p1lygsc6w1gn2m410` FOREIGN KEY (`itemid`) REFERENCES `item_menu` (`itemid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plato`
--

LOCK TABLES `plato` WRITE;
/*!40000 ALTER TABLE `plato` DISABLE KEYS */;
INSERT INTO `plato` VALUES (850,1),(950,3);
/*!40000 ALTER TABLE `plato` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendedor`
--

DROP TABLE IF EXISTS `vendedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendedor` (
  `vendedorid` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `latitud` double DEFAULT NULL,
  `longitud` double DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`vendedorid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendedor`
--

LOCK TABLES `vendedor` WRITE;
/*!40000 ALTER TABLE `vendedor` DISABLE KEYS */;
INSERT INTO `vendedor` VALUES (1,_binary '',-34.6037,-58.3816,'Av. Corrientes 123, santa fe','Juan Prez'),(2,_binary '',-34.7,-58.4,'Av. Siempre Viva 742, CABA','Mara Lpez');
/*!40000 ALTER TABLE `vendedor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-16 17:17:16
