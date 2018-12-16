<template>
    <div class="wrapper userInfo">
        <el-form :inline="true" :model="editForm" :rules="rules" ref="guestInfoForm">
            <el-col :span="8">
                <el-form-item label="账号">
                    <el-input v-model="editForm.nickname" :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="真实姓名">
                    <el-input v-model="editForm.realname" :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="性别">
                    <el-input v-model="editForm.sex" :disabled="true"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="editForm.phone"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="送货地址" prop="address">
                    <el-input v-model="editForm.address" style="width:780px;"></el-input>
                </el-form-item>
            </el-col>
        </el-form>
        <div class="btnGrounp" v-if="ifChanged">
            <el-button type="primary" @click="saveChange">保存</el-button>
            <el-button type="danger" @click="removeChange">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name:"guestInfo",
    created(){
        this.init();
        console.log(this.userID);
    },
    computed:{
        userID(){
            return this.$store.state.userName;
        },
    },
    data(){
        var password = function(rule,value,callback){
            if(value == "")
            {
                callback(new Error("密码不为空"));
            }
            if(value.length > 20)
            {
                callback(new Error("密码过长"));
            }
            else
            {
                callback();
            }
        };
        var phone = function(rule,value,callback){
            if(value == "")
            {
                callback(new Error("联系电话不能为空"));
            }
            let regExp = /^[0-9]{11}$/;
            if(!regExp.test(value))
            {
                callback(new Error("请输入符合格式的联系电话"));
            }
            else
            {
                callback();
            }
        };
        return{
            user:"",
            editForm:{
                nickname:"coke43",
                realname:"",
                password:"",
                sex:"",
                phone:"",
                address:"",
                email:""
            },
            temForm:{},
            ifChanged:false,
            rules:{
                realname:[
                    {required:true,message:"不能为空",trigger:['blur','change']}
                ],
                password:[
                    {
                        required:true,
                        validator:password,
                        trigger:['blur','change']
                    }
                ],
                address:[
                    {
                        required:true,
                        message:"地址不能为空",
                        trigger:["blur","change"],
                    }
                ],
                phone:[
                    {
                        required:true,
                        validator:phone,
                        trigger:["blur","change"],
                    }
                ],
                email:[
                    {
                        required:true,
                        message:"邮箱不能为空",
                        trigger:["blur","change"],
                    }
                ],
            },
        }
    },
    watch:{
        // 共有两种方式监听对象当中具体属性的变化
        // 1.通过computed返回一个变量，然后再监听变量
        // 2.直接通过引号将对象属性括起来监听
        'editForm.password'(){
            if(this.editForm.password != this.temForm.password)
            {
                this.ifChanged = true;
            }
        },
        'editForm.address'(){
            if(this.editForm.address != this.temForm.address)
            {
                this.ifChanged = true;
            }
        },
        'editForm.phone'(){
            if(this.editForm.phone != this.temForm.phone)
            {
                this.ifChanged = true;
            }
        },
        'editForm.email'(){
            if(this.editForm.email != this.temForm.email)
            {
                this.ifChanged = true;
            }
        },
    },
    methods:{
        init(){
            let params = {
                "method":"refresh",
                // "userName":this.$store.state.userName
                "userName":this.editForm.nickname
            };
            this.$http.post("/guestInfo",params)
            .then((data) => {
                let responseData = data.data.data[0];
                console.log(responseData);
                this.editForm.nickname = responseData.user_nickname;
                this.editForm.realname = responseData.user_realname;
                this.editForm.password = responseData.user_password;
                this.editForm.phone = responseData.user_phone;
                this.editForm.address = responseData.user_address;
                this.editForm.email = responseData.user_email;
                if(responseData.user_sex == "m")
                {
                    this.editForm.sex = "男";
                }
                else
                {
                    this.editForm.sex = "女";
                }
                this.temForm = JSON.parse(JSON.stringify(this.editForm));
                console.log(this.temForm);
            }).catch((err) => {
                console.log(err);
            });
        },
        saveChange(){
            this.$refs["guestInfoForm"].validate((valid) => {
                if(valid)
                {
                    this.ifChanged = false;
                    let params = {
                        "method":"updateUserInfo",
                        "userInfo":this.editForm,
                    };
                    this.$http.post('/guestInfo',params)
                    .then(() => {
                        this.$message({
                            message:"保存成功",
                            type:"success"
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
            });
        },
        removeChange(){
            console.log(this.editForm);
            console.log(this.temForm);
            this.editForm = JSON.parse(JSON.stringify(this.temForm));
            this.ifChanged = false;
            this.$message({
                message:"已取消更改",
                type:"warning"
            });
        },
    },
}
</script>


<style lang="scss" scoped>
    .userInfo
    {
        overflow: hidden;
        margin-left: 320px;
        margin-top: 50px;
        height: auto;
        .el-form--inline>.el-form-item__label
        {
            display: inline-block;
            width: 80px !important;
        }
    }
</style>