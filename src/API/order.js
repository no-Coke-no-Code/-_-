const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");
const response = require("./../response/response.js");
const _ = require("./../utils/utils.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/order",(req,res)=>{
    let requestData = "";
    req.on('data',(chunk)=>{
        requestData += chunk;
    });
    req.on('end',(err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            requestData = JSON.parse(requestData);
            let sql = "";
            let sqlParams = [];  
            switch(requestData.method)
            {
                case "checkOrderDetail":
                    sql = "SELECT * FROM orderitem WHERE orderList_id ";
                    if(requestData.orderList.length == 1)
                    {
                        sql += "=" + requestData.orderList[0];
                    }
                    else if(requestData.orderList.length > 1)
                    {
                        sql += "IN (";
                        for(let i = 0;i<requestData.orderList.length;i++)
                        {
                            sql += requestData.orderList[i] + ",";
                        }
                        sql = _.deleting(sql,",",-1);
                        sql += ")";
                    }
                    else if(!requestData.orderList.length)
                    {
                        return;
                    }
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            console.log(responseData);
                            res.json(response.responseSuccess(responseData));
                        }
                    });
                break;

                default:
                break;
            }
        }
    });
});

module.exports = route;