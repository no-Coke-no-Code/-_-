module.exports = {
    host:'localhost',
    user:'root',
    password:'coke43',
    database:'test1',
    timezone:"08:00"
};
// timezone：用来改变时区
// 因为使用nodejs获取mysql里面的时间，会比实际的时间要少8个小时（时区的缘故）
// 数据库里面存的是我所设置的中国标准时时间    而这边获取的话会自动转化为UTC通用标准时间