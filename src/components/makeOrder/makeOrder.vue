<template>
    <div class="wrapper" v-loading="ifLoading">
        <headers></headers>
        <div class="mainBlock">
            <h2>请确认所有信息</h2>
            <div class="goodList">
                <h2>商品信息</h2>
                <el-table :data="goodList">
                    <!-- 下面这个是用来放图片的 -->
                    <el-table-column label="图片" prop="good_imgurl">
                        <template slot-scope="scope">
                            <img class="goodImg" :src="scope.row.good_imgurl"/>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" prop="good_name"></el-table-column>
                    <el-table-column label="单价（￥）" prop="good_price"></el-table-column>
                    <el-table-column label="单位" prop="good_unit"></el-table-column>
                    <el-table-column label="数量" prop="num"></el-table-column>
                    <el-table-column label="小计（￥）" prop="sum"></el-table-column>
                </el-table>
            </div>
            <div class="totalPrice">
                <h1>总价:￥{{this.totalPrice}}</h1>
                <h1>会员价:￥{{this.discountPrice}}</h1>
            </div>
            <div class="userCoupon">
                <p>可使用优惠券:<el-button @click="noUseCoupon">不使用优惠券</el-button></p>
                <div class="coupon" v-for="item in couponList" @click="chooseCoupon(item)">
                    <div class="coupon_left">
                        <p>{{item.coupon_name}}</p>
                        <p>有效日期:</p>
                        <p>{{item.coupon_startTime.split(" ")[0]}} 至 {{item.coupon_endTime.split(" ")[0]}}</p>
                        <p v-text="item.coupon_type=='all'?'全类型可用':'限'+item.coupon_type+'商品可用'"></p>
                        <p v-if="item.coupon_limit" >限消费￥{{item.coupon_limit}}以上可用</p>
                    </div>
                    <div class="coupon_right">
                        <p>￥{{item.coupon_price}}</p>
                        <div class="chosenTick" v-if="chosenCoupon.id == item.id">
                            <img src="@/../static/pic/price_icon_payment_success@2x.png">
                        </div>
                    </div>
                    <div class="triangleTop"></div>
                    <div class="triangleBottom"></div>
                    <div class="divideLine"></div>
                </div>
            </div>
            <div class="userInfo">
                <h2>用户信息</h2>
                <div>
                    <p>收货人姓名：<el-input class="orderInfo" v-model="userRealname"></el-input></p>
                    <p>联系电话：<el-input class="orderInfo" v-model="userPhone"></el-input></p>
                    <p>送货地址：<el-input class="orderInfo" v-model="userAddress"></el-input></p>
                </div>
            </div>
            <el-button @click="confirmOrder" type="primary">确定生成</el-button>
            <el-button @click="cancelOrder"><router-link to="/guestBackStage/guestCart">取消生成</router-link></el-button>
        </div>
    </div>
</template>

<script>
import headers from "../global/headers.vue";
export default {
    name: 'makeOrder',
    components:{
        headers
    },
    data(){
        return{
            ifLoading:false,
            goodList:[],
            totalPrice:"",
            normalTotalPrice:"",
            user_creditMark:"",
            discount:0,
            discountPrice:"",
            normalDiscountPrice:"",
            userName:"",
            userPhone:"",
            userAddress:"",
            userRealname:"",
            goodIdList:[],
            couponList:[],
            chosenCoupon:{},
        }
    },
    created(){
        this.goodList = JSON.parse(window.localStorage.getItem("selectedGoodList"));
        if(!this.goodList)
        {
            window.history.back(-1);
        }
        this.totalPrice = window.localStorage.getItem("totalPrice");
    },
    mounted(){
        this.userName = this.$store.state.userName;
        let promise = new Promise((resolve,reject)=>{
            let params = {
                "method":"checkUserCoupon",
                "user_nickname":this.userName
            };
            this.$http
            .post('/coupon',params)
            .then((data)=>{
                let responseData = data.data;
                if(responseData.code == 0)
                {
                    for(let i = 0;i<responseData.data.length;i++)
                    {
                        this.couponList.push(responseData.data[i]);
                    }
                    console.log(this.couponList);
                    resolve();
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        });
        promise.then(()=>{
            // 初始化订单用户信息(需要调用用户数据表)
            let params = {
                "method":"refresh",
                "userName":this.userName
            };
            // 关于VUEX使用两个注意点
            // 1:如果要对VUEX中的数据进行操作，动态绑定，则需要将VUEX的数据在computed里面进行监听，才能够实时把握住它里面数据的变化
            // 2：貌似无法直接在created钩子函数中获取VUEX中的数据（除非通过computed进行监听）
            // 获取直接在mounted钩子函数中获取也行
            // 根据用户名调用用户信息
            this.$http
            .post('/guestInfo',params)
            .then((data)=>{
                console.log("服务器返回的数据",data.data.data[0]);
                let responseData = data.data.data[0];
                this.userPhone = responseData.user_phone;
                this.userAddress = responseData.user_address;
                this.userRealname = responseData.user_realname;
                this.creditMark = responseData.user_creditMark;
                this.getCreditRank();
            })
            .catch((err)=>{
                console.log(err);
            });
        });
    },
    methods:{
        // 获取当前用户会员等级，折扣优惠
        getCreditRank(){
            let params = {
                "method":"getCredit",
                "creditMark":this.creditMark
            };
            console.log(params,'i want to see that');
            this.$http
            .post('/credit',params)
            .then((data)=>{
                console.log(data);
                let responseData = data.data;
                console.log(responseData);
                this.discount = responseData.data.user_discount;
                this.discountPrice = this.totalPrice * this.discount;
                this.normalTotalPrice = this.totalPrice;
                this.normalDiscountPrice = this.discountPrice;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 最终确认生成订单
        confirmOrder(){
            this.$confirm('是否确定生成订单？？','提示',{
                confirmButtonText:"生成",
                cancelButtonText:"我再想想"
            })
            .then(() => {
                if(this.userPhone && this.userAddress && this.userRealname)
                {
                    this.$message({
                        message:"正在生成，请稍后",
                        type:"success"
                    });
                    let goodList = [];
                    for(let i = 0;i<this.goodList.length;i++)
                    {
                        goodList.push(this.goodList[i]);
                    }
                    this.ifLoading = true;
                    // 生成订单接口所需参数：用户名，商品信息，数量，单价，小计，创建时间(后端生成吧)
                    let params = {
                        "method":"makeGuestOrder",
                        "userName":this.userName,
                        "goodList":this.goodList,
                        "totalPrice":this.totalPrice,
                        "discountPrice":this.discountPrice,
                        "address":this.userAddress,
                        "phone":this.userPhone,
                    };
                    console.log(this.goodList);
                    this.$http
                    .post('/guestOrder',params)
                    .then((data) => {
                        console.log(data);
                        this.ifLoading = false;
                        for(let i = 0;i<this.goodList.length;i++)
                        {
                            this.goodIdList.push(this.goodList[i].good_id);
                        }
                        params = {
                            "method":"makeOrderSuccess",
                            "userName":this.userName,
                            "goodIdList":this.goodIdList,
                            "goodDetailList":this.goodList,
                        };
                        // 删除购物车中商品操作
                        this.$http
                        .post('/guestCart',params)
                        .then((data)=>{
                            console.log(data);
                            // 更新用户积分操作
                            let params33 = {
                                "method":"updataUserCredit",
                                "user_nickname":this.userName,
                                "addCreditMark":Math.round(this.totalPrice*0.1)
                            };
                            // 更新会员积分
                            this.$http
                            .post('/credit',params33)
                            .then((data)=>{
                                let responseData = data.data;
                                console.log("更新用户积分成功");
                                // 删除用户所使用优惠券
                                if(this.chosenCoupon.id)
                                {
                                    this.$http
                                    .delete('/coupon',{
                                        params:{
                                            method:"deleteCouponById",
                                            couponId:this.chosenCoupon.id
                                        }
                                    })
                                    .then((data)=>{
                                        let responseData = data.data;
                                        if(responseData.code == 0)
                                        {
                                            this.$router.push({path:"/makeOrderSuccess",name:"makeOrderSuccess"});
                                        }
                                    })
                                    .catch((err)=>{
                                        console.log(err);
                                    });
                                }
                                else
                                {
                                    this.$router.push({path:"/makeOrderSuccess",name:"makeOrderSuccess"});
                                }
                            })
                            .catch((err)=>{
                                if(err)
                                {
                                    console.log(err);
                                }
                            });
                        })
                        .catch((err)=>{
                            console.log(err);
                        });
                        })
                    .catch((err) => {
                        console.log(err);
                    });
                }
                else
                {
                    this.$message.error("请先完善订单信息");
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 取消生成订单
        cancelOrder(){
            window.localStorage.removeItem('selectedGoodList');
        },

        // 选择将要使用的优惠券
        chooseCoupon(coupon){
            this.chosenCoupon = JSON.parse(JSON.stringify(coupon));
            this.totalPrice = this.normalTotalPrice - this.chosenCoupon.coupon_price;
            this.discountPrice = this.normalDiscountPrice - this.chosenCoupon.coupon_price;
            if(this.discountPrice < 0)
            {
                this.discountPrice = 0;
            }
        },

        // 不适用优惠券
        noUseCoupon(){
            this.chosenCoupon = {};
            this.totalPrice = this.normalTotalPrice;
            this.discountPrice = this.normalDiscountPrice;
        },
    },
}
</script>

<style lang="scss" scoped>
@import "./static/global/coupon.scss";

    .mainBlock
    {
        padding: 50px 80px;
        .goodImg
        {
            width: 100px;
            height: 100px;
        }
        .orderInfo
        {
            display: inline-block;
            width: 400px;
        }
        .chosenTick
        {
            position: absolute;
            right: 5px;
            bottom: 5px;
            border-radius: 50%;
            background-color: #fff;
            width: 29px;
            height: 29px;
            img
            {
                width: 30px;
                height: 30px;
            }
        }
    }
</style>

