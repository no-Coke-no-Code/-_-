const express = require("express");
const mysql = require("mysql");
const formidable = require("formidable");
const path = require('path');
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/goodMange",(req,res) => {
    var sql = "";
    var sqlParams = "";
    let requestData = "";
    req.on('data',(chunk) => {
        requestData += chunk;
    });
    req.on('end',() => {
            requestData = JSON.parse(requestData);
            // 通过判断传过来的method来判断算需要进行的操作
            switch(requestData.method){
                // 查询接口
                // 1.查询所有数据
                case "searchGood":
                    if(requestData.ifAll)
                    {
                        sql = "SELECT * FROM good";
                        connection.query(sql,(err,data) => {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                console.log(JSON.parse(JSON.stringify(data)));
                                res.send(JSON.parse(JSON.stringify(data)));
                            }
                        });
                    }
                    // 2.查询特定条件的数据
                    else
                    {
                        console.log(requestData.goodForm);
                        let sql = "SELECT * FROM good WHERE ";
                        if(requestData.goodForm.id != "")
                        {
                            sql += "good_id=" + requestData.goodForm.id + " AND ";
                        }
                        if(requestData.goodForm.name != "")
                        {
                            sql += "good_name='" + requestData.goodForm.name + "' AND ";
                        }
                        if(requestData.goodForm.price != "")
                        {
                            let lowPrice = requestData.goodForm.price.split("-")[0];
                            let highPrice = requestData.goodForm.price.split("-")[1];
                            console.log("最高价:"+highPrice + "最低价:" + lowPrice);
                            sql += "good_price BETWEEN " + lowPrice + " AND " + highPrice + " AND ";
                        }
                        if(requestData.goodForm.type != "")
                        {
                            sql += "good_type='" + requestData.goodForm.type + "' AND ";
                        }
                        if(requestData.goodForm.from != "")
                        {
                            sql += "good_from='" + requestData.goodForm.from + " AND ";
                        }
                        if(requestData.goodForm.unit != "")
                        {
                            sql += "good_unit='" + requestData.goodForm.unit + "' AND ";
                        }
                        sql = sql.split(" ").slice(0,-2).join(" ");
                        console.log(sql);
                        connection.query(sql,(err,data) => {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                res.send(JSON.parse(JSON.stringify(data)));
                                console.log(JSON.parse(JSON.stringify(data)));
                            }
                        });
                    }
                break;
                case "addGood":
                // 增加商品接口
                    console.log(requestData.addGoodForm.name);
                    sql = "SELECT * FROM good WHERE good_name=?";
                    sqlParams = [requestData.addGoodForm.name];
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseNum = JSON.parse(JSON.stringify(data));
                            if(responseNum.length == 0)
                            {
                                sql = "INSERT INTO good SET ?";
                                sqlParams = {
                                    good_name:requestData.addGoodForm.name,
                                    good_price:requestData.addGoodForm.price,
                                    category_name:requestData.addGoodForm.type,
                                    good_imgurl:requestData.addGoodForm.imgurl,
                                    good_detail:requestData.addGoodForm.detail,
                                    good_unit:requestData.addGoodForm.unit,
                                    good_from:requestData.addGoodForm.from,
                                };
                                connection.query(sql,sqlParams,(err,data) => {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        let responseData = JSON.parse(JSON.stringify(data));
                                        res.json({
                                            'code':0,
                                            'message':"添加商品成功",
                                            'data':responseData
                                        });
                                    }
                                });
                            }
                        }
                    });
                break;
                // 删除商品接口
                case "deleteGood":
                    sql = "DELETE FROM good WHERE good_id=?";
                    sqlParams = [requestData.deleteId];
                    console.log(sqlParams);
                    connection.query(sql,sqlParams,(err,data) => {
                        if(err)
                        {
                            console.log(err);
                            res.json({
                                "state":"fail"
                            });
                        }
                        else
                        {
                            console.log("成功删除数据");
                            console.log(data);
                            res.json({
                                "state":"success",
                            });
                        }
                    });
                break;
                // 编辑商品接口
                case "editGood":
                    sql = "UPDATE good SET good_name=? , good_price=? , category_name=? , good_detail=? , good_from=? , good_unit=? , good_imgurl=? WHERE good_id=?";
                    sqlParams = [
                        requestData.editForm.name,
                        requestData.editForm.price,
                        requestData.editForm.type,
                        requestData.editForm.detail,
                        requestData.editForm.from,
                        requestData.editForm.unit,
                        requestData.editForm.imgurl,
                        requestData.editForm.id,
                    ];
                    connection.query(sql,sqlParams,(err) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            res.json({
                                "state":"done"
                            });
                            console.log("成功编辑数据");
                        }
                    });
                break;
                // 刷新商品信息接口
                case "refreshGood":
                    sql = "SELECT * FROM good WHERE good_name=?";
                    sqlParams = [requestData.good_name];
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let resData = JSON.parse(JSON.stringify(data));
                            res.json({
                                "code":"0",
                                "message":"成功返回数据",
                                "data":resData
                            });
                        }
                    });
                break;
                default:break;
        }
    });
});

module.exports = route;