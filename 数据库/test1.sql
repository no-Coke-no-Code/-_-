/*
Navicat MySQL Data Transfer

Source Server         : coke43
Source Server Version : 50559
Source Host           : localhost:3306
Source Database       : test1

Target Server Type    : MYSQL
Target Server Version : 50559
File Encoding         : 65001

Date: 2019-03-18 00:32:45
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `admin_account` varchar(100) DEFAULT NULL,
  `admin_password` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('1', 'admin', 'admin');

-- ----------------------------
-- Table structure for adminreply
-- ----------------------------
DROP TABLE IF EXISTS `adminreply`;
CREATE TABLE `adminreply` (
  `reply_id` int(10) NOT NULL AUTO_INCREMENT,
  `reply_comment_id` int(10) DEFAULT NULL,
  `reply_content` varchar(255) DEFAULT NULL,
  `reply_to_id` int(10) DEFAULT NULL,
  `reply_to_nickname` varchar(100) DEFAULT NULL,
  `admin_account` varchar(100) DEFAULT NULL,
  `reply_time` datetime DEFAULT NULL,
  `good_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`reply_id`),
  KEY `user_nickname3` (`reply_to_nickname`),
  KEY `good_name3` (`good_name`),
  CONSTRAINT `good_name3` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_nickname3` FOREIGN KEY (`reply_to_nickname`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of adminreply
-- ----------------------------
INSERT INTO `adminreply` VALUES ('1', '7', '谢谢支持哈哈', '2', 'coke34', 'admin', '2019-03-07 23:34:29', '大白菜心');
INSERT INTO `adminreply` VALUES ('2', '13', '谢谢您的支持', '1', 'coke43', 'admin', '2019-03-16 12:13:42', '上海青瓜');
INSERT INTO `adminreply` VALUES ('3', '5', '谢谢支持哈哈', '2', 'coke34', 'admin', '2019-03-16 12:36:46', '上海青瓜');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `user_nickname` varchar(100) NOT NULL,
  `good_id` int(10) NOT NULL,
  PRIMARY KEY (`good_id`,`user_nickname`),
  KEY `cart_ibfk_1` (`user_nickname`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_nickname`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES ('coke43', '12');
INSERT INTO `cart` VALUES ('coke43', '14');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('6', '水果');
INSERT INTO `category` VALUES ('4', '河鲜');
INSERT INTO `category` VALUES ('1', '海鲜');
INSERT INTO `category` VALUES ('10', '烘培糕点');
INSERT INTO `category` VALUES ('3', '肉类');
INSERT INTO `category` VALUES ('2', '蔬菜');
INSERT INTO `category` VALUES ('9', '豆制品');
INSERT INTO `category` VALUES ('8', '零食');
INSERT INTO `category` VALUES ('7', '饮料');

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection` (
  `good_name` varchar(100) NOT NULL,
  `user_id` int(10) NOT NULL,
  `good_id` int(10) NOT NULL,
  `user_nickname` varchar(100) NOT NULL,
  PRIMARY KEY (`good_id`,`user_id`),
  KEY `user_name1` (`user_nickname`),
  KEY `good_name1` (`good_name`),
  CONSTRAINT `good_name1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_name1` FOREIGN KEY (`user_nickname`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of collection
-- ----------------------------
INSERT INTO `collection` VALUES ('大白菜心', '2', '3', 'coke34');
INSERT INTO `collection` VALUES ('鲈鱼', '1', '12', 'coke43');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comment_id` int(10) NOT NULL AUTO_INCREMENT,
  `comment_content` varchar(300) NOT NULL,
  `good_name` varchar(100) NOT NULL,
  `user_id` int(10) DEFAULT NULL,
  `user_nickname` varchar(100) DEFAULT NULL,
  `comment_rank` int(10) DEFAULT NULL,
  `comment_time` datetime NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `good_name` (`good_name`),
  KEY `user_nickname11` (`user_nickname`),
  CONSTRAINT `good_name` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_nickname11` FOREIGN KEY (`user_nickname`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('5', 'aa+', '上海青瓜', '2', 'coke34', '4', '2019-03-07 17:45:21');
INSERT INTO `comment` VALUES ('6', '很新鲜，很不错', '大白菜心', '1', 'coke43', '5', '2019-03-07 22:42:38');
INSERT INTO `comment` VALUES ('7', '还是可以的   ', '大白菜心', '2', 'coke34', '4', '2019-03-07 23:34:29');
INSERT INTO `comment` VALUES ('13', '不错不错', '上海青瓜', '1', 'coke43', '4', '2019-03-16 12:11:36');

-- ----------------------------
-- Table structure for foreign_good
-- ----------------------------
DROP TABLE IF EXISTS `foreign_good`;
CREATE TABLE `foreign_good` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  `good_id` int(10) NOT NULL,
  PRIMARY KEY (`id`,`good_name`,`good_id`),
  KEY `foreign_good_ibfk_1` (`good_name`),
  CONSTRAINT `foreign_good_ibfk_1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of foreign_good
-- ----------------------------
INSERT INTO `foreign_good` VALUES ('1', '上海青瓜', '2');
INSERT INTO `foreign_good` VALUES ('4', '土猪肉', '5');
INSERT INTO `foreign_good` VALUES ('2', '大白菜心', '3');
INSERT INTO `foreign_good` VALUES ('3', '波士顿龙虾', '4');
INSERT INTO `foreign_good` VALUES ('5', '西洋菜', '6');

-- ----------------------------
-- Table structure for good
-- ----------------------------
DROP TABLE IF EXISTS `good`;
CREATE TABLE `good` (
  `good_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  `good_price` float(10,2) NOT NULL,
  `category_name` varchar(10) DEFAULT NULL,
  `good_imgurl` varchar(255) NOT NULL,
  `good_detail` varchar(255) NOT NULL,
  `good_unit` varchar(10) NOT NULL,
  `good_from` varchar(255) NOT NULL,
  `subCatalog_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`good_id`,`good_name`),
  KEY `good_name` (`good_name`),
  KEY `good_id` (`good_id`),
  KEY `catalog_name11` (`category_name`),
  KEY `subCatalog_name11` (`subCatalog_name`),
  CONSTRAINT `catalog_name11` FOREIGN KEY (`category_name`) REFERENCES `category` (`category_name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `subCatalog_name11` FOREIGN KEY (`subCatalog_name`) REFERENCES `subcatalog` (`subCatalog_name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of good
-- ----------------------------
INSERT INTO `good` VALUES ('2', '上海青瓜', '10.00', '蔬菜', '@/../static/pic/goodImg/20192123380_上海青瓜.jpg', '新鲜爽口', '斤', '上海', '瓜果');
INSERT INTO `good` VALUES ('3', '大白菜心', '3.00', '蔬菜', '@/../static/pic/vagetable1/shengcai2.jpg', '河南大白菜', '斤', '河南', '绿叶菜');
INSERT INTO `good` VALUES ('4', '波士顿龙虾', '360.00', '海鲜', '@/../static/pic/vagetable1/shengcai2.jpg', '新鲜大龙虾', '只', '美国', '虾');
INSERT INTO `good` VALUES ('5', '土猪肉', '20.00', '肉类', '@/../static/pic/vagetable1/shengcai2.jpg', '新鲜土猪肉', '斤', '广东', '猪');
INSERT INTO `good` VALUES ('6', '西洋菜', '5.00', '蔬菜', '@/../static/pic/vagetable1/shengcai2.jpg', '鲜美西洋菜', '斤', '广东', '绿叶菜');
INSERT INTO `good` VALUES ('7', '安格斯牛肉', '50.00', '肉类', '@/../static/pic/goodImg/20192134755_安格斯牛肉.jpg', '鲜嫩的牛肉', '斤', '阿根廷', '牛');
INSERT INTO `good` VALUES ('12', '鲈鱼', '10.00', '河鲜', '', '新鲜大鲈鱼', '斤', '广东', '河鱼');
INSERT INTO `good` VALUES ('16', '三黄鸡', '20.00', '肉类', '@/../static/pic/goodImg/20193173010_三黄鸡.jpg', '新鲜的三黄鸡', '斤', '广东', '鸡');
INSERT INTO `good` VALUES ('17', '草鱼', '10.00', '河鲜', '@/../static/pic/goodImg/20193185950_草鱼.jpg', '新鲜的草鱼', '斤', '广东', '河鱼');
INSERT INTO `good` VALUES ('18', '猪颈肉', '30.00', '肉类', '', '新鲜猪颈肉', '500克', '广西', '猪');

-- ----------------------------
-- Table structure for newest_good
-- ----------------------------
DROP TABLE IF EXISTS `newest_good`;
CREATE TABLE `newest_good` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  `good_id` int(10) NOT NULL,
  PRIMARY KEY (`id`,`good_name`,`good_id`),
  KEY `newest_good_ibfk_1` (`good_name`),
  CONSTRAINT `newest_good_ibfk_1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of newest_good
-- ----------------------------
INSERT INTO `newest_good` VALUES ('1', '上海青瓜', '2');
INSERT INTO `newest_good` VALUES ('4', '土猪肉', '5');
INSERT INTO `newest_good` VALUES ('2', '大白菜心', '3');
INSERT INTO `newest_good` VALUES ('3', '波士顿龙虾', '4');

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
  `ifComment` int(10) DEFAULT NULL,
  PRIMARY KEY (`orderItem_id`),
  KEY `orderitem_ibfk_1` (`orderList_id`),
  KEY `orderitem_ibfk_2` (`good_name`),
  CONSTRAINT `orderitem_ibfk_1` FOREIGN KEY (`orderList_id`) REFERENCES `orderlist` (`orderList_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orderitem
-- ----------------------------
INSERT INTO `orderitem` VALUES ('34', '上海青瓜', '1', '10.00', '47', '10', '@/../static/pic/vagetable1/shengcai1.jpg', '1');
INSERT INTO `orderitem` VALUES ('35', '大白菜心', '2', '3.00', '47', '6', '@/../static/pic/vagetable1/shengcai2.jpg', '0');
INSERT INTO `orderitem` VALUES ('36', '上海青瓜', '1', '10.00', '48', '10', '@/../static/pic/vagetable1/shengcai1.jpg', '1');
INSERT INTO `orderitem` VALUES ('37', '上海青瓜', '1', '10.00', '49', '10', '@/../static/pic/vagetable1/shengcai1.jpg', '0');
INSERT INTO `orderitem` VALUES ('38', '上海青瓜', '1', '10.00', '50', '10', '@/../static/pic/vagetable1/shengcai1.jpg', '0');
INSERT INTO `orderitem` VALUES ('39', '上海青瓜', '1', '10.00', '51', '10', '@/../static/pic/vagetable1/shengcai1.jpg', '1');
INSERT INTO `orderitem` VALUES ('40', '大白菜心', '1', '3.00', '51', '3', '@/../static/pic/vagetable1/shengcai2.jpg', '0');
INSERT INTO `orderitem` VALUES ('41', '土猪肉', '1', '20.00', '52', '20', '@/../static/pic/vagetable1/shengcai2.jpg', '0');
INSERT INTO `orderitem` VALUES ('42', '上海青瓜', '1', '10.00', '53', '10', '@/../static/pic/vagetable1/shengcai1.jpg', '0');
INSERT INTO `orderitem` VALUES ('49', '草鱼', '1', '10.00', '60', '10', '', null);

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
  `user_phone` varchar(20) DEFAULT '',
  `user_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orderList_id`),
  KEY `user_nickname` (`user_nickname`) USING BTREE,
  KEY `user_address` (`user_address`),
  CONSTRAINT `orderlist_ibfk_1` FOREIGN KEY (`user_nickname`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orderlist
-- ----------------------------
INSERT INTO `orderlist` VALUES ('47', 'coke43', 'f', '2019-01-26 14:34:16', '2019-02-04 16:34:34', '16', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('48', 'coke34', 'f', '2019-01-31 17:16:30', '2019-02-05 00:47:47', '10', '123123', '你猜猜');
INSERT INTO `orderlist` VALUES ('49', 'coke34', 'b', '2019-01-31 17:21:54', null, '10', '123123', '你猜猜');
INSERT INTO `orderlist` VALUES ('50', 'coke34', 'b', '2019-01-31 17:25:12', null, '10', '123123', '你猜猜');
INSERT INTO `orderlist` VALUES ('51', 'coke34', 'f', '2019-01-31 17:32:41', '2019-03-07 23:34:34', '13', '123123', '你猜猜');
INSERT INTO `orderlist` VALUES ('52', 'coke34', 'b', '2019-01-31 17:37:32', null, '20', '123123', '你猜猜');
INSERT INTO `orderlist` VALUES ('53', 'coke43', 'b', '2019-02-05 17:08:58', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('54', 'coke43', 'b', '2019-03-15 00:14:07', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('55', 'coke43', 'b', '2019-03-15 10:58:58', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('56', 'coke43', 'b', '2019-03-15 11:00:00', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('57', 'coke43', 'b', '2019-03-15 11:16:33', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('58', 'coke43', 'b', '2019-03-15 11:18:28', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('59', 'coke43', 'b', '2019-03-15 11:19:46', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('60', 'coke43', 'b', '2019-03-17 00:49:09', null, '10', '13808820102', '广东省广州市荔湾区西华路18号604');

-- ----------------------------
-- Table structure for salecount
-- ----------------------------
DROP TABLE IF EXISTS `salecount`;
CREATE TABLE `salecount` (
  `good_id` int(10) NOT NULL,
  `good_name` varchar(100) NOT NULL,
  `sale_number` int(100) DEFAULT NULL,
  `sale_sum` int(100) DEFAULT NULL,
  PRIMARY KEY (`good_id`,`good_name`),
  KEY `goodName1` (`good_name`),
  CONSTRAINT `goodName1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of salecount
-- ----------------------------

-- ----------------------------
-- Table structure for subcatalog
-- ----------------------------
DROP TABLE IF EXISTS `subcatalog`;
CREATE TABLE `subcatalog` (
  `subCatalog_id` int(11) NOT NULL AUTO_INCREMENT,
  `catalog_name` varchar(100) DEFAULT NULL,
  `subCatalog_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`subCatalog_id`),
  KEY `subCatalog_name` (`subCatalog_name`),
  KEY `catalog_name1` (`catalog_name`),
  CONSTRAINT `catalog_name1` FOREIGN KEY (`catalog_name`) REFERENCES `category` (`category_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of subcatalog
-- ----------------------------
INSERT INTO `subcatalog` VALUES ('1', '海鲜', '螃蟹');
INSERT INTO `subcatalog` VALUES ('3', '蔬菜', '瓜果');
INSERT INTO `subcatalog` VALUES ('4', '蔬菜', '绿叶菜');
INSERT INTO `subcatalog` VALUES ('5', '海鲜', '虾');
INSERT INTO `subcatalog` VALUES ('6', '肉类', '猪');
INSERT INTO `subcatalog` VALUES ('7', '肉类', '牛');
INSERT INTO `subcatalog` VALUES ('8', '河鲜', '河鱼');
INSERT INTO `subcatalog` VALUES ('14', '肉类', '鸡');

-- ----------------------------
-- Table structure for superior_good
-- ----------------------------
DROP TABLE IF EXISTS `superior_good`;
CREATE TABLE `superior_good` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `good_name` varchar(100) NOT NULL,
  `good_id` int(10) NOT NULL,
  PRIMARY KEY (`id`,`good_name`,`good_id`),
  KEY `superior_good_ibfk_1` (`good_name`),
  CONSTRAINT `superior_good_ibfk_1` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of superior_good
-- ----------------------------
INSERT INTO `superior_good` VALUES ('23', '鲈鱼', '12');

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
  `user_headImg` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`user_nickname`),
  KEY `user_nickname` (`user_nickname`),
  KEY `user_address` (`user_address`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'coke43', '13808820102', '广东省广州市荔湾区西华路18号604', 'm', '1456751226@qq.com', '庾荣亮', 'coke43', '@/../static/pic/userHeadImg/20193189784_headImg.jpg');
INSERT INTO `user` VALUES ('2', 'coke34', '12312312345', '你猜猜', 'm', 'wu', 'AK', 'coke34', '2019258519_headImg.jpg');
