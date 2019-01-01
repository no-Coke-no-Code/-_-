<template>
    <div>
        <headers></headers>
        <search-input></search-input>
        <good-menu></good-menu>
    </div>
</template>

<script>
import headers from "../global/headers.vue";
import searchInput from "./../global/searchInput.vue";
import goodMenu from "./../global/goodMenu.vue";

export default {
    name:"searchResult",
    components:{
        headers,
        searchInput,
        goodMenu,
    },
    data(){
        return{
            searchText:"",
            responseData:[],
        }
    },
    created(){
        this.searching(this.search);
    },
    computed:{
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
                // let params = {
                //     "search":goods,
                // };
                // alert("所搜索内容:" + goods);
                // this.$http.post("",params)
                // .then((data) => {
                //     this.responseData = data;
                // })
                // .catch((err) => {
                //     console.log(err);
                // });
                alert("成功搜索:" + goods);
            }
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
