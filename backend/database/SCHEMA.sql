-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: pms
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'ADMIN','Administration','2026-08-30 05:31:12','2026-08-30 05:31:12'),(2,'HR','Human Resources','2026-08-30 05:31:12','2026-08-30 05:31:12'),(3,'FIN','Finance','2026-08-30 05:31:12','2026-08-30 05:31:12'),(4,'IT','Information Technology','2026-08-30 05:31:12','2026-08-30 05:31:12'),(5,'OPS','Operations','2026-08-30 05:31:12','2026-08-30 05:31:12'),(6,'SALES','Sales','2026-08-30 05:31:12','2026-08-30 05:31:12'),(7,'MKT','Marketing','2026-08-30 05:31:12','2026-08-30 05:31:12'),(8,'ACCT','Accounting','2026-08-30 05:31:12','2026-08-30 05:31:12'),(9,'CS','Customer Service','2026-08-30 05:31:12','2026-08-30 05:31:12'),(10,'LEGAL','Legal','2026-08-30 05:31:12','2026-08-30 05:31:12');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_no` varchar(20) NOT NULL,
  `biometric_id` varchar(100) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `prefix` varchar(20) DEFAULT NULL,
  `first_name` varchar(200) DEFAULT NULL,
  `middle_name` varchar(200) DEFAULT NULL,
  `last_name` varchar(200) DEFAULT NULL,
  `suffix` varchar(20) DEFAULT NULL,
  `street1` varchar(500) DEFAULT NULL,
  `street2` varchar(500) DEFAULT NULL,
  `city` varchar(200) DEFAULT NULL,
  `province` varchar(200) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `home_phone` varchar(20) DEFAULT NULL,
  `mobile_phone` varchar(20) DEFAULT NULL,
  `email_address` varchar(200) DEFAULT NULL,
  `spouse_name` varchar(500) DEFAULT NULL,
  `spouse_occupation` varchar(500) DEFAULT NULL,
  `emergency_name` varchar(500) DEFAULT NULL,
  `emergency_address` varchar(500) DEFAULT NULL,
  `emergency_phone` varchar(20) DEFAULT NULL,
  `sex` varchar(10) DEFAULT NULL,
  `civil_status` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `citizenship` varchar(100) DEFAULT NULL,
  `tin_no` varchar(20) DEFAULT NULL,
  `sss_no` varchar(20) DEFAULT NULL,
  `philhealth_no` varchar(20) DEFAULT NULL,
  `pagibig_no` varchar(20) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `date_hired` date DEFAULT NULL,
  `type_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `job_title_id` int DEFAULT NULL,
  `sched_in` time DEFAULT NULL,
  `sched_out` time DEFAULT NULL,
  `pay_type` int DEFAULT NULL,
  `yearly_count` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `min_allow` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employee_no` (`employee_no`),
  UNIQUE KEY `biometric_id` (`biometric_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_job_title_id` (`job_title_id`),
  KEY `idx_type_id` (`type_id`),
  KEY `idx_is_active` (`is_active`),
  CONSTRAINT `fk_employee_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (11,'EMP-0001','BIO-10001','employees/EMP-0001.jpg','Mr.','Juan','Santos','Dela Cruz',NULL,NULL,NULL,'Iligan City','Lanao del Norte','9200',NULL,'09171234567','juan.delacruz@example.com',NULL,NULL,'Maria Dela Cruz','123 Rizal Street, Iligan City','09181234567','Male','Married','1990-03-15','Iligan City','Catholic','Filipino','TIN-DUMMY-001','SSS-DUMMY-001','PH-DUMMY-001','PAG-DUMMY-001','Regular employee','2020-01-15',1,1,1,'08:00:00','17:00:00',1,12,1,500.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(12,'EMP-0002','BIO-10002','employees/EMP-0002.jpg','Ms.','Maria','Angela','Reyes',NULL,NULL,NULL,'Cagayan de Oro City','Misamis Oriental','9000',NULL,'09181234568','maria.reyes@example.com',NULL,NULL,'Ana Reyes','45 Quezon Avenue, Cagayan de Oro City','09191234568','Female','Single','1995-07-22','Cagayan de Oro City','Catholic','Filipino','TIN-DUMMY-002','SSS-DUMMY-002','PH-DUMMY-002','PAG-DUMMY-002',NULL,'2021-03-01',1,2,2,'08:00:00','17:00:00',1,10,1,450.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(13,'EMP-0003','BIO-10003','employees/EMP-0003.jpg','Mr.','Michael','Jose','Garcia','Jr.',NULL,NULL,'Iligan City','Lanao del Norte','9200',NULL,'09201234567','michael.garcia@example.com',NULL,NULL,'Robert Garcia','88 Bonifacio Street, Iligan City','09211234567','Male','Married','1988-11-10','Iligan City','Catholic','Filipino','TIN-DUMMY-003','SSS-DUMMY-003','PH-DUMMY-003','PAG-DUMMY-003','Team supervisor','2019-06-10',1,3,3,'08:30:00','17:30:00',1,15,1,750.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(14,'EMP-0004','BIO-10004',NULL,'Mrs.','Jennifer','Marie','Tan',NULL,NULL,NULL,'Iligan City','Lanao del Norte','9200',NULL,'09221234567','jennifer.tan@example.com',NULL,NULL,'Daniel Tan','17 Macapagal Road, Iligan City','09231234567','Female','Married','1992-02-28','Cebu City','Catholic','Filipino','TIN-DUMMY-004','SSS-DUMMY-004','PH-DUMMY-004','PAG-DUMMY-004',NULL,'2022-02-14',2,4,4,'09:00:00','18:00:00',1,8,1,400.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(15,'EMP-0005','BIO-10005','employees/EMP-0005.jpg','Mr.','Robert','James','Wilson',NULL,NULL,NULL,'Marawi City','Lanao del Sur','9700',NULL,'09321234567','robert.wilson@example.com',NULL,NULL,'James Wilson','201 Mabini Street, Marawi City','09331234567','Male','Single','1997-09-05','Marawi City','Christian','Filipino','TIN-DUMMY-005','SSS-DUMMY-005','PH-DUMMY-005','PAG-DUMMY-005','Probationary employee','2025-01-06',2,5,5,'08:00:00','17:00:00',1,6,1,300.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(16,'EMP-0006','BIO-10006','employees/EMP-0006.jpg','Ms.','Sarah','Anne','Lim',NULL,NULL,NULL,'Cagayan de Oro City','Misamis Oriental','9000',NULL,'09421234567','sarah.lim@example.com',NULL,NULL,'Grace Lim','55 Velez Street, Cagayan de Oro City','09431234567','Female','Single','1998-12-18','Cagayan de Oro City','Catholic','Filipino','TIN-DUMMY-006','SSS-DUMMY-006','PH-DUMMY-006','PAG-DUMMY-006',NULL,'2024-04-15',1,4,6,'08:00:00','17:00:00',1,5,1,350.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(17,'EMP-0007','BIO-10007',NULL,'Mr.','Anthony','Ramon','Fernandez',NULL,NULL,NULL,'Iligan City','Lanao del Norte','9200',NULL,'09521234567','anthony.fernandez@example.com',NULL,NULL,'Carlos Fernandez','90 Del Pilar Street, Iligan City','09531234567','Male','Married','1985-06-30','Davao City','Catholic','Filipino','TIN-DUMMY-007','SSS-DUMMY-007','PH-DUMMY-007','PAG-DUMMY-007','Senior staff','2017-08-21',1,1,7,'07:30:00','16:30:00',1,20,1,850.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(18,'EMP-0008','BIO-10008','employees/EMP-0008.jpg','Mrs.','Catherine','Rose','Mendoza',NULL,NULL,NULL,'Iligan City','Lanao del Norte','9200',NULL,'09621234567','catherine.mendoza@example.com',NULL,NULL,'Mark Mendoza','33 Zamora Street, Iligan City','09631234567','Female','Married','1991-10-12','Iligan City','Catholic','Filipino','TIN-DUMMY-008','SSS-DUMMY-008','PH-DUMMY-008','PAG-DUMMY-008',NULL,'2020-11-02',1,3,8,'08:00:00','17:00:00',2,12,1,600.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(19,'EMP-0009','BIO-10009',NULL,'Mr.','David','Lee','Chua',NULL,NULL,NULL,'Ozamiz City','Misamis Occidental','7200',NULL,'09721234567','david.chua@example.com',NULL,NULL,'Peter Chua','71 Aguinaldo Street, Ozamiz City','09731234567','Male','Single','1996-04-25','Ozamiz City','Christian','Filipino','TIN-DUMMY-009','SSS-DUMMY-009','PH-DUMMY-009','PAG-DUMMY-009','Currently inactive','2023-05-08',2,4,9,'09:00:00','18:00:00',1,4,0,250.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(20,'EMP-0010','BIO-10010','employees/EMP-0010.jpg','Ms.','Michelle','Grace','Navarro',NULL,NULL,NULL,'Iligan City','Lanao del Norte','9200',NULL,'09821234567','michelle.navarro@example.com',NULL,NULL,'Rose Navarro','14 Luna Street, Iligan City','09831234567','Female','Single','1999-01-17','Iligan City','Catholic','Filipino','TIN-DUMMY-010','SSS-DUMMY-010','PH-DUMMY-010','PAG-DUMMY-010','New employee','2026-01-12',1,2,10,'08:00:00','17:00:00',1,2,1,300.00,'2026-08-30 05:31:31','2026-08-30 05:31:31'),(21,'kennethupdatedasdf','asdfasdfasdf',NULL,NULL,'asdfasdf',NULL,'asdfasdf',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-08-27',NULL,1,1,'00:00:00','00:00:00',1,5,1,230.00,'2026-08-30 08:25:30','2026-08-30 14:44:02'),(22,'adfafqqwerw','werwqrewrq',NULL,'','asdfasdf','','asdfasdf','','','','','','','','','','','','','','','','','2026-08-23','','','','','','','','','2026-08-24',NULL,1,1,'00:00:00','00:00:00',2,NULL,1,0.00,'2026-08-30 08:26:56','2026-08-30 08:26:56'),(23,'09876','12345',NULL,'','KENO','','MIRAL','','','','','','','','','','','','','','','','','2026-08-23','','','','','','','','','2026-08-30',NULL,1,NULL,'00:00:00','00:00:00',1,NULL,1,0.00,'2026-08-30 08:50:51','2026-08-30 08:50:51'),(24,'1234','1234',NULL,'','Herra','','Miral','','','','','','','','','','','','','','','','','2026-08-29','','','','','','','','','2026-08-30',NULL,9,NULL,'00:00:00','00:00:00',1,NULL,1,0.00,'2026-08-30 12:44:30','2026-08-30 12:44:30'),(25,'1231dsdfdf','23234234fg',NULL,'','April','','Cabunoc','','','','','','','','','','','','','','','Female','Married','2026-04-30','','','','','','','','','2026-08-30',NULL,8,NULL,'00:00:00','00:00:00',NULL,NULL,1,0.00,'2026-08-30 12:58:59','2026-08-30 12:58:59'),(26,'234234234','234234234',NULL,'Mr.','Dexter jim',NULL,'Abrigana',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Male','Single','2026-08-07','Laguindingan Mis. Or.','Catholic','filipino',NULL,NULL,NULL,NULL,NULL,'2026-08-30',NULL,8,NULL,'00:00:00','00:00:00',NULL,NULL,1,0.00,'2026-08-30 14:45:25','2026-08-31 05:37:38');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobtitle`
--

DROP TABLE IF EXISTS `jobtitle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobtitle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(10) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobtitle`
--

LOCK TABLES `jobtitle` WRITE;
/*!40000 ALTER TABLE `jobtitle` DISABLE KEYS */;
INSERT INTO `jobtitle` VALUES (1,'DEV','Web Developer'),(2,'SE','Software Engineer'),(3,'ITSUP','IT Support Specialist'),(4,'HR','HR Officer'),(5,'ACCT','Accountant'),(6,'FIN','Finance Officer'),(7,'MGR','Manager'),(8,'SUP','Supervisor'),(9,'ADMIN','Administrative Assistant'),(10,'REC','Recruitment Specialist'),(11,'SALES','Sales Representative'),(12,'MARK','Marketing Specialist'),(13,'QA','Quality Assurance'),(14,'DESIGN','Graphic Designer'),(15,'OPS','Operations Officer');
/*!40000 ALTER TABLE `jobtitle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_accounts`
--

DROP TABLE IF EXISTS `user_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `employee_id` int DEFAULT NULL,
  `user_type_id` int DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `last_name` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_user_type_id` (`user_type_id`),
  CONSTRAINT `fk_user_account_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_accounts`
--

LOCK TABLES `user_accounts` WRITE;
/*!40000 ALTER TABLE `user_accounts` DISABLE KEYS */;
INSERT INTO `user_accounts` VALUES (1,'admin','$2a$12$.NRP3DL/0Z3uhF6Gfjj5jOpNG97o1s5A7UL/w47f9LxxYJTYagyfK',NULL,NULL,1,'Miral','Kenneth','Garcia','2026-08-28 13:16:02','2026-08-28 13:17:28');
/*!40000 ALTER TABLE `user_accounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-31 14:12:30
