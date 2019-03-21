<template>
    <div class="wrapper">
        <el-form :model="registerForm" ref="registerForm" class="registerForm" :rules="rules">
            <h2 class="registerFormTitle">注册</h2>
            <el-form-item label="账号" prop="username">
                <el-input v-model="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password"></el-input>
            </el-form-item>
            <!-- <el-form-item label="确认密码">
                <el-input v-model="registerForm.confirmPassword" @blur="confirmPassword"></el-input>
            </el-form-item> -->
            <el-form-item label="真实姓名" prop="name">
                <el-input v-model="registerForm.name"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="registerForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="registerForm.sex" placeholder="">
                    <el-option
                    v-for="item in sexOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="送货地址" prop="address">
                <el-input v-model="registerForm.address"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="registerForm.email"></el-input>
            </el-form-item>
            <el-button type="primary" @click="register('registerForm')" class="registerFormBtn">确定</el-button>
            <el-button @click="backToLogin" class="registerFormBtn">返回</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    name:'register',
    data(){
        return{
            registerForm:{
                username:'',
                password:'',
                confirmPassword:'',
                name:'',
                sex:'',
                phone:'',
                address:'',
                email:'',
            },

            sexOptions:[
                {
                    label:'男',
                    value:'m'
                },
                {
                    label:'女',
                    value:'f'
                }
            ],

            rules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},
                    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                ],
                sex:[
                    {required:true,message:'请选择性别',trigger:'blur'},
                ],
                name:[
                    {required:true,message:'请输入姓名',trigger:'blur'},
                ],
                phone:[
                    {required:true,message:'请选择联系电话',trigger:'blur'},
                ],
                address:[
                    {required:true,message:'请填写地址',trigger:'blur'},
                ],
                email:[
                    {required:true,message:'请填写电子邮箱',trigger:'blur'},
                ],
            }
        }
    },
    methods:{
        backToLogin(){
            this.$router.push("/login");
        },
        confirmPassword(){
            if(this.registerForm.password !== this.registerForm.confirmPassword)
            {
                alert("两次输入的密码并不正确");
                return;
            }
        },
        register(form){
            this.$refs[form].validate((valid) => {
                if(valid)
                {
                    // this.confirmPassword();
                    let params = {
                        "registerUsername":this.registerForm.username,
                        "registerUserpassword":this.registerForm.password,
                        "registerName":this.registerForm.name,
                        "registerPhone":this.registerForm.phone,
                        "registerEmail":this.registerForm.email,
                        "registerSex":this.registerForm.sex,
                        "registerAddress":this.registerForm.address
                    };
                    this.$http
                    .post("/register",params)
                    .then((responseData) => {
                        if(responseData.data.state == 1)
                        {
                            alert("注册成功");
                            this.$router.push("/login");
                        }
                        else
                        {
                            alert(responseData.data.stateMent);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
                else
                {
                    this.$message({
                        message:"尚有信息未完善或不正确",
                        type:"warning"
                    });
                    return false;
                }
            });
        },
    },
}
</script>

<style>
    .registerForm .el-form-item__label
    {
        width: 100px;
        position: absolute;
        top: 0px;
        left: 0px;
    }
    .registerForm .el-form-item__content
    {
        display: inline-block;
        margin-left: 120px;
        width: 400px;
    }
    .registerForm .el-select
    {
        width: 300px;
    }
</style>

<style lang="scss" scoped>
    .wrapper
    {
        border: 1px solid #c0c0c0;
        border-radius: 5px;
        width: 50%;
        margin: 50px auto;
        padding: 20px 10px;
        .registerForm
        {
            padding-right: 80px;
            padding-left: 80px;
            .registerFormTitle
            {
                text-align: center;
                font-size: 30px;
                margin-bottom: 20px;
            }
            .el-form-item
            {
                position: relative;
            }
            .registerFormBtn
            {
                display: block;
                width: 500px;
                margin-top: 50px;
                margin-left: 20px;
            }
            .el-button+.el-button
            {
                margin-top: 20px;
            }
        }
    }
</style>

