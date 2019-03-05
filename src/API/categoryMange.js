const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/categoryMange",(req,res) => {
    var sql = "";
    var sqlParams = "";
    let requestData = "";
    req.on('data',(chunk) => {
        requestData += chunk;
    });
    req.on('end',() => {
            requestData = JSON.parse(requestData);
            // 通过判断传过来的method来判断算需要进行的操作
            switch(requestData.method){
                // 查询接口
                // 1.添加商品类别
                case "addCategory":
                    sql = "SELECT * FROM category WHERE category_name=?";
                    sqlParams = [requestData.categoryName];
                    if(!requestData.categoryName)
                    {
                        console.log("传了空值过来了，沙雕");
                        return;
                    }
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            if(responseData.length>0)
                            {
                                res.json({
                                    "code":"-1",
                                    "message":"添加类别失败"
                                });
                            }
                            else
                            {
                                sql = "INSERT INTO category ";
                                sqlParams = [requestData.categoryName];
                                connection.query((err,data)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        responseData = JSON.parse(JSON.stringify(data));
                                        res.json({
                                            "code":"0",
                                            "message":"添加商品类别成功",
                                        });
                                    }
                                });
                            }
                        }
                    });
                break;
                // 查看所有商品种类
                case "checkCategory":
                    sql = "SELECT category_name FROM category";
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            res.json({
                                "code":"0",
                                "message":"查询商品类别成功",
                                "data":responseData
                            });
                        }
                    });
                break;
                default:break;
        }
    });
});

module.exports = route;