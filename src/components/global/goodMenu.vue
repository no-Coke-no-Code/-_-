<template>
    <div>
        <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">蔬菜</template>
                <el-menu-item index="叶类蔬菜">叶类蔬菜</el-menu-item>
                <el-menu-item index="地下蔬菜">地下蔬菜</el-menu-item>
                <el-menu-item index="山货">山货</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">水果</template>
                <el-menu-item index="2-1">苹果</el-menu-item>
                <el-menu-item index="2-2">雪梨</el-menu-item>
                <el-menu-item index="2-3">香蕉</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">海鲜</template>
                <el-menu-item index="2-1">鱼</el-menu-item>
                <el-menu-item index="2-2">龙虾</el-menu-item>
                <el-menu-item index="2-3">鲍鱼</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">肉类</template>
                <el-menu-item index="2-1">牛肉</el-menu-item>
                <el-menu-item index="2-2">猪肉</el-menu-item>
                <el-menu-item index="2-3">羊肉</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">零食</template>
                <el-menu-item index="2-1">巧克力</el-menu-item>
                <el-menu-item index="2-2">糖果</el-menu-item>
                <el-menu-item index="2-3">汽水</el-menu-item>
            </el-submenu>
            <!-- <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item> -->
        </el-menu>
    </div>
</template>

<script>
export default {
    name:"goodMenu",
    data(){
        return{

        }
    },
    methods:{
        // 这里面的key是导航栏项里面的index
        handleSelect(key){
            this.$router.push({path:'searchResult',query:{search:key}});
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
