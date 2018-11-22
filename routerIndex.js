const express = require("express");

// 引入各个功能接口
const userMange = require("./src/API/userMange.js");
const goodMange = require("./src/API/goodMange.js");
const register = require("./src/API/register.js");
const login = require("./src/API/login.js");

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

    return route;
};