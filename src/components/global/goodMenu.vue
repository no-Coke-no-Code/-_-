<template>
    <div class="goodMenuWrapper">
        <el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu v-for="(catalog,index1) in catalogList" :index="catalog.category_name" :key="catalog.category_name">
                <template slot="title">{{catalog.category_name}}</template>
                <el-menu-item v-if="catalog.subCatalog_name" v-for="(subCatalog,index2) in catalog.subCatalog_name" :index="subCatalog" :key="subCatalog">
                    {{subCatalog}}
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    name:"goodMenu",
    data(){
        return{
            catalogList:[],
            subCatalogList:[],
        }
    },
    created(){
        let params = {
            "method":"checkCategory"
        };
        this.$http
        .post('/categoryMange',params)
        .then((data)=>{
            let responseData = data.data;
            if(responseData.code == 0)
            {
                for(let i = 0;i<responseData.data.length;i++)
                {
                    this.catalogList.push(responseData.data[i]);
                }
                console.log(this.catalogList,'1111');
            }
        })
        .catch((err)=>{
            if(err)
            {
                console.log(err);
            }
        });
    },
    methods:{
        testing(){
            alert("哈哈沙雕");
        },
        // 这里面的key是导航栏项里面的index
        handleSelect(key){
            alert(key,'this one');
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
