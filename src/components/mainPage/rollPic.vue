<template>
    <div class="wrapper">
        <div class="content">
            <h2>网上生鲜超市</h2>
            <p>把最新鲜的美味送到你手上</p>
        </div>
        <el-carousel trigger="click" height="500px">
            <el-carousel-item v-for="item in rollPicList" :key="item.content">
                <img :src="item.url"/>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>

export default {
    name: 'rollPic',
    data(){
        return{
            // 这里再一次注意：如果图片放在assets目录下，webpack会对其进行编译
            // 需要写成require()的方式去引用
            // 如果是放在static目录下，则直接写图片的路径即可(等同于是直接引入)
            // 第三方图片，url-loader不会对其进行处理
            rollPicList:[
                {
                    url:require("../../assets/img/rollPic/scrollPic1.png"),
                    content:"这是第一幅图片",
                },
                {
                    url:require("../../assets/img/rollPic/scrollPic2.png"),
                    content:"这是第二幅图片",
                },
                {
                    url:require("../../assets/img/rollPic/scrollPic3.png"),
                    content:"这是第三幅图片",
                },
            ],
        }
    },
}
</script>

<style scoped>
    .wrapper
    {
        position: relative;
        margin-top: 50px;
    }
    .content
    {
        position: absolute;
        left: 102px;
        bottom: 195px;
        color: #fff;
        z-index: 3;
    }
    .content h2
    {
        font-size: 36px;
    }
    .content p
    {
        font-size: 30px;
        font-style: italic;
        margin-left: 54px;
        margin-top: 20px;
    }

    .el-carousel__item
    {
        width: 100%;
        height: 100%;
    }
    .el-carousel__item img
    {
        width: 100%;
        height: 100%;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6;
    }
</style>
