<template>
    <div class="CountManageWrapper">
        <el-form inline>
            <el-form-item label="开始时间:">
                <el-date-picker v-model="searchForm.startTime" type="date" value-format="yyyy-M-d H:m:s"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间:">
                <el-date-picker v-model="searchForm.endTime" type="date" value-format="yyyy-M-d"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="btnGroup">
                    <el-button @click="search" type="primary"><i class="el-icon-search"></i>查询</el-button>
                </div>
            </el-form-item>
        </el-form>
        <p class="countContent">
            <span>总成交金额:{{this.totalMoney}}</span>
            <span>总订单数:{{this.totalOrderNum}}</span>
        </p>
        <p class="countContent">
            <span>最畅销商品:{{this.hottestGood}}</span>
            <span>销量:{{this.hottestGoodNum}}</span>
        </p>
        <h2 class="countRankTable">商品销售排行榜</h2>
        <el-table :data="hottestRankTable" :default-sort = "{prop: 'count', order: 'descending'}">
            <el-table-column label="商品图片">
                <template slot-scope="scope">
                    <img :src="scope.row.img" class="goodImg"/>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name">
            </el-table-column>
            <el-table-column label="商品单价" prop="price"></el-table-column>
            <el-table-column label="单位" prop="good_unit"></el-table-column>
            <el-table-column label="销售数量" prop="count"></el-table-column>
            <!-- <el-table-column label="小计">
                <template slot-scope="scope">
                    <p>{{scope.row.price * scope.row.count}}</p>
                </template>
            </el-table-column> -->
        </el-table>
    </div>
</template>

<script>
export default {
    name:"countManage",
    data(){
        return{
            searchForm : {
                startTime:"",
                endTime:"",
                searchResult:{},
            },
            totalMoney:0,
            totalOrderNum:0,
            hottestGood:"",
            hottestGoodNum:0,
            hottestRankTable:[],
        }
    },
    created(){
        this.search();
    },
    methods:{
        // 开始查询
        search(){
            this.totalMoney = 0;
            this.totalOrderNum = 0;
            this.hottestGood = "";
            this.hottestGoodNum = 0;
            this.hottestRankTable = [];

            let promise = new Promise((resolve,reject)=>{
                let params = {
                    "method":"getCount"
                };
                if(this.searchForm.startTime && this.searchForm.endTime)
                {
                    params.searchStartTime = this.searchForm.startTime;
                    params.searchEndTime = this.searchForm.endTime + " 23:59:59";
                    let startTime = params.searchStartTime.replace(/-/g,"/");
                    let endTime = params.searchEndTime.replace(/-/g,"/");
                    startTime = new Date(startTime);
                    endTime = new Date(endTime);
                    if(startTime > endTime)
                    {
                        this.$message.error("老铁你秀逗了吧");
                        return;
                    }
                }
                else if(this.searchForm.startTime && !this.searchForm.endTime)
                {
                    params.searchStartTime = this.searchForm.startTime;
                    params.searchEndTime = "";
                    let currentTime = new Date();
                    params.searchEndTime += currentTime.getFullYear() + "-";
                    params.searchEndTime += currentTime.getMonth() + 1 + "-";
                    params.searchEndTime += currentTime.getDate() + " ";
                    params.searchEndTime += currentTime.getHours() + ":";
                    params.searchEndTime += currentTime.getMinutes() + ":";
                    params.searchEndTime += currentTime.getSeconds();
                }
                else if(!this.searchForm.startTime && !this.searchForm.endTime)
                {
                }
                else
                {
                    this.$message.error("请填写完整的时间");
                    return
                }

                console.log(params);
                this.$http
                .post('/countManage',params)
                .then((data)=>{
                    let responseData = data.data;
                    this.searchResult = responseData.data;
                    console.log(this.searchResult);
                    var hottestSum = [];
                    for(let i = 0;i<this.searchResult.length;i++)
                    {
                        hottestSum.push(this.searchResult[i].orderList_id);
                        this.totalOrderNum ++;
                        if(this.searchResult[i].orderList_discountPrice)
                        {
                            this.totalMoney += this.searchResult[i].orderList_discountPrice;
                        }
                        else
                        {
                            this.totalMoney += this.searchResult[i].orderList_price;
                        }
                    }
                    resolve(hottestSum);
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
            // 根据订单编号查询相关的订单项
            promise.then((value)=>{
                let params = {
                    "method":"checkOrderDetail",
                    "orderList":value
                };
                this.$http
                .post('/countManage',params)
                .then((data)=>{
                    let responseData = data.data.data;
                    console.log(data,'我想看看这个');

                    // 对订单项进行统计
                    let hottestRank = {};
                    for(let i = 0;i<responseData.length;i++)
                    {
                        if(!hottestRank[responseData[i].good_name])
                        {
                            hottestRank[responseData[i].good_name] = {};
                            hottestRank[responseData[i].good_name].count = responseData[i].good_count;
                            hottestRank[responseData[i].good_name].name = responseData[i].good_name;
                            hottestRank[responseData[i].good_name].img = responseData[i].good_imgurl;
                            hottestRank[responseData[i].good_name].price = responseData[i].good_price;
                            hottestRank[responseData[i].good_name].good_unit = responseData[i].good_unit;
                        }
                        else
                        {
                            hottestRank[responseData[i].good_name].count += responseData[i].good_count;
                        }
                    }
                    for(var x in hottestRank)
                    {
                        this.hottestRankTable.push(hottestRank[x]);
                    }
                    console.log(this.hottestRankTable,"畅销排行榜");
                    for(let good in hottestRank)
                    {
                        if(hottestRank[good].count > this.hottestGoodNum)
                        {
                            this.hottestGood = hottestRank[good].name;
                            this.hottestGoodNum = hottestRank[good].count;
                        }
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
        },
        // 重置查询表单
        reset(){
            this.searchForm.timeRange = "";
        },
    },
}
</script>

<style lang="scss" scoped>
    .CountManageWrapper
    {
        box-sizing: border-box;
        height: calc(100% - 40px);
        margin-left: 300px;
        padding: 30px;
        overflow: auto;
        .el-form-item
        {
            margin-right: 50px;
        }
        .countRankTable
        {
            margin-bottom: 40px;
            margin-top: 40px;
        }
        .countContent
        {
            width: 428px;
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            margin-bottom: 20px;
        }
    }
    .goodImg
    {
        width: 100px;
        height:100px;
    }
</style>
