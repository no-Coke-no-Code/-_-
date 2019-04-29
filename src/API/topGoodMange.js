const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");
const response = require("../response/response")
const _ = require("../utils/utils.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/topGoodMange',(req,res)=>{
    let sql = '';
    let sqlParams = '';
    let requestData = '';
    req.on('data',(chunk)=>{
        requestData += chunk;
    });
    req.on('end',()=>{
        requestData = JSON.parse(requestData);
        switch(requestData.method){
            case 'getAllGood':
            sql = "SELECT * FROM good";
            connection.query(sql,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    console.log(responseData);
                    res.send({
                        "code":'0',
                        'message':'返回数据成功',
                        'data':responseData
                    });
                }
            });
            break;
            case 'getTopGood':
            sql = "SELECT * FROM superior_good";
            connection.query(sql,(err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    res.json({
                        'code':'0',
                        'message':'成功返回数据',
                        'data':responseData
                    });
                }
            });
            break;

            case 'setTopGood':
            let promise = new Promise(function(resolve,reject){
                resolve();
            });

            promise
            .then(function(){
                sql = "SELECT good_name,good_id FROM good WHERE good_id ";
                sqlParams = [requestData.good_id];
                return new Promise((resolve,reject)=>{
                    if(requestData.good_id.length > 1)
                    {
                        sql += "IN (" + requestData.good_id + ")";
                    }
                    else if(requestData.good_id.length == 1)
                    {
                        sql += "= " + requestData.good_id;
                    }
                    console.log(sql,'sql语句');
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            console.log(responseData,'testing');
                            resolve(responseData);
                        }
                    });
                });
            })
            .then(function(value){
                console.log(value,'上一个异步函数传过来的值');
                if(value.length == 1)
                {
                    sql = "INSERT INTO superior_good SET ?";
                    sqlParams = [];
                    for(let i = 0;i<value.length;i++)
                    {
                        let obj = {};
                        obj.good_name = value[i].good_name;
                        obj.good_id = value[i].good_id;
                        sqlParams.push(obj);
                    }
                    connection.query(sql,sqlParams,(err)=>{
                        if(err)
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                            return;
                        }
                        else
                        {
                            res.json(response.responseSuccess());
                        }
                    });
                }
                else if(value.length > 1)
                {
                    sql = "INSERT INTO superior_good(good_name,good_id) VALUES ";
                    for(let i = 0;i<value.length;i++)
                    {
                        sql += "('" + value[i].good_name + "'," + value[i].good_id + "),"; 
                    }
                    sql = _.deleting(sql,",",-1);
                    connection.query(sql,(err)=>{
                        if(err) 
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                            return;
                        }
                        else
                        {
                            res.json(response.responseSuccess());
                        }
                    });
                }
            });
            break;

            case 'removeTopGood':
            sql = "DELETE FROM superior_good WHERE good_id ";
            sqlParams = [requestData.good_id];
            if(requestData.good_id.length == 1)
            {
                sql += "= ?";
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
                        console.log(responseData);
                        res.json(response.responseSuccess(responseData));
                    }
                });
            }
            else if(requestData.good_id.length > 1)
            {
                sql += "IN (";
                for(let i = 0;i<requestData.good_id.length;i++)
                {
                    sql += requestData.good_id[i] + ","; 
                }
                sql += ")";
                sql = _.deleting(sql,",",-1);
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        res.json(response.responseFail(err));
                        return;
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        res.json(response.responseSuccess(responseData));
                    }
                });
            }
            break

            case "getNewGood":
            sql = "SELECT * FROM newest_good";
            connection.query(sql,(err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    res.json({
                        'code':'0',
                        'message':'成功返回数据',
                        'data':responseData
                    });
                }
            });
            break;

            case "setNewGood":
            let promise2 = new Promise(function(resolve,reject){
                resolve();
            });

            promise2
            .then(function(){
                sql = "SELECT good_name,good_id FROM good WHERE good_id ";
                sqlParams = [requestData.good_id];
                return new Promise((resolve,reject)=>{
                    if(requestData.good_id.length > 1)
                    {
                        sql += "IN (" + requestData.good_id + ")";
                    }
                    else if(requestData.good_id.length == 1)
                    {
                        sql += "= " + requestData.good_id;
                    }
                    console.log(sql,'sql语句');
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            console.log(responseData,'testing');
                            resolve(responseData);
                        }
                    });
                });
            })
            .then(function(value){
                console.log(value,'上一个异步函数传过来的值');
                if(value.length == 1)
                {
                    sql = "INSERT INTO newest_good SET ?";
                    sqlParams = [];
                    for(let i = 0;i<value.length;i++)
                    {
                        let obj = {};
                        obj.good_name = value[i].good_name;
                        obj.good_id = value[i].good_id;
                        sqlParams.push(obj);
                    }
                    connection.query(sql,sqlParams,(err)=>{
                        if(err)
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                            return;
                        }
                        else
                        {
                            res.json(response.responseSuccess());
                        }
                    });
                }
                else if(value.length > 1)
                {
                    sql = "INSERT INTO newest_good(good_name,good_id) VALUES ";
                    for(let i = 0;i<value.length;i++)
                    {
                        sql += "('" + value[i].good_name + "'," + value[i].good_id + "),"; 
                    }
                    sql = _.deleting(sql,",",-1);
                    connection.query(sql,(err)=>{
                        if(err)
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                            return;
                        }
                        else
                        {
                            res.json(response.responseSuccess());
                        }
                    });
                }
            });
            break;

            case "removeNewGood":
            sql = "DELETE FROM newest_good WHERE good_id ";
            sqlParams = [requestData.good_id];
            if(requestData.good_id.length == 1)
            {
                sql += "= ?";
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
                        console.log(responseData);
                        res.json(response.responseSuccess(responseData));
                    }
                });
            }
            else if(requestData.good_id.length > 1)
            {
                sql += "IN (";
                for(let i = 0;i<requestData.good_id.length;i++)
                {
                    sql += requestData.good_id[i] + ","; 
                }
                sql += ")";
                sql = _.deleting(sql,",",-1);
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        res.json(response.responseFail(err));
                        return;
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        res.json(response.responseSuccess(responseData));
                    }
                });
            }
            break;

            case "getForeignGood":
            sql = "SELECT * FROM foreign_good";
            connection.query(sql,(err,data)=>{
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let responseData = JSON.parse(JSON.stringify(data));
                    res.json({
                        'code':'0',
                        'message':'成功返回数据',
                        'data':responseData
                    });
                }
            });
            break;

            case "setForeignGood":
            let promise3 = new Promise(function(resolve,reject){
                resolve();
            });

            promise3
            .then(function(){
                sql = "SELECT good_name,good_id FROM good WHERE good_id ";
                sqlParams = [requestData.good_id];
                return new Promise((resolve,reject)=>{
                    if(requestData.good_id.length > 1)
                    {
                        sql += "IN (" + requestData.good_id + ")";
                    }
                    else if(requestData.good_id.length == 1)
                    {
                        sql += "= " + requestData.good_id;
                    }
                    console.log(sql,'sql语句');
                    connection.query(sql,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                            return;
                        }
                        else
                        {
                            let responseData = JSON.parse(JSON.stringify(data));
                            console.log(responseData,'testing');
                            resolve(responseData);
                        }
                    });
                });
            })
            .then(function(value){
                console.log(value,'上一个异步函数传过来的值');
                if(value.length == 1)
                {
                    sql = "INSERT INTO foreign_good SET ?";
                    sqlParams = [];
                    for(let i = 0;i<value.length;i++)
                    {
                        let obj = {};
                        obj.good_name = value[i].good_name;
                        obj.good_id = value[i].good_id;
                        sqlParams.push(obj);
                    }
                    connection.query(sql,sqlParams,(err)=>{
                        if(err)
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                            return;
                        }
                        else
                        {
                            res.json(response.responseSuccess());
                        }
                    });
                }
                else if(value.length > 1)
                {
                    sql = "INSERT INTO foreign_good(good_name,good_id) VALUES ";
                    for(let i = 0;i<value.length;i++)
                    {
                        sql += "('" + value[i].good_name + "'," + value[i].good_id + "),"; 
                    }
                    sql = _.deleting(sql,",",-1);
                    connection.query(sql,(err)=>{
                        if(err)
                        {
                            console.log(err);
                            res.json(response.responseFail(err));
                            return;
                        }
                        else
                        {
                            res.json(response.responseSuccess());
                        }
                    });
                }
            });
            break;

            case "removeForeignGood":
            sql = "DELETE FROM foreign_good WHERE good_id ";
            sqlParams = [requestData.good_id];
            if(requestData.good_id.length == 1)
            {
                sql += "= ?";
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
                        console.log(responseData);
                        res.json(response.responseSuccess(responseData));
                    }
                });
            }
            else if(requestData.good_id.length > 1)
            {
                sql += "IN (";
                for(let i = 0;i<requestData.good_id.length;i++)
                {
                    sql += requestData.good_id[i] + ","; 
                }
                sql += ")";
                sql = _.deleting(sql,",",-1);
                connection.query(sql,(err,data)=>{
                    if(err)
                    {
                        res.json(response.responseFail(err));
                        return;
                    }
                    else
                    {
                        let responseData = JSON.parse(JSON.stringify(data));
                        res.json(response.responseSuccess(responseData));
                    }
                });
            }
            break;
            
            default:break;
        }
    });
});

module.exports = route;