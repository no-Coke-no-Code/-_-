const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 引入方法
const functions = require("./function.js");

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/adminLogin",(req,res)=>{
    let clientData = "";
    req.on('data',(data) => {
        clientData += data;
    });
    req.on("end",() => {
        clientData = JSON.parse(clientData);
        functions.adminLogin(clientData,connection,req,res);
    });
});
module.exports = route;