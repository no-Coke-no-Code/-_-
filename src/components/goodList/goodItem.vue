<template>
    <div class="goodItemWrapper">
        <div v-if="responseData.length">
            <el-row :gutter="40">
                <el-col :span="8" v-for="(item, index) in responseData" :key="index">
                    <el-card :body-style="{ padding: '0px' }">
                    <img :src="item.good_imgurl" class="image">
                    <div style="padding: 14px;">
                        <span>{{item.good_name}}</span>
                        <div class="bottom clearfix">
                            <el-button type="primary" class="button" @click="toGoodDetail(item)">查看详情</el-button>
                            <el-button type="warning" class="button" @click="collect(item)">收藏</el-button>
                            <el-button type="danger" class="button" @click="addToCart(item)">加入购物车</el-button>
                        </div>
                    </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div v-if="!responseData.length">
            <h2>暂无结果</h2>
        </div>
    </div>
</template>

<script>
export default {
    name:"goodItem",
    props:[
        "searchKeyWord"
    ],
    data(){
        return{
            responseData:[],
        }
    },
    created(){
        let params = {};
        if(this.searchKeyWord=="精品推介"||this.searchKeyWord=="劲爆新品"||this.searchKeyWord=="异国风情")
        {
            params.searchType = "goodBlock"
            params.searchKeyWord = this.searchKeyWord;
        }
        else
        {
            params.searchType = "goodName";
            params.searchKeyWord = this.searchKeyWord;
        }
        this.$http
        .post('/goodSearch',params)
        .then((data)=>{
            console.log(data);
            this.responseData = data.data.data;
            console.log(this.responseData);
        })
        .catch((err)=>{
            console.log(err);
        });
    },
    methods:{
        // 查看商品详情
        toGoodDetail(item){
            this.$router.push({path:"/goodDetail",name:"goodDetail",query:{goodName:item.good_name},params:{
                goodDetail:item
            }});
        },
        // 收藏操作
        collect(item){
            let userName = this.$store.getters.getUsername;
            let userId = this.$store.getters.getUserid;
            if(userName===null)
            {
                this.$store.state.location = decodeURI(window.location.href);
                this.$router.push({path:"/login",name:"login"});
                return;
            }
            let params = {
                "method":"addToCollection",
                "userName":userName,
                "userId":userId,
                "goodId":item.good_id,
                "goodName":item.good_name,
            };
            this.$http.post('/guestCollection',params)
            .then((data)=>{
                console.log(data);
                this.$message({
                    message:"已经成功添加至我的收藏",
                    type:'success'
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 添加至购物车操作
        addToCart(item){
            let userName = this.$store.getters.getUsername;
            // 若尚未登录，点击添加到购物车按钮，页面回自动跳转到登录页；并在登录后返回原页面
            if(userName===null)
            {
                this.$store.state.location = decodeURI(window.location.href);
                this.$router.push({path:"/login",name:"login"});
                return;
            }
            let params = {
                "method":"addToCart",
                "userName":userName,
                "goodId":item.good_id,
            };
            this.$http.post('/guestCart',params)
            .then((data)=>{
                console.log(data);
                this.$message({
                    message:"已经成功添加至购物车",
                    type:'success'
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        },
    },
    watch:{
        searchKeyWord(val){
            let params = {
                "searchType":"goodName",
                "searchKeyWord":this.searchKeyWord
            };
            this.$http
            .post('/goodSearch',params)
            .then((data)=>{
                this.responseData = data.data.data;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
    },
}
</script>

<style lang="scss" scoped>
    .image
    {
        width: 300px;
        height: 200px;
    }
    .el-card
    {
        transition: .2s ease;
        &:hover
        {
            transform: scale(1.05,1.05);
            transition: .2s ease;
        }
    }
</style>
