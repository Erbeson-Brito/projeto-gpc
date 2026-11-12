-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gpc
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `alunos`
--

DROP TABLE IF EXISTS `alunos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `objetivo_profissional` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nivel_experiencia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `alunos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES `alunos` WRITE;
/*!40000 ALTER TABLE `alunos` DISABLE KEYS */;
INSERT INTO `alunos` VALUES (1,2,'Ser Desenvolvedor Backend Júnior','Iniciante'),(2,3,'Reciclar conhecimentos básicos','Sênior');
/*!40000 ALTER TABLE `alunos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulos`
--

DROP TABLE IF EXISTS `modulos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `trilha_id` bigint NOT NULL,
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ordem` int NOT NULL DEFAULT '1',
  `descricao` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `trilha_id` (`trilha_id`),
  CONSTRAINT `modulos_ibfk_1` FOREIGN KEY (`trilha_id`) REFERENCES `trilhas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulos`
--

LOCK TABLES `modulos` WRITE;
/*!40000 ALTER TABLE `modulos` DISABLE KEYS */;
INSERT INTO `modulos` VALUES (1,1,'Lógica de Programação',1,'Fundamentos de algoritmos, estruturas de decisão e repetição.'),(2,1,'Java Básico',2,'Sintaxe da linguagem, tipos primitivos, arrays e controle de fluxo.'),(3,1,'Programação Orientada a Objetos (POO)',3,'Classes, objetos, encapsulamento, herança e polimorfismo.');
/*!40000 ALTER TABLE `modulos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nos`
--

DROP TABLE IF EXISTS `nos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `modulo_id` bigint NOT NULL,
  `titulo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `conteudo` text COLLATE utf8mb4_unicode_ci,
  `ordem` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `modulo_id` (`modulo_id`),
  CONSTRAINT `nos_ibfk_1` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nos`
--

LOCK TABLES `nos` WRITE;
/*!40000 ALTER TABLE `nos` DISABLE KEYS */;
INSERT INTO `nos` VALUES (1,1,'Variáveis e Operadores','Conceito de memória, atribuição e operações lógicas/aritméticas.',1),(2,1,'Estruturas Condicionais','Uso de if/else e switch-case.',2),(3,2,'Configuração de Ambiente e Sintaxe Java','Instalação do JDK, estrutura da classe Main e método main.',1),(4,2,'Estruturas de Repetição em Java','Laços for, while e do-while em Java.',2),(5,3,'Classes e Instâncias','Definição de moldes e criação de instâncias com new.',1),(6,3,'Encapsulamento e Modificadores','Getters, setters e visibilidade private/public.',2);
/*!40000 ALTER TABLE `nos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papeis`
--

DROP TABLE IF EXISTS `papeis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papeis` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papeis`
--

LOCK TABLES `papeis` WRITE;
/*!40000 ALTER TABLE `papeis` DISABLE KEYS */;
INSERT INTO `papeis` VALUES (5,'ADMIN'),(1,'ALUNO'),(2,'PROFESSOR'),(4,'RECRUTADOR'),(3,'TUTOR');
/*!40000 ALTER TABLE `papeis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pre_requisitos`
--

DROP TABLE IF EXISTS `pre_requisitos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pre_requisitos` (
  `no_id` bigint NOT NULL,
  `no_requisito_id` bigint NOT NULL,
  PRIMARY KEY (`no_id`,`no_requisito_id`),
  KEY `no_requisito_id` (`no_requisito_id`),
  CONSTRAINT `pre_requisitos_ibfk_1` FOREIGN KEY (`no_id`) REFERENCES `nos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pre_requisitos_ibfk_2` FOREIGN KEY (`no_requisito_id`) REFERENCES `nos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pre_requisitos`
--

LOCK TABLES `pre_requisitos` WRITE;
/*!40000 ALTER TABLE `pre_requisitos` DISABLE KEYS */;
INSERT INTO `pre_requisitos` VALUES (2,1),(5,3);
/*!40000 ALTER TABLE `pre_requisitos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professores`
--

DROP TABLE IF EXISTS `professores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `especialidade` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biografia` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `professores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professores`
--

LOCK TABLES `professores` WRITE;
/*!40000 ALTER TABLE `professores` DISABLE KEYS */;
INSERT INTO `professores` VALUES (1,3,'Arquitetura Java e Banco de Dados','Mestre em Ciência da Computação, especialista em MySQL e JPA.');
/*!40000 ALTER TABLE `professores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progresso_usuario`
--

DROP TABLE IF EXISTS `progresso_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progresso_usuario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `no_id` bigint NOT NULL,
  `concluido` tinyint(1) DEFAULT '0',
  `data_conclusao` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_no` (`usuario_id`,`no_id`),
  KEY `no_id` (`no_id`),
  CONSTRAINT `progresso_usuario_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `progresso_usuario_ibfk_2` FOREIGN KEY (`no_id`) REFERENCES `nos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progresso_usuario`
--

LOCK TABLES `progresso_usuario` WRITE;
/*!40000 ALTER TABLE `progresso_usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `progresso_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questoes`
--

DROP TABLE IF EXISTS `questoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questoes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `no_id` bigint NOT NULL,
  `enunciado` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `gabarito` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dificuldade` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'FACIL',
  PRIMARY KEY (`id`),
  KEY `no_id` (`no_id`),
  CONSTRAINT `questoes_ibfk_1` FOREIGN KEY (`no_id`) REFERENCES `nos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questoes`
--

LOCK TABLES `questoes` WRITE;
/*!40000 ALTER TABLE `questoes` DISABLE KEYS */;
INSERT INTO `questoes` VALUES (1,1,'Qual operador representa a negação lógica em programação?','!','FACIL'),(2,2,'Em qual cenário a cláusula else é acionada?','Quando a condição do if for falsa.','FACIL'),(3,3,'Qual a assinatura correta do método principal de uma aplicação Java?','public static void main(String[] args)','MEDIA'),(4,5,'Qual palavra-chave é utilizada para instanciar um novo objeto em Java?','new','FACIL');
/*!40000 ALTER TABLE `questoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recrutadores`
--

DROP TABLE IF EXISTS `recrutadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recrutadores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `empresa` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cargo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `recrutadores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recrutadores`
--

LOCK TABLES `recrutadores` WRITE;
/*!40000 ALTER TABLE `recrutadores` DISABLE KEYS */;
INSERT INTO `recrutadores` VALUES (2,4,'Tech Talent Solutions','Tech Recruiter Sênior');
/*!40000 ALTER TABLE `recrutadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trilhas`
--

DROP TABLE IF EXISTS `trilhas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trilhas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_unicode_ci,
  `ativo` tinyint(1) DEFAULT '1',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trilhas`
--

LOCK TABLES `trilhas` WRITE;
/*!40000 ALTER TABLE `trilhas` DISABLE KEYS */;
INSERT INTO `trilhas` VALUES (1,'Desenvolvimento Backend','Trilha voltada para arquitetura de software, lógica e linguagens server-side.',1,'2026-09-28 15:47:14');
/*!40000 ALTER TABLE `trilhas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tutores`
--

DROP TABLE IF EXISTS `tutores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tutores` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `area_atuacao` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `biografia` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `tutores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tutores`
--

LOCK TABLES `tutores` WRITE;
/*!40000 ALTER TABLE `tutores` DISABLE KEYS */;
/*!40000 ALTER TABLE `tutores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_papeis`
--

DROP TABLE IF EXISTS `usuario_papeis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_papeis` (
  `usuario_id` bigint NOT NULL,
  `papel_id` bigint NOT NULL,
  PRIMARY KEY (`usuario_id`,`papel_id`),
  KEY `papel_id` (`papel_id`),
  CONSTRAINT `usuario_papeis_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_papeis_ibfk_2` FOREIGN KEY (`papel_id`) REFERENCES `papeis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_papeis`
--

LOCK TABLES `usuario_papeis` WRITE;
/*!40000 ALTER TABLE `usuario_papeis` DISABLE KEYS */;
INSERT INTO `usuario_papeis` VALUES (2,1),(3,1),(3,2),(4,4),(1,5);
/*!40000 ALTER TABLE `usuario_papeis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_conta` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'ATIVA',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Admin','admin@gpc.edu.br','$2a$10$hashSimuladoAqui1','ATIVA','2026-09-28 15:47:14'),(2,'Aluno Demonstração','aluno.demo@gpc.edu.br','$2a$10$hashSimuladoAqui2','ATIVA','2026-09-28 15:47:14'),(3,'João Professor','professor.joao@gpc.edu.br','$2a$10$hashSimuladoAqui3','ATIVA','2026-09-28 15:47:14'),(4,'Thomas Recrutador','recrutador.thomas@gpc.com','$2a$10$hashSimuladoAqui4','ATIVA','2026-09-28 15:59:52');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificacoes_profissionais`
--

DROP TABLE IF EXISTS `verificacoes_profissionais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verificacoes_profissionais` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `usuario_id` bigint NOT NULL,
  `tipo_perfil` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'PENDENTE',
  `data_solicitacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_analise` timestamp NULL DEFAULT NULL,
  `analisado_por` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `analisado_por` (`analisado_por`),
  CONSTRAINT `verificacoes_profissionais_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `verificacoes_profissionais_ibfk_2` FOREIGN KEY (`analisado_por`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificacoes_profissionais`
--

LOCK TABLES `verificacoes_profissionais` WRITE;
/*!40000 ALTER TABLE `verificacoes_profissionais` DISABLE KEYS */;
INSERT INTO `verificacoes_profissionais` VALUES (1,3,'PROFESSOR','APROVADO','2026-09-20 14:00:00','2026-09-28 15:47:14',1),(3,4,'RECRUTADOR','APROVADO','2026-09-28 15:59:52','2026-09-28 15:59:52',1);
/*!40000 ALTER TABLE `verificacoes_profissionais` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-28 12:24:55
