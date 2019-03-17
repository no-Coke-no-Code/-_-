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


route.post('/guestInfo/changeGuestHeadImg',(req,res) => {
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
            var imgName = files.file.name;
            var nameArray = imgName.split(".");
            var imgType = nameArray[nameArray.length-1];
            let time = new Date();
            let year = time.getFullYear();
            let month = time.getMonth()+1;
            let day = time.getDate();
            let random = parseInt(Math.random() * 10000);
            let newName = year.toString()+month.toString()+day.toString()+random.toString() + "_headImg." + imgType;
            let oldPath = files.file.path;
            var newPath = form.uploadDir + "\\" + newName;
            console.log(newPath);
            fs.renameSync(oldPath,newPath);
            newPath = "@/../static/pic/userHeadImg/"+newName;

            let sql = "SELECT user_headImg FROM user WHERE user_nickname=?";
            let sqlParams = [fields.userNickname];
            connection.query(sql,sqlParams,(err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                { 
                    let responseData = JSON.parse(JSON.stringify(data));
                    let deleteImg = responseData[0].user_headImg.split("/");
                    deleteImg = deleteImg[deleteImg.length-1];
                    if(responseData[0].user_headImg.length != 0)
                    {
                        fs.unlinkSync(form.uploadDir + "\\" + deleteImg);
                    }
                    sql = "UPDATE user SET user_headImg=? WHERE user_nickname=?";
                    sqlParams = [newPath,fields.userNickname];
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        res.json({
                            "state":"200",
                            "message":"成功接收到上传的图片",
                            "data":newPath
                        });
                    });
                }
            });
        });
});

module.exports = route;