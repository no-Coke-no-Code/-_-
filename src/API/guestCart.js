const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/guestCart',(req,res) => {
    let reqData = "";
    req.on("data",(chunk) => {
        reqData += chunk;
    });
    req.on("end",() => {
        reqData = JSON.parse(reqData);
        console.log(reqData);
        switch(reqData.method){
            case "refreshCart":
            var sql = "SELECT * FROM cart WHERE user_nickname = ?";
            var sqlParams = [reqData.userName];
            connection.query(sql,sqlParams,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    sql = "SELECT * FROM good WHERE good_id = ? ";
                    sqlParams = [responseData[0].good_id];
                    // 若购物车中的商品多余一个，则对sql语句进行拼接
                    if(responseData.length > 1)
                    {
                        for(let i = 1; i<responseData.length;i++)
                        {
                            sql += "OR ? "
                            sqlParams.push(responseData[i].good_id);
                        }
                    }
                    connection.query(sql,sqlParams,(err,data) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let good_list = JSON.parse(JSON.stringify(data));
                            responseData = good_list;
                            console.log(responseData);
                            res.json(responseData);
                        }
                    });
                }
            });
            break;

            case "deleting":
            sql = "DELETE FROM cart WHERE good_id = ?";
            sqlParams = [reqData.good_id];
            connection.query(sql,sqlParams,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("删除商品成功,准备刷新购物车列表");
                    res.json({
                        "state":"succeed",
                        "statement":"删除商品成功"
                    });
                }
            });
            break;

            case "addToCart":
            sql = "INSERT IGNORE INTO cart SET ?"
            sqlParams = {
                "user_nickname":reqData.userName,
                "good_id":reqData.goodId,
            };
            connection.query(sql,sqlParams,(err)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.json({
                        "state":"200",
                        "message":"接口成功响应",
                    });
                }
            });
        }
    });
});

module.exports = route;