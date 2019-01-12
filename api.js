const express = require("express");

// 引入各个功能接口
const userMange = require("./src/API/userMange.js");
const goodMange = require("./src/API/goodMange.js");
const register = require("./src/API/register.js");
const login = require("./src/API/login.js");
const guestInfo = require("./src/API/guestInfo.js");
const guestOrder = require("./src/API/guestOrder.js");
const guestCart = require("./src/API/guestCart.js");
const mainPageGoodBlock = require("./src/API/mainPageGoodBlock.js");
const goodDetail = require("./src/API/goodDetail.js");
const guestCollection = require('./src/API/guestCollection.js');
const getGuestHeadImg = require("./src/API/getGuestHeadImg");
const deleteGuestHeadImg = require("./src/API/deleteGuestHeadImg");

module.exports = () => {
    const route = express.Router();

    // 客户端发起登录请求
    route.post("/index",login);

    // 客户端发起注册请求
    route.post("/register",register);


    // 后台管理商品信息功能
    route.post("/goodMange",goodMange);
    

    // 后台管理用户信息功能
    route.post("/userMange",userMange);


    // 用户获取/修改个人信息功能
    route.post("/guestInfo",guestInfo);
    // 用户设置个人头像功能接口
    route.post("/guestInfo/getGuestHeadImg",getGuestHeadImg);
    // 删除用户个人头像功能接口
    route.delete("/guestInfo/deleteGuestHeadImg",deleteGuestHeadImg);

    // 用户查看订单功能
    route.post("/guestOrder",guestOrder);

    // 用户购物车功能
    route.post("/guestCart",guestCart);

    // 商城主页三个商品区域接口
    route.post("/mainPageGoodBlock",mainPageGoodBlock);

    // 查询商品详细信息接口
    route.post("/goodDetail",goodDetail);

    // 用户收藏夹功能接口
    route.post('/guestCollection',guestCollection);

    return route;
};