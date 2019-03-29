const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");
const response = require("./../response/response.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/countManage",(req,res)=>{
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
                case "getCount":
                    let nowTime = new Date();
                    sql = "SELECT * FROM orderlist";
                    if(requestData.searchStartTime && requestData.searchEndTime)
                    {
                        sql +=" WHERE orderList_startTime BETWEEN '" + requestData.searchStartTime + "' AND '" + requestData.searchEndTime + "'";
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