const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/goodDetail',(req,res) => {
    let reqData = "";
    req.on('data',(chunk) => {
        reqData += chunk;
    });
    req.on('end',() => {
        // 存放在POST请求体当中的是字符串化的对象，类型为字符串，这里需要重新转换一下
        reqData = JSON.parse(reqData);
        let result = {};
        let sql = "SELECT * FROM good WHERE good_name = ?";
        let sqlParams = [reqData.goodName];
        connection.query(sql,sqlParams,(err,data) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                result = JSON.parse(JSON.stringify(data));
                console.log(result);
                res.json({
                    "state":"200",
                    "message":"接口相应成功:成功查询商品详情",
                    "data":result
                });
            }
        });
    });
});

module.exports = route;