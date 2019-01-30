<template>
    <div class="searchInputWrapper">
        <el-input v-model="searchText" placeholder="请输入搜索内容">
            <template slot="append">
                <el-button type="primary" class="searchBtn" @click="searching"><i class="el-icon-search"></i>搜索</el-button>
            </template>
        </el-input>
        <!-- <el-button type="primary" class="searchBtn" @click="searching"><i class="el-icon-search"></i>搜索</el-button> -->
    </div>
</template>

<script>
export default {
    name:"searchInput",
    data(){
        return{
            searchText:""
        }
    },
    methods:{
        searching(){
            this.$router.push({path:'searchResult',query:{search:this.searchText}});
        },
    },
}
</script>


<style>
    .searchInputWrapper .el-input__inner
    {
        border-right: transparent !important;
    }
</style>

<style lang="scss" scoped>
    .searchInputWrapper
    {
        margin: 50px 200px 30px 200px;
        position: relative;
        text-align: center;
        .el-input
        {
            width: 500px;
            padding: 5px;
            margin: 0px auto;
        }
        .el-button
        {
            background: #409EFF;
            color: white;
            font-weight: bold;
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0 !important;
            [class^=el-icon-]
            {
                font-weight: bold;
            }
            &:hover
            {
                background-color:rgb(141, 198, 255)  !important;
            }
        }
    }
</style>
