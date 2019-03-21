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
        let sql = "";
        let sqlParams = [];
        requestData = JSON.parse(requestData);
        console.log(requestData.method);
        switch(requestData.method)
        {
            case "searchAll":
            sql = "SELECT * FROM user";
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
            break;

            case "searchSome":
            sql = "SELECT * FROM user WHERE ";
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
            break;

            case "getUserHeadImg":
            sql = "SELECT user_headImg FROM user WHERE user_nickname = ?"
            sqlParams = [requestData.user_nickname];
            connection.query(sql,sqlParams,(err,data)=>{
                if(err)
                {
                    console.log(err);
                    res.json(response.responseFail(err));
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    res.json(response.responseSuccess(responseData));
                }
            });
            break;
        }
    });
})

module.exports = route;