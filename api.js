const express = require("express");

// 引入各个功能接口
const userMange = require("./src/API/userMange.js");
const goodMange = require("./src/API/goodMange.js");
const register = require("./src/API/register.js");
const login = require("./src/API/login.js");
const adminLogin = require("./src/API/adminLogin");
const guestInfo = require("./src/API/guestInfo.js");
const guestOrder = require("./src/API/guestOrder.js");
const guestCart = require("./src/API/guestCart.js");
const mainPageGoodBlock = require("./src/API/mainPageGoodBlock.js");
const goodDetail = require("./src/API/goodDetail.js");
const guestCollection = require('./src/API/guestCollection.js');
const changeGuestHeadImg = require("./src/API/changeGuestHeadImg");
const deleteGuestHeadImg = require("./src/API/deleteGuestHeadImg");
const goodSearch = require("./src/API/goodSearch.js");
const mangeOrder = require('./src/API/mangeOrder.js');
const changeGoodImg = require('./src/API/changeGoodImg');
const categoryMange = require("./src/API/categoryMange");
const topGoodMange = require("./src/API/topGoodMange");
const comment = require("./src/API/comment");
const credit = require("./src/API/credit");
const countManage = require('./src/API/countManage');
const order = require("./src/API/order");
const coupon = require("./src/API/coupon");

module.exports = () => {
    const route = express.Router();

    // 客户端发起登录请求
    route.post("/index",login);
    // 管理员登录接口
    route.post("/adminLogin",adminLogin);

    // 客户端发起注册请求
    route.post("/register",register);


    // 后台管理商品信息功能
    route.post("/goodMange",goodMange);
    

    // 后台管理用户信息功能
    route.post("/userMange",userMange);
    // 后台管理用户订单功能
    route.post("/mangeOrder",mangeOrder);
    // 后台修改商品图片功能
    route.post('/goodMange/changeGoodImg',changeGoodImg);
    // 后台操作商品类别功能
    route.post("/categoryMange",categoryMange);
    // 后台管理首页三种商品类别功能
    route.post('/topGoodMange',topGoodMange);

    // 用户获取/修改个人信息功能
    route.post("/guestInfo",guestInfo);
    // 用户设置个人头像功能接口
    route.post("/guestInfo/changeGuestHeadImg",changeGuestHeadImg);
    // 删除用户个人头像功能接口
    // (需要落实如何接收delete请求的参数)
    route.post("/guestInfo/deleteGuestHeadImg",deleteGuestHeadImg);

    // 用户查看订单功能
    route.post("/guestOrder",guestOrder);

    // 用户查询商品功能接口
    route.post("/goodSearch",goodSearch);

    // 用户购物车功能
    route.post("/guestCart",guestCart);

    // 商城主页三个商品区域接口
    route.post("/mainPageGoodBlock",mainPageGoodBlock);

    // 查询商品详细信息接口
    route.post("/goodDetail",goodDetail);

    // 用户收藏夹功能接口
    route.post('/guestCollection',guestCollection);

    // 评论功能接口
    route.post('/comment',comment);

    // 获取订单项接口
    route.post("/order",order);

    // 根据积分查询会员等级接口
    // 情况1
    // route.get("/checkCreditRank/",checkCreditRank);
    // 情况2
    route.post("/credit",credit);

    // 交易统计功能接口
    route.post("/countManage",countManage);

    // 优惠券操作功能接口
    route.all("/coupon",coupon);

    return route;
};