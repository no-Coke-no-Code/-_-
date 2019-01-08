/*
Navicat MySQL Data Transfer

Source Server         : coke43
Source Server Version : 50559
Source Host           : localhost:3306
Source Database       : test1

Target Server Type    : MYSQL
Target Server Version : 50559
File Encoding         : 65001

Date: 2019-01-08 19:33:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `address_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `address_name` varchar(100) NOT NULL,
  `user_id` int(10) NOT NULL,
  `address_status` int(10) NOT NULL,
  `user_phone` int(20) NOT NULL,
  `user_realname` varchar(8) NOT NULL,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of address
-- ----------------------------

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `admin_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `admin_password` varchar(20) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `user_nickname` varchar(100) NOT NULL,
  `good_id` int(10) NOT NULL,
  PRIMARY KEY (`good_id`,`user_nickname`),
  KEY `user_nickname` (`user_nickname`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_nickname`) REFERENCES `user` (`user_nickname`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES ('coke43', '0');
INSERT INTO `cart` VALUES ('coke43', '3');
INSERT INTO `cart` VALUES ('coke43', '5');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', '海鲜');
INSERT INTO `category` VALUES ('2', '蔬菜');

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection` (
  `good_id` int(10) NOT NULL,
  `user_nickname` varchar(100) NOT NULL,
  PRIMARY KEY (`good_id`,`user_nickname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of collection
-- ----------------------------
INSERT INTO `collection` VALUES ('0', 'coke43');
INSERT INTO `collection` VALUES ('3', 'coke43');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` int(10) NOT NULL,
  `comment_content` varchar(300) NOT NULL,
  `good_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for foreign_good
-- ----------------------------
DROP TABLE IF EXISTS `foreign_good`;
CREATE TABLE `foreign_good` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`,`good_name`),
  KEY `good_name` (`good_name`),
  CONSTRAINT `foreign_good_ibfk_1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of foreign_good
-- ----------------------------
INSERT INTO `foreign_good` VALUES ('1', '上海青瓜');
INSERT INTO `foreign_good` VALUES ('4', '土猪肉');
INSERT INTO `foreign_good` VALUES ('2', '大白菜心');
INSERT INTO `foreign_good` VALUES ('3', '波士顿龙虾');
INSERT INTO `foreign_good` VALUES ('5', '西洋菜');

-- ----------------------------
-- Table structure for good
-- ----------------------------
DROP TABLE IF EXISTS `good`;
CREATE TABLE `good` (
  `good_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  `good_price` float(10,2) NOT NULL,
  `category_name` varchar(10) NOT NULL,
  `good_imgurl` varchar(255) NOT NULL,
  `good_detail` varchar(255) NOT NULL,
  `good_unit` varchar(10) NOT NULL,
  `good_from` varchar(255) NOT NULL,
  PRIMARY KEY (`good_id`,`good_name`),
  KEY `good_name` (`good_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of good
-- ----------------------------
INSERT INTO `good` VALUES ('2', '上海青瓜', '10.00', '蔬菜', '@/../static/pic/vagetable1/shengcai1.jpg', '新鲜爽口', '斤', '上海');
INSERT INTO `good` VALUES ('3', '大白菜心', '3.00', '蔬菜', '@/../static/pic/vagetable1/shengcai2.jpg', '河南大白菜', '斤', '河南');
INSERT INTO `good` VALUES ('4', '波士顿龙虾', '360.00', '海鲜', '@/../static/pic/vagetable1/shengcai2.jpg', '新鲜大龙虾', '只', '美国');
INSERT INTO `good` VALUES ('5', '土猪肉', '20.00', '肉类', '@/../static/pic/vagetable1/shengcai2.jpg', '新鲜土猪肉', '斤', '广东');
INSERT INTO `good` VALUES ('6', '西洋菜', '5.00', '蔬菜', '@/../static/pic/vagetable1/shengcai2.jpg', '鲜美西洋菜', '斤', '广东');

-- ----------------------------
-- Table structure for newest_good
-- ----------------------------
DROP TABLE IF EXISTS `newest_good`;
CREATE TABLE `newest_good` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`,`good_name`),
  KEY `good_name` (`good_name`),
  CONSTRAINT `newest_good_ibfk_1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of newest_good
-- ----------------------------
INSERT INTO `newest_good` VALUES ('1', '上海青瓜');
INSERT INTO `newest_good` VALUES ('4', '土猪肉');
INSERT INTO `newest_good` VALUES ('2', '大白菜心');
INSERT INTO `newest_good` VALUES ('3', '波士顿龙虾');
INSERT INTO `newest_good` VALUES ('5', '西洋菜');

-- ----------------------------
-- Table structure for orderitem
-- ----------------------------
DROP TABLE IF EXISTS `orderitem`;
CREATE TABLE `orderitem` (
  `orderItem_id` int(10) NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  `good_count` int(10) NOT NULL,
  `good_price` float(10,2) DEFAULT NULL,
  `orderList_id` int(10) unsigned NOT NULL,
  `orderItem_priceSub` float(10,0) DEFAULT NULL,
  `good_imgurl` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orderItem_id`),
  KEY `orderList_id` (`orderList_id`),
  KEY `good_name` (`good_name`),
  CONSTRAINT `orderitem_ibfk_1` FOREIGN KEY (`orderList_id`) REFERENCES `orderlist` (`orderList_id`) ON UPDATE CASCADE,
  CONSTRAINT `orderitem_ibfk_2` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orderitem
-- ----------------------------
INSERT INTO `orderitem` VALUES ('2', '大白菜心', '1', '3.00', '4', '3', null);
INSERT INTO `orderitem` VALUES ('3', '上海青瓜', '1', '10.00', '5', '10', null);
INSERT INTO `orderitem` VALUES ('4', '上海青瓜', '1', '10.00', '6', '10', null);
INSERT INTO `orderitem` VALUES ('5', '大白菜心', '1', '3.00', '5', '3', null);

-- ----------------------------
-- Table structure for orderlist
-- ----------------------------
DROP TABLE IF EXISTS `orderlist`;
CREATE TABLE `orderlist` (
  `orderList_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_nickname` varchar(100) NOT NULL,
  `orderList_state` varchar(255) NOT NULL,
  `orderList_startTime` datetime DEFAULT NULL,
  `orderList_finishTime` datetime DEFAULT NULL,
  `orderList_price` int(20) DEFAULT NULL,
  `user_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orderList_id`),
  KEY `user_nickname` (`user_nickname`) USING BTREE,
  KEY `user_address` (`user_address`),
  CONSTRAINT `orderlist_ibfk_1` FOREIGN KEY (`user_nickname`) REFERENCES `user` (`user_nickname`) ON UPDATE CASCADE,
  CONSTRAINT `orderlist_ibfk_2` FOREIGN KEY (`user_address`) REFERENCES `user` (`user_address`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orderlist
-- ----------------------------
INSERT INTO `orderlist` VALUES ('4', 'coke43', 'f', '2018-12-06 00:05:33', '2018-12-07 00:05:38', '3', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('5', 'coke43', 'b', '2018-12-06 09:18:07', null, '13', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('6', 'coke43', 'b', '2018-12-06 09:18:48', null, '10', '广东省广州市荔湾区西华路18号604');

-- ----------------------------
-- Table structure for superior_good
-- ----------------------------
DROP TABLE IF EXISTS `superior_good`;
CREATE TABLE `superior_good` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`,`good_name`),
  KEY `good_name` (`good_name`),
  CONSTRAINT `superior_good_ibfk_1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of superior_good
-- ----------------------------
INSERT INTO `superior_good` VALUES ('1', '上海青瓜');
INSERT INTO `superior_good` VALUES ('4', '土猪肉');
INSERT INTO `superior_good` VALUES ('2', '大白菜心');
INSERT INTO `superior_good` VALUES ('3', '波士顿龙虾');
INSERT INTO `superior_good` VALUES ('5', '西洋菜');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_nickname` varchar(100) NOT NULL,
  `user_phone` char(20) DEFAULT NULL,
  `user_address` varchar(255) DEFAULT NULL,
  `user_sex` varchar(4) DEFAULT NULL,
  `user_email` varchar(20) DEFAULT NULL,
  `user_realname` char(8) DEFAULT NULL,
  `user_password` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`user_nickname`),
  KEY `user_nickname` (`user_nickname`),
  KEY `user_address` (`user_address`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'coke43', '13808820102', '广东省广州市荔湾区西华路18号604', 'm', '1456751226@qq.com', '庾荣亮', 'coke43');
