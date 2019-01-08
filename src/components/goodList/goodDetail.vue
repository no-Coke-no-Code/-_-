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
                <el-button @click="addToCart" type="primary">加入购物车</el-button>
                <el-button @click="collect" type="warning">收藏</el-button>
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
    },
    created(){
        // 检测当前是否已经接收到了商品信息；若是没有，则重新通过商品名查找数据库获取
        // 一般，重新刷新页面的话，穿过来的对象会被刷掉
        if(this.$route.params.goodDetail == undefined)
        {
            let params = {
                "goodName":this.$route.query.goodName
            };
            this.$http.post('/goodDetail',params).then((data) => {
                this.goodDetail = data.data.data[0];
                console.log(this.goodDetail);
            }).catch((err) => {
                console.log(err);
            });
        }
        else
        {
            this.goodDetail = JSON.parse(JSON.stringify(this.$route.params.goodDetail));
        }
    },
}
</script>

<style lang="scss" scoped>
    .goodDetail_wrapper
    {
        width: 80%;
        margin: 50px auto;
        font-size: 0;
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
            margin-left: 200px;
            display: inline-block;
            font-size: 16px;
            // 两个元素都是行内块元素。前一个元素是图片标签，基线为下边缘
            // 这个是文字内容块，基线是最后一行文本的基线（若没有文本，基线为下边框）
            // vertical-align：top就是让当前元素的顶部与当前行的最高的元素的顶部重合
            // 因为当前行最高元素是IMG标签，所以该元素顶部与IMG顶部重合
            vertical-align: top;
            h2,p
            {
                margin-bottom: 10px;
            }
            p
            {

            }
        }
    }
</style>
