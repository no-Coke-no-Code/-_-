const express = require("express");
const api = require("./api.js");

const server = express();

server.all("*",(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    // OPTIONS请求方法的主要用途有两个：
    // 1、获取服务器支持的HTTP请求方法；也是黑客经常使用的方法。
    // 2、用来检查服务器的性能。例如：AJAX进行跨域请求时的预检，
    // 需要向另外一个域名的资源发送一个HTTP OPTIONS请求头，
    // 用以判断实际发送的请求是否安全。
    if(req.method == 'OPTIONS')
    {
        res.sendStatus(200);
    }
    else
    {
        next();
    }
});
server.use(api());
// server.use('/', api());

server.listen(3333,()=>{
    console.log("正在监听端口3333");
});