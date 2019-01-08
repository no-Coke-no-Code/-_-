const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/guestCollection',(req,res)=>{
    let reqData = "";
    req.on('data',(chunk) => {
        reqData += chunk;
    });
    req.on('end',()=>{
        reqData = JSON.parse(reqData);
        let sql = "";
        let sqlParams = "";
        switch(reqData.method)
        {
            case "refreshCollection":
            break;

            case "deleting":
            break;

            case "addToCollection":
                sql = "INSERT IGNORE INTO collection SET ?";
                sqlParams = {
                    user_nickname:reqData.userName,
                    good_id:reqData.goodId,
                };
                connection.query(sql,sqlParams,(err)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("已成功添加商品至收藏夹中");
                        res.json({
                            "state":"200",
                            "message":"接口响应成功"
                        });
                    }
                });
            break;
        }
    });
});


module.exports = route;