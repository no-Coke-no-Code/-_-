const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/goodSearch',(req,res)=>{
    let reqData = "";
    req.on('data',(chunk) => {
        reqData += chunk;
    });
    req.on('end',()=>{
        let sql = "";
        let sqlParams = [];
        reqData = JSON.parse(reqData);
        switch(reqData.searchType)
        {   
            case "goodName":
                sql = "SELECT * FROM good WHERE good_name LIKE '%" + reqData.searchKeyWord + "%' OR category_name LIKE '%" + reqData.searchKeyWord + "%'";
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json({
                            "code":"-1",
                            "message":"查询商品失败",
                            "data":[]
                        });
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        console.log("成功查询的数据",responseData);
                        res.json({
                            "code":"0",
                            "message":"查询商品成功",
                            "data":responseData
                        });
                    }
                });
            break;
        }
    });
});


module.exports = route;