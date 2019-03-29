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

            // 用户使用券后删除该券方法
            case 'deleteUserCoupon':
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
            case "postCoupon":
            break;

            // 管理员查看所有券方法
            case "checkAllCoupon":
                sql = "SELECT * FROM coupon";
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

            // 管理员删除券方法
            case "deleteCoupon":
            break;

            default:
            break;
        }
    });
});

module.exports = route;