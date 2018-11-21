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

    // 后台管理商品信息功能
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
                                // res.end();
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
                    console.log(requestData.addGoodForm);
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
                            console.log(data);
                            console.log("增加操作已完成");
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
                default:break;
            };
        });
    });

    // 后台管理用户信息功能
    route.post('/userMange',(req,res) => {
        let requestData = "";
        req.on('data',(chunk) => {
            requestData += chunk;
        });
        req.on('end',() => {
            requestData = JSON.parse(requestData);
            console.log(requestData.method);
            if(requestData.method == "searchAll")
            {
                let sql = "SELECT * FROM user";
                connection.query(sql,(err,data) => {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        let searchResult = JSON.parse(JSON.stringify(data));
                        console.log(searchResult);
                        res.json({
                            "state":"done",
                            "responseData":searchResult
                        });
                    }
                });
            }
            if(requestData.method == "searchSome")
            {
                let sql = "SELECT * FROM user WHERE ";
                if(requestData.userForm.id != "")
                {
                    sql += "user_id=" + requestData.userForm.id + " AND ";
                }
                if(requestData.userForm.realname != "")
                {
                    sql += "user_realname='" + requestData.userForm.realname + "' AND ";
                }
                if(requestData.userForm.nickname != "")
                {
                    sql += "user_nickname='" + requestData.userForm.nickname + "' AND ";
                }
                if(requestData.userForm.sex != "")
                {
                    sql += "user_sex='" + requestData.userForm.sex + "' AND ";
                }
                if(requestData.userForm.address != "")
                {
                    sql += "user_address='" + requestData.userForm.address + "' AND ";
                }
                if(requestData.userForm.phone != "")
                {
                    sql += "user_phone=" + requestData.userForm.phone + " AND ";
                }
                if(requestData.userForm.email != "")
                {
                    sql += "user_email='" + requestData.userForm.email + "' AND ";
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
                        res.json({
                            "state":"success",
                            "responseData":JSON.parse(JSON.stringify(data))
                        });
                        console.log(JSON.parse(JSON.stringify(data)));
                    }
                });
            }
        });
    });


    return route;
};