<template>
    <div class="wrapper guestOrder" v-loading="ifLoading">
        <el-form :model="searchForm" :inline="true">
            <el-row>
                <el-form-item label="订单ID">
                    <el-input v-model="searchForm.orderId"></el-input>
                </el-form-item>
                <el-form-item label="订单总价">
                    <el-select v-model="searchForm.orderPrice">
                        <el-option v-for="x in priceList" :key="x" :label="x" :value="x"></el-option>
                    </el-select>
                </el-form-item>
            </el-row>
            <el-row>
                <el-form-item label="开始订单时间">
                    <el-date-picker v-model="searchForm.startTime" type="datetimerange" range-separator="至" value-format="yyyy-M-d H:m:s"></el-date-picker>
                </el-form-item>
                <el-form-item label="完成订单时间">
                    <el-date-picker v-model="searchForm.finishTime" type="datetimerange" range-separator="至" value-format="yyyy-M-d H:m:s"></el-date-picker>
                </el-form-item>
            </el-row>
            <div class="btnGroup">
                <el-button @click="init(orderState)" type="primary">搜索</el-button>
            </div>
        </el-form>
        <el-tabs @tab-click="changeTab" v-model="activeName">
            <el-tab-pane label="全部">
                <div class="orderList" v-for="order in responseData" v-if="responseData.length">
                    <h3>订单号:{{order.orderList_id}}</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column prop="good_imgurl">
                            <template slot-scope="scope">
                                <img :src="scope.row.good_imgurl" class="orderItemPic"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品名称" prop="good_name" ></el-table-column>
                        <el-table-column label="商品数量" prop="good_count" ></el-table-column>
                        <el-table-column label="商品单价" prop="good_price" ></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                        <el-table-column v-if="order.orderList_state=='f'" prop="ifComment" >
                            <template slot-scope="scope">
                                <a v-if="!scope.row.ifComment" @click="makeComment(scope.row,order,scope)" class="makeComment">添加评价</a>
                                <a v-if="scope.row.ifComment">该商品已评价</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p>订单总金额:￥{{order.orderList_discountPrice}}</p>
                    <p>订单状态:{{order.orderList_state=='f'?"已完成":"未完成"}}</p>
                    <p>生成订单时间:{{order.orderList_startTime}}</p>
                    <p v-if="order.orderList_state=='f'">完成订单时间:{{order.orderList_finishTime}}</p>
                </div>
                <div v-if="!responseData.length">
                    暂时无相关的订单
                </div>
            </el-tab-pane>
            <el-tab-pane label="未发货">
                <div class="orderList" v-for="(order,index) in responseData" v-if="responseData.length">
                    <h3>订单号:{{order.orderList_id}}</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column prop="good_imgurl">
                            <template slot-scope="scope">
                                <img :src="scope.row.good_imgurl" class="orderItemPic"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                    </el-table>
                    <p>订单总金额:￥{{order.orderList_price}}</p>
                    <p>生成订单时间:{{order.orderList_startTime}}</p>
                    <p v-if="order.orderList_state=='f'">完成订单时间:{{order.orderList_finishTime}}</p>
                </div>
                <div v-if="!responseData.length">
                    暂时无相关的订单
                </div>
            </el-tab-pane>
            <el-tab-pane label="已发货">
                <div class="orderList" v-for="(order,index) in responseData" v-if="responseData.length">
                    <h3>订单号:{{order.orderList_id}}</h3>
                    <el-table :data="order.orderDetail">
                        <el-table-column prop="good_imgurl">
                            <template slot-scope="scope">
                                <img :src="scope.row.good_imgurl" class="orderItemPic"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品名称" prop="good_name"></el-table-column>
                        <el-table-column label="商品数量" prop="good_count"></el-table-column>
                        <el-table-column label="商品单价" prop="good_price"></el-table-column>
                        <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                        <el-table-column prop="ifComment">
                            <template slot-scope="scope">
                                <a v-if="!scope.row.ifComment" @click="makeComment(scope.row,order,scope)" class="makeComment">添加评价</a>
                                <a v-if="scope.row.ifComment">该商品已评价</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p>订单总金额:￥{{order.orderList_price}}</p>
                    <p>生成订单时间:{{order.orderList_startTime}}</p>
                    <p v-if="order.orderList_state=='f'">完成订单时间:{{order.orderList_finishTime}}</p>
                </div>
                <div v-if="!responseData.length">
                    暂时无相关的订单
                </div>
            </el-tab-pane>
        </el-tabs>
        <guest-comment :commentDialog='commentDialog' @closeDialog='closeDialog' :commentGood='commentGood' :commentGoodIndex='commentGoodIndex' :commentOrder='commentOrder'></guest-comment>
    </div>
</template>

<script>
import guestComment from "./guestComment.vue";
export default {
    name:"guestOrder",
    components:{
        guestComment
    },
    data(){
        return{
            responseData:[],
            activeName:"",
            // orderState:"",
            // 标记：这是一条假数据，实际情况应该是从vuex里面获取
            username:"",
            ifLoading:false,
            searchForm:{
                startTime:"",
                finishTime:"",
                orderId:"",
                orderPrice:"",
            },
            priceList:[
                "0-99",
                "100-399",
                "400-699",
                "700-999",
                "1000-9999"
            ],
            orderState:"all",
            commentDialog:false,
            commentGood:{},
            commentOrder:{},
            commentGoodIndex:"",
        }
    },
    methods:{
        init(orderState){
            console.log(orderState);
            let params = {};
            if(this.searchForm.orderId=="" && this.searchForm.orderPrice=="" && !this.searchForm.startTime && !this.searchForm.finishTime)
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
                console.log(this.responseData,'i want to see');
                this.ifLoading = false;
            })
            .catch((err) => {
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
        makeComment(row,order,scope){
            this.commentDialog = true;
            this.commentGood = row;
            this.commentOrder = order;
            this.commentGoodIndex = scope.$index
        },
        closeDialog(){
            this.commentDialog = false;
            this.init("all");
        },
    },
    created(){
        this.init("all");
    },
}
</script>

<style>
    .guestOrder .el-tabs__content
    {
        overflow: unset !important;
    }
</style>

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
        height: calc(100% - 40px);
        overflow: auto;
        padding: 30px;
        box-sizing: border-box;
        .btnGroup
        {
            margin-bottom: 30px;
        }
        .orderList
        {
            border: 1px solid black;
            margin-top: 10px;
            padding: 20px;
            border-radius: 5px;
            transition: .2s ease;
            position: relative;
            &:hover
            {
                transition: .2s ease;
                transform: scale(1.01,1.01);
            }
        }
        .orderItemPic
        {
            width: 100px;
            height: 100px;
        }
    }
    .makeComment
    {
        &:hover
        {
            color: #1989fa;
            cursor: pointer;
            text-decoration: underline;
        }
    }
</style>