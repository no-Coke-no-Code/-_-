<template>
    <div class="goodMenuWrapper">
        <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">蔬菜</template>
                <el-menu-item index="叶类蔬菜">叶类蔬菜</el-menu-item>
                <el-menu-item index="地下蔬菜">地下蔬菜</el-menu-item>
                <el-menu-item index="山货">山货</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">水果</template>
                <el-menu-item index="苹果">苹果</el-menu-item>
                <el-menu-item index="雪梨">雪梨</el-menu-item>
                <el-menu-item index="香蕉">香蕉</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">海鲜</template>
                <el-menu-item index="鱼">鱼</el-menu-item>
                <el-menu-item index="龙虾">龙虾</el-menu-item>
                <el-menu-item index="鲍鱼">鲍鱼</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">肉类</template>
                <el-menu-item index="牛肉">牛肉</el-menu-item>
                <el-menu-item index="猪肉">猪肉</el-menu-item>
                <el-menu-item index="羊肉">羊肉</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">零食</template>
                <el-menu-item index="巧克力">巧克力</el-menu-item>
                <el-menu-item index="糖果">糖果</el-menu-item>
                <el-menu-item index="汽水">汽水</el-menu-item>
            </el-submenu>
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
            this.$router.push({path:'searchResult',query:{search:key,searchType:'category'}});
        },
    },
}
</script>

<style lang="scss" scoped>
    .goodMenuWrapper
    {
        border-bottom: 1px solid #e6e6e6;
        border-top: 1px solid #e6e6e6;
        .el-menu.el-menu--horizontal
        {
            width: 80%;
            margin: 0px auto;
            border: transparent !important;
        }
    }
</style>
