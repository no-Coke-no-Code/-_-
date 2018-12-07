const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/guestCart',(req,res) => {
    let reqData = "";
    req.on("data",(chunk) => {
        reqData += chunk;
    });
    req.on("end",() => {
        console.log(reqData);
    });
});

module.exports = route;