<template>
    <el-dialog class="addCouponWrapper" :visible.sync="dialogStage">
        <el-form :model="couponInfo" ref="addCoupon" :rules="rules" :inline="true">
            <el-form-item label="名称" prop="coupon_name">
                <el-input v-model="couponInfo.coupon_name"></el-input>
            </el-form-item>
            <el-form-item label="金额" prop="coupon_price">
                <el-input v-model="couponInfo.coupon_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="限制金额" prop="coupon_limit">
                <el-input v-model="couponInfo.coupon_limit" type="number"></el-input>
            </el-form-item>
            <el-form-item label="适用范围">
                <el-select v-model="couponInfo.coupon_type">
                    <el-option v-for="item in typeList" :value="item" :key="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="coupon_startTime">
                <el-date-picker :clearable="false" v-model="couponInfo.coupon_startTime" value-format="yyyy-M-d H:m:s" :picker-options="pickerOption1"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="coupon_endTime">
                <el-date-picker :clearable="false" v-model="couponInfo.coupon_endTime" value-format="yyyy-M-d H:m:s" :picker-options="pickerOption2"></el-date-picker>
            </el-form-item>
        </el-form>
        <div class="btnGroup">
            <el-button @click="confirm" type="primay">确定</el-button>
            <el-button @click="cancel" type="error">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name:'addCoupon',
    props:[
        "dialogState",
    ],
    watch:{
        dialogState(val){
            if(val)
            {
                this.dialogStage = true;
            }
        },
    },
    data(){
        var couponStartTime = (rule,value,callback)=>{
            if(!value)
            {
                callback(new Error('优惠券开始时间不能为空'));
            }
            else
            {
                if(new Date(value) > new Date(this.couponInfo.coupon_endTime))
                {
                    return new Error(callback('开始时间不能晚于结束时间'));
                }
                else
                {
                    callback();
                }
            }
        };
        var couponEndTime = (rule,value,callback)=>{
            if(!value)
            {
                callback(new Error('优惠券结束时间不能为空'));
            }
            else
            {
                if(new Date(value) < new Date(this.couponInfo.coupon_startTime))
                {
                    return new Error(callback('结束时间不能早于开始时间'));
                }
                else
                {
                    callback();
                }
            }
        };
        var couponPrice = (rule,value,callback)=>{
            if(!value)
            {
                callback(new Error("优惠价格不能为空"));
            }
            else
            {
                callback();
            }
        };
        return{
            dialogStage:false,
            rules:{
                coupon_name:[
                    { required:true,message:"券名不能为空",trigger:'blur' }
                ],
                coupon_price:[
                    { required:true,validate:couponPrice,trigger:'blur' }
                ],
                coupon_limit:[
                    { min:0,message:"限制金额必须是数字",trigger:'blur' }
                ],
                coupon_startTime:[
                    { required:true,validator:couponStartTime,trigger:'blur' }
                ],
                coupon_endTime:[
                    { required:true,validator:couponEndTime,trigger:'blur' }
                ],
            },
            pickerOption1:{
                disabledDate(time){
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            pickerOption2:{
                disabledDate(time){
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            typeList:[],
            couponInfo:{
                coupon_endTime: "",
                coupon_limit: "",
                coupon_name: "",
                coupon_price: "",
                coupon_startTime: "",
                coupon_type: "",
            },
        }
    },
    created(){
        this.getTypeList();
    },
    methods:{
        getTypeList(){
            let params = {
                "method":"checkCategory"
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
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        confirm(){
            this.$refs['addCoupon'].validate((valid)=>{
                if(valid)
                {
                    let params = {
                        "method":"addCoupon",
                        "coupon_name":this.couponInfo.coupon_name,
                        "coupon_price":this.couponInfo.coupon_price,
                        "coupon_startTime":this.couponInfo.coupon_startTime,
                        "coupon_endTime":this.couponInfo.coupon_endTime,
                        "coupon_limit":this.couponInfo.coupon_limit,
                        "coupon_type":this.couponInfo.coupon_type,
                    };
                    if(params.coupon_type == "无限制" || params.coupon_type == "")
                    {
                        params.coupon_type = "all";
                    }
                    if(params.coupon_limit.trim() == "")
                    {
                        params.coupon_limit = 0;
                    }
                    this.$http
                    .post('/coupon',params)
                    .then((data)=>{
                        let responseData = data.data;
                        if(responseData.code == 0)
                        {
                            this.dialogStage = false;
                            this.$emit("confirmAdd");
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
            });
        },

        cancel(){
            this.dialogStage = false;
            this.$emit("cancelAdd");
            // this.editCouponInfo={
            //     coupon_endTime: "",
            //     coupon_limit:"" ,
            //     coupon_name: "",
            //     coupon_price:"" ,
            //     coupon_startTime:"",
            //     coupon_type: "",
            //     id: "",
            //     user_nickname: "",
            // };
        },
    },
}
</script>
