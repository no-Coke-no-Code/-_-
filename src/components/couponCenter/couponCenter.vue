<template>
    <div class="couponCenterWrapper" :class="{wrapper:!ifGoodItem}">
        <vheader></vheader>
        <div class="titleWrapper">
            <h2>优惠券中心</h2>
        </div>
        <div class="couponWrapper">
            <div class="coupon" v-for="item in couponList" @click="getCoupon(item)">
                <div class="coupon_left">
                    <p>{{item.coupon_name}}</p>
                    <p>有效日期:</p>
                    <p>{{item.coupon_startTime.split(" ")[0]}} 至 {{item.coupon_endTime.split(" ")[0]}}</p>
                    <p v-text="item.coupon_type?'限'+item.coupon_type+'商品可用':'全类型可用'"></p>
                    <p v-if="item.coupon_limit" >限消费￥{{item.coupon_limit}}以上可用</p>
                </div>
                <div class="coupon_right">
                    <p>￥{{item.coupon_price}}</p>
                </div>
                <div class="triangleTop"></div>
                <div class="triangleBottom"></div>
                <div class="divideLine"></div>
            </div>
        </div>
        <footers :class="{footers:!ifGoodItem}"></footers>
    </div>
</template>

<script>
import vheader from "@/components/global/headers.vue";
import footers from "@/components/global/footers";

export default {
    name:"couponCenter",
    components:{
        vheader,
        footers,
    },
    data(){
        return{
            couponList:[],
            ifGoodItem:true,
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            this.couponList = [];
            let params = {
                "method":"checkNewCoupon",
            };
            this.$http
            .post('/coupon',params)
            .then((data)=>{
                let responseData = data.data.data;
                for(let i = 0;i<responseData.length;i++)
                {
                    this.couponList.push(responseData[i]);
                }
                this.searchDone(this.couponList);
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        searchDone(val){
            if(val.length == 0)
            {
                this.ifGoodItem = false;
            }
            else
            {
                this.ifGoodItem = true;
            }
            console.log(this.ifGoodItem);
        },

        getCoupon(coupon){
            console.log(coupon);
            this.$confirm(
                "是否领取此优惠券",
                "提示",
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                })
                .then(()=>{
                    let userName = this.$store.state.userName;
                    let that = this;
                    let promise = new Promise((resolve,reject)=>{
                        let params = {
                            "method":"getCoupon",
                            "coupon_id":coupon.id,
                            "user_nickname":userName
                        };
                        that.$http
                        .post('/coupon',params)
                        .then((data)=>{
                            resolve();
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                    });
                    promise.then(()=>{
                        that.init();
                    });
                })
                .catch(()=>{
                    return;
                });
        },
    },
}
</script>

<style lang="scss" scoped>
@import "@/../static/global/coupon.scss";


    .wrapper
    {
        position:relative;
        height:100%;
    }
    .titleWrapper
    {
        padding-left: 50px;
        margin-top: 30px;
        font-size: 30px;
    }
    .couponWrapper
    {
        border-radius: 5px;
        margin:50px;
        min-height: 339px;
    }
    .footers
    {
        position: absolute;
        bottom: 0;
        right:0;
        left:0;
    }

</style>
