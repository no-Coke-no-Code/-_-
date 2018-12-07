const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/guestOrder',(req,res) => {
    let reqData = "";
    req.on('data',(chunk) => {
        reqData += chunk;
    });
    req.on('end',() => {
        // 这里有个坑:不可以使用order作为mysql的表名
        reqData = JSON.parse(reqData);
        switch (reqData.orderState)
        {
            // 读取所有订单
            case "all":
                // 先查看数据库当中属于某个用户的所有订单
                sql = "SELECT * FROM orderList WHERE user_nickname = ?";
                sqlParams = [reqData.userName];
                connection.query(sql,sqlParams,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let resultData = JSON.parse(JSON.stringify(data));
                        let orderDetail = [];
                        // 然后再遍历刚刚所查询到的所有订单，查询属于该订单的货物的详细信息，然后以对象数组形式并入该订单中
                        for(let x = 0; x<resultData.length;x++)
                        {
                            let sql = "SELECT * FROM orderItem WHERE orderList_id = ?";
                            let sqlParams = [resultData[x].orderList_id];
                            connection.query(sql,sqlParams,(err,data) => {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    resultData[x].orderDetail = JSON.parse(JSON.stringify(data));
                                    if(x == resultData.length-1)
                                    {
                                        console.log(resultData);
                                        res.json(resultData);
                                    }
                                }
                            });
                        }
                    }
                });
            break;

            // 读取开始状态的订单
            case "b":
                // 先查看数据库当中属于某个用户的所有订单
                sql = "SELECT * FROM orderList WHERE user_nickname = ? AND orderList_state = 'b'";
                sqlParams = [reqData.userName];
                connection.query(sql,sqlParams,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let resultData = JSON.parse(JSON.stringify(data));
                        let orderDetail = [];
                        // 然后再遍历刚刚所查询到的所有订单，查询属于该订单的货物的详细信息，然后以对象数组形式并入该订单中
                        for(let x = 0; x<resultData.length;x++)
                        {
                            let sql = "SELECT * FROM orderItem WHERE orderList_id = ?";
                            let sqlParams = [resultData[x].orderList_id];
                            connection.query(sql,sqlParams,(err,data) => {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    resultData[x].orderDetail = JSON.parse(JSON.stringify(data));
                                    if(x == resultData.length-1)
                                    {
                                        console.log(resultData);
                                        res.json(resultData);
                                    }
                                }
                            });
                        }
                    }
                });
            break;

            // 读取已经完成的订单
            case "f":
                // 先查看数据库当中属于某个用户的所有订单
                sql = "SELECT * FROM orderList WHERE user_nickname = ? AND orderList_state = 'f'";
                sqlParams = [reqData.userName];
                connection.query(sql,sqlParams,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let resultData = JSON.parse(JSON.stringify(data));
                        let orderDetail = [];
                        // 然后再遍历刚刚所查询到的所有订单，查询属于该订单的货物的详细信息，然后以对象数组形式并入该订单中
                        for(let x = 0; x<resultData.length;x++)
                        {
                            let sql = "SELECT * FROM orderItem WHERE orderList_id = ?";
                            let sqlParams = [resultData[x].orderList_id];
                            connection.query(sql,sqlParams,(err,data) => {
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    resultData[x].orderDetail = JSON.parse(JSON.stringify(data));
                                    if(x == resultData.length-1)
                                    {
                                        console.log(resultData);
                                        res.json(resultData);
                                    }
                                }
                            });
                        }
                    }
                });
            break;
        }
    });
});
module.exports = route;