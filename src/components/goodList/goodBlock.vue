<template>
    <div class="blockWrapper">
        <div class="blockTitle">
            <h2>{{this.title}}</h2>
            <a @click="changeBatch">换一批</a>
        </div>
        <div>
            <el-row :gutter="40">
                <el-col :span="8" v-for="(item, index) in responseData" :key="index">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="item.good_imgurl" class="image">
                        <div style="padding: 14px;">
                            <span>{{item.good_name}}</span>
                            <div class="bottom clearfix">
                                <el-button type="primary" class="button" @click="toGoodDetail(item)">查看详情</el-button>
                                <el-button type="warning" class="button" @click="collect">收藏</el-button>
                                <el-button type="danger" class="button" @click="addToCart(item)">加入购物车</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name:"goodBlock",
    props:[
        "title",
        "type"
    ],
    data(){
        return{
            responseData:[
                // {
                //     category_name: "",
                //     good_detail: "",
                //     good_from: "",
                //     good_id: 0,
                //     good_imgurl: "",
                //     good_name: "",
                //     good_price: 0,
                //     good_unit: "",
                // }
            ],
            goodDetail:{
                category_name: "",
                good_detail: "",
                good_from: "",
                good_id: 0,
                good_imgurl: "",
                good_name: "",
                good_price: 0,
                good_unit: "",
            },
        }
    },
    created(){
        this.init();
        // foreignGood
    },
    methods:{
        init(){
            // this.responseData = "";
            let params = {
                "type":this.type,
            };

            this.$http.post('/mainPageGoodBlock',params)
            .then((data) => {
                this.responseData = data.data.data;
            }).catch((err) => {
                console.log(err);
            });
        },
        // 换一批按钮的操作，重新随机请求一批数据
        changeBatch(){
            this.init();
        },
        // 查看商品详情
        toGoodDetail(item){
            this.$router.push({path:"/goodDetail",name:"goodDetail",query:{goodName:item.good_name},params:{
                goodDetail:item
            }});
        },
        // 收藏操作
        collect(){
            let userName = this.$store.getters.getUsername;
            if(userName===null)
            {
                this.$store.state.location = decodeURI(window.location.href);
                this.$router.push({path:"/login",name:"login"});
                return;
            }
            let params = {
                "method":"addToCollection",
                "userName":userName,
                "goodId":this.goodDetail.good_id,
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
}
</script>

<style lang="scss" scoped>
    .blockWrapper
    {
        a
        {
            &:hover
            {
                color: #409EFF;
                font-weight: bolder;
                text-decoration: underline;
                cursor: pointer;
            }
        }
        .blockTitle
        {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .image
        {
            width: 300px;
            height: 200px;
        }
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
    // .testing
    // {
    //     opacity: 1;
    //     transition: 2s ease;
    // }
    // .testing2
    // {
    //     opacity: 0;
    //     transition: 2s ease;
    // }
</style>
