<template>
    <div class="headerWrapper">
        <div class="stateArea">
            <img :src="headImg" class="userHeadImg"/>
            <span v-if="ifLogin">当前账号:{{this.userName}}</span>
            <span v-if="!ifLogin">当前状态:未登录</span>
        </div>
        <div class="controlArea">
            <button class="back" @click="backToMainPage" v-if="$route.fullPath != '/'">返回主页</button>
            <button class="primary" @click="login" v-if="!ifLogin">登录</button>
            <button class="primary" v-if="($route.fullPath != '/guestBackStage/'+$route.name)&&($route.fullPath != '/guestBackStage')" @click="iftoguestBack">
                个人中心
            </button>
            <button class="primary" v-if="$route.fullPath != '/couponCenter'" @click="toCouponCenter">抢券中心</button>
            <button class="danger" @click="logout" v-if="ifLogin">退出登录</button>
        </div>
    </div>
</template>

<script>
export default {
    name:"headers",
    data(){
        return{
            userName:'',
            ifLogin:false,
            headImg:'',
        }
    },
    created(){
        if(this.$store.getters.getUsername !== undefined && this.$store.getters.getUsername !== null)
        {
            this.userName = this.$store.getters.getUsername;
            this.ifLogin = true;
            let params = {
                "method":"getUserHeadImg",
                "user_nickname":this.userName
            };
            this.$http
            .post('/userMange',params)
            .then((data)=>{
                let responseData = data.data;
                if(responseData.code == 0)
                {
                    this.headImg = responseData.data[0].user_headImg;
                    if(this.headImg == "")
                    {
                        this.headImg = require('D:/hemashengxian/hema/static/pic/userHeadImg/noHeadImg.png');
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
            console.log(this.userName,this.ifLogin);
        }
        else
        {
            this.userName = "未登录";
            this.ifLogin = false;
            this.headImg = require('D:/hemashengxian/hema/static/pic/userHeadImg/noHeadImg.png');
        }
    },
    methods:{
        iftoguestBack(){
            if(this.userName == "未登录" && this.ifLogin == false)
            {
                this.$router.push({path:'login'});
            }
            else
            {
                this.$router.push({path:'guestBackStage'});
            }
        },
        login(){
            this.$router.push("/login");
        },
        logout(){
            this.$router.push("/");
            this.$store.commit('removeUsername');
            this.userName = "未登录";
            this.ifLogin = false;
            window.localStorage.removeItem('selectedGoodList');
            window.localStorage.removeItem('totalPrice');
            window.location.reload();
        },
        backToMainPage(){
            this.$router.push({path:"/"});
        },
        toCouponCenter(){
            this.$router.push({path:"/couponCenter"});
        },
    },
}
</script>

<style lang="scss" scoped>
    .headerWrapper
    {
        background-color: #EEEFF3;
        height: 40px;
        display: flex;
        justify-content: space-between;
        line-height: 40px;
        .userHeadImg
        {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
        }
        .stateArea
        {
            margin-left: 80px;
        }
        .controlArea
        {
            margin-right: 80px;
            .primary
            {
                background-color: #409EFF;
            }
            .danger
            {
                background-color: #f78989;
            }
            .danger,.primary,.back
            {
                border-radius:4px;
                padding: 5px 10px;
                color: white;
                font-weight: bolder;
                outline: none;
                border: 1px solid #dcdfe6;
                cursor: pointer;
                font-size: 18px;
            }
            a
            {
                color: white;
                font-size: 18px;
                font-weight: bolder;
            }
        }
    }
</style>
