<template>
    <div class="couponManageWrapper">
        <el-button @click="addCoupon" type="primary">添加新券</el-button>
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
                        <a @click="editCoupon(scope.row)">编辑</a>
                        <a @click="deleteCoupon(scope.row)">删除</a>
                    </div>
                </template>
            </el-table-column>
        </el-table>
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
            dialogStage:false,
            dialogState:false,
            couponInfo:{},
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
                    "method":"checkAllCoupon"
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
                    console.log(this.couponList);
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
    },
}
</script>

<style lang="scss" scoped>
    .couponManageWrapper
    {
        margin-left: 300px;
        padding: 30px;
        box-sizing: border-box;
        overflow: auto;
        height: calc(100% - 40px);
    }
</style>
