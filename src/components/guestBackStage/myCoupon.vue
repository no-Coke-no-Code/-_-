<template>
    <div class="couponWrapper">
        <div class="coupon" v-for="item in couponList">
            <div class="coupon_left">
                <p>{{item.coupon_name}}</p>
                <p>有效日期:</p>
                <p>{{item.coupon_startTime.split(" ")[0]}} 至 {{item.coupon_endTime.split(" ")[0]}}</p>
                <p v-text="item.coupon_type=='all'?'全类型可用':'限'+item.coupon_type+'商品可用'"></p>
                <p v-if="item.coupon_limit" >限消费￥{{item.coupon_limit}}以上可用</p>
            </div>
            <div class="coupon_right">
                <p>￥{{item.coupon_price}}</p>
            </div>
            <div class="triangleTop"></div>
            <div class="triangleBottom"></div>
            <div class="divideLine"></div>
        </div>
        <h2 v-if="couponList.length == 0">当前您并没有优惠券，快去抢券中心看看吧</h2>
    </div>
</template>

<script>
export default {
    name:"guestCoupon",
    data(){
        return{
            limitText:"",
            couponList:[],
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            let userName = this.$store.state.userName;
            let promise = new Promise((resolve,reject)=>{
                this.$http
                .delete('/coupon',{
                    params:{
                        method:"deleteCouponByDate"
                    }
                })
                .then((data)=>{
                    let responseData = data.data;
                    if(responseData.code == 0)
                    {
                        resolve();
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
            promise.then(()=>{
                this.couponList = [];
                let params = {
                    "method":"checkUserCoupon",
                    "user_nickname":userName
                };
                this.$http
                .post('/coupon',params)
                .then((data)=>{
                    let responseData = data.data;
                    console.log(responseData);
                    for(let i = 0;i<responseData.data.length;i++)
                    {
                        this.couponList.push(responseData.data[i]);
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/../static/global/coupon.scss";

    .couponWrapper
    {
        box-sizing: border-box;
        height: calc(100% - 40px);
        margin-left: 300px;
        padding: 30px;
        padding-top: 0px;
        overflow: auto;
    }
</style>
