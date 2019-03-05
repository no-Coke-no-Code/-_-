var response = {
    responseSuccess:(resData) => {
        if(resData == undefined || resData == null)
        {
            return{
                'code':'0',
                'message':'成功返回数据',
            }
        }
        else
        {
            return{
                'code':'0',
                'message':'成功返回数据',
                'data':resData
            }
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