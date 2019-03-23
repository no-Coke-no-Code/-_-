const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/adminLogin",(req,res)=>{
    let clientData = "";
    let ifLogin = "";
    req.on('data',(data) => {
        clientData += data;
    });
    req.on("end",() => {
        clientData = JSON.parse(clientData);
        let sql = 'SELECT * FROM admin WHERE admin_account=? AND admin_password=?';
        let sqlParams = [clientData.admin_account,clientData.admin_password];
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
                        "state":1,
                        "admin":queryData[0]
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