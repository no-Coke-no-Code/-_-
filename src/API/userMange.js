const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");
const response = require("./../response/response.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/userMange",(req,res) => {
    let requestData = "";
    req.on('data',(chunk) => {
        requestData += chunk;
    });
    req.on('end',() => {
        requestData = JSON.parse(requestData);
        console.log(requestData.method);
        if(requestData.method == "searchAll")
        {
            let sql = "SELECT * FROM user WHERE user_nickname != 'admin'";
            connection.query(sql,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let searchResult = JSON.parse(JSON.stringify(data));
                    console.log(searchResult);
                    res.json({
                        "state":"done",
                        "responseData":searchResult
                    });
                }
            });
        }
        if(requestData.method == "searchSome")
        {
            let sql = "SELECT * FROM user WHERE ";
            if(requestData.userForm.id != "")
            {
                sql += "user_id=" + requestData.userForm.id + " AND ";
            }
            if(requestData.userForm.realname != "")
            {
                sql += "user_realname='" + requestData.userForm.realname + "' AND ";
            }
            if(requestData.userForm.nickname != "")
            {
                sql += "user_nickname='" + requestData.userForm.nickname + "' AND ";
            }
            if(requestData.userForm.sex != "")
            {
                sql += "user_sex='" + requestData.userForm.sex + "' AND ";
            }
            if(requestData.userForm.address != "")
            {
                sql += "user_address='" + requestData.userForm.address + "' AND ";
            }
            if(requestData.userForm.phone != "")
            {
                sql += "user_phone=" + requestData.userForm.phone + " AND ";
            }
            if(requestData.userForm.email != "")
            {
                sql += "user_email='" + requestData.userForm.email + "' AND ";
            }
            sql = sql.split(" ").slice(0,-2).join(" ");
            console.log(sql);
            connection.query(sql,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.json({
                        "state":"success",
                        "responseData":JSON.parse(JSON.stringify(data))
                    });
                    console.log(JSON.parse(JSON.stringify(data)));
                }
            });
        }
    });
})

module.exports = route;