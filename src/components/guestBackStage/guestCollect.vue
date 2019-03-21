<template>
    <div class="collectionWrapper" v-loading="ifLoading">
        <div class="collectionListItem" v-for="item in collectionList">
            <img class="collectionImg" :src="item.good_imgurl"/>
            <span class="collectionName">商品名称:{{item.good_name}}</span>
            <span>操作:</span>
            <a class="seeGoodDetail" @click="toGood(item)">点击查看</a>
            <a class="removeCollection" @click="removeCollection(item)">不再收藏</a>
        </div>
        <h2 v-if="!collectionList.length">您的收藏夹还是空空如也哦   去逛逛吧</h2>
    </div>
</template>

<script>
export default {
    name:'guestCollect',
    data(){
        return{
            userId:"",
            collectionList:[],
            ifLoading:false,
        }
    },
    methods:{
        // 查看商品详情页面
        toGood:function(item){
            this.$router.push({path:"/goodDetail",name:"goodDetail",query:{goodName:item.good_name},params:{
                goodDetail:item
            }});
        },
        // 将商品移除出收藏夹
        removeCollection(item){
            let params = {
                "method":"deleteCollection",
                "good_id":item.good_id,
                "user_id":this.userId,
            };
            this.$http
            .post('/guestCollection',params)
            .then((data)=>{
                let responseData = data.data;
                if(responseData.code == 0)
                {
                    this.$message.success("商品已从收藏夹去除");
                    this.init();
                }

            })
            .catch((err)=>{
                console.log(err);
                this.$message.error("移除收藏夹操作失败");
            });
        },
        // 初始化收藏商品页面列表
        init(){
            this.ifLoading = true;
            this.userId = this.$store.getters.getUserid;
            let params = {
                "method":"refreshCollection",
                "userId":this.userId
            };
            this.$http
            .post('/guestCollection',params)
            .then((data)=>{
                let responseData = data.data.data;
                console.log(responseData);
                this.ifLoading = false;
                if(responseData == "无收藏")
                {
                    this.collectionList = [];
                }
                else
                {
                    this.collectionList = responseData;
                }
            })
            .catch((err)=>{
                this.ifLoading = false;
                console.log(err);
            });
        },
    },
    created(){
        this.init();
    },
}
</script>

<style lang="scss" scoped>
    .collectionWrapper
    {
        padding: 30px;
        height: calc(100% - 40px);
        overflow: auto;
        box-sizing: border-box;
        .collectionListItem
        {
            border-radius: 3px;
            border: 2px solid #f6f6f6;
            padding: 20px;
            background-color: #f7f4f2d3;
            &:hover
            {
                background-color: #f0eeeed3;
            }
            .collectionImg
            {
                width: 100px;
                height: 100px;
                vertical-align: middle;
            }
            .collectionName
            {
                margin-left: 100px;
                margin-right: 100px;
            }
            .removeCollection,.seeGoodDetail
            {
                &:hover
                {
                    text-decoration: underline;
                    cursor: pointer;
                    color: #1989fa;
                }
            }
        }   
    }
</style>
