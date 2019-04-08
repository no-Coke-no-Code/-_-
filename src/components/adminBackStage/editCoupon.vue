<template>
    <el-dialog class="editCouponWrapper" :visible.sync="dialogState">
        <el-form :model="couponInfo" ref="editCoupon" :rules="rules" :inline="true">
            <el-form-item label="编号">
                <el-input v-model="couponInfo.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="coupon_name">
                <el-input v-model="couponInfo.coupon_name"></el-input>
            </el-form-item>
            <el-form-item label="金额" prop="coupon_price">
                <el-input v-model="couponInfo.coupon_price"></el-input>
            </el-form-item>
            <el-form-item label="限制金额" prop="coupon_limit">
                <el-input v-model="couponInfo.coupon_limit"></el-input>
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
    name:'editCoupon',
    props:[
        "dialogStage",
        "couponInfo"
    ],
    watch:{
        dialogStage(val){
            console.log(val);
            if(val)
            {
                this.dialogState = true;
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
        return{
            dialogState:false,
            rules:{
                coupon_name:[
                    { required:true,message:"券名不能为空",trigger:'blur' }
                ],
                coupon_price:[
                    { type:'number',min:0,required:true,message:"券值不能为空",trigger:'blur' }
                ],
                coupon_limit:[
                    { type:'number',min:0,message:"限制金额必须是数字",trigger:'blur' }
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
            editCouponInfo:{
                coupon_endTime: this.couponInfo.coupon_endTime,
                coupon_limit: this.couponInfo.coupon_limit,
                coupon_name: this.couponInfo.coupon_name,
                coupon_price: this.couponInfo.coupon_price,
                coupon_startTime: this.couponInfo.coupon_startTime,
                coupon_type: this.couponInfo.coupon_type,
                id: this.couponInfo.id,
                user_nickname: this.couponInfo.user_nickname,
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
            this.$refs['editCoupon'].validate((valid)=>{
                if(valid)
                {
                    let params = {
                        "method":"editCoupon",
                        "id":this.couponInfo.id,
                        "coupon_name":this.couponInfo.coupon_name,
                        "coupon_price":this.couponInfo.coupon_price,
                        "coupon_startTime":this.couponInfo.coupon_startTime,
                        "coupon_endTime":this.couponInfo.coupon_endTime,
                        "coupon_limit":this.couponInfo.coupon_limit,
                        "coupon_type":this.couponInfo.coupon_type,
                    };
                    if(params.coupon_type == "无限制")
                    {
                        params.coupon_type = "all";
                    }
                    this.$http
                    .post('/coupon',params)
                    .then((data)=>{
                        let responseData = data.data;
                        if(responseData.code == 0)
                        {
                            this.dialogState = false;
                            this.$emit("confirmEdit");
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
            });
        },

        cancel(){
            this.dialogState = false;
            this.$emit("cancelEdit");
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
