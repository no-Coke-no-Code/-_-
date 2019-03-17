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

route.post("/categoryMange",(req,res) => {
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
                // 1.添加商品类别
                case "addCategory":
                    sql = "SELECT * FROM category WHERE category_name=?";
                    sqlParams = [requestData.categoryName];
                    if(!requestData.categoryName)
                    {
                        console.log("传了空值过来了，沙雕");
                        return;
                    }
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            if(responseData.length>0)
                            {
                                res.json({
                                    "code":"-1",
                                    "message":"添加类别失败"
                                });
                            }
                            else
                            {
                                sql = "INSERT INTO category set ?";
                                sqlParams = [{
                                    "category_name":requestData.categoryName
                                }];
                                connection.query(sql,sqlParams,(err,data)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        res.json({
                                            "code":"0",
                                            "message":"添加商品类别成功",
                                        });
                                    }
                                });
                            }
                        }
                    });
                break;

                // 查看所有商品种类（每个父类包含各自的子类）
                case "checkCategory":
                let promise3 = new Promise((resolve,reject)=>{
                    sql = "SELECT category_name FROM category";
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            // res.json({
                            //     "code":"0",
                            //     "message":"查询商品类别成功",
                            //     "data":responseData
                            // });
                            console.log(responseData);
                            console.log("我想看看这个");
                            resolve(responseData);
                        }
                    });
                });
                promise3.then((value)=>{
                    sql = "SELECT subCatalog_name,catalog_name FROM subCatalog WHERE catalog_name IN (";
                    for(let i = 0;i<value.length;i++)
                    {
                        sql += "'" + value[i].category_name + "',";
                    }
                    sql = _.deleting(sql,",",-1);
                    sql += ")";
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            for(let i = 0;i<value.length;i++)
                            {
                                value[i].subCatalog_name = [];
                                for(let x = 0;x<responseData.length;x++)
                                {
                                    if(responseData[x].catalog_name == value[i].category_name)
                                    {
                                        value[i].subCatalog_name.push(responseData[x].subCatalog_name);
                                    }
                                }
                            }
                            console.log(value);
                            res.json(response.responseSuccess(value));
                        }
                    });
                });
                break;

                // 查询所有的商品子种类
                case "checkAllSubCatalog":
                    sql = "SELECT subCatalog_name,catalog_name FROM subCatalog";
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            res.json(response.responseSuccess(responseData));
                        }
                    });
                break;

                // 根据选择的父类查询相对应商品子种类
                case "checkSubCatalog":
                    sql = "SELECT subCatalog_name FROM subCatalog WHERE catalog_name = ?";
                    sqlParams = [requestData.catalog_name];
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
                // 根据选择的父类查询相对应商品子种类
                case "addSubCatalog":
                    let promise = new Promise((resolve,reject)=>{
                        sql = "SELECT * FROM subCatalog WHERE subCatalog_name = ?";
                        sqlParams = [requestData.subCatalog_name];
                        connection.query(sql,sqlParams,(err,data)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                let responseData = JSON.parse(JSON.stringify(data));
                                if(responseData.length == 0)
                                {
                                    resolve();
                                }
                                else
                                {
                                    res.json(response.responseFail("该分类已存在该子目录"));
                                }
                            }
                        });
                    });
                    promise.then((resolve,reject)=>{
                        sql = "INSERT INTO subCatalog SET ?";
                        sqlParams = [{
                            "catalog_name":requestData.catalog_name,
                            "subCatalog_name":requestData.subCatalog_name,
                        }];
                        connection.query(sql,sqlParams,(err,data)=>{
                            if(err)
                            {
                                console.log(err);
                                res.json(response.responseFail("新增子分类失败失败"));
                            }
                            else
                            {
                                res.json(response.responseSuccess("新增子分类成功"));
                            }
                        });
                    });
                break;

                case "deleteCatalog":
                sql = "DELETE FROM category WHERE category_name = ?";
                sqlParams = [requestData.category_name];
                connection.query(sql,sqlParams,(err)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json(response.responseFail(err));
                    }
                    else
                    {
                        res.json(response.responseSuccess("删除成功"));
                    }
                });
                break;

                case "deleteSubCatalog":
                sql = "DELETE FROM subCatalog WHERE subCatalog_name = ?";
                sqlParams = [requestData.subCatalog_name];
                connection.query(sql,sqlParams,(err)=>{
                    if(err)
                    {
                        console.log(err);
                        res.json(response.responseFail(err));
                    }
                    else
                    {
                        res.json(response.responseSuccess("删除成功"));
                    }
                });
                break;

                default:break;
        }
    });
});

module.exports = route;