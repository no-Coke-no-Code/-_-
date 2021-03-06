const express = require("express");
const mysql = require("mysql");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const response = require("./../response/response.js");
const _ = require("./../utils/utils.js");

// 连接mysql数据库的基本配置
const mysqlConfig = require("../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.delete('/coupon',(req,res)=>{
    let sql;
    let sqlParams = [];
    console.log(req.query);
    switch(req.query.method)
    {
        case "deleteCouponById":
            sql = "DELETE FROM coupon WHERE id = ?";
            sqlParams = [req.query.couponId];
            connection.query(sql,sqlParams,(err,data)=>{
                if(err)
                {
                    console.log(err);
                    res.json(response.responseFail("删除失败"));
                }
                else
                {
                    res.json(response.responseSuccess('删除成功'));
                }
            });
        break;

        case "deleteCouponByDate":
            let currentTime = Date.now();
            sql = "DELETE FROM coupon WHERE coupon_endTime < ?";
            sqlParams = [currentTime];
            connection.query(sql,sqlParams,(err,data)=>{
                if(err)
                {
                    console.log(err);
                    res.json(response.responseFail("删除失败"));
                }
                else
                {
                    res.json(response.responseSuccess("删除成功"));
                }
            });
        break;

        default:
        break;
    }
});

route.post('/coupon',(req,res)=>{
    let requestData = "";
    req.on('data',(chunk)=>{
        requestData += chunk;
    });
    req.on('end',()=>{
        requestData = JSON.parse(requestData);
        let sql = "";
        let sqlParam = [];
        switch (requestData.method) {
            // 用户抢券方法
            case 'getCoupon':
                sql = "UPDATE coupon SET user_nickname = ? WHERE id = ?";
                sqlParam = [requestData.user_nickname,requestData.coupon_id];
                connection.query(sql,sqlParam,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        res.json(response.responseSuccess("成功抢券"));
                    }
                });
            break;

            // 用户查看可抢券方法
            case "checkNewCoupon":
                sql = "SELECT * FROM coupon WHERE user_nickname IS NULL";
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        res.json(response.responseSuccess(responseData));
                    }
                });
            break;
        
            // 用户查看自己的优惠券方法
            case "checkUserCoupon":
                let currentTime = _.getCurrentTime();
                let promise = new Promise((resolve,reject)=>{
                    sql = "DELETE FROM coupon WHERE coupon_endTime < ?";
                    sqlParam = [currentTime];
                    connection.query(sql,sqlParam,(err)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            resolve();
                        }
                    });
                });
                promise.then(()=>{
                    sql = "SELECT * FROM coupon WHERE user_nickname = ?";
                    sqlParam = [requestData.user_nickname];
                    connection.query(sql,sqlParam,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            res.json(response.responseSuccess(responseData));
                        }
                    });
                });
            break;

            // 管理员发放新券方法
            case "addCoupon":
                requestData.coupon_endTime = requestData.coupon_endTime.split(" ");
                requestData.coupon_endTime.splice(1,1,"23:59:59");
                requestData.coupon_endTime = requestData.coupon_endTime.join(" ");

                sql = "INSERT INTO coupon SET ?";
                sqlParam = [{
                    "coupon_name":requestData.coupon_name,
                    "coupon_price":requestData.coupon_price,
                    "coupon_startTime":requestData.coupon_startTime,
                    "coupon_endTime":requestData.coupon_endTime,
                    "coupon_limit":requestData.coupon_limit,
                    "coupon_type":requestData.coupon_type
                }];
                connection.query(sql,sqlParam,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json(response.responseFail("添加优惠券失败"));
                    }
                    else
                    {
                        res.json(response.responseSuccess("添加优惠券成功"));
                    }
                });
            break;

            // 管理员查看所有券方法
            case "checkAllCoupon":
            let promise1 = new Promise((resolve,reject)=>{
                sql = "SELECT * FROM coupon LIMIT "+(requestData.pageIndex-1)*requestData.pageSize + "," + requestData.pageSize;
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        resolve(responseData);
                    }
                });
            });
            promise1.then((val)=>{
                sql = "SELECT COUNT(*) FROM coupon";
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json(response.responseFail("窝可"));
                    }
                    else
                    {
                        let totalSize = JSON.parse(JSON.stringify(data))[0]['COUNT(*)'];
                        res.json({
                            code:0,
                            data:val,
                            totalSize:totalSize,
                            message:"成功查询优惠券"
                        });
                    }
                });
            });
            break;

            // 管理员按条件查看券方法
            case "checkCouponByCondition":
                let promise2 = new Promise((resolve,reject)=>{
                    sql = "SELECT * FROM coupon WHERE ";
                    console.log(requestData.coupon_id);
                    if(requestData.coupon_id)
                    {
                        sql += "id = " + requestData.coupon_id + " AND ";
                    }
                    if(requestData.coupon_name)
                    {
                        sql += "coupon_name = '" + requestData.coupon_name + "' AND ";
                    }
                    if(requestData.coupon_limit)
                    {
                        sql += "coupon_limit = " + requestData.coupon_limit + " AND ";
                    }
                    if(requestData.coupon_type)
                    {
                        sql += "coupon_type = '" + requestData.coupon_type + " AND ";
                    }
                    if(requestData.coupon_ifOwner)
                    {
                        sql += "user_nickname IS NOT NULL AND ";
                    }
                    else
                    {
                        sql += "user_nickname IS NULL AND ";
                    }
                    if(requestData.coupon_owner)
                    {
                        sql += "user_nickname = '" + requestData.coupon_owner + "' AND ";
                    }
                    if(requestData.coupon_startTime.length)
                    {
                        sql += "coupon_startTime BETWEEN '" + requestData.coupon_startTime[0] + "' AND '" + requestData.coupon_startTime[1] + "' AND ";
                    }
                    if(requestData.coupon_endTime.length)
                    {
                        sql += "coupon_endTime BETWEEN '" + requestData.coupon_endTime[0] + "' AND '" + requestData.coupon_endTime[1] + "' AND ";
                    }
                    sql = sql.split(" ").slice(0,-2).join(" ");
                    console.log(sql);
                    console.log("问题出现了");
                    sql += " LIMIT " + (requestData.pageIndex-1)*requestData.pageSize + "," + requestData.pageSize;
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            resolve(responseData);
                        }
                    });
                });
                promise2.then((val)=>{
                    sql = "SELECT COUNT(*) FROM coupon WHERE ";
                    if(requestData.coupon_id)
                    {
                        sql += "id = " + requestData.coupon_id + " AND ";
                    }
                    if(requestData.coupon_name)
                    {
                        sql += "coupon_name = '" + requestData.coupon_name + "' AND ";
                    }
                    if(requestData.coupon_limit)
                    {
                        sql += "coupon_limit = " + requestData.coupon_limit + " AND ";
                    }
                    if(requestData.coupon_type)
                    {
                        sql += "coupon_type = '" + requestData.coupon_type + " AND ";
                    }
                    if(requestData.coupon_ifOwner)
                    {
                        sql += "user_nickname IS NOT NULL AND ";
                    }
                    else
                    {
                        sql += "user_nickname IS NULL AND ";
                    }
                    if(requestData.coupon_owner)
                    {
                        sql += "user_nickname = '" + requestData.coupon_owner + "' AND ";
                    }
                    if(requestData.coupon_startTime.length)
                    {
                        sql += "coupon_startTime BETWEEN '" + requestData.coupon_startTime[0] + "' AND '" + requestData.coupon_startTime[1] + "' AND ";
                    }
                    if(requestData.coupon_endTime.length)
                    {
                        sql += "coupon_endTime BETWEEN '" + requestData.coupon_endTime[0] + "' AND '" + requestData.coupon_endTime[1] + "' AND ";
                    }
                    sql = sql.split(" ").slice(0,-2).join(" ");
                    sql += " LIMIT " + (requestData.pageIndex-1)*requestData.pageSize + "," + requestData.pageSize;
                    console.log(sql);
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let totalSize = JSON.parse(JSON.stringify(data))[0]['COUNT(*)'];
                            res.json({
                                code:0,
                                data:val,
                                totalSize:totalSize
                            });
                        }
                    });
                });
            break;

            // 管理员编辑优惠券方法
            case "editCoupon":
                sql = "UPDATE coupon SET coupon_name=?,coupon_price=?,coupon_startTime=?,coupon_endTime=?,coupon_limit=?,coupon_type=? WHERE id = ?";
                sqlParams = [
                    requestData.coupon_name,
                    requestData.coupon_price,
                    requestData.coupon_startTime,
                    requestData.coupon_endTime,
                    parseInt(requestData.coupon_limit),
                    requestData.coupon_type,
                    requestData.id
                ];
                connection.query(sql,sqlParams,(err,data)=>{ 
                    if(err)
                    {
                        console.log(err);
                        res.json(response.responseFail("编辑失败"));
                    }
                    else
                    {
                        res.json(response.responseSuccess("编辑成功"));
                    }
                });
            break;

            default:
            break;
        }
    });
});

module.exports = route;