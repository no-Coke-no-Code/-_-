<template>
    <div class="wrapper">
        用户当前积分为{{user_creditMark}}
        用户当前身份为{{user_creditRank}}
        用户当前可享受折扣为{{user_discount==1?"无折扣优惠":user_discount}}
        下个等级{{user_creditRank==user_nextRank?"最高等级":user_nextRank}}
        下个积分{{user_creditMark==user_nextMark?"最高等级":user_nextMark}}
    </div>
</template>

<script>
export default {
    name:'guestCredit',
    data(){
        return{
            user_creditRank:"",
            user_creditMark:0,
            user_discount:"",
            user_nextRank:"",
            user_nextMark:0,
        }
    },
    methods:{
        init(){
            let that = this;
            let user_nickName = that.$store.state.userName;
            let promise = new Promise((resolve,reject)=>{
                let params = {
                    "method":"refresh",
                    "userName":user_nickName,
                };
                that.$http
                .post("/guestInfo",params)
                .then((data)=>{
                    let responseData = data.data;
                    that.user_creditMark = responseData.data[0].user_creditMark;
                    resolve(that.user_creditMark);
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
            promise.then((value)=>{
                // axios中的get请求使用须知：
                // 1.传递的参数应当是要在get函数的第二个参数中，且该参数为一个对象；
                // 数据放在该参数的params属性下
                // 此时，axios会以/xxxx?aa=bb的方式传参
                // 使用express处理请求时，需要用req.query接收参数

                // 2.如果传递的参数是直接跟在url后，如/xxx/bb
                // 此时，在express中注册路由时需要这样,/xxx/:aa
                // 使用express处理请求时间,需要用到req.params接收参数

                // 情况1
                // that.$http
                // .get("/checkCreditRank",{
                //     params:{
                //         "creditMark":value,
                //     }
                // })
                // .then((data)=>{
                //     let responseData = data.data;
                //     that.user_creditRank = responseData.data.credit_rank
                // })
                // .catch((err)=>{
                //     if(err)
                //     {
                //         console.log(err);
                //     }
                // });

                // 情况2
                // that.$http
                // .get("/credit/"+value)
                // .then((data)=>{
                //     let responseData = data.data;
                //     console.log(responseData.data);
                //     this.user_creditRank = responseData.data.user_creditRank;
                //     if(responseData.data.user_discount != 1)
                //     {
                //         this.user_discount = responseData.data.user_discount.toString().split(".")[1];
                //     }
                //     else
                //     {
                //         this.user_discount = responseData.data.user_discount;
                //     }
                // })
                // .catch((err)=>{
                //     if(err)
                //     {
                //         console.log(err);
                //     }
                // });

                let params = {
                    "method":"getCredit",
                    "creditMark":value
                };
                that.$http
                .post("/credit",params)
                .then((data)=>{
                    let responseData = data.data;
                    console.log(responseData.data);
                    this.user_creditRank = responseData.data.user_creditRank;
                    this.user_nextRank = responseData.data.user_nextRank;
                    this.user_nextMark = responseData.data.user_nextMark;
                    if(responseData.data.user_discount != 1)
                    {
                        this.user_discount = responseData.data.user_discount.toString().split(".")[1];
                    }
                    else
                    {
                        this.user_discount = responseData.data.user_discount;
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
        },
    },
    created(){
        this.init();
    },
}
</script>

<style lang="scss" scoped>

</style>
