const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post("/guestInfo",(req,res) => {
    let reqData = "";
    req.on("data",(chunk) => {
        reqData = reqData + chunk;
    });
    req.on("end",() => {
        reqData = JSON.parse(reqData);
        console.log(reqData);
        var sql = "";
        var sqlParams = [];
        switch(reqData.method)
        {
            case "refresh":
            {
                sql = "SELECT * FROM user WHERE user_nickname = ?";
                sqlParams = [reqData.userName];
                connection.query(sql,sqlParams,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let responseData = {
                            "state":"成功",
                            "data":JSON.parse(JSON.stringify(data))
                        };
                        console.log(responseData);
                        res.json(responseData);
                    }
                });
                break;
            }
            case "updateUserInfo":{
                console.log(reqData.userInfo.phone.length);
                sql = "UPDATE user SET user_password=?,user_address=?,user_phone=?,user_email=? WHERE user_nickname=?";
                sqlParams = [
                    reqData.userInfo.password,
                    reqData.userInfo.address,
                    reqData.userInfo.phone,
                    reqData.userInfo.email,
                    reqData.userInfo.nickname,
                ];
                connection.query(sql,sqlParams,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        console.log("更新成功");
                        res.json({
                            "state":"更新成功",
                        });
                    }
                });
                break;
            }
            case "guestOrder":{
                // 这里有个坑:不可以使用order作为mysql的表名
                if(reqData.orderState == "all")
                {
                    sql = "SELECT * FROM orderList WHERE user_nickname = ?";
                    // sql = "SELECT * FROM order WHERE user_nickname = ?";
                    sqlParams = [reqData.userName];
                    connection.query(sql,sqlParams,(err,data) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            console.log(JSON.parse(JSON.stringify(data)));
                            res.json(
                                JSON.parse(JSON.stringify(data))
                            );
                        }
                    });
                }
                if(reqData.orderState == "b")
                {
                    // sql = "SELECT * FROM order WHERE user_nickname = ?";
                    sql = "SELECT * FROM orderList WHERE user_nickname = ? AND orderList_state = 'b'";
                    sqlParams = [reqData.userName];
                    connection.query(sql,sqlParams,(err,data) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            console.log(JSON.parse(JSON.stringify(data)));
                            res.json(
                                JSON.parse(JSON.stringify(data))
                            );
                        }
                    });
                }
                if(reqData.orderState == "f")
                {
                    // sql = "SELECT * FROM order WHERE user_nickname = ?";
                    sql = "SELECT * FROM orderList WHERE user_nickname = ? AND orderList_state = 'f'";
                    sqlParams = [reqData.userName];
                    connection.query(sql,sqlParams,(err,data) => {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            console.log(JSON.parse(JSON.stringify(data)));
                            res.json(
                                JSON.parse(JSON.stringify(data))
                            );
                        }
                    });
                }
            }
        }
    });
});

module.exports = route;