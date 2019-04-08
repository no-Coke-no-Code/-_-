<template>
    <div class="footWrapper">
        <div class="hyperLinkList">
            <a>联系我们</a>
            <span>|</span>
            <a>了解更多</a>
            <span>|</span>
            <a>我要投诉</a>
            <span>|</span>
            <a>关注更多</a>
            <span>|</span>
            <a>关于我们</a>
            <span>|</span>
            <a>我要提议</a>
            <span>|</span>
            <router-link to="adminLogin">后台入口</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name:'footers'
}
</script>

<style>

</style>

<style lang="scss" scoped>
    .footWrapper
    {
        height: 80px;
        background-color: #F3F3F3;
        margin-top: 50px;
        .hyperLinkList
        {
            padding-top: 20px;
            text-align: center;
            a
            {
                color: #333;
                cursor: pointer;
                &:hover
                {
                    text-decoration: underline;
                }
            }
            span
            {
                margin: 0px 10px;
            }
        }
    }
</style>
