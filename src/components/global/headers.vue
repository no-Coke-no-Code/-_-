<template>
    <div class="wrapper">
        <div class="stateArea">
            <span v-if="ifLogin">当前账号:{{userName}}</span>
            <span v-if="!ifLogin">当前状态:未登录</span>
        </div>
        <div class="controlArea">
            <button class="back" @click="goBack">返回</button>
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
            
        }
    },
    computed:{
        userName(){
            return this.$store.state.userName;
        },
        ifLogin(){
            if(this.$store.state.ifLogin)
            {
                return true;
            }
            else
            {
                return false;
            }
        },
    },
    methods:{
        login(){
            this.$router.push("/login");
        },
        logout(){
            if(this.$store.state.ifLogin)
            {
                this.$router.push("/");
                this.$store.state.ifLogin = false;
                this.$store.state.userName = null;
            }
            else
            {
                alert("你尚未登录");
            }
        },
        goBack(){
            history.back(-1);
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
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
