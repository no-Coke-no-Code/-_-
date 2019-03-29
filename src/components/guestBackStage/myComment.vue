<template>
    <div class="myCommentWrapper">
        <div class="commentList">
            <div class="commentItem" v-for="(item,index) in myComment">
                <div v-if="!item.reply_comment_id">
                    <p class="guestRank">
                        <el-rate v-model="item.comment_rank" disabled></el-rate>
                        <span class="commentTime">{{item.comment_time}}</span>
                    </p>
                    <p class="guestCommentContent">{{item.comment_content}}</p>
                    <span class="goodName">评价商品:{{item.good_name}}</span>
                    <div class="replyComment" v-for="item2 in item.adminReply" v-if='item2.reply_comment_id==item.comment_id'>
                        管理员回复：{{item2.reply_content}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'myComment',
    data(){
        return{
            myComment:[],
            adminReply:[],
        }
    },
    methods:{
        init(){
            let userName = this.$store.state.userName;
            let params = {
                "method":"getOwnComment",
                "user_nickname":userName,
            };
            this.$http
            .post('/comment',params)
            .then((data)=>{
                let responseData = data.data;

                // 这里顺带复习一手数组的深拷贝
                // 方法一
                // for(let i = 0;i<responseData.data.length;i++)
                // {
                //     this.myComment.push(responseData.data[i]);
                // }

                // 方法二
                this.myComment = responseData.data.concat();

                // 方法三
                // this.myComment = responseData.data.slice(0);

                console.log(this.myComment);
            })
            .catch((err)=>{
                console.log(err);
            });
        },
    },
    created(){
        this.init();
    },
}
</script>

<style>
    .myCommentWrapper .el-rate
    {
        display: inline-block;
    }
</style>

<style lang="scss" scoped>
    .myCommentWrapper
    {
        box-sizing: border-box;
        height: calc(100% - 40px);
        margin-left: 300px;
        padding: 30px;
        overflow: auto;
        .commentList
        {
            margin-left:30px;
            margin-right: 30px;
            padding-top:30px;
            .commentItem
            {
                margin-bottom: 30px;
                border: 1px solid #EEEFF3;
                padding: 10px;
                border-radius: 5px;
                transition: .5s ease;
                &:hover
                {
                    transform: scale(1.01);
                    transition: .2s ease;
                    border: 1px solid #2E9EFF;
                    box-shadow: 0 0 24px 0 rgba(82,94,102,0.15);
                    cursor: pointer;
                }

                .guestName
                {
                    margin-left: 20px;
                }
                .guestCommentContent,.guestRank,.goodName,.commentTime,.reply,.replyComment
                {
                    margin-left: 20px;
                }
                .guestRank
                {
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .guestCommentContent
                {
                    margin-bottom: 20px;
                }
                .commentTime
                {
                    margin-left: 50px;
                    vertical-align: sub;
                }
                .reply
                {
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .response
                {
                    font-style: italic;
                    &:hover
                    {
                        color: blue;
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }

                .commentArea
                {
                    padding: 20px;
                    margin-bottom: 20px;
                    background-color: #EEEFF3;
                    border-radius: 5px;
                }
            }
        }   
    }
</style>
