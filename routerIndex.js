const express = require("express");
const mysql = require("mysql");
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'coke43',
    database:'test1'
});
connection.connect();

module.exports = () => {
    const route = express.Router();

    route.get("/",(req,res) => {
        res.json({
            "state":"success"
        });
    });


    // 客户端发起登录请求
    route.post("/index",(req,res)=>{
        let clientData = "";
        let ifLogin = "";
        req.on('data',(data) => {
            clientData += data;
        });
        req.on("end",() => {
            clientData = JSON.parse(clientData);
            let sql = 'SELECT * FROM user WHERE user_nickname=? AND user_password=?';
            let sqlParams = [clientData.username,clientData.password];
            connection.query(sql,sqlParams,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let queryData = JSON.parse(JSON.stringify(data));
                    ifLogin = queryData.length;
                    if(ifLogin == 1)
                    {
                        let responseData = {
                            "ifLogin":"成功",
                            "state":1
                        };
                        res.json(responseData);
                    }
                    else
                    {
                        let responseData = {
                            "ifLogin":"失败，账号或密码错误",
                            "state":0
                        };
                        res.json(responseData);
                    }
                }
            });
        });
    });

    // 客户端发起注册请求
    route.post("/register",(req,res) => {
        let clientData = "";
        let ifRegisterSucced = "";
        req.on("data",(data) => {
            clientData += data;
        });
        req.on("end",() => {
            clientData = JSON.parse(clientData);
            let sql = "SELECT COUNT(*) FROM user WHERE user_nickname = ?";
            let sqlParams = [clientData.registerUsername];
            connection.query(sql,sqlParams,(err,data) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    let queryData = JSON.parse(JSON.stringify(data));
                    if(queryData[0]['COUNT(*)'] == 0)
                    {
                        sql = "INSERT INTO user(user_nickname,user_password,user_realname,user_phone,user_sex,user_address,user_email) VALUES(?,?,?,?,?,?,?)"
                        sqlParams = [
                            clientData.registerUsername,
                            clientData.registerUserpassword,
                            clientData.registerName,
                            clientData.registerPhone,
                            clientData.registerSex,
                            clientData.registerAddress,
                            clientData.registerEmail,
                        ];
                        connection.query(sql,sqlParams,(err) => {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                res.json({
                                    "状态":"成功",
                                    "stateMent":"注册成功",
                                    "state":"1"
                                });
                            }
                        });
                    }
                    else
                    {
                        res.json({
                            "状态":"失败",
                            "stateMent":"该账户以存在",
                            "state":"0"
                        });
                    }
                }
            });
        });
    });

    // 返回商品类别,商品


    return route;
};