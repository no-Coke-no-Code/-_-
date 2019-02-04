<template>
    <div class="wrapper" v-loading="ifLoading">
        <el-form class="searchForm">
            <el-form-item label="用户名:">
                <el-input v-model="currentGuest"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchByName"><i class="el-icon-search"></i>搜索</el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="HeadBtnGroup">
            <el-button type="primary" @click="searchByName"><i class="el-icon-search"></i>搜索</el-button>
        </div> -->
        <el-tabs @tab-click="handleClick">
            <el-tab-pane label="所有订单">
                <el-table :data="orderList" empty-text='暂无数据'>
                    <el-table-column label="订单编号" prop="orderList_id"></el-table-column>
                    <el-table-column label="订单用户" prop="user_nickname"></el-table-column>
                    <el-table-column label="生成时间">
                        <template slot-scope="scope">
                            {{scope.row.orderList_startTime | ifHaveTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="完成时间">
                        <template slot-scope="scope">
                            {{scope.row.orderList_finishTime | ifHaveTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <a v-if="scope.row.orderList_state=='b'" @click="toOrderDetail(scope)" class="hyperLink">处理订单</a>
                            <a v-if="scope.row.orderList_state=='f'" @click="toOrderDetail(scope)" class="hyperLink">查看订单</a>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <h2 v-if="!orderList.length">暂无数据</h2> -->
            </el-tab-pane>
            <el-tab-pane label="已处理订单">
                <el-table :data="orderList" empty-text='暂无数据'>
                    <el-table-column label="订单编号" prop="orderList_id"></el-table-column>
                    <el-table-column label="订单用户" prop="user_nickname"></el-table-column>
                    <el-table-column label="生成时间">
                        <template slot-scope="scope">
                            {{scope.row.orderList_startTime | ifHaveTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="完成时间">
                        <template slot-scope="scope">
                            {{scope.row.orderList_finishTime | ifHaveTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <a @click="toOrderDetail(scope)" class="hyperLink">查看订单</a>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <h2 v-if="!orderList.length">暂无数据</h2> -->
            </el-tab-pane>
            <el-tab-pane label="未处理订单">
                <el-table :data="orderList" empty-text='暂无数据'>
                    <el-table-column label="订单编号" prop="orderList_id"></el-table-column>
                    <el-table-column label="订单用户" prop="user_nickname"></el-table-column>
                    <el-table-column label="生成时间">
                        <template slot-scope="scope">
                            {{scope.row.orderList_startTime | ifHaveTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="完成时间">
                        <template slot-scope="scope">
                            {{scope.row.orderList_finishTime | ifHaveTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <a @click="toOrderDetail(scope)" class="hyperLink">处理订单</a>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <h2 v-if="!orderList.length">暂无数据</h2> -->
            </el-tab-pane>
        </el-tabs>

        <el-dialog :visible.async="orderDetailDialog" @close="cancel" title="订单详情">
            <div class="contentBlock">
                <p>
                    <span>订单编号:</span>
                    {{chosenOrder.orderList_id}}
                </p>
                <p>
                    <span>订单用户:</span>
                    {{chosenOrder.user_nickname}}
                </p>
                <p>
                    <span>订单生成时间:</span>
                    {{chosenOrder.orderList_startTime}}
                </p>
                <p>
                    <span>订单结束时间:</span>
                    {{chosenOrder.orderList_finishTime}}
                </p>
                <p>
                    <span>送货地址:</span>
                    {{chosenOrder.user_address}}
                </p>
                <p>
                    <span>联系电话:</span>
                    {{chosenOrder.user_phone}}
                </p>
                <p>
                    <span>订单总金额:</span>
                    {{chosenOrder.orderList_price}}
                </p>
                <h2>订单商品</h2>
                <el-table :data="chosenOrder.goodList">
                    <el-table-column label="商品名称" prop="good_name"></el-table-column>
                    <el-table-column label="商品数量" prop="good_count"></el-table-column>
                    <el-table-column label="商品单价" prop="good_price"></el-table-column>
                    <el-table-column label="商品小计" prop="orderItem_priceSub"></el-table-column>
                </el-table>
            </div>
            <div class="btnGroup">
                <el-button @click="confirmOrder" type="primary" v-if="chosenOrder.orderList_state=='b'">订单发货</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>


export default {
    name: 'orderMange',
    data () {
        return {
            menuList:{

            },
            orderList:[],
            orderDetailDialog:false,
            chosenOrder:{},
            ifLoading:false,
            currentTab:"all",
            currentGuest:"",
        }
    },
    filters:{
        ifHaveTime(val){
            if(val == null)
            {
                return "--";
            }
            else
            {
                return val;
            }
        }
    },
    created(){
        this.showOrder("all","all");
    },
    methods:{
        // 根据输入的用户名查找相对应用户的订单
        searchByName(){
            // 判断输入栏是否为空
            if(this.currentGuest == "")
            {
                this.showOrder("all",this.currentTab);
            }
            else
            {
                this.showOrder(this.currentGuest,this.currentTab);
            }
        },

        showOrder(userName,orderType){
            let params = {
                "userName":userName,
                "orderType":orderType,
                "action":'checkOrder'
            };
            // this.ifLoading = true;
            this.orderList = [];
            this.$http
            .post('/mangeOrder',params)
            .then((data) => {
                this.orderList = data.data.data;
                console.log(this.orderList);
                // this.ifLoading = false;
            })
            .catch((err) => {
                console.log(err);
            });
        },

        handleClick(tab){
            let tabName = tab.label;
            // this.orderList = [];
            if(tabName == "所有订单")
            {
                this.currentTab = "all";
            }
            else if(tabName == "已处理订单")
            {
                this.currentTab = "finish";
            }
            else if(tabName == "未处理订单")
            {
                this.currentTab = "begin";
            }

            if(this.currentGuest == "")
            {
                this.showOrder('all',this.currentTab);
            }
            else
            {
                this.showOrder(this.currentGuest,this.currentTab);
            }
        },

        confirmOrder(){
            console.log(this.chosenOrder);
            let params = {
                'orderList_id':this.chosenOrder.orderList_id,
                'orderType':'mange'
            };
            // this.ifLoading = true;
            this.$http
            .post("/mangeOrder",params)
            .then((data)=>{
                if(data.data.code == "0")
                {
                    // this.ifLoading = false;
                    this.orderDetailDialog = false;
                    if(this.currentGuest == "")
                    {
                        this.showOrder('all',this.currentTab);
                    }
                    else
                    {
                        this.showOrder(this.currentGuest,this.currentTab);
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
            this.$message({
                message:"已确认订单",
                type:'success'
            });
        },

        cancel(){
            this.orderDetailDialog = false;
            this.chosenOrder = {};
        },

        toOrderDetail(scope){
            this.orderDetailDialog = true;
            this.chosenOrder = scope.row;
            console.log(this.chosenOrder);
        },
    },
}
</script>


<style lang="scss" scoped>
    .wrapper
    {
        padding-left: 310px;
        .searchForm
        {
            .el-form-item
            {
                height: 100px;
            }   
            .el-form-item__content::after, .el-form-item__content::before
            {
                display: block !important;
            }
            .el-button
            {
                &:hover
                {
                    cursor: pointer;
                }
            }
        }
        .hyperLink
        {
            color: #409EFF;
            &:hover
            {
                text-decoration: underline;
                cursor: pointer;
            }
        }
    }
</style>

