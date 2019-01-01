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
                            <el-button type="danger" class="button" @click="addToCart">加入购物车</el-button>
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
                {
                    category_name: "",
                    good_detail: "",
                    good_from: "",
                    good_id: 0,
                    good_imgurl: "",
                    good_name: "",
                    good_price: 0,
                    good_unit: "",
                }
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
        collect(){},
        // 添加至购物车操作
        addToCart(){},
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
</style>
