<template>
    <div class="wrapper" v-loading="ifLoading">
        <h1>已成功生成订单！！货品将会很快送到你手上的！！</h1>
        <div class="btnGroup">
            <!-- 这里放一个庆祝的图片 -->
            <img/>
            <el-button><router-link to="/">返回商城首页</router-link></el-button>
            <el-button><router-link to="guestBackStage/guestOrder">查看我的订单</router-link></el-button>
        </div>
    </div>
</template>

<script>
import headers from "../global/headers.vue";

export default {
    name: 'makeOrderSuccess',
    components:{
        headers
    },
}
</script>

<style lang="scss" scoped>

</style>

