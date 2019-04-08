const response = require("./../response/response.js");
const _ = require("./../utils/utils.js");
const async = require("async");

var func = function(){};
func.prototype = {
    // 扩展模块方法
    extend:(target,source)=>{
        for(var i in source)
        {
            target[i] = source[i];
        }
        return target;
    },
};
func = new func();

// 管理员模块方法
// 管理员登录
func.extend(func,{
    adminLogin:(data,connection,req,res)=>{
        let sql = 'SELECT * FROM admin WHERE admin_account=? AND admin_password=?';
        let sqlParams = [data.admin_account,data.admin_password];
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
                        "state":1,
                        "admin":queryData[0]
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
    },
});

// 用户模块方法
// 获取用户头像图片
func.extend(func,{
    getUserHeadImg:(data,connection,req,res,ifPromise)=>{
        // let commentList = [];
        // commentList = JSON.parse(JSON.stringify(data));
        // let sql = "SELECT user_headImg FROM user WHERE user_nickname = ?";
        // let sqlParams = [];
        // let userHeadImgList = [];

        // let funcList = [];
        // // 这里使用了效率比较低的方法，看看以后会不会有更优的方法
        // // 通过传进来的用户ID数组，按照顺序，分别查询N次数据库（promise）
        // // 最后通过Promise.all将所有操作整合再返回
        // function createPromise(commentList,i){
        //     var promises = new Promise((resolve,reject)=>{
        //         sqlParams = [];
        //         sqlParams.push(commentList[i].user_nickname);
        //         connection.query(sql,sqlParams,(err,data)=>{
        //             if(err)
        //             {
        //                 console.log(err);
        //             }
        //             else
        //             {
        //                 // 这里返回的其实是一个数组
        //                 let responseData = JSON.parse(JSON.stringify(data));
        //                 resolve(responseData[0].user_headImg);
        //             }
        //         });
        //     });
        //     return promises;
        // };
        // for(let i = 0;i<commentList.length;i++)
        // {
        //     funcList.push(createPromise(commentList,i));
        // };
        // let promiseAll = Promise.all(funcList);
        // promiseAll
        // .then((value)=>{
        //     userHeadImgList = JSON.parse(JSON.stringify(value));
        //     return userHeadImgList;
        // })
        // .then((value)=>{
        //     console.log(value);
        //     console.log("我要证明promise的返回值无法返回");
        // })
        // .catch((err)=>{
        //     console.log(err);
        // });
    }
});

// 评论模块方法

// 商品管理模块方法

// 评论模块方法

module.exports = func;