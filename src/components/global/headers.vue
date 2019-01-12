<template>
    <div class="headerWrapper">
        <div class="stateArea">
            <span v-if="ifLogin">当前账号:{{this.userName}}</span>
            <span v-if="!ifLogin">当前状态:未登录</span>
        </div>
        <div class="controlArea">
            <!-- <button class="back" @click="goBack">返回</button> -->
            <button class="back" @click="backToMainPage">返回主页</button>
            <button class="primary" @click="login" v-if="!ifLogin">登录</button>
            <button class="primary">
                <router-link to="guestBackStage">个人信息</router-link>
            </button>
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
        }
    },
    created(){
        if(this.$store.getters.getUsername !== undefined && this.$store.getters.getUsername !== null)
        {
            this.userName = this.$store.getters.getUsername;
            this.ifLogin = true;
            console.log(this.userName,this.ifLogin);
        }
        else
        {
            this.userName = "未登录";
            this.ifLogin = false;
        }
    },
    methods:{
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
        },
        backToMainPage(){
            this.$router.push({path:"/"});
        },
    },
}
</script>

<style lang="scss" scoped>
    .headerWrapper
    {
        background-color: #999;
        height: 40px;
        display: flex;
        justify-content: space-between;
        line-height: 40px;
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
