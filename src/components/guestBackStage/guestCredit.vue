<template>
    <div class="wrapper">
        <p>用户当前会员积分：{{user_creditMark}}</p>
        <p>用户当前会员身份：{{user_creditRank}}</p>

        <p v-if="user_discount!=1">用户当前可享受折扣：{{user_discount}}</p>
        <p v-if="user_discount==1">用户当前未可享受会员优惠</p>

        <p v-if="user_creditRank==user_nextRank">用户当卡已是最高会员等级</p>
        <p v-if="user_creditRank!=user_nextRank">下个会员等级：{{user_nextRank}}</p>

        <p v-if="user_creditMark!=user_nextMark">下个会员等级所需积分：{{user_nextMark}}</p>
        <p v-if="user_creditMark==user_nextMark">用户当前已是最高等级</p>

        <el-progress :text-inside="true" :stroke-width="18" :percentage="creditPercentage"></el-progress>
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
            creditPercentage:0,
        }
    },
    computed:{
        creditPercentage1(){
            return this.user_creditMark/this.user_nextMark;
        },
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
                    this.creditPercentage = Math.floor(this.user_creditMark/this.user_nextMark*100);
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
    .wrapper
    {
        box-sizing: border-box;
        height: calc(100% - 40px);
        margin-left: 300px;
        padding: 30px;
    }
</style>
