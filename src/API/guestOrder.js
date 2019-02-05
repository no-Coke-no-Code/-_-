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
        console.log(reqData.method);
        switch(reqData.method){
            case "getGuestOrder":
            returnOrderList(reqData.userName,reqData.orderState);
            function returnOrderList(userName,orderState){
                // 判断是否查询所有订单
                if(orderState == "all")
                {
                    var sql = "SELECT * FROM orderList WHERE user_nickname = ?";
                }
                // 判断查询订单类型
                else
                {
                    var sql = "SELECT * FROM orderList WHERE user_nickname = ? AND orderList_state=? ";
                }
                let sqlParams = [userName,orderState];
                connection.query(sql,sqlParams,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let resultData = JSON.parse(JSON.stringify(data));
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
                                        res.json({
                                            'code':'0',
                                            'message':'成功返回数据',
                                            'data':resultData
                                        });
                                    }
                                }
                            });
                        }
                        // res.json({
                        //     'code':'0',
                        //     'message':'成功返回数据',
                        //     'data':resultData
                        // });
                    }
                });
            }
            break;

            case "makeGuestOrder":
                console.log("生成订单接口发送过来的数据" , reqData);
                let newTime = new Date();
                // 注意：要获取到实际的月份，需要getMonth()+1
                let createOrderTime = newTime.getFullYear()+"-"+(newTime.getMonth()+1)+"-"+newTime.getDate()+" "+newTime.getHours()+":"+newTime.getMinutes()+":"+newTime.getSeconds();
                sql = "INSERT INTO orderlist SET ?";
                sqlParams = {
                    "user_nickname":reqData.userName,
                    // "goodList":JSON.parse(reqData.goodList),
                    "orderList_startTime":createOrderTime,
                    "orderList_state":"b",
                    "orderList_price":reqData.totalPrice,
                    "user_address":reqData.address,
                    "user_phone":reqData.phone
                };
                // console.log("传送过来的数据",sqlParams);
                connection.query(sql,sqlParams,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        sql = "INSERT INTO orderitem (good_name,good_count,good_price,orderList_id,orderItem_priceSub,good_imgurl) VALUES ?";
                        sqlParams = [];
                        for(let i = 0;i<reqData.goodList.length;i++)
                        {
                            reqData.goodList[i].orderList_id = data.insertId;
                            reqData.goodList[i].good_count = reqData.goodList[i].num;
                            reqData.goodList[i].orderItem_priceSub = reqData.goodList[i].sum;
                            sqlParams[i] = [];
                            sqlParams[i].push(
                                reqData.goodList[i].good_name,
                                reqData.goodList[i].good_count,
                                reqData.goodList[i].good_price,
                                reqData.goodList[i].orderList_id,
                                reqData.goodList[i].orderItem_priceSub,
                                reqData.goodList[i].good_imgurl,
                            );
                        }
                        connection.query(sql,[sqlParams],(err)=>{
                            if(err){
                                console.log(err);
                            }
                            else
                            {
                                res.json({
                                    "code":0,
                                    "message":"生成订单接口响应成功"
                                });
                            }
                        });
                    }
                });
            break;

            case "finishGuestOrder":
                
            break;
        };
    });
});
module.exports = route;