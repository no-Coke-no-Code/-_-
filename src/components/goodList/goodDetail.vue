<template>
    <div>
        <headers></headers>
        <search-input></search-input>
        <good-menu></good-menu>
        <div class="goodDetail_wrapper">
            <div class="goodImgs">
                <img :src="goodDetail.good_imgurl"/>
            </div>
            <div class="goodInfo">
                <h2>{{this.goodDetail.good_name}}</h2>
                <p>售价:{{this.goodDetail.good_price}}</p>
                <p>描述:{{this.goodDetail.good_detail}}</p>
                <p>单位:{{this.goodDetail.good_unit}}</p>
                <p>所属类别 : {{this.goodDetail.category_name}} - {{this.goodDetail.subCatalog_name}}</p>
                <p>总销量:</p>
                <el-button @click="addToCart" type="primary">加入购物车</el-button>
                <el-button @click="collect" type="warning">收藏</el-button>
            </div>
        </div>
        <div class="goodComment">
            <h2>最新评论</h2>
            <div v-for="item in commentList" class="commentItem" v-if="commentList.length != 0 && !item.reply_comment_id">
                <!-- <img :src="item.user_" class="userImg"/> -->
                <span class="userName">{{item.user_nickname}}</span>
                <el-rate disabled v-model="item.comment_rank" class="commentRank"></el-rate>
                <p class="commentContent">{{item.comment_content}}</p>
                <span class="commentTime">{{item.comment_time}}</span>
                <div v-for="item2 in commentList" v-if="item2.reply_comment_id == item.comment_id" class="adminReply">
                    管理员admin:{{item2.comment_content}}
                </div>
            </div>
            <div v-if="commentList.length == 0">
                <p>暂无评论</p>
            </div>
        </div>
    </div>
</template>

<script>
import headers from "./../global/headers";
import searchInput from "./../global/searchInput.vue";
import goodMenu from "./../global/goodMenu.vue";

export default {
    name:"goodItem",
    data(){
        return{
            goodDetail:{},
            commentList:[],
        }
    },
    components:{
        headers,
        searchInput,
        goodMenu
    },
    methods:{
        addToCart(){
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
                "goodId":this.goodDetail.good_id,
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
        // 添加收藏操作与购物车操作同理
        collect(){
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
                "goodId":this.goodDetail.good_id,
                "goodName":this.goodDetail.good_name,
            };
            console.log(params,"商品详细信息");
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

        init:function(){
            // promise中this的指向与vue中this的指向是不同的
            // 返回的promise对象应该是包裹着要执行的异步函数的
            let that = this;
            let promise = new Promise((resolve,reject)=>{
                resolve();
            });
            promise
            .then(function(){
                // 检测当前是否已经接收到了商品信息；若是没有，则重新通过商品名查找数据库获取
                // 一般，重新刷新页面的话，穿过来的对象会被刷掉
                if(that.$route.params.goodDetail == undefined)
                {
                    return new Promise((resolve,reject)=>{
                        let params = {
                            "goodName":that.$route.query.goodName
                        };
                        that.$http
                        .post('/goodDetail',params)
                        .then((data) => {
                            that.goodDetail = data.data.data[0];
                            console.log(that.goodDetail,"商品详情");
                            resolve(that.goodDetail);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    });
                }
                else
                {
                    return new Promise((resolve,reject)=>{
                        that.goodDetail = JSON.parse(JSON.stringify(that.$route.params.goodDetail));
                        resolve(that.goodDetail);
                    });
                }
            })
            .then(function(goodDetail){
                console.log(goodDetail,'I want to see');
                let params = {
                    "method":'getGoodComment',
                    "good_name":goodDetail.good_name
                };
                that.$http
                .post('/comment',params)
                .then((data)=>{
                    let responseData = data.data.data;
                    that.commentList = responseData;
                    console.log(that.commentList,'返回的商品评论');
                })
                .catch((err)=>{
                    console.log(err);
                });
            });
        },
    },
    created(){
        this.init();
    },
}
</script>

<style lang="scss" scoped>
    .goodDetail_wrapper
    {
        width: 1000px;
        margin: 50px auto;
        display: flex;
        .goodImgs
        {
            display: inline-block;
            img
            {
                width: 400px;
                height: 400px;
            }
        }
        .goodInfo
        {
            display: inline-block;
            width: calc(100% - 405px);
            font-size: 16px;
            vertical-align: top;
            padding-left: calc(100% - 800px);
            // 两个元素都是行内块元素。前一个元素是图片标签，基线为下边缘
            // 这个是文字内容块，基线是最后一行文本的基线（若没有文本，基线为下边框）
            // vertical-align：top就是让当前元素的顶部与当前行的最高的元素的顶部重合
            // 因为当前行最高元素是IMG标签，所以该元素顶部与IMG顶部重合
            h2,p
            {
                margin-bottom: 30px;
            }
            p
            {

            }
        }
    }
    .goodComment
    {
        width: 1000px;
        margin: 0px auto;
        margin-top: 100px;
        margin-bottom: 100px;
        h2
        {
            margin-bottom: 30px;
        }
        .userName
        {
            display: inline-block;
            width: 130px;
        }
        .commentRank
        {
            display: inline-block;
            margin-bottom: 10px;
        }
        .commentContent
        {
            margin-left: 135px;
            margin-bottom: 10px;
        }
        .commentTime
        {
            margin-left: 135px;
        }
        .commentItem
        {
            border: 1px solid #f6f6f6;
            border-radius: 3px;
            padding: 30px;
            background-color: #f7f4f2d3;
            margin-bottom: 10px;
            .adminReply
            {
                border: 1px solid black;
                border-radius: 3px;
                background: #cccbcbd3;
                margin: 20px 0px 0px 50px;
            }
            &:hover
            {
                background-color: #f0eeeed3;
            }
        }
    }
</style>
