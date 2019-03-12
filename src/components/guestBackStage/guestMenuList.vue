<template>
    <div class="wrapper">
        <!-- <h1 class="userName">你好，{{username}}</h1> -->
        <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-menu-item index="1" @click="toGuestInfo">
                <i class="el-icon-menu"></i>
                <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="2" @click="toCart">
                <i class="el-icon-menu"></i>
                <span>我的购物车</span>
            </el-menu-item>
            <el-menu-item index="3" @click="toGuestOrder">
                <i class="el-icon-setting"></i>
                <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="4" @click="toGuestCollect">
                <i class="el-icon-setting"></i>
                <span>我的收藏</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>


<script>


export default {
    name: 'adminBackStageMenuList',
    data () {
        return {
            menuList:{
            },
        }
    },
    computed:{
        username(){
            return this.$store.state.userName;
        },
    },
    created(){
        
    },
    methods:{
        toGuestInfo(){
            this.$router.push("/guestBackStage/guestInfo");
        },
        toCart(){
            this.$router.push("/guestBackStage/guestCart");
        },
        toGuestOrder(){
            this.$router.push("/guestBackStage/guestOrder");
        },
        toGuestCollect(){
            this.$router.push("/guestBackStage/guestCollect");
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        width: 300px;
        float: left;
        min-height: 100%;
        background-color: rgb(84, 92, 100);
        .userName
        {
            text-align: center;
            background-color: #c0c0c0;
        }
    }
</style>

