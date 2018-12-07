const queryString = require("querystring");

var demoJson = {
    name:'YRL',
    age:21
};

console.log(queryString.stringify(demoJson));