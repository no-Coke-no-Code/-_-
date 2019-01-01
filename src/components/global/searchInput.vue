<template>
    <div>
        <el-input v-model="searchText" placeholder="请输入搜索内容"><el-button slot="append" type="primary" @click="searching"><i class="el-icon-search"></i>搜索</el-button></el-input>
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

<style lang="scss" scoped>

</style>
