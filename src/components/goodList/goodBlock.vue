<template>
    <div class="blockWrapper">
        <div class="blockTitle">
            <h2>{{this.title}}</h2>
            <div class="action">
                <a @click="changeBatch">换一批</a>
                <a @click="seeMore">查看更多</a>
            </div>
        </div>
        <div>
            <el-row :gutter="40">
                <el-col :span="8" v-for="(item, index) in responseData" :key="index" style="margin-bottom:20px;">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="item.good_imgurl" class="image">
                        <div class="contentArea">
                            <p class="describeArea">
                                <span>{{item.good_name}}</span>
                                <span>￥{{item.good_price}}/{{item.good_unit}}</span>
                            </p>
                            <div class="bottomBtn clearfix">
                                <el-button type="primary" class="button" @click="toGoodDetail(item)">查看详情</el-button>
                                <el-button type="warning" class="button" @click="collect(item)">收藏</el-button>
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

            this.$http
            .post('/mainPageGoodBlock',params)
            .then((data) => {
                this.responseData = data.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
        },
        // 换一批按钮的操作，重新随机请求一批数据
        changeBatch(){
            this.init();
        },
        // 查看更多操作
        seeMore(){
            this.$router.push(({path:'searchResult',query:{search:this.title}}));
        },
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
}
</script>

<style>
    .bottomBtn .el-button:nth-child(2)
    {
        margin-left: 15px !important;
        margin-right: 15px !important;
    }
    .blockWrapper .el-button+.el-button
    {
        margin: 0px;
    }
</style>

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
            .action
            {
                a:nth-child(1)
                {
                    margin-right: 20px;
                }
            }
        }
        .image
        {
            width: 100%;
            height: 300px;
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

    .bottomBtn
    {
        display: flex;
        justify-content: center;
    }
    .contentArea
    {
        padding: 14px;
        background-color: #EEEFF3;
        .describeArea
        {
            margin: 20px 0px;
        }
    }
</style>
