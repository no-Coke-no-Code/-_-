<template>
    <div class="wrapper">
        <h1 class="listTitle">后台管理</h1>
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
            <el-menu-item index="4" @click="toCategoryMange">
                <i class="el-icon-setting"></i>
                <span>商品类别管理</span>
            </el-menu-item>
            <el-menu-item index="5" @click="toTopGoodMange">
                <i class="el-icon-setting"></i>
                <span>新品，热销品管理</span>
            </el-menu-item>
            <el-menu-item index="6" @click="toCommentManage">
                <i class="el-icon-setting"></i>
                <span>用户评论管理</span>
            </el-menu-item>
            <el-menu-item index="7" @click="toCountManage">
                <i class="el-icon-setting"></i>
                <span>交易统计</span>
            </el-menu-item>
            <el-menu-item index="8" @click="toCouponManage">
                <i class="el-icon-setting"></i>
                <span>优惠券管理</span>
            </el-menu-item>
            <el-menu-item index="9" @click="logout">
                <i class="el-icon-setting"></i>
                <span>退出</span>
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
    created(){
    },
    methods:{
        toGoodMange(){
            this.$router.push("/adminBackStage/goodMange");
        },
        toUserMange(){
            this.$router.push("/adminBackStage/userMange");
        },
        toOrderMange(){
            this.$router.push("/adminBackStage/OrderMange");
        },
        toCategoryMange(){
            this.$router.push('/adminBackStage/categoryMange');
        },
        toTopGoodMange(){
            this.$router.push('/adminBackStage/topGoodMange');
        },
        toCommentManage(){
            this.$router.push("/adminBackStage/commentManage");
        },
        toCountManage(){
            this.$router.push("/adminBackStage/countManage");
        },
        toCouponManage(){
            this.$router.push("/adminBackStage/couponManage");
        },
        logout(){
            this.$router.push("/");
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        width: 300px;
        float: left;
        height: 100%;
        background: rgb(84, 92, 100);   
        .listTitle
        {
            text-align: center;
            line-height: 80px;
            color:#fff;
        }
    }
</style>
