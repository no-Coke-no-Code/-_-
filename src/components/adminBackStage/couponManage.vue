<template>
    <div class="couponManageWrapper">
        <div class="btnGroup">
            <el-button @click="search" icon="el-icon-search" type="primary">查询</el-button>
            <el-button @click="addCoupon" icon="el-icon-plus" type="primary">添加新券</el-button>
            <el-button @click="reset" icon="el-icon-refresh">重置</el-button>
        </div>
        <el-form :model="searchForm" :inline='true'>
            <el-form-item label="代金券ID">
                <el-input v-model="searchForm.coupon_id"></el-input>
            </el-form-item>
            <el-form-item label="代金券名称">
                <el-input v-model="searchForm.coupon_name"></el-input>
            </el-form-item>
            <el-form-item label="券值金额">
                <el-input v-model="searchForm.coupon_price"></el-input>
            </el-form-item>
            <el-form-item label="限制金额">
                <el-input v-model="searchForm.coupon_limit"></el-input>
            </el-form-item>
            <el-form-item label="券类型">
                <el-select v-model="searchForm.coupon_type">
                    <el-option v-for="item in typeList" :value="item" :key="item">{{item}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker v-model="searchForm.coupon_startTime" type="datetimerange" range-separator="至" value-format="yyyy-M-d H:m:s"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="searchForm.coupon_endTime" type="datetimerange" range-separator="至" value-format="yyyy-M-d H:m:s"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否已被领取">
                <el-switch v-model="searchForm.coupon_ifOwner"></el-switch>
            </el-form-item>
            <el-form-item label="持有人" v-if="searchForm.coupon_ifOwner">
                <el-input v-model="searchForm.coupon_owner"></el-input>
            </el-form-item>
        </el-form>
        <el-table :data="couponList">
            <el-table-column label="编号" prop="id"></el-table-column>
            <el-table-column label="名称" prop="coupon_name"></el-table-column>
            <el-table-column label="金额" prop="coupon_price"></el-table-column>
            <el-table-column label="限制金额" prop="coupon_limit">
                <template slot-scope="scope">
                    <p>{{scope.row.coupon_limit?scope.row.coupon_limit:0}}</p>
                </template>
            </el-table-column>
            <el-table-column label="适用范围" prop="coupon_type">
                <template slot-scope="scope">
                    <p>{{scope.row.coupon_type!="all"?scope.row.coupon_type:"无限制"}}</p>
                </template>
            </el-table-column>
            <el-table-column label="开始日期" prop="coupon_startTime">
                <template slot-scope="scope">
                    <p>{{scope.row.coupon_startTime.split(" ")[0]}}</p>
                </template>
            </el-table-column>
            <el-table-column label="截至日期" prop="coupon_endTime">
                <template slot-scope="scope">
                    <p>{{scope.row.coupon_endTime.split(" ")[0]}}</p>
                </template>
            </el-table-column>
            <el-table-column label="所属用户" prop="user_nickname">
                <template slot-scope="scope">
                    <p>{{scope.row.user_nickname?scope.row.user_nickname:"--"}}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div v-if="!scope.row.user_nickname">
                        <a @click="editCoupon(scope.row)" class="action">编辑</a>
                        <a @click="deleteCoupon(scope.row)" class="action">删除</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @current-change="handleCurrentChange"
            @size-change="pagesizeChange"
            :current-page="searchPageForm.pageIndex"
            :page-size="searchPageForm.pageSize"
            :page-sizes="[10,20,30]"
            layout="total, sizes,prev, pager, next, jumper"
            :total="searchPageForm.total">
        </el-pagination>
        <editCoupon :dialogStage='dialogStage' :couponInfo='couponInfo' @confirmEdit='confirmEdit' @cancelEdit='cancelEdit'></editCoupon>
        <addCoupon :dialogState='dialogState' @confirmAdd="confirmAdd" @cancelAdd="cancelAdd"></addCoupon>
    </div>
</template>

<script>
import editCoupon from "./editCoupon.vue";
import addCoupon from "./addCoupon.vue";

export default {
    name:"couponManage",
    components:{
        editCoupon,
        addCoupon
    },
    data(){
        return{
            couponList:[],
            typeList:[],
            dialogStage:false,
            dialogState:false,
            couponInfo:{},
            searchForm:{
                coupon_id:"",
                coupon_name:"",
                coupon_price:"",
                coupon_limit:"",
                coupon_type:"",
                coupon_startTime:[],
                coupon_endTime:[],
                coupon_ifOwner:false,
                coupon_owner:"",
            },
            searchPageForm:{
                pageSize:10,
                pageIndex:1,
                total:0,
            },
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            let promise = new Promise((resolve,reject)=>{
                this.$http
                .delete('/coupon',{
                    params:{
                        method:"deleteCouponByDate"
                    }
                })
                .then((data)=>{
                    let responseData = data.data;
                    console.log(responseData);
                    if(responseData.code == 0)
                    {
                        resolve();
                    }
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
            promise.then(()=>{
                this.couponList = [];
                let params = {
                    "method":"checkAllCoupon",
                    "pageSize":this.searchPageForm.pageSize,
                    "pageIndex":this.searchPageForm.pageIndex
                };
                this.$http
                .post('/coupon',params)
                .then((data)=>{
                    let responseData = data.data.data;
                    for(let i = 0;i<responseData.length;i++)
                    {
                        this.couponList.push(responseData[i]);
                        if(this.couponList[i].coupon_type == "all")
                        {
                            this.couponList[i].coupon_type = "无限制";
                        }
                    }
                    this.searchPageForm.total = data.data.totalSize;
                    console.log(this.couponList);
                })
                .catch((err)=>{
                    console.log(err);
                });
            })
            .then(()=>{
                this.typeList = [];
                let params = {
                    "method":"checkCategory",
                };
                this.$http
                .post('/categoryMange',params)
                .then((data)=>{
                    let responseData = data.data;
                    if(responseData.code == 0)
                    {
                        for(let i = 0;i<responseData.data.length;i++)
                        {
                            this.typeList.push(responseData.data[i].category_name);
                        }
                        this.typeList.push("无限制");
                    }
                    console.log(this.typeList);
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
        },

        deleteCoupon(row){
            this.$http
            .delete('/coupon',{
                params:{
                    method:"deleteCouponById",
                    couponId:row.id
                }
            })
            .then((data)=>{
                let responseData = data.data;
                if(responseData.code == "0")
                {
                    this.$message.success("删除成功");
                    this.init();
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 查询优惠券操作
        search(){
            this.couponList = [];
            let params = {
                "method":"checkCouponByCondition",
                "coupon_id":this.searchForm.coupon_id,
                "coupon_name":this.searchForm.coupon_name,
                "coupon_price":this.searchForm.coupon_price,
                "coupon_limit":this.searchForm.coupon_limit,
                "coupon_type":this.searchForm.coupon_type,
                "coupon_startTime":this.searchForm.coupon_startTime,
                "coupon_endTime":this.searchForm.coupon_endTime,
                "coupon_ifOwner":this.searchForm.coupon_ifOwner,
                "coupon_owner":this.searchForm.coupon_owner,
                "pageSize":this.searchPageForm.pageSize,
                "pageIndex":this.searchPageForm.pageIndex
            };
            if(params.coupon_type == "无限制")
            {
                params.coupon_type = "all";
            }
            console.log(params);
            this.$http
            .post('/coupon',params)
            .then((data)=>{
                let responseData = data.data.data;
                console.log(responseData);
                for(let i = 0;i<responseData.length;i++)
                {
                    this.couponList.push(responseData[i]);
                    if(this.couponList[i].coupon_type == "all")
                    {
                        this.couponList[i].coupon_type = "无限制";
                    }
                }
                this.searchPageForm.total = data.data.totalSize;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        reset(){
            this.searchForm.coupon_id = "";
            this.searchForm.coupon_name = "";
            this.searchForm.coupon_price = "";
            this.searchForm.coupon_limit = "";
            this.searchForm.coupon_type = "";
            this.searchForm.coupon_startTime = [];
            this.searchForm.coupon_endTime = [];
            this.searchForm.coupon_ifOwner = false;
            this.searchForm.coupon_owner = "";
            this.init();
        },

        // 编辑优惠券系列操作
        editCoupon(row){
            this.dialogStage = true;
            this.couponInfo = row;
            console.log(this.couponInfo);
        },
        cancelEdit(){
            this.$message.error("已取消更改");
            this.dialogStage = false;
        },
        confirmEdit(){
            this.$message.success("已保存更改");
            this.dialogStage = false;
            this.init();
        },

        // 新增优惠券系列操作
        addCoupon(){
            this.dialogState = true;
        },
        confirmAdd(){
            this.$message.success("添加优惠券成功");
            this.dialogState = false;
            this.init();
        },
        cancelAdd(){
            this.$message.error("已取消新增");
            this.dialogState = false;
        },

        handleCurrentChange(val){
            this.searchPageForm.pageIndex = val;
            this.init();
        },
        pagesizeChange(val){
            this.searchPageForm.pageSize = val;
            this.init();
        },
    },
}
</script>

<style>
    .couponManageWrapper .el-pagination
    {
        float: right;
        margin-top: 50px;
    }
</style>

<style lang="scss" scoped>
    .couponManageWrapper
    {
        margin-left: 300px;
        padding: 30px;
        box-sizing: border-box;
        overflow: auto;
        height: calc(100% - 40px);
        .action
        {
            &:hover
            {
                text-decoration: underline;
                cursor: pointer;
                color: blue;
            }
        }
    }
</style>
