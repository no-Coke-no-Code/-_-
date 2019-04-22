<template>
    <div class="wrapper">
        <el-menu
            class="el-menu-vertical-demo"
            :default-active="defaultActive"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            >
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
            <el-menu-item index="5" @click="toGuestCredit">
                <i class="el-icon-setting"></i>
                <span>我的会员积分</span>
            </el-menu-item>
            <el-menu-item index="6" @click="toMyComment">
                <i class="el-icon-setting"></i>
                <span>我的评论</span>
            </el-menu-item>
            <el-menu-item index="7" @click="toMyCoupon">
                <i class="el-icon-setting"></i>
                <span>我的优惠券</span>
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
            defaultActive:'0',
        }
    },
    computed:{
        username(){
            return this.$store.state.userName;
        },
    },
    watch:{
        $route:(val)=>{
            if(val.fullPath == "/guestBackStage/guestCart")
            {
                this.defaultActive = '2';
            }
            else if(val.fullPath == "/guestBackStage/guestCollect")
            {
                this.defaultActive = '4';
            }
        },
    },
    created(){
        if(this.$route.fullPath == "/guestBackStage/guestCart")
        {
            this.defaultActive = '2';
        }
        else if(this.$route.fullPath == "/guestBackStage/guestCollect")
        {
            this.defaultActive = '4';
        }
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
        toGuestCredit(){
            this.$router.push("/guestBackStage/guestCredit");
        },
        toMyComment(){
            this.$router.push("/guestBackStage/myComment");
        },
        toMyCoupon(){
            this.$router.push("/guestBackStage/myCoupon");
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        box-sizing: border-box;
        height: calc(100% - 40px);
        width: 300px;
        float: left;
        background-color: #545c64;
        .userName
        {
            text-align: center;
            background-color: #c0c0c0;
        }
    }
</style>

