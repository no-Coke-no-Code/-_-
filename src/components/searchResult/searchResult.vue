<template>
    <div v-loading="ifLoading" :class="{wrapper:!ifGoodItem}">
        <headers></headers>
        <search-input></search-input>
        <good-menu></good-menu>
        <good-item :searchKeyWord="search" @searchDone="searchDone"></good-item>
        <footers :class="{footers:!ifGoodItem}"></footers>
    </div>
</template>

<script>
import headers from "../global/headers.vue";
import searchInput from "./../global/searchInput.vue";
import goodMenu from "./../global/goodMenu.vue";
import goodItem from "./../goodList/goodItem.vue";
import footers from "./../global/footers.vue";

export default {
    name:"searchResult",
    components:{
        headers,
        searchInput,
        goodMenu,
        goodItem,
        footers,
    },
    data(){
        return{
            searchText:"",
            responseData:[],
            ifLoading:false,
            ifGoodItem:true,
        }
    },
    created(){
        // 把需要传递的值通过地址栏进行传递
        // 然后在这里面获取，再把值传递到good-item组件
        // 在那一边监听传递值的变化，如果有变化则向后端发起请求
        this.searching(this.search);
    },
    computed:{
        // 这里是用于将URL中传过来的参数去除空格和空值
        search(){
            var reg = /\s+/g;
            this.searchText = this.$route.query.search.replace(reg,"");
            if(this.searchText == undefined)
            {
                return "";
            }
            else
            {
                return this.searchText;
            }
        },
    },
    watch:{
        $route(){
            this.searching(this.search);
        }
    },
    methods:{
        searching(goods){
            if(goods == "")
            {
                this.responseData = "无数据";
                alert("无数据");
            }
            else
            {
                alert("成功搜索:" + goods);
            }
        },
        searchDone(val){
            if(val == "noValue")
            {
                this.ifGoodItem = false;
            }
            else
            {
                this.ifGoodItem = true;
            }
            console.log(this.ifGoodItem);
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        position:relative;
        height:100%;
    }
    .footers
    {
        position: absolute;
        bottom: 0;
        right:0;
        left:0;
    }
</style>
