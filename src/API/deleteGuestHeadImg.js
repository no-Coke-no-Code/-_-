const express = require("express");
const mysql = require("mysql");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

// 连接mysql数据库的基本配置
const mysqlConfig = require("../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.delete('/guestInfo/deleteGuestHeadImg/',(req,res) => {
    var form = new formidable.IncomingForm();
    form.encoding = "utf-8";
    // 接收后的图片所存放的位置
    form.uploadDir = path.join(__dirname + "../../../static/pic/userHeadImg");
    form.keepExtensions = true;
    form.parse(req,(err,fields,files)=>{
        if(err)
        {
            console.log(err);
        }
        console.log("接收到的图片信息");
        console.log(files);
        // var fileName = files.the_file.name;
        // var nameArray = filename.split(".");
        // var type = nameArray[nameArray.length-1];
        // var name = "";
        // for(let i = 0;i<nameArray.length;i++)
        // {
        //     name = name + nameArray[i];
        // }
        // var avatarName = name + "." + type;
        // var newPath = form.uploadDir + "/" + avatarName;
        // fs.renameSync(files.the_file.name,newPath);
        // res.send({
        //     "data":"/upload" + avartarName
        // });
    });
});

module.exports = route;