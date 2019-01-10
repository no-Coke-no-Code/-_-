<template>
    <div class="wrapper">
        <el-tabs @tab-click="changeTab" v-model="activeName">
            <el-tab-pane label="全部">
                <div class="orderList" v-for="order in responseData">
                    <h3>订单</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                    </el-table>
                    <p>订单总价:{{order.orderList_price}}</p>
                </div>
            </el-tab-pane>
            <el-tab-pane label="未发货">
                <div class="orderList" v-for="(order,index) in responseData">
                    <h3>订单{{index}}</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                    </el-table>
                    <p>订单总价:{{order.orderList_price}}</p>
                </div>
            </el-tab-pane>
            <el-tab-pane label="已发货">
                <div class="orderList" v-for="(order,index) in responseData">
                    <h3>订单{{index}}</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                    </el-table>
                    <p>订单总价:{{order.orderList_price}}</p>
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
            username:"coke43",
        }
    },
    watch:{
        activeName(){
            
        },
    },
    methods:{
        init(orderState){
            let params = {
                "method":"getGuestOrder",
                "userName":this.username,
                "orderState":orderState,
            };
            this.$http.post("/guestOrder",params).then((data) => {
                this.responseData = data.data;
                console.log(this.responseData);
                console.log(data);
            }).catch((err) => {
                console.log(err);
            });
        },
        changeTab(){
            // 查看所有订单
            if(this.activeName == 0)
            {
                this.init("all");
            }
            // 查看未发货订单
            if(this.activeName == 1)
            {
                this.init("b");
            }
            // 查看已发货订单
            if(this.activeName == 2)
            {
                this.init("f");
            }
        },
    },
    created(){
        this.init("all");
    },
}
</script>

<style lang="scss" scoped>
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