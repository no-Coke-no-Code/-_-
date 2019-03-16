<template>
    <div class="wrapper" v-loading="ifLoading">
        <headers></headers>
        <div class="mainBlock">
            <h2>请确认所有信息</h2>
            <div class="goodList">
                <h2>商品信息</h2>
                <el-table :data="goodList">
                    <!-- 下面这个是用来放图片的 -->
                    <el-table-column label="图片"></el-table-column>
                    <el-table-column label="商品名称" prop="good_name"></el-table-column>
                    <el-table-column label="单价" prop="good_price"></el-table-column>
                    <el-table-column label="单位" prop="good_unit"></el-table-column>
                    <el-table-column label="数量" prop="num"></el-table-column>
                    <el-table-column label="小计" prop="sum"></el-table-column>
                </el-table>
            </div>
            <div class="totalPrice">
                <h1>总价:￥{{this.totalPrice}}</h1>
            </div>
            <div class="userInfo">
                <h2>用户信息</h2>
                <div>
                    <p>收货人姓名：{{this.userName}}</p>
                    <p>联系电话：{{this.userPhone}}</p>
                    <p>送货地址：{{this.userAddress}}</p>
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
            userName:"",
            userPhone:"",
            userAddress:"",
            goodIdList:[],
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
        // 初始化订单用户信息(需要调用用户数据表)
        this.userName = this.$store.state.userName;
        let params = {
            "method":"refresh",
            "userName":this.userName
        };
        console.log("将要发送的数据",params);
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
        })
        .catch((err)=>{
            console.log(err);
        });
    },
    methods:{
        // 最终确认生成订单
        confirmOrder(){
            this.$confirm('是否确定生成订单？？','提示',{
                confirmButtonText:"生成",
                cancelButtonText:"我再想想"
            })
            .then(() => {
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
                    this.$http
                    .post('/guestCart',params)
                    .then((data)=>{
                        console.log(data);
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                    this.$router.push({path:"/makeOrderSuccess",name:"makeOrderSuccess"});
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 取消生成订单
        cancelOrder(){
            window.localStorage.removeItem('selectedGoodList');
        },
    },
}
</script>

<style lang="scss" scoped>
    .mainBlock
    {
        padding: 50px 80px;
    }
</style>

