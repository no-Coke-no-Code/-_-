const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/mainPageGoodBlock",(req,res) => {
    var sql = "";
    var sqlParams = "";
    let requestData = "";
    req.on('data',(chunk) => {
        requestData += chunk;
    });
    req.on("end",() => {
        requestData = JSON.parse(requestData);
        switch(requestData.type){
            case "jingping":
                // 注意事项：在MYSQL的嵌套查询当中，子查询条件不可以直接使用LIMIT关键字，需要进行嵌套
                // 同时，若打算将查询结果当作将要被查询的集合(派生表)，需要为该集合（派生表）设定一个别名
                sql = "SELECT * FROM good WHERE good_name=any(SELECT good_name FROM (SELECT * FROM superior_good ORDER BY RAND() LIMIT 3) as X)";
                connection.query(sql,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(JSON.parse(JSON.stringify(data)));
                        res.json({
                            "state":"200",
                            "data":JSON.parse(JSON.stringify(data)),
                            "message":"接口返回成功",
                        });
                    }
                });
            break;
            case "newGood":
                sql = "SELECT * FROM good WHERE good_name=any(SELECT good_name FROM (SELECT * FROM newest_good ORDER BY RAND() LIMIT 3) as X)";
                connection.query(sql,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(JSON.parse(JSON.stringify(data)));
                        res.json({
                            "state":"200",
                            "data":JSON.parse(JSON.stringify(data)),
                            "message":"接口返回成功",
                        });
                    }
                });
            break;
            case "foreignGood":
                sql = "SELECT * FROM good WHERE good_name=any(SELECT good_name FROM (SELECT * FROM foreign_good ORDER BY RAND() LIMIT 3) as X)";
                connection.query(sql,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log(JSON.parse(JSON.stringify(data)));
                        res.json({
                            "state":"200",
                            "data":JSON.parse(JSON.stringify(data)),
                            "message":"接口返回成功",
                        });
                    }
                });
            break;
        };
    });
});

module.exports = route;