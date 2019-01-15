const express = require("express");
const mysql = require("mysql");
const path = require("path");
const fs = require("fs");

// 连接mysql数据库的基本配置
const mysqlConfig = require("../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/guestInfo/deleteGuestHeadImg',(req,res) => {
    var reqData = "";
    req.on('data',(chunk) => {
        reqData += chunk;
    });
    req.on('end',() => {
        reqData = JSON.parse(reqData); 
        let imgUrl = reqData.deleteImg;
        imgUrl.replace(/\//g,"\\");
        console.log("将要删除的头像的地址:"+imgUrl);
        fs.unlinkSync(imgUrl);
        res.json({
            "code":0,
            "message":"文件已经被删除"
        });
    });
});

module.exports = route;