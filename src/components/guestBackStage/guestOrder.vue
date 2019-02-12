<template>
    <div class="wrapper" v-loading="ifLoading">
        <el-form :model="searchForm" :inline="true">
            <el-form-item label="订单ID">
                <el-input v-model="searchForm.orderId"></el-input>
            </el-form-item>
            <el-form-item label="订单总价">
                <el-select v-model="searchForm.orderPrice">
                    <el-option v-for="x in priceList" :key="x" :label="x" :value="x"></el-option>
                </el-select>
            </el-form-item>
            <div class="btnGroup">
                <el-button @click="init(orderState)">搜索</el-button>
            </div>
        </el-form>
        <el-tabs @tab-click="changeTab" v-model="activeName">
            <el-tab-pane label="全部">
                <div class="orderList" v-for="order in responseData" v-if="responseData.length">
                    <h3>订单</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                    </el-table>
                    <p>订单总价:{{order.orderList_price}}</p>
                </div>
                <div v-if="!responseData.length">
                    暂时无相关的订单
                </div>
            </el-tab-pane>
            <el-tab-pane label="未发货">
                <div class="orderList" v-for="(order,index) in responseData" v-if="responseData.length">
                    <h3>订单{{index}}</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                    </el-table>
                    <p>订单总价:{{order.orderList_price}}</p>
                </div>
                <div v-if="!responseData.length">
                    暂时无相关的订单
                </div>
            </el-tab-pane>
            <el-tab-pane label="已发货">
                <div class="orderList" v-for="(order,index) in responseData" v-if="responseData.length">
                    <h3>订单{{index}}</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                    </el-table>
                    <p>订单总价:{{order.orderList_price}}</p>
                </div>
                <div v-if="!responseData.length">
                    暂时无相关的订单
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name:"guestOrder",
    data(){
        return{
            responseData:[],
            activeName:"",
            // orderState:"",
            // 标记：这是一条假数据，实际情况应该是从vuex里面获取
            username:"",
            ifLoading:false,
            searchForm:{},
            priceList:[
                "0-99",
                "100-399",
                "400-699",
                "700-999",
                "1000-9999"
            ],
            orderState:"all",
        }
    },
    methods:{
        init(orderState){
            console.log(orderState);
            let params = {};
            if(this.searchForm.orderId=="" && this.searchForm.orderPrice=="")
            {
                params = {
                    "method":"getGuestOrder",
                    "ifAll":true,
                    "user_nickname":this.$store.state.userName,
                    "userName":this.$store.state.userName,
                    "orderState":orderState,
                };
            }
            else
            {
                params = {
                    "method":"getGuestOrder",
                    "ifAll":false,
                    "orderForm":this.searchForm,
                    "user_nickname":this.$store.state.userName,
                    "orderState":orderState,
                };
            }

            this.responseData = [];
            this.ifLoading = true;
            this.$http
            .post("/guestOrder",params)
            .then((data) => {
                this.responseData = data.data.data;
                console.log(data);
                this.ifLoading = false;
            })
            .catch((err) => {
                // alert(this.responseData);
                this.ifLoading = false;
                console.log(err);
            });
        },
        changeTab(){
            // 查看所有订单
            if(this.activeName == 0)
            {
                this.init("all");
                this.orderState = "all";
            }
            // 查看未发货订单
            else if(this.activeName == 1)
            {
                this.init("b");
                this.orderState = "f";
            }
            // 查看已发货订单
            else if(this.activeName == 2)
            {
                this.init("f");
                this.orderState = "b";
            }
        },
        search(){
            let params = {};
            if(this.searchForm.orderId=="" && this.searchForm.orderPrice=="")
            {
                params = {
                    "method":"searchOrder",
                    "ifAll":true,
                    "user_nickname":this.$store.state.userName,
                };
            }
            else
            {
                params = {
                    "method":"searchOrder",
                    "ifAll":false,
                    "orderForm":this.searchForm,
                    "user_nickname":this.$store.state.userName,
                };
            }
            this.responseData = [];
            this.$http.post('/guestOrder',params).then((data)=>{
                console.log(data);
                this.responseData = data.data.data;
            }).catch((err)=>{
                console.log(err);
            });
        },
    },
    created(){
        this.init("all");
    },
}
</script>

<style lang="scss" scoped>
    .el-form-item::after, .el-form-item::before
    {
        display: block !important;
    }
    .el-form-item__content::after, .el-form-item__content::before
    {
        display: block !important;
    }
    .wrapper
    {
        padding-left: 320px;
        padding-right: 30px;
        .orderList
        {
            border: 1px solid black;
            margin-top: 10px;
        }
    }
</style>