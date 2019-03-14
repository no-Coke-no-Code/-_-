const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");
const _ = require("./../utils/utils.js");

// 返回数据函数
const response = require("../response/response");

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
        switch(reqData.method){
            case "getGuestOrder":
            console.log(reqData);
            console.log("我想看的东西在这行上米娜"); 
            if(reqData.orderForm)
            {
                returnOrderList(reqData.user_nickname,reqData.orderState,reqData.orderForm);
            }
            else
            {
                returnOrderList(reqData.user_nickname,reqData.orderState);
            }
            function returnOrderList(userName,orderState,orderForm){
                // 判断是否查询所有订单
                if(orderState == "all")
                {
                    var sql = "SELECT * FROM orderList WHERE user_nickname = '"+userName+"' AND ";
                }
                // 判断查询订单类型
                else
                {
                    var sql = "SELECT * FROM orderList WHERE user_nickname = '"+ userName +"' AND orderList_state='"+ orderState +"' AND ";
                }

                if(orderForm)
                {
                    if(orderForm.orderId)
                    {
                        sql += "orderList_id = "+ orderForm.orderId + " AND ";
                    }
                    else if(orderForm.orderPrice)
                    {
                        let lowPrice = orderForm.orderPrice.split("-")[0];
                        let highPrice = orderForm.orderPrice.split("-")[1];
                        sql += " orderList_price BETWEEN " + lowPrice + " AND " + highPrice + " AND ";
                    }
                    else if(orderForm.startTime)
                    {
                        sql += "orderList_startTime BETWEEN '" + orderForm.startTime[0] + "' AND '" + orderForm.startTime[1] + "' AND ";
                    }
                    else if(orderForm.finishTime)
                    {
                        sql += "orderList_finishTime BETWEEN '" + orderForm.finishTime[0] + "' AND '" + orderForm.finishTime[1] + "' AND ";
                    }
                    // sql = sql.split(" ").slice(0,-2).join(" ")
                }
                sql = _.deleting(sql,"AND",-1);
                console.log(sql);
                connection.query(sql,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let resultData = JSON.parse(JSON.stringify(data));
                        if(resultData.length == 0)
                        {
                            res.json(response.responseSuccess(resultData));
                        }
                        else
                        {
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
                                            res.json(response.responseSuccess(resultData));
                                        }
                                    }
                                });
                            }
                        }
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
                    "orderList_startTime":createOrderTime,
                    "orderList_state":"b",
                    "orderList_price":reqData.totalPrice,
                    "user_address":reqData.address,
                    "user_phone":reqData.phone
                };
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
        };
    });
});
module.exports = route;