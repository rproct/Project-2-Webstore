-- MySQL dump 10.13  Distrib 5.7.31, for Linux (x86_64)
--
-- Host: localhost    Database: new_grass_db
-- ------------------------------------------------------
-- Server version	5.7.31-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `short_desc` varchar(50) DEFAULT NULL,
  `carried_quantity` int(11) DEFAULT NULL,
  `product_details_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `product_details_id` (`product_details_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`product_details_id`) REFERENCES `product_details` (`product_details_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Bent','https://www.chicagotribune.com/resizer/1RmPFP7fkuf5ojlCJw2WDnFg1Ys=/1200x0/top/arc-anglerfish-arc2-prod-tronc.s3.amazonaws.com/public/L6OBE5YOPZEWZP3GBGYTFP54II.jpg','A short and robust grass',212,1),(2,'Bermuda','https://grassseedwholesale.files.wordpress.com/2015/03/tumblr_inline_nmxkhtz3oz1tp0g9c_1280.jpg?w=355&h=266','A denser and robust grass.',303,2),(3,'Centipede','https://www.housemanpest.com/wp-content/uploads/2019/06/Houseman-Grass-Series-%E2%80%93-All-about-Centipede-Grass-1200x797.jpeg','A long and calm grass',279,3),(4,'Dichondria','https://www.scotts.com/sites/g/files/oydgjc106/files/styles/scotts_asset_image_720_440/public/asset_images/Dichondra.jpg?itok=u5ZvsN_q','A more leafy grass',121,4),(5,'Fine Fescue','https://i.pinimg.com/originals/a9/09/72/a9097262a7b086ea8dc428e4c60e1cd7.jpg','A very fine mixture',420,5),(6,'Kentucky Bluegrass','https://redhenturf.com/blog/wp-content/uploads/2018/01/KBG-field.jpg','A more tougher grass',354,6),(7,'Rye','https://www.naturesseed.com/media/cache/1200x400/e47cf16f3d5bd49571ce8f0606b63dc4/f/r/Fresh-Lawn-Grass-Seed.jpg','A classic, shiny grass',431,7),(8,'St. Augustine','https://blog.supersod.com/hubfs/staugistine_grass.jpg','A southern favorite',541,8),(9,'Tall Fescue','https://i.pinimg.com/originals/9c/b3/c4/9cb3c4da2276d1b89583c2504ad0cf82.jpg','An extremely tough grass',498,9),(10,'Zoysia','https://www.thespruce.com/thmb/xeuGDOxe8uJ4FpGfrKpdakeTRM0=/1976x1976/smart/filters:no_upscale()/GettyImages-511747120-dc031b421fd9422a8dde3f9dddf06295.jpg','A thick and tough grass',324,10);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_details`
--

DROP TABLE IF EXISTS `product_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_details` (
  `product_details_id` int(11) NOT NULL AUTO_INCREMENT,
  `color` varchar(20) DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `sq_ft` int(11) DEFAULT NULL,
  `long_description` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`product_details_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_details`
--

LOCK TABLES `product_details` WRITE;
/*!40000 ALTER TABLE `product_details` DISABLE KEYS */;
INSERT INTO `product_details` VALUES (1,'Soft green',5.98,1,'A fine grass that in small quantities greatly suffies. Being used in many ways, it is a quite dense grass that is soft to the touch and maintains its structure. Needs humidity.'),(2,'Deep green',8.46,2,'A common grass found across the Continental United States. It is an ideal grass as it roots deeply in use. Allowing a small amount to got quite the way when in use. Needs to be tended to.'),(3,'Light green',2.34,1,'A tall grass that need to be kept in a humid and warm environment. Very susceptible to heat. It will hibernate, and lose its quality when in a dry environment.'),(4,'Varies green',7.97,1,'A delicate grass that stems opposite on each strand. It\'s leaves create a nice surface that is preferred typically in Arizona and California. Requires maintenance.'),(5,'Dull green',4.98,2,'A more tougher grass that is a mix of other species. It typically will last a longer time in the shadow. It does not resist the heat nearly as well. Quite fine and dense.'),(6,'Dark green',7.33,2,'A nicely dealt with grass. Easily maintained and with a great root system, it helps on the texture. It is best to not keep in the shade.'),(7,'Dark green',6.90,2,'A shiny grass that is easy to spot and recognize. Most common in the mid United States. The grass does not take to cold temperatures, best to keep it in a ventilated area.'),(8,'Dark green',5.50,1,'A very coarse grass that needs to be in high humidity. A southern favorite due to the high humidity. It will wilt if in the cold and die.'),(9,'Dark green',3.40,1,'A tough grass that can withstand damage. Will last a long period of time due to its overall rigidty. While usually found in the north, it is quite common furhter south.'),(10,'Light green',2.90,1,'A tougher grass that is common to the Mid US. Takes a while to grow, but it is quite tough. It is, however, susceptible to the heat.');
/*!40000 ALTER TABLE `product_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shopping_cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `shopping_cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  CONSTRAINT `shopping_cart_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `username` varchar(30) DEFAULT NULL,
  `password` varchar(60) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-10-07 18:02:02
