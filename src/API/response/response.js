var response = {
    responseSuccess:(resData) => {
        return{
            'code':'0',
            'message':'成功返回数据',
            'data':resData
        }
    },
    responseFail:(resData) => {
        return{
            'code':'-1',
            'message':'返回数据失败',
            'err':resData
        }
    },
}


module.exports = response;