/*
Navicat MySQL Data Transfer

Source Server         : coke43
Source Server Version : 50559
Source Host           : localhost:3306
Source Database       : test1

Target Server Type    : MYSQL
Target Server Version : 50559
File Encoding         : 65001

Date: 2019-04-29 16:48:38
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
INSERT INTO `category` VALUES ('3', '肉类');
INSERT INTO `category` VALUES ('2', '蔬菜');

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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES ('5', 'aa+', '上海青瓜', '2', 'coke34', '4', '2019-03-07 17:45:21');
INSERT INTO `comment` VALUES ('6', '很新鲜，很不错', '大白菜心', '1', 'coke43', '5', '2019-03-07 22:42:38');
INSERT INTO `comment` VALUES ('7', '还是可以的   ', '大白菜心', '2', 'coke34', '4', '2019-03-07 23:34:29');
INSERT INTO `comment` VALUES ('13', '不错不错', '上海青瓜', '1', 'coke43', '4', '2019-03-16 12:11:36');
INSERT INTO `comment` VALUES ('24', '还不错', '大白菜心', '1', 'coke43', '4', '2019-03-19 16:34:12');
INSERT INTO `comment` VALUES ('25', '再次购买，很新鲜，不错', '上海青瓜', '1', 'coke43', '4', '2019-04-06 23:14:00');

-- ----------------------------
-- Table structure for coupon
-- ----------------------------
DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coupon_name` varchar(255) DEFAULT NULL,
  `coupon_price` int(10) DEFAULT NULL,
  `user_nickname` varchar(100) DEFAULT NULL,
  `coupon_startTime` datetime DEFAULT NULL,
  `coupon_endTime` datetime DEFAULT NULL,
  `coupon_limit` int(10) DEFAULT NULL,
  `coupon_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `couponType` (`coupon_type`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of coupon
-- ----------------------------
INSERT INTO `coupon` VALUES ('19', '代金券', '5', 'coke43', '2019-04-08 00:00:00', '2019-04-30 23:59:59', '0', 'all');
INSERT INTO `coupon` VALUES ('20', '代金券', '10', 'coke43', '2019-04-17 00:00:00', '2019-04-30 23:59:59', '0', 'all');
INSERT INTO `coupon` VALUES ('21', '代金券', '10', 'coke43', '2019-04-17 00:00:00', '2019-04-30 23:59:59', '0', 'all');
INSERT INTO `coupon` VALUES ('22', '代金券', '10', 'coke43', '2019-04-17 00:00:00', '2019-04-30 23:59:59', '0', 'all');
INSERT INTO `coupon` VALUES ('24', '代金券', '5', 'coke43', '2019-04-25 00:00:00', '2019-04-30 23:59:59', '0', 'all');

-- ----------------------------
-- Table structure for credit
-- ----------------------------
DROP TABLE IF EXISTS `credit`;
CREATE TABLE `credit` (
  `credit_id` int(11) NOT NULL AUTO_INCREMENT,
  `credit_rank` varchar(100) NOT NULL,
  `credit_mark` int(10) DEFAULT NULL,
  `credit_discount` decimal(10,1) DEFAULT NULL,
  `credit_level` int(11) NOT NULL,
  PRIMARY KEY (`credit_id`,`credit_rank`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of credit
-- ----------------------------
INSERT INTO `credit` VALUES ('1', '普通会员', '100', '0.9', '1');
INSERT INTO `credit` VALUES ('2', '黄金会员', '300', '0.8', '2');
INSERT INTO `credit` VALUES ('3', '至尊会员', '500', '0.7', '3');

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
  `good_saleCount` int(10) DEFAULT '0',
  PRIMARY KEY (`good_id`,`good_name`),
  KEY `good_name` (`good_name`),
  KEY `good_id` (`good_id`),
  KEY `catalog_name11` (`category_name`),
  KEY `subCatalog_name11` (`subCatalog_name`),
  KEY `good_imgurl` (`good_imgurl`),
  CONSTRAINT `catalog_name11` FOREIGN KEY (`category_name`) REFERENCES `category` (`category_name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `subCatalog_name11` FOREIGN KEY (`subCatalog_name`) REFERENCES `subcatalog` (`subCatalog_name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of good
-- ----------------------------
INSERT INTO `good` VALUES ('2', '上海青瓜', '10.00', '蔬菜', '@/../static/pic/goodImg/20193181675_上海青瓜.jpg', '新鲜爽口', '斤', '上海', '瓜果', '0');
INSERT INTO `good` VALUES ('3', '大白菜心', '3.00', '蔬菜', '@/../static/pic/vagetable1/shengcai2.jpg', '河南大白菜', '斤', '河南', '绿叶菜', '6');
INSERT INTO `good` VALUES ('4', '波士顿龙虾', '360.00', '海鲜', '@/../static/pic/goodImg/20194255043_波士顿龙虾.jpg', '新鲜大龙虾', '只', '美国', '虾', '0');
INSERT INTO `good` VALUES ('5', '土猪肉', '20.00', '肉类', '@/../static/pic/goodImg/20194255987_土猪肉.jpg', '新鲜土猪肉', '斤', '广东', '猪', '1');
INSERT INTO `good` VALUES ('6', '西洋菜', '5.00', '蔬菜', '@/../static/pic/goodImg/20194253212_西洋菜.jpg', '鲜美西洋菜', '斤', '广东', '绿叶菜', '1');
INSERT INTO `good` VALUES ('7', '安格斯牛肉', '50.00', '肉类', '@/../static/pic/goodImg/20194259767_安格斯牛肉.jpg', '鲜嫩的牛肉', '斤', '阿根廷', '牛', '3');
INSERT INTO `good` VALUES ('12', '鲈鱼', '10.00', '河鲜', '@/../static/pic/goodImg/20194273440_鲈鱼.jpg', '新鲜大鲈鱼', '斤', '广东', '河鱼', '5');
INSERT INTO `good` VALUES ('16', '三黄鸡', '20.00', '肉类', '@/../static/pic/goodImg/20194258836_三黄鸡.jpg', '新鲜的三黄鸡', '斤', '广东', '鸡', '1');
INSERT INTO `good` VALUES ('17', '草鱼', '10.00', '河鲜', '@/../static/pic/goodImg/20194251834_草鱼.jpg', '新鲜的草鱼', '斤', '广东', '河鱼', '0');
INSERT INTO `good` VALUES ('18', '猪颈肉', '30.00', '肉类', '@/../static/pic/goodImg/20194252689_猪颈肉.jpg', '新鲜猪颈肉', '500克', '广西', '猪', '0');

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
  `good_unit` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`orderItem_id`),
  KEY `orderitem_ibfk_1` (`orderList_id`),
  KEY `order_good` (`good_name`),
  CONSTRAINT `order_good` FOREIGN KEY (`good_name`) REFERENCES `good` (`good_name`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `orderitem_ibfk_1` FOREIGN KEY (`orderList_id`) REFERENCES `orderlist` (`orderList_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orderitem
-- ----------------------------
INSERT INTO `orderitem` VALUES ('67', '上海青瓜', '1', '10.00', '72', '10', '@/../static/pic/goodImg/20193181675_上海青瓜.jpg', '1', '斤');
INSERT INTO `orderitem` VALUES ('77', '大白菜心', '1', '3.00', '81', '3', '@/../static/pic/vagetable1/shengcai2.jpg', '0', '斤');
INSERT INTO `orderitem` VALUES ('78', '西洋菜', '1', '5.00', '81', '5', '@/../static/pic/goodImg/20194253212_西洋菜.jpg', '0', '斤');
INSERT INTO `orderitem` VALUES ('79', '三黄鸡', '1', '20.00', '81', '20', '@/../static/pic/goodImg/20194258836_三黄鸡.jpg', '0', '斤');
INSERT INTO `orderitem` VALUES ('80', '安格斯牛肉', '3', '50.00', '82', '150', '@/../static/pic/goodImg/20194259767_安格斯牛肉.jpg', '0', '斤');
INSERT INTO `orderitem` VALUES ('81', '大白菜心', '6', '3.00', '83', '18', '@/../static/pic/vagetable1/shengcai2.jpg', '0', '斤');
INSERT INTO `orderitem` VALUES ('82', '安格斯牛肉', '3', '50.00', '84', '150', '@/../static/pic/goodImg/20194259767_安格斯牛肉.jpg', '0', '斤');

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
  `orderList_discountPrice` int(20) DEFAULT NULL,
  `orderList_price` int(20) DEFAULT NULL,
  `user_phone` varchar(20) DEFAULT '',
  `user_address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orderList_id`),
  KEY `user_nickname` (`user_nickname`) USING BTREE,
  KEY `user_address` (`user_address`),
  CONSTRAINT `orderlist_ibfk_1` FOREIGN KEY (`user_nickname`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of orderlist
-- ----------------------------
INSERT INTO `orderlist` VALUES ('72', 'coke43', 'f', '2019-04-06 23:11:28', '2019-04-06 23:13:13', '9', '10', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('81', 'coke43', 'b', '2019-04-25 16:26:51', null, '15', '18', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('82', 'coke43', 'b', '2019-04-25 16:29:43', null, '135', '150', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('83', 'coke43', 'b', '2019-04-27 09:23:20', null, '11', '13', '13808820102', '广东省广州市荔湾区西华路18号604');
INSERT INTO `orderlist` VALUES ('84', 'coke43', 'f', '2019-04-27 09:24:32', '2019-04-27 09:25:25', '135', '150', '13808820102', '广东省广州市荔湾区西华路18号604');

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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

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
INSERT INTO `subcatalog` VALUES ('15', '水果', '苹果');
INSERT INTO `subcatalog` VALUES ('17', '水果', '雪梨');

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of superior_good
-- ----------------------------
INSERT INTO `superior_good` VALUES ('27', '三黄鸡', '16');
INSERT INTO `superior_good` VALUES ('24', '土猪肉', '5');
INSERT INTO `superior_good` VALUES ('26', '安格斯牛肉', '7');
INSERT INTO `superior_good` VALUES ('25', '西洋菜', '6');
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
  `user_creditMark` int(10) DEFAULT '0',
  PRIMARY KEY (`user_id`,`user_nickname`),
  KEY `user_nickname` (`user_nickname`),
  KEY `user_address` (`user_address`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'coke43', '13808820102', '广东省广州市荔湾区西华路18号604', 'm', '1456751226@qq.com', '庾荣亮', 'coke43', '@/../static/pic/userHeadImg/20194267702_headImg.jpg', '195');
INSERT INTO `user` VALUES ('2', 'coke34', '12312312345', '你猜猜', 'm', 'wu', 'AK', 'coke34', '', '610');
INSERT INTO `user` VALUES ('4', 'coke4', '123123', '你猜猜', 'm', '123123', 'yrll', 'coke4', null, '610');
INSERT INTO `user` VALUES ('5', 'coke42', '123123', 'adsfsad', 'm', '123123', 'YRL', 'coke42', null, '610');
INSERT INTO `user` VALUES ('6', 'coke44', '12', 'sadfasd', 'f', '12312', 'asd', 'coke44', null, '610');
INSERT INTO `user` VALUES ('7', 'aaa', 'aaa', 'aaa', 'm', 'aaa', 'aaa', 'aaa', null, '0');
