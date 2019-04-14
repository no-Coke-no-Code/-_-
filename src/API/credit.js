const express = require("express");
const mysql = require("mysql");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const response = require("./../response/response.js");

// 连接mysql数据库的基本配置
const mysqlConfig = require("../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

// 情况1
// route.get('/checkCreditRank/',(req,res) => {
//     console.log(req.query);
// });
// 情况2 req.params
route.post('/credit',(req,res)=>{
    let requestData = "";
    req.on('data',(chunk)=>{
        requestData += chunk;
    });
    req.on('end',()=>{
        requestData = JSON.parse(requestData);
        let sql = "";
        let sqlParam = [];
        switch (requestData.method) {
            case 'getCredit':
            let user_creditMark = requestData.creditMark;
            let user_creditRank = "非会员";
            let user_discount = "1";
            let user_nextRank = "普通会员";
            let user_nextMark = "100";
            let user_creditLevel = "";
            console.log(requestData.creditMark);
            sql = "SELECT * FROM credit";
            connection.query(sql,(err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    console.log(responseData);
                    for(let i = 0;i<responseData.length;i++)
                    {   
                        if(user_creditMark >= responseData[i].credit_mark)
                        {
                            user_creditRank = responseData[i].credit_rank;
                            user_discount = responseData[i].credit_discount;
                            user_creditLevel = responseData[i].credit_level;
                            if(i != responseData.length-1)
                            {
                                console.log(responseData[i+1]);
                                user_nextMark = responseData[i+1].credit_mark;
                                user_nextRank = responseData[i+1].credit_rank;
                            }
                        }
                    }
                    let resObj = {
                        "user_creditRank":user_creditRank,
                        "user_discount":user_discount,
                        "user_creditMark":user_creditMark,
                        "user_creditLevel":user_creditLevel,
                        "user_nextMark":user_nextMark,
                        "user_nextRank":user_nextRank,
                    };
                    res.json(response.responseSuccess(resObj));
                }
            });
            break;
        
            case "updataUserCredit":
                let user_nickname = requestData.user_nickname;
                let addCreditMark = requestData.addCreditMark;
                sql = "UPDATE user INNER JOIN (SELECT user_creditMark FROM user WHERE user_nickname= ? ) user1 SET user.user_creditMark = user1.user_creditMark + ? WHERE user_nickname= ?";
                sqlParam = [user_nickname,addCreditMark,user_nickname];
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
            break;

            case "getAllRank":
                sql = "SELECT * FROM credit";
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

            default:
            break;
        }
    });
});

module.exports = route;