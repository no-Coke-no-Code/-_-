<template>
    <div class="couponCenterWrapper">
        <vheader></vheader>
        <div class="coupon" v-for="item in couponList" @click="getCoupon(item)">
            <div class="coupon_left">
                <p>{{item.coupon_name}}</p>
                <p>有效日期:</p>
                <!-- <p>{{item.coupon_startTime}}-{{item.coupon_endTime}}</p> -->
                <!-- <p>{{this.limitText}}</p> -->
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
</template>

<script>
import vheader from "@/components/global/headers.vue";

export default {
    name:"couponCenter",
    components:{
        vheader
    },
    data(){
        return{
            couponList:[],
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
            })
            .catch((err)=>{
                console.log(err);
            });
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
                });
        },
    },
}
</script>

<style lang="scss" scoped>
    .coupon
    {
        display: inline-block;
        margin-left: 30px;
        margin-top: 40px;
        width: 245px;
        height:110px;
        background-color: #f23030;
        // overflow: hidden;
        position: relative;
        border-radius: 5px;
        box-shadow: 2px 2px 5px #ccc;
        transition: .2s ease;
        .coupon_right
        {
            float: right;
            height: 100%;
            width: 70px;
            text-align: center;
            position: relative;

            // display: flex;
            // justify-content: center;
            // align-items: center;

            p
            {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                color: #fff;
            }
        }
        .coupon_left
        {
            box-sizing: border-box;
            float: left;
            height: 100%;
            width: 175px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 10px;
            color: #fff;
            p
            {
                margin-top: 5px;
                font-size: 12px;
                &:nth-child(1)
                {
                    margin-top: 0px;
                    text-align: center;
                    font-size: 14px;
                }
            }
        }
        .triangleTop
        {
            position: absolute;
            top: -20px;
            right: 50px;
            width: 40px;
            height: 40px;
            // border-top: 20px solid #fff;
            // border-right: 20px solid transparent;
            // border-left: 20px solid transparent;
            // box-shadow: inset 2px 2px 5px #888888;
            border-radius: 50%;
            background-color: #fff;
        }
        .triangleBottom
        {
            position: absolute;
            bottom: -20px;
            right: 50px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #fff;
            box-shadow: inset 0px 2px 1px #ccc;;
            // border-bottom: 20px solid #fff;
            // border-right: 20px solid transparent;
            // border-left: 20px solid transparent;
        }
        .divideLine
        {
            position: absolute;
            top: 20px;
            right: 68.3px;
            width: 1px;
            height: 70px;
            border-left: 1px dotted #fff;
        }
        &:hover
        {
            transition: .2s ease;
            cursor: pointer;
            transform: scale(1.01);
        }
    }
</style>
