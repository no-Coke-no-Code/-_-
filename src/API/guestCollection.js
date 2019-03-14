const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

const response = require("../response/response.js");
const _ = require("../utils/utils.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();
 
route.post('/guestCollection',(req,res)=>{
    let reqData = "";
    req.on('data',(chunk) => {
        reqData += chunk;
    });
    req.on('end',()=>{
        reqData = JSON.parse(reqData);
        let sql,sqlParams;
        switch(reqData.method)
        {
            case "refreshCollection":
            let promise = new Promise((resolve,reject)=>{
                sql = "SELECT good_name FROM collection WHERE user_id = ?";
                sqlParams = [reqData.userId];
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
                        // console.log(responseData,'i want to see');
                        resolve(responseData);
                    }
                });
            });
            promise.then(function(responseData){
                return new Promise((resolve,reject)=>{
                    sql = "SELECT * FROM good WHERE good_name "
                    if(responseData.length == 1)
                    {
                        sql += "= '" + responseData[0].good_name + "'";
                    }
                    else if(responseData.length > 1)
                    {
                        sql += "IN (";
                        for(let i = 0;i<responseData.length;i++)
                        {
                            sql += "'" + responseData[i].good_name + "',";
                        }
                        sql = _.deleting(sql,',',-1)
                        sql += ")";
                    }
                    else if(responseData.length == 0)
                    {
                        res.json(response.responseSuccess('无收藏'));
                        return;  
                    }
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
                            res.json(response.responseSuccess(responseData));
                        }
                    });
                });
            });
            break;

            case "deleteCollection":
            sql = "DELETE FROM collection WHERE good_id = ? AND user_id = ?";
            sqlParams = [reqData.good_id,reqData.user_id];
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
                    res.json(response.responseSuccess(responseData));
                }
            });
            break;

            case "addToCollection":
                sql = "INSERT IGNORE INTO collection SET ?";
                sqlParams = {
                    "user_nickname":reqData.userName,
                    "user_id":reqData.userId,
                    "good_id":reqData.goodId,
                    "good_name":reqData.goodName
                };
                connection.query(sql,sqlParams,(err)=>{
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("已成功添加商品至收藏夹中");
                        res.json({
                            "state":"200",
                            "message":"接口响应成功"
                        });
                    }
                });
            break;
        }
    });
});


module.exports = route;