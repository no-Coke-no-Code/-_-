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

route.post('/goodSearch',(req,res)=>{
    let reqData = "";
    req.on('data',(chunk) => {
        reqData += chunk;
    });
    req.on('end',()=>{
        let sql = "";
        let sqlParams = [];
        reqData = JSON.parse(reqData);
        switch(reqData.searchType)
        {   
            case "goodName":
                sql = "SELECT * FROM good WHERE good_name LIKE '%" + reqData.searchKeyWord + "%' OR category_name LIKE '%" + reqData.searchKeyWord + "%' OR subCatalog_name LIKE '%" + reqData.searchKeyWord + "%'";
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json({
                            "code":"-1",
                            "message":"查询商品失败",
                            "data":[]
                        });
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        console.log("成功查询的数据",responseData);
                        res.json({
                            "code":"0",
                            "message":"查询商品成功",
                            "data":responseData
                        });
                    }
                });
            break;

            case "goodBlock":
                let promise = new Promise((resolve,reject)=>{
                    sql = "SELECT good_id FROM";
                    if(reqData.searchKeyWord == "精品推介")
                    {
                        sql += " superior_good";
                    }
                    else if(reqData.searchKeyWord == "劲爆新品")
                    {
                        sql += " newest_good";
                    }
                    else if(reqData.searchKeyWord == "异国风情")
                    {
                        sql += " foreign_good";
                    }
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
                promise.then((value)=>{
                    sql = "SELECT * FROM good WHERE good_id IN (";
                    for(let i = 0;i<value.length;i++)
                    {
                        sql += value[i].good_id + ",";
                    }
                    sql = _.deleting(sql,',',-1);
                    sql += ")";
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                        }
                        else
                        {
                            let responseData2 = JSON.parse(JSON.stringify(data));
                            res.json(response.responseSuccess(responseData2));
                        }
                    });
                });
            break;

        }
    });
});


module.exports = route;