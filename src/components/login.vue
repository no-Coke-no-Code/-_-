<template>
    <div class="wrapper">
        <header>
        </header>
        <div class="middle">
            <div class="middle_left">
            </div>
            <div class="middle_right">
                <form id="form1" runat="server">
                    <h1>购物网站</h1>
                    <div class="hr"></div>
                    <p>
                        <!-- <span class="icon_admin">&#xe625;</span> -->
                        <i class="el-icon-edit"></i>
                        <input type="text" id="username" name="username" v-model="username"/>
                    </p>
                    <p>
                        <!-- <span class="icon_password">&#xe8a3;</span> -->
                        <i class="el-icon-edit"></i>
                        <input type="password" id="password" name="password" v-model="password"/>
                    </p>
                    <p>
                        <el-button class="login" type="primary" @click="login">登录</el-button>
                    </p>
                    <router-link to="/register">没有账号？？注册一个</router-link>
                </form>
            </div>
        </div>
        <footer>
        </footer>
    </div>
</template>

<script>
export default {
    name:'login',
    data(){
        return{
            name:"登录页",
            username:"",
            password:"",
        }
    },
    methods:{
        login(){
            var username = this.checkingUsername;
            var password = this.checkingPassword;
            let params = {
                "username":this.username,
                "password":this.password
            };
            if(username() && password())
            {
                this.$http
                .post("/index",params)
                .then((responseData) => { 
                    if(responseData.data.state == 1)
                    {
                        this.$store.state.ifLogin = true;
                        this.$store.state.userName = this.username;
                        this.$router.push("/");
                    }
                    else
                    {
                        alert("账号或密码有误，请重新输入");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        },
        // 校验账户名
        checkingUsername(){
            if(this.username == "" || this.username == undefined)
            {
                alert("账号不可为空");
                return false;
            }
            return true;
        },
        // 校验密码
        checkingPassword(){
            if(this.password == "" || this.password == undefined)
            {
                alert("密码不可为空");
                return false;
            }
            return true;
        },
    },
    created(){
        this.$http.get("http://localhost:3333/index").then((data)=>{
            // this.name = data
            console.log(data);
        }).catch((err)=>{
            console.log(err);
        });
    },
}
</script>

<style lang="scss" scoped>

    .wrapper
    {
        height: 100%;
    }
    header
    {
        height: 10%;
        // background: url("../assets/img/index/htop.png");
        background-color: transparent;
    }
    .middle
    {
        height: 80%;
        background-color: green;
        .middle_left
        {
            float: left;
            height: 100%;
            width: 60%;
            background-image: url("../assets/img/index/hleft.png");
            background-size: 100% 100%;
        }
        .middle_right
        {
            float: left;
            height: 100%;
            width: 40%;
            background-image: url("../assets/img/index/hright.png");
            #form1
            {
                box-sizing: border-box;
                background-color: #fff;
                border-radius: 10%;
                width: 80%;
                margin: auto;
                margin-top: 50px;
                padding: 0 50px;
                h1
                {
                    text-align: center;
                    line-height: 60px;
                }
                .hr
                {
                    height: 1px;
                    border-top: 1px dotted gray;
                    margin:auto;
                }
                p
                {
                    margin-top: 10px;
                    font-size: 0;
                    [class^="icon_"]
                    {
                        display: inline-block;
                        background-color: #c0c0c0;
                        padding: 5px;
                        font-size: 16px;
                        border: 1px solid gray;
                    }
                    input
                    {
                        height: 25px;
                        vertical-align: top;
                        padding: 0 5px;
                    }
                }
            }
        }
    }
    footer
    {
        height: 10%;
        background: transparent;  
    }
</style>


