<template>
    <div class="makeOrderSuccessWrapper">
        <div class="innerWrapper">
            <el-steps :active="3" finish-status="success" align-center>
                <el-step title="1.我的购物车"></el-step>
                <el-step title="2.填写核对订单信息"></el-step>
                <el-step title="3.成功提交订单"></el-step>
            </el-steps>
            <img class="success_icon" :src="imgDoc+'price_icon_payment_success@2x.png'"/>
            <h2 class="success_content">已成功生成订单！！货品将会很快送到你手上的！！</h2>
            <div class="btnGroup">
                <el-button><router-link to="/">返回商城首页</router-link></el-button>
                <el-button><router-link to="guestBackStage/guestOrder">查看我的订单</router-link></el-button>
            </div>
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
    data(){
        return{
            ifLoading:false
        }
    },
}
</script>

<style lang="scss" scoped>
    .makeOrderSuccessWrapper
    {
        position: relative;
        width: 100%;
        height: 100%;
        .innerWrapper
        {
            width: 900px;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            margin-top: 100px;
            margin-bottom: 50px;
            .success_icon
            {
                display: block;
                margin: auto;
                margin-top: 50px;
            }
            .success_content
            {
                text-align: center;
                margin-top: 30px;
            }
            .btnGroup
            {
                margin-top: 30px;
                text-align: center;
                button
                {
                    margin-right: 30px;
                    margin-left: 30px;
                }
            }
        }
    }
</style>

