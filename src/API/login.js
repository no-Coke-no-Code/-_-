const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/index",(req,res)=>{
    let clientData = "";
    let ifLogin = "";
    req.on('data',(data) => {
        clientData += data;
    });
    req.on("end",() => {
        clientData = JSON.parse(clientData);
        let sql = 'SELECT * FROM user WHERE user_nickname=? AND user_password=?';
        let sqlParams = [clientData.username,clientData.password];
        connection.query(sql,sqlParams,(err,data) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                let queryData = JSON.parse(JSON.stringify(data));
                ifLogin = queryData.length;
                if(ifLogin == 1)
                {
                    let responseData = {
                        "ifLogin":"成功",
                        "state":1
                    };
                    res.json(responseData);
                }
                else
                {
                    let responseData = {
                        "ifLogin":"失败，账号或密码错误",
                        "state":0
                    };
                    res.json(responseData);
                }
            }
        });
    });
});
module.exports = route;