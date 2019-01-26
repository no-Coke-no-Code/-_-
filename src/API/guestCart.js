const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/guestCart',(req,res) => {
    let reqData = "";
    req.on("data",(chunk) => {
        reqData += chunk;
    });
    req.on("end",() => {
        reqData = JSON.parse(reqData);
        console.log(reqData);
        switch(reqData.method){
            case "refreshCart":
            var sql = "SELECT * FROM cart WHERE user_nickname = ?";
            var sqlParams = [reqData.userName];
            connection.query(sql,sqlParams,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    console.log(responseData,"这是从购物车表查询到的数据");
                    if(responseData.length == 0)
                    {
                        res.json({
                            'state':'200',
                            'message':'当前购物车空空如也',
                            'data':'empty'
                        });
                        return;
                    }
                    sql = "SELECT * FROM good WHERE good_id";
                    sqlParams = [];
                    // 问题应该出现在这里下面
                    console.log("将要查询的购物车中的商品的ID",sqlParams);
                    // 若购物车中的商品多余一个，则对sql语句进行拼接
                    if(responseData.length > 1)
                    {
                        sql += " IN (";
                        for(let i = 0; i<responseData.length;i++)
                        {
                            if(i == responseData.length-1)
                            {
                                sql += "?";
                                sqlParams.push(responseData[i].good_id);
                            }
                            else
                            {
                                sql += "?,";
                                sqlParams.push(responseData[i].good_id);
                            }
                        }
                        sql += ")";
                    }
                    else
                    {
                        sql += "= ?"; 
                        sqlParams = [responseData[0].good_id];
                    }
                    console.log(sql,sqlParams,'出现问题了');
                    // console.log("将要查询的购物车中的商品",sqlParams);
                    connection.query(sql,sqlParams,(err,data) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let good_list = JSON.parse(JSON.stringify(data));
                            responseData = good_list;
                            console.log(responseData);
                            res.json(responseData);
                        }
                    });
                }
            });
            break;

            case "deleting":
            sql = "DELETE FROM cart WHERE good_id = ?";
            sqlParams = [reqData.good_id];
            connection.query(sql,sqlParams,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("删除商品成功,准备刷新购物车列表");
                    res.json({
                        "state":"succeed",
                        "statement":"删除商品成功"
                    });
                }
            });
            break;

            case "addToCart":
            sql = "INSERT IGNORE INTO cart SET ?"
            sqlParams = {
                "user_nickname":reqData.userName,
                "good_id":reqData.goodId,
            };
            console.log('将要新增至购物车的商品',sqlParams);
            connection.query(sql,sqlParams,(err)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    res.json({
                        "state":"200",
                        "message":"接口成功响应",
                    });
                }
            });
            break;

            case "makeOrderSuccess":
            sql = "DELETE FROM cart WHERE user_nickname=? AND good_id";
            sqlParams = [];
            sqlParams.push(reqData.userName);
            if(reqData.goodIdList.length > 1)
            {
                sql += " IN (";
                for(let i = 0;i<reqData.goodIdList.length;i++)
                {
                    if(i == reqData.goodIdList.length-1)
                    {
                        sql += "?)";
                    }
                    else
                    {
                        sql += "?,";
                    }
                    sqlParams.push(reqData.goodIdList[i]);
                }
            }
            else if(reqData.goodIdList.length == 1)
            {
                sql += "=?";
                sqlParams = reqData.goodIdList[0];
            }
            connection.query(sql,sqlParams,(err)=>{
                if(err)
                {
                    console.log(err);
                    res.json({
                        "code":"-1",
                        "message":err,
                    });
                }
                else
                {
                    console.log("生成订单成功，已成功从用户购物车清除生成订单的商品");
                    res.json({
                        "code":"0",
                        "message":"已成功删除生成订单的商品"
                    });
                }
            });
        }
    });
});

module.exports = route;