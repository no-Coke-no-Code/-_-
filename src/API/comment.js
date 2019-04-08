const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");
const response = require("../response/response.js");
const _ = require("../utils/utils.js");

// 实例化express路由
const route = express.Router();

// 引入方法
const functions = require("./function.js");

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/comment',(req,res)=>{
    var requestData = "";
    req.on('data',(chunk)=>{
        requestData += chunk;
    });
    req.on('end',()=>{
        requestData = JSON.parse(requestData);
        var sql,sqlParams;
        switch(requestData.method)
        {
            case "getGuestComment": 
            let pageIndex = requestData.pageIndex;
            let pageSize = requestData.pageSize;
            let promise1 = new Promise((resolve,reject)=>{
                sql = "SELECT * FROM comment LIMIT " + (pageIndex-1)*pageSize + "," + pageSize;
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json(response.responseFail(err));
                        return;
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        resolve(responseData);
                    }
                });
            });
            promise1.then((val)=>{
                sql = "SELECT COUNT(*) FROM comment";
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json(response.responseFail(err));
                    }
                    else
                    {
                        let totalSize = JSON.parse(JSON.stringify(data))[0]['COUNT(*)'];
                        res.json({
                            "code":0,
                            "message":"查询成功",
                            "data":val,
                            "totalSize":totalSize
                        });
                    }
                });
            });
            break;

            case "getOwnComment":
                let promise0 = new Promise((resolve,reject)=>{
                    sql = "SELECT * FROM comment WHERE user_nickname = ?";
                    sqlParams = [requestData.user_nickname];
                    connection.query(sql,sqlParams,(err,data)=>{
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
                promise0.then((value)=>{
                    console.log(value);
                    sql = "SELECT * FROM adminReply WHERE reply_comment_id";
                    if(value.length > 1)
                    {
                        sql += " IN(";
                        for(let i = 0;i<value.length;i++)
                        {
                            sql += value[i].comment_id + ",";
                        }
                        sql = _.deleting(sql,",",-1);
                        sql += ")";
                    }
                    else if(value.length == 1)
                    {
                        sql += " = " + value[0].comment_id;
                    }
                    else if(value.length == 0)
                    {
                        res.json(response.responseSuccess("暂无回复"));
                        return
                    }
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            for(let i = 0;i<responseData.length;i++)
                            {
                                for(let x = 0;x<value.length;x++)
                                {
                                    value[x].adminReply = [];
                                    if(responseData[i].reply_comment_id == value[x].comment_id)
                                    {
                                        value[x].adminReply.push(responseData[i]);
                                    }
                                }
                            }
                            console.log(value);
                            res.json(response.responseSuccess(value));
                        }
                    });
                });
            break;

            case "getReplyComment":
            if(requestData.good_name)
            {
                sql = "SELECT * FROM adminReply WHERE good_name = ?";
                sqlParams = [requestData.good_name];
            }
            else
            {
                sql = "SELECT * FROM adminReply";
                sqlParams = [];
            }
            connection.query(sql,sqlParams,(err,data)=>{
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

            case "getGoodComment":
            sql = "SELECT * FROM comment WHERE good_name = ?";
            sqlParams = [requestData.good_name];
            connection.query(sql,sqlParams,(err,data)=>{
                if(err)
                {
                    console.log(err);
                    res.json(response.responseFail(err));
                    return;
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    let userHeadImgList = [];

                    let commentList = [];
                    commentList = JSON.parse(JSON.stringify(data));
                    let sql = "SELECT user_headImg FROM user WHERE user_nickname = ?";
                    let sqlParams = [];
                    let funcList = [];
                    // 这里使用了效率比较低的方法，看看以后会不会有更优的方法
                    // 通过传进来的用户ID数组，按照顺序，分别查询N次数据库（promise）
                    // 最后通过Promise.all将所有操作整合再返回
                    function createPromise(commentList,i){
                        var promises = new Promise((resolve,reject)=>{
                            sqlParams = [];
                            sqlParams.push(commentList[i].user_nickname);
                            connection.query(sql,sqlParams,(err,data)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    // 这里返回的其实是一个数组
                                    let responseData = JSON.parse(JSON.stringify(data));
                                    resolve(responseData[0].user_headImg);
                                }
                            });
                        });
                        return promises;
                    };
                    for(let i = 0;i<commentList.length;i++)
                    {
                        funcList.push(createPromise(commentList,i));
                    };
                    let promiseAll = Promise.all(funcList);
                    promiseAll
                    .then((value)=>{
                        userHeadImgList = JSON.parse(JSON.stringify(value));
                        for(let i = 0;i<responseData.length;i++)
                        {
                            responseData[i].user_headImg = userHeadImgList[i];
                        }
                        res.json(response.responseSuccess(responseData));
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
            });
            break;

            case "makeComment":
            let time = new Date();
            let commentTime = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
            console.log(commentTime);
            let promise = new Promise((resolve,reject)=>{
                // 评论需要插入comment表
                sql = "INSERT INTO comment SET ?";
                sqlParams = {
                    "comment_content":requestData.comment_content,
                    "comment_rank":requestData.comment_rank,
                    "comment_time":commentTime,
                    "user_id":requestData.user_id,
                    "user_nickname":requestData.user_nickname,
                    "good_name":requestData.good_name,
                };
                connection.query(sql,sqlParams,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        // res.json(response.responseFail(err));
                        return;
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        console.log(data);
                        // res.json(response.responseSuccess(responseData));
                        resolve()
                    }
                })
            });
            promise.then(function(){
                return new Promise((resolve,reject)=>{
                    // 需要修改orderItem表中的ifComment字段
                    sql = "UPDATE orderitem SET ifComment = 1 WHERE orderItem_id = ?";
                    let commentGoodIndex = requestData.commen_goodIndex;
                    sqlParams = [requestData.comment_order.orderDetail[commentGoodIndex].orderItem_id];
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            return;
                        }
                        else
                        {
                            res.json(response.responseSuccess("发表评论成功"));
                        }
                    });
                });
            });
            break;
            
            case "replyComment":
            let currentTime = _.getCurrentTime();
            sql = "INSERT INTO adminReply SET ?";
            sqlParams = [
                {
                    "reply_content":requestData.comment_content,
                    "good_name":requestData.good_name,
                    "admin_account":"admin",
                    "reply_to_id":requestData.reply_to_id,
                    "reply_to_nickname":requestData.reply_to_nickname,
                    "reply_time":currentTime,
                    "reply_comment_id":requestData.reply_to_comment_id
                }
            ];
            connection.query(sql,sqlParams,(err,data)=>{
                if(err)
                {
                    console.log(err);
                    res.json(response.responseFail(err));
                    return
                }
                else
                {
                    res.json(response.responseSuccess());
                }
            });
            break;

            case "deleteComment":

            break;
        }
    });
});

module.exports = route;