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
                "method":"guestOrder",
                "userName":this.username,
                "orderState":orderState,
            };
            this.$http.post("/guestInfo",params).then((data) => {
                this.responseData = data.data;
                console.log(this.responseData);
                // 遍历返回的订单总数，共有多少份订单
                // for(let x = 0;x<this.responseData.length;x++)
                // {
                //     // 将每个订单的商品都改造成对象数组
                //     // 遍历每个订单当中的那三个属性，并且每次从它们中各取一个，生成一个对象
                //     // 由于那三个属性都是字符串，所以得先把它们分割成为数组形式
                //     // if(this.responseData[x].good_id.indexOf(",") > 0)
                //     // {
                //     //     this.responseData[x].good = [];
                //     //     this.responseData[x].goodIdList = [];
                //     //     this.responseData[x].goodIdList = this.responseData[x].good_id.split(",");
                //     //     this.responseData[x].goodCountList = [];
                //     //     this.responseData[x].goodCountList = this.responseData[x].good_count.split(",");
                //     //     this.responseData[x].goodPriceList = [];
                //     //     this.responseData[x].goodPriceList = this.responseData[x].good_price.split(",");
                //     //     for(let i = 0;i<this.responseData[x].goodIdList.length;i++)
                //     //     {
                //     //         this.responseData[x].good[i] = {};
                //     //         this.responseData[x].good[i].id = this.responseData[x].goodIdList[i];
                //     //         this.responseData[x].good[i].count = this.responseData[x].goodCountList[i];
                //     //         this.responseData[x].good[i].price = this.responseData[x].goodPriceList[i];
                //     //         // this.responseData[x].good[i].name = this.responseData[x].
                //     //     }
                //     // }
                //     // 如果不是多个得话，就不需要转化为数组形式了，直接用变量形式
                //     // else
                //     // {
                //     //     this.responseData[x].good = [];
                //     //     this.responseData[x].good[0] = {};
                //     //     this.responseData[x].good[0].id = this.responseData[x].good_id;
                //     //     this.responseData[x].good[0].count = this.responseData[x].good_count;
                //     //     this.responseData[x].good[0].price = this.responseData[x].good_price;
                //     // }
                //     // 通过订单中的货物的ID获取货物的
                    
                // }
            }).catch((err) => {
                console.log(err);
            });
        },
        changeTab(){
            // 查看所有订单
            if(this.activeName == 0)
            {
                // this.orderState = "all";
                this.init("all");
            }
            // 查看未发货订单
            if(this.activeName == 1)
            {
                // this.orderState = "b";
                this.init("b");
            }
            // 查看已发货订单
            if(this.activeName == 2)
            {
                // this.orderState = "f";
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
    .orderList
    {
        border: 1px solid black;
        margin-top: 10px;
    }
</style>