<template>
    <div class="goodItemWrapper" v-loading='ifloading'>
        <div class="searchCriteria">
            <p>搜索条件：</p>
            <div>
                <a @click="noneActive" :class="{active:criteria=='none'}">无</a>
                <a @click="saleCountActive" :class="{active:criteria=='saleCount'}">
                    销量
                    <i class="arrowDown"></i>
                </a>
                <a @click="priceCountActive" :class="{active:criteria=='priceCount'}">
                    价格
                    <i class="arrowDown"></i>
                </a>
            </div>
        </div>
        <div v-if="responseData.length">
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
            criteria:"none",
            ifloading:false,
        }
    },
    created(){
        this.searchGood();
    },
    methods:{
        searchGood(sortType){
            this.ifloading = true;
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
            if(sortType)
            {
                params.sortType = sortType;
            }
            this.$http
            .post('/goodSearch',params)
            .then((data)=>{
                this.responseData = data.data.data;
                this.ifloading = false;
            })
            .catch((err)=>{
                console.log(err);
            });
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

        noneActive(){
            this.criteria = "none";
            this.searchGood();
        },
        saleCountActive(){
            this.criteria = "saleCount";
            this.searchGood("saleCount");
        },
        priceCountActive(){
            this.criteria = "priceCount";
            this.searchGood("priceCount");
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

<style>
    .bottomBtn .el-button:nth-child(2)
    {
        margin-left: 15px !important;
        margin-right: 15px !important;
    }
    .goodItemWrapper .el-button+.el-button
    {
        margin: 0px;
    }
</style>

<style lang="scss" scoped>
    .goodItemWrapper
    {
        padding: 20px;
        .searchCriteria
        {
            margin-bottom: 20px;
            padding: 10px;
            padding-left: 20px;
            background-color: #f7f5f5;
            p
            {
                margin-bottom: 10px;
                font-weight: bold;
                font-size: 18px;
            }
            .arrowDown
            {
                display: inline-block;
                width: 10px;
                height: 20px;
                background-image: url("../../../static/pic/sprite-arrow.png");
                background-position: 253px 67px;
                transform: scale(1.5);
            }
            a
            {
                display: inline-block;
                margin-right: 40px;
                width: 80px;
                height: 30px;
                line-height: 30px;
                vertical-align: middle;
                text-align: center;
                border: 1px solid black;
                border-radius: 5px;
                cursor: pointer;
                &:hover
                {
                    background: #66b1ff;
                    color: #fff;
                    .arrowDown
                    {
                        color: #fff;
                        background-position: 253px 47px;
                    }
                }
            }
            .active
            {
                background-color: #66b1ff;
                color: #fff;
                .arrowDown
                {
                    color: #fff;
                    background-position: 253px 47px;
                }
            }
        }
        .image
        {
            width: 100%;
            height: 300px;
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
    }
</style>
