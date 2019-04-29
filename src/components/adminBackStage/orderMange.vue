<template>
    <div class="OrderWrapper" v-loading="ifLoading">
        <el-form class="searchForm" :inline="true">
            <el-form-item label="生成订单时间段:">
                <el-date-picker v-model="startTimeRange" type="datetimerange" range-separator="至" value-format="yyyy-M-d H:m:s"></el-date-picker>
            </el-form-item>
            <el-form-item label="完成订单时间段:">
                <el-date-picker v-model="endTimeRange" type="datetimerange" range-separator="至" value-format="yyyy-M-d H:m:s"></el-date-picker>
            </el-form-item>
            <el-form-item label="用户名:">
                <el-input v-model="currentGuest"></el-input>
            </el-form-item>
            <!-- <el-row> -->
            <!-- </el-row> -->
        </el-form>
        <div class="btn_group">
            <el-button type="primary" @click="searchByName"><i class="el-icon-search"></i>搜索</el-button>
        </div>
        <el-tabs @tab-click="handleClick" class="orderTabs">
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
                <p class="orderInfo">
                    <span>订单编号:{{chosenOrder.orderList_id}}</span>

                    <span>订单用户:{{chosenOrder.user_nickname}}</span>

                    <span>订单总金额:{{chosenOrder.orderList_price}}</span>
                </p>
                <p class="orderInfo">
                    <span>订单生成时间:{{chosenOrder.orderList_startTime}}</span>

                    <span>订单结束时间:{{chosenOrder.orderList_finishTime}}</span>
                </p>
                <p class="orderInfo">
                    <span>送货地址:{{chosenOrder.user_address}}</span>

                    <span>联系电话:{{chosenOrder.user_phone}}</span>
                </p>
                <h2>订单商品</h2>
                <el-table :data="chosenOrder.goodList" class="orderItemGood">
                    <el-table-column label="图片" prop="good_imgurl">
                        <template slot-scope="scope">
                            <img :src="scope.row.good_imgurl" class="goodImg"/>
                        </template>
                    </el-table-column>
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
            startTimeRange:"",
            endTimeRange:"",
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
            if(this.startTimeRange != "")
            {
                params.startTimeRange = this.startTimeRange;
            }
            if(this.endTimeRange != "")
            {
                params.endTimeRange = this.endTimeRange;
            }
            console.log(params);
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


<style>
    .searchForm .el-form--inline .el-form-item
    {
        margin-right: 20px !important;
    }
    .searchForm .el-form-item__label
    {
        width: 114px !important;
    }
    .searchForm .el-row .el-input input
    {
        width: 400px;
    }
    .OrderWrapper .el-dialog__body
    {
        padding-bottom: 10px;
    }
</style>

<style lang="scss" scoped>
    .OrderWrapper
    {
        padding-left: 30px;
        height: 100%;
        overflow: auto;
        .searchForm
        {
            padding-top: 20px;
            height: 100px;
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
        .btn_group
        {
            margin-top: 30px;
            margin-bottom: 30px;
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
        .orderInfo
        {
            span
            {
                margin-right: 50px;
            }
        }
        .orderItemGood
        {
            .goodImg
            {
                width: 100px;
                height: 100px;
            }
        }
        .contentBlock
        {
            p
            {
                // margin-right: 50px;
                margin-bottom: 30px;
            }
        }
    }

    .orderTabs
    {
        margin-bottom: 30px;
    }

    .btnGroup
    {
        margin-top: 20px;
    }
</style>

