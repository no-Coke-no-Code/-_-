<template>
    <div class="wrapper">

        <div class="formArea">
                <form id="form1" runat="server">
                    <h1>管理员登录</h1>
                    <div class="hr"></div>
                    <div id="form1Content">
                        <p>
                            <i class="adminIcon">
                                <img src="../assets/img/index/user_icon_alter@2x.png"/>
                            </i>
                            <input type="text" id="username" name="username" v-model="adminAccount" placeholder="账号"/>
                        </p>
                        <p>
                            <i class="adminIcon">
                                <img src="../assets/img/index/nav_icon_pwd@2x.png"/>
                            </i>
                            <input type="password" id="password" name="password" v-model="adminPassword" placeholder="密码"/>
                        </p>
                        <p>
                            <el-button class="login" type="primary" @click="login">登录</el-button>
                        </p>
                        <!-- <p>
                            <el-button class="login">
                                <router-link to="/register" style="display:block;height:100%;">注册</router-link>
                            </el-button>
                        </p> -->
                    </div>
                </form>
        </div>
    </div>
</template>

<script>

export default {
    name:'adminlogin',
    data(){
        return{
            name:"后台登录页",
            adminAccount:"",
            adminPassword:"",
        }
    },
    methods:{
        login(){
            var adminAccount = this.checkingAdminAccount;
            var password = this.checkingPassword;
            let params = {
                "admin_account":this.adminAccount,
                "admin_password":this.adminPassword
            };
            if(adminAccount() && password())
            {
                this.$http
                .post("/adminLogin",params)
                .then((responseData) => { 
                    if(responseData.data.state == 1)
                    {
                        // let userInfo = {
                        //     userName:responseData.data.user.user_nickname,
                        //     userId:responseData.data.user.user_id,
                        // };
                        // this.$store.commit('setUsername',userInfo);
                        // 这个操作是用户若尚未登录，点击购物车/收藏操作时会创建一个锚点，登录后进入原页面
                        // if(this.$store.state.location != undefined)
                        // {
                        //     let targetLocation = this.$store.state.location.split("#")[1];
                        //     let targetGood = this.$store.state.location.split("=")[1]
                        //     this.$router.push({path:targetLocation,name:"goodDetail",query:{
                        //         goodName:targetGood
                        //     }});
                        //     return;
                        // }
                        this.$router.push("/adminBackStage");
                    }
                    else
                    {
                        this.$message({
                            message:"账号或密码有误，请重新输入",
                            type:"error"
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        },
        // 校验账户名
        checkingAdminAccount(){
            if(this.adminAccount == "" || this.adminPassword == undefined)
            {
                alert("账号不可为空");
                return false;
            }
            return true;
        },
        // 校验密码
        checkingPassword(){
            if(this.adminPassword == "" || this.adminPassword == undefined)
            {
                alert("密码不可为空");
                return false;
            }
            return true;
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        height: 100%;
        background: url("../../static/pic/adminLoginBg.jpg") no-repeat;
        background-size:cover;
        background-position: -4px -129px;
        .formArea
        {
            height: 100%;
            position: relative;
        }
        #form1
        {
            box-sizing: border-box;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 360px;
            margin: auto;
            height: 425px;
            padding-top: 30px;
            background-color: #fff;
            border-radius: 6px;
            border: 2px solid #c0c0c0;
            h1
            {
                text-align: center;
                line-height: 60px;
                font-family:Verdana, Geneva, Tahoma, sans-serif;
            }
            .hr
            {
                height: 1px;
                border-top: 1px dotted gray;
                margin:10px auto;
                width: 90%;
            }
            #form1Content
            {
                padding: 0 50px;
                p
                {
                    margin-top: 20px;
                    font-size: 0;
                    // [class^="el-icon-"]
                    // {
                    //     display: inline-block;
                    //     padding: 5px;
                    //     font-size: 16px;
                    //     border: 1.5px solid #c0c0c0;
                    //     border-right: unset;
                    // }
                    .adminIcon
                    {
                        display: inline-block;
                        padding: 8px 9px 4px 9px;;
                        font-size: 16px;
                        border: 1.5px solid #c0c0c0;
                        border-right: unset;
                        background-color:rgba(192,192,192,0.2);
                        img
                        {
                            width: 20px;
                            height: 20px;
                        }
                    }
                    input
                    {
                        height: 35px;
                        vertical-align: top;
                        padding: 0 5px;
                        width: 200px;
                    }
                    .el-button
                    {
                        width: 253px;
                    }
                    &:first-of-type
                    {
                        margin-top: 50px;
                    }
                    &:nth-of-type(3)
                    {
                        margin-top: 50px;
                    }
                }
            }
        }
    }
</style>


