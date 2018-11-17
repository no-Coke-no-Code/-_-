<template>
    <div class="wrapper">
        <span v-if="ifLogin">当前账号:{{userName}}</span>
        <span v-if="!ifLogin">当前状态:未登录</span>
        <el-button type="primary" @click="login" v-if="!ifLogin">登录</el-button>
        <el-button type="danger" @click="logout" v-if="ifLogin">退出登录</el-button>
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
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        background-color: #c0c0c0;
        height: 40px;
    }
</style>
