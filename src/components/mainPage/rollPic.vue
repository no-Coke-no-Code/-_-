<template>
  <div class="wrapper">
    <el-carousel trigger="click" height="300px">
      <el-carousel-item v-for="item in rollPicList" :key="item.content">
            <!-- <div class="container"> -->
            <img :src="item.url"/>
                <!-- <div class="describe">
                    <p>{{item.content}}</p>
                </div> -->
            <!-- </div> -->
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
                    url:require("../../assets/img/rollPic/pic1.jpg"),
                    content:"这是第一幅图片",
                },
                {
                    url:require("../../assets/img/rollPic/pic2.jpg"),
                    content:"这是第二幅图片",
                },
                {
                    url:require("../../assets/img/rollPic/pic3.png"),
                    content:"这是第三幅图片",
                },
                {
                    url:require("../../assets/img/rollPic/pic4.png"),
                    content:"这是第四幅图片",
                },
                {
                    url:require("../../assets/img/rollPic/pic5.png"),
                    content:"这是第五幅图片",
                },

                // "../../../static/rollPic/pic1.jpg",
                // "../../../static/rollPic/pic2.jpg",
                // "../../../static/rollPic/pic3.png",
                // "../../../static/rollPic/pic4.png",
                // "../../../static/rollPic/pic5.png",
            ],
        }
    },
}
</script>

<style  scoped>
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
