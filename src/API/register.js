const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/register",(req,res) => {
    let clientData = "";
    let ifRegisterSucced = "";
    req.on("data",(data) => {
        clientData += data;
    });
    req.on("end",() => {
        clientData = JSON.parse(clientData);
        let sql = "SELECT COUNT(*) FROM user WHERE user_nickname = ?";
        let sqlParams = [clientData.registerUsername];
        connection.query(sql,sqlParams,(err,data) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                let queryData = JSON.parse(JSON.stringify(data));
                if(queryData[0]['COUNT(*)'] == 0)
                {
                    sql = "INSERT INTO user(user_nickname,user_password,user_realname,user_phone,user_sex,user_address,user_email) VALUES(?,?,?,?,?,?,?)"
                    sqlParams = [
                        clientData.registerUsername,
                        clientData.registerUserpassword,
                        clientData.registerName,
                        clientData.registerPhone,
                        clientData.registerSex,
                        clientData.registerAddress,
                        clientData.registerEmail,
                    ];
                    connection.query(sql,sqlParams,(err) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            res.json({
                                "状态":"成功",
                                "stateMent":"注册成功",
                                "state":"1"
                            });
                        }
                    });
                }
                else
                {
                    res.json({
                        "状态":"失败",
                        "stateMent":"该账户以存在",
                        "state":"0"
                    });
                }
            }
        });
    });
});
module.exports = route;