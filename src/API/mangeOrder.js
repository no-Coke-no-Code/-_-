const express = require("express");
const mysql = require("mysql");
// 连接mysql数据库的基本配置
const mysqlConfig = require("./../../mysql.config.js");

// 实例化express路由
const route = express.Router();

// 连接数据库
var connection = mysql.createConnection(mysqlConfig);
connection.connect();

route.post('/mangeOrder',(req,res) => {
    let reqData = "";
    req.on('data',(chunk)=>{
        reqData += chunk;
    });
    req.on('end',(err)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            reqData = JSON.parse(reqData);
            console.log("所要查询的用户名字",reqData.userName);
            console.log("所要查询的订单类型",reqData.orderType);
            console.log("所要查询的订单开始范围",reqData.startTimeRange);
            console.log("所要查询的订单结束范围",reqData.endTimeRange);
            let sql = "";
            let sqlParams = [];
            switch(reqData.orderType){
                case "all":
                    if(reqData.userName == "all")
                    {
                        sql = "SELECT * FROM orderlist";
                        if(reqData.startTimeRange)
                        {
                            sql += " WHERE orderList_startTime BETWEEN '" + reqData.startTimeRange[0] + "' AND '" + reqData.startTimeRange[1]+"'";
                        }
                        else if(reqData.endTimeRange && !reqData.startTimeRange)
                        {
                            sql += " WHERE orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }
                        if(reqData.endTimeRange && reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }
                        console.log(sql);
                        // 这里是先查询出全部有多少订单
                        connection.query(sql,(err,data)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                let reqOrderList = JSON.parse(JSON.stringify(data));
                                if(reqOrderList.length == 0)
                                {
                                    res.json({
                                        'code':'0',
                                        "message":'成功返回数据',
                                        'data':reqOrderList
                                    });
                                    return;
                                }
                                sqlParams = [];
                                sql = "SELECT * FROM orderitem WHERE orderList_id IN (";
                                for(let i =0;i<reqOrderList.length;i++)
                                {
                                    sqlParams.push(reqOrderList[i].orderList_id);
                                    if(i == reqOrderList.length-1)
                                    {
                                        sql += "?)";
                                    }
                                    else
                                    {
                                        sql += "?,";
                                    }
                                }
                                // 这里是查询出刚查询的订单中的商品列表项(结果尚未得知商品属于哪个订单)
                                connection.query(sql,sqlParams,(err,data)=>{
                                    if(err)  
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        let result = JSON.parse(JSON.stringify(data));
                                        if(result.length == 0)
                                        {
                                            res.json({
                                                'code':'0',
                                                "message":'成功返回数据',
                                                'data':reqOrderList
                                            });
                                            return;
                                        }
                                        for(let i = 0;i<reqOrderList.length;i++)
                                        {
                                            reqOrderList[i].goodList = [];
                                            for(let x = 0;x<result.length;x++)
                                            {
                                                if(reqOrderList[i].orderList_id == result[x].orderList_id)
                                                {
                                                    reqOrderList[i].goodList.push(result[x]);
                                                }
                                            }
                                        }
                                        res.json({
                                            "code":'0',
                                            "data":reqOrderList,
                                            "message":'成功返回数据'
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        sql = "SELECT * FROM orderlist WHERE user_nickname = ?";
                        if(reqData.startTimeRange)
                        {
                            sql += " AND orderList_startTime BETWEEN '" + reqData.startTimeRange[0] + "' AND '" + reqData.startTimeRange[1]+"'";
                        }
                        else if(reqData.endTimeRange && !reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }
                        if(reqData.endTimeRange && reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }
                        sqlParams = [reqData.userName];
                        // 这里是先查询某个用户有多少订单
                        connection.query(sql,sqlParams,(err,data)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                let reqOrderList = JSON.parse(JSON.stringify(data));
                                if(reqOrderList.length == 0)
                                {
                                    res.json({
                                        'code':'0',
                                        "message":'成功返回数据',
                                        'data':reqOrderList
                                    });
                                    return;
                                }
                                sqlParams = [];
                                sql = "SELECT * FROM orderitem WHERE orderList_id IN (";
                                for(let i =0;i<reqOrderList.length;i++)
                                {
                                    sqlParams.push(reqOrderList[i].orderList_id);
                                    if(i == reqOrderList.length-1)
                                    {
                                        sql += "?)";
                                    }
                                    else
                                    {
                                        sql += "?,";
                                    }
                                }
                                // 这里是查询出刚查询的订单中的商品列表项(结果尚未得知商品属于哪个订单)
                                connection.query(sql,sqlParams,(err,data)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        let result = JSON.parse(JSON.stringify(data));
                                        if(result.length == 0)
                                        {
                                            res.json({
                                                'code':'0',
                                                "message":'成功返回数据',
                                                'data':result
                                            });
                                            return;
                                        }
                                        for(let i = 0;i<reqOrderList.length;i++)
                                        {
                                            reqOrderList[i].goodList = [];
                                            for(let x = 0;x<result.length;x++)
                                            {
                                                if(reqOrderList[i].orderList_id == result[x].orderList_id)
                                                {
                                                    reqOrderList[i].goodList.push(result[x]);
                                                }
                                            }
                                        }
                                        res.json({
                                            "code":'0',
                                            "data":reqOrderList,
                                            "message":'成功返回数据'
                                        });
                                    }
                                });
                            }
                        });
                    }
                break;
                case "finish":
                    if(reqData.userName == "all")
                    {
                        sql = "SELECT * FROM orderlist WHERE orderList_state=?";

                        if(reqData.startTimeRange)
                        {
                            sql += " AND orderList_startTime BETWEEN '" + reqData.startTimeRange[0] + "' AND '" + reqData.startTimeRange[1]+"'";
                        }
                        else if(reqData.endTimeRange && !reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }
                        if(reqData.endTimeRange && reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }

                        sqlParams = ["f"];
                        connection.query(sql,sqlParams,(err,data)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                let reqOrderList = JSON.parse(JSON.stringify(data));
                                if(reqOrderList.length == 0)
                                {
                                    res.json({
                                        'code':'0',
                                        "message":'成功返回数据',
                                        'data':reqOrderList
                                    });
                                    return;
                                }
                                sqlParams = [];
                                sql = "SELECT * FROM orderitem WHERE orderList_id IN (";
                                for(let i =0;i<reqOrderList.length;i++)
                                {
                                    sqlParams.push(reqOrderList[i].orderList_id);
                                    if(i == reqOrderList.length-1)
                                    {
                                        sql += "?)";
                                    }
                                    else
                                    {
                                        sql += "?,";
                                    }
                                }
                                // 这里是查询出刚查询的订单中的商品列表项(结果尚未得知商品属于哪个订单)
                                connection.query(sql,sqlParams,(err,data)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        let result = JSON.parse(JSON.stringify(data));
                                        for(let i = 0;i<reqOrderList.length;i++)
                                        {
                                            reqOrderList[i].goodList = [];
                                            for(let x = 0;x<result.length;x++)
                                            {
                                                if(reqOrderList[i].orderList_id == result[x].orderList_id)
                                                {
                                                    reqOrderList[i].goodList.push(result[x]);
                                                }
                                            }
                                        }
                                        res.json({
                                            "code":'0',
                                            "data":reqOrderList,
                                            "message":'成功返回数据'
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        sql = "SELECT * FROM orderlist WHERE orderList_state=? AND user_nickname=?";

                        if(reqData.startTimeRange)
                        {
                            sql += " AND orderList_startTime BETWEEN '" + reqData.startTimeRange[0] + "' AND '" + reqData.startTimeRange[1]+"'";
                        }
                        else if(reqData.endTimeRange && !reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }
                        if(reqData.endTimeRange && reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }

                        sqlParams = ['f',reqData.userName];
                        connection.query(sql,sqlParams,(err,data)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                let reqOrderList = JSON.parse(JSON.stringify(data));
                                if(reqOrderList.length == 0)
                                {
                                    res.json({
                                        'code':'0',
                                        "message":'成功返回数据',
                                        'data':reqOrderList
                                    });
                                    return;
                                }
                                sqlParams = [];
                                sql = "SELECT * FROM orderitem WHERE orderList_id IN (";
                                for(let i =0;i<reqOrderList.length;i++)
                                {
                                    sqlParams.push(reqOrderList[i].orderList_id);
                                    if(i == reqOrderList.length-1)
                                    {
                                        sql += "?)";
                                    }
                                    else
                                    {
                                        sql += "?,";
                                    }
                                }
                                // 这里是查询出刚查询的订单中的商品列表项(结果尚未得知商品属于哪个订单)
                                connection.query(sql,sqlParams,(err,data)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        let result = JSON.parse(JSON.stringify(data));
                                        if(result.length == 0)
                                        {
                                            res.json({
                                                'code':'0',
                                                "message":'成功返回数据',
                                                'data':result
                                            });
                                            return;
                                        }
                                        for(let i = 0;i<reqOrderList.length;i++)
                                        {
                                            reqOrderList[i].goodList = [];
                                            for(let x = 0;x<result.length;x++)
                                            {
                                                if(reqOrderList[i].orderList_id == result[x].orderList_id)
                                                {
                                                    reqOrderList[i].goodList.push(result[x]);
                                                }
                                            }
                                        }
                                        res.json({
                                            "code":'0',
                                            "data":reqOrderList,
                                            "message":'成功返回数据'
                                        });
                                    }
                                });
                            }
                        });
                    }
                break;
                case "begin":
                if(reqData.userName == "all")
                {
                    sql = "SELECT * FROM orderlist WHERE orderList_state=?";

                    if(reqData.startTimeRange)
                    {
                        sql += " AND orderList_startTime BETWEEN '" + reqData.startTimeRange[0] + "' AND '" + reqData.startTimeRange[1]+"'";
                    }
                    else if(reqData.endTimeRange && !reqData.startTimeRange)
                    {
                        sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                    }
                    if(reqData.endTimeRange && reqData.startTimeRange)
                    {
                        sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                    }

                    sqlParams = ["b"];
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let reqOrderList = JSON.parse(JSON.stringify(data));
                            if(reqOrderList.length == 0)
                            {
                                res.json({
                                    'code':'0',
                                    "message":'成功返回数据',
                                    'data':reqOrderList
                                });
                                return;
                            }
                            sqlParams = [];
                            sql = "SELECT * FROM orderitem WHERE orderList_id IN (";
                            for(let i =0;i<reqOrderList.length;i++)
                            {
                                sqlParams.push(reqOrderList[i].orderList_id);
                                if(i == reqOrderList.length-1)
                                {
                                    sql += "?)";
                                }
                                else
                                {
                                    sql += "?,";
                                }
                            }
                            // 这里是查询出刚查询的订单中的商品列表项(结果尚未得知商品属于哪个订单)
                            connection.query(sql,sqlParams,(err,data)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                                else
                                {
                                    let result = JSON.parse(JSON.stringify(data));
                                    if(result.length == 0)
                                    {
                                        res.json({
                                            'code':'0',
                                            "message":'成功返回数据',
                                            'data':result
                                        });
                                        return;
                                    }
                                    for(let i = 0;i<reqOrderList.length;i++)
                                    {
                                        reqOrderList[i].goodList = [];
                                        for(let x = 0;x<result.length;x++)
                                        {
                                            if(reqOrderList[i].orderList_id == result[x].orderList_id)
                                            {
                                                reqOrderList[i].goodList.push(result[x]);
                                            }
                                        }
                                    }
                                    res.json({
                                        "code":'0',
                                        "data":reqOrderList,
                                        "message":'成功返回数据'
                                    });
                                }
                            });
                        }
                    });
                }
                else
                    {
                        sql = "SELECT * FROM orderlist WHERE orderList_state=? AND user_nickname=?";

                        if(reqData.startTimeRange)
                        {
                            sql += " AND orderList_startTime BETWEEN '" + reqData.startTimeRange[0] + "' AND '" + reqData.startTimeRange[1]+"'";
                        }
                        else if(reqData.endTimeRange && !reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }
                        if(reqData.endTimeRange && reqData.startTimeRange)
                        {
                            sql += " AND orderList_finishTime BETWEEN '" + reqData.endTimeRange[0] + "' AND '" + reqData.endTimeRange[1]+"'";
                        }

                        sqlParams = ['b',reqData.userName];
                        connection.query(sql,sqlParams,(err,data)=>{
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                let reqOrderList = JSON.parse(JSON.stringify(data));
                                if(reqOrderList.length == 0)
                                {
                                    res.json({
                                        'code':'0',
                                        "message":'成功返回数据',
                                        'data':reqOrderList
                                    });
                                    return;
                                }
                                sqlParams = [];
                                sql = "SELECT * FROM orderitem WHERE orderList_id IN (";
                                for(let i =0;i<reqOrderList.length;i++)
                                {
                                    sqlParams.push(reqOrderList[i].orderList_id);
                                    if(i == reqOrderList.length-1)
                                    {
                                        sql += "?)";
                                    }
                                    else
                                    {
                                        sql += "?,";
                                    }
                                }
                                // 这里是查询出刚查询的订单中的商品列表项(结果尚未得知商品属于哪个订单)
                                connection.query(sql,sqlParams,(err,data)=>{
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                    else
                                    {
                                        let result = JSON.parse(JSON.stringify(data));
                                        if(result.length == 0)
                                        {
                                            res.json({
                                                'code':'0',
                                                "message":'成功返回数据',
                                                'data':result
                                            });
                                            return;
                                        }
                                        for(let i = 0;i<reqOrderList.length;i++)
                                        {
                                            reqOrderList[i].goodList = [];
                                            for(let x = 0;x<result.length;x++)
                                            {
                                                if(reqOrderList[i].orderList_id == result[x].orderList_id)
                                                {
                                                    reqOrderList[i].goodList.push(result[x]);
                                                }
                                            }
                                        }
                                        res.json({
                                            "code":'0',
                                            "data":reqOrderList,
                                            "message":'成功返回数据'
                                        });
                                    }
                                });
                            }
                        });
                    }
                break;
                case "mange":
                    let nowTime = new Date();
                    let nowDate = nowTime.getFullYear()+"-"+(nowTime.getMonth()+1)+"-"+nowTime.getDate()+" "+nowTime.getHours()+':'+nowTime.getMinutes()+":"+nowTime.getMinutes();
                    sql = "UPDATE orderlist SET orderList_state=?,orderList_finishTime=? WHERE orderList_id = ?";
                    sqlParams = ['f',nowDate,reqData.orderList_id];
                    connection.query(sql,sqlParams,(err,data)=>{
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            let resData = JSON.parse(JSON.stringify(data));
                            res.json({
                                'code':0,
                                'message':"订单已经成功处理",
                                'data':resData
                            });
                        }
                    });
                break;

                case "checkOrderDetail":
                sql = "SELECT * FROM orderitem WHERE orderList_id ";
                if(reqData.orderList.length == 1)
                {
                    sql += "=" + reqData.orderList[0];
                }
                else if(reqData.orderList.length > 1)
                {
                    sql += "IN (";
                    for(let i = 0;i<reqData.orderList.length;i++)
                    {
                        sql += reqData.orderList[i] + ",";
                    }
                    sql = _.deleting(sql,",",-1);
                    sql += ")";
                }
                else if(!reqData.orderList.length)
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