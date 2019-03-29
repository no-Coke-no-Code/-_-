<template>
    <div class="CountManageWrapper">
        统计管理页面
        <el-form>
            <el-form-item label="开始时间">
                <el-date-picker v-model="searchForm.startTime" type="date" value-format="yyyy-M-d H:m:s"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="searchForm.endTime" type="date" value-format="yyyy-M-d"></el-date-picker>
            </el-form-item>
        </el-form>
        <p>总成交金额:{{this.totalMoney}}</p>
        <p>总订单数:{{this.totalOrderNum}}</p>
        <p>最畅销商品:{{this.hottestGood}}</p>
        <p>销量:{{this.hottestGoodNum}}</p>
        <div class="btnGroup">
            <el-button @click="search">搜索</el-button>
        </div>
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
                .post('/order',params)
                .then((data)=>{
                    let responseData = data.data.data;
                    console.log(responseData);

                    // 对订单项进行统计
                    let hottestRank = {};
                    for(let i = 0;i<responseData.length;i++)
                    {
                        if(!hottestRank[responseData[i].good_name])
                        {
                            hottestRank[responseData[i].good_name] = 1;
                        }
                        else
                        {
                            hottestRank[responseData[i].good_name] += responseData[i].good_count;
                        }
                    }
                    console.log(hottestRank,"畅销排行榜");
                    for(let good in hottestRank)
                    {
                        if(hottestRank[good] > this.hottestGoodNum)
                        {
                            this.hottestGood = good;
                            this.hottestGoodNum = hottestRank[good];
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
        overflow: hidden;
    }
</style>
