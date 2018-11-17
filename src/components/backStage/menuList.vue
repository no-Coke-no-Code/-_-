<template>
    <div class="wrapper">
        <h1>后台管理</h1>
    <el-menu
        class="el-menu-vertical-demo"

        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" @click="toGoodMange">
            <i class="el-icon-menu"></i>
            <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="2" @click="toUserMange">
            <i class="el-icon-menu"></i>
            <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="3" @click="toOrderMange">
            <i class="el-icon-setting"></i>
            <span>订单管理</span>
        </el-menu-item>
        </el-menu>
    </div>
</template>


<script>


export default {
    name: 'menuList',
    data () {
        return {
            menuList:{

            },
        }
    },
    created(){
    },
    methods:{
        toGoodMange(){
            this.$router.push("/backStage/goodMange");
        },
        toUserMange(){
            this.$router.push("/backStage/userMange");
        },
        toOrderMange(){
            this.$router.push("/backStage/OrderMange");
        },
    },
}
</script>

<style scoped>
    .wrapper
    {
        width: 300px;
        float: left;
    }
</style>
