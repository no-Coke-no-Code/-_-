<template>
    <div class="commentManageWrapper">
        <div class="commentList">
            <div class="commentItem" v-for="(item,index) in commentList">
                <div v-if="!item.reply_comment_id">
                    <span class="guestName">用户{{item.user_nickname}}:</span>
                    <p class="guestRank">
                        <el-rate v-model="item.comment_rank" disabled></el-rate>
                        <span class="commentTime">{{item.comment_time}}</span>
                    </p>
                    <p class="guestCommentContent">{{item.comment_content}}</p>
                    <span class="goodName">评价商品:{{item.good_name}}</span>
                    <p class="reply">
                        <a class="response" @click="response(index,item)" v-if="!item.reply_comment_id">回复评论</a>
                        <a v-if="item.reply_comment_id">该评价已回复</a>
                    </p>

                    <div class="commentArea" v-if="ifResponseComment[index]">
                        <el-form ref="commentForm" :rules="rules" :model="commentForm">
                            <el-form-item prop="comment_content">
                                <el-input v-model="commentForm.comment_content"></el-input>
                            </el-form-item>
                            <el-button @click="confirm(item)">发表</el-button>
                            <el-button @click="clear">清空</el-button>
                            <el-button @click="close(index)">取消</el-button>
                        </el-form>
                    </div>

                    <div class="replyComment" v-for="item2 in replyList" v-if='item2.reply_comment_id==item.comment_id'>
                        管理员回复：{{item2.reply_content}}
                    </div>
                </div>
            </div>
            <div class="pagination1">
                <el-pagination
                    @current-change="handleCurrentChange"
                    @size-change="pagesizeChange"
                    :current-page="searchForm.pageIndex"
                    :page-size="searchForm.pageSize"
                    :page-sizes="[10,20,30]"
                    layout="total, sizes,prev, pager, next, jumper"
                    :total="searchForm.total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'commentManage',
    data(){
        return{
            commentList:[],
            replyList:[],
            ifResponseComment:[],
            commentForm:{
                comment_content:"",
            },
            rules:{
                comment_content:[
                    { required:true,message:"评价不能为空",trigger:blur }
                ],
            },
            searchForm:{
                pageSize:10,
                pageIndex:1,
                total:0,
            },
        }
    },
    methods:{
        init(){
            // 获取用户评论
            let params = {
                "method":"getGuestComment",
                "pageSize":this.searchForm.pageSize,
                "pageIndex":this.searchForm.pageIndex,
            };
            this.$http
            .post('/comment',params)
            .then((data)=>{
                let commentList = data.data.data;
                let totalSize = data.data.totalSize;
                for(let i = 0;i<this.commentList.length;i++)
                {
                    this.ifResponseComment.push(false);
                }
                // 获取管理员回复
                let params2 = {
                    "method":"getReplyComment",
                };
                this.$http
                .post('/comment',params2)
                .then((data)=>{
                    let replyList = data.data.data;
                    this.commentList = commentList;
                    this.replyList = replyList;
                    this.searchForm.total = totalSize;
                    // 获取用户头像
                    // let params3 = {
                    //     "method":"",
                    // };
                    // this.$http
                    // .post('/userMange',params3)
                    // .then((data)=>{
                    //     let responseData = data.data;
                    // })
                    // .catch((err)=>{
                    //     console.log(err);
                    // });
                })
                .catch((err)=>{
                    console.log(err);
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        response(index,user){
            // 在VUE中，直接改变数组的元素，视图是不会响应的
            // 需要使用this.$set修改
            this.commentForm.comment_content = "";
            for(let i = 0;i<this.ifResponseComment.length;i++)
            {
                this.$set(this.ifResponseComment,i,false);
            }
            this.$set(this.ifResponseComment,index,true);
        },

        // 发表评价
        confirm(item){
            // 这里有个坑：由于每个表单并不是页面初始化的时候就渲染的，所以事件绑定会绑定不了？？
            // this.$refs.commentForm.validate((valid)=>{
            //     if(valid)
            //     {
                let regExp = /(^\s*)|(\s*$)/g;
                this.commentForm.comment_content = this.commentForm.comment_content.replace(regExp,"");
                if(this.commentForm.comment_content)
                {
                    let params = {
                        "method":"replyComment",
                        "comment_content":this.commentForm.comment_content,
                        "good_name":item.good_name,
                        "reply_to_id":item.user_id,
                        "reply_to_nickname":item.user_nickname,
                        "reply_to_comment_id":item.comment_id
                    };
                    this.$http
                    .post('/comment',params)
                    .then((data)=>{
                        let responseData = data.data;
                        if(responseData.code == 0)
                        {
                            this.$message.success("回复评论成功");
                            this.commentForm.comment_content = "";
                            for(let i = 0;i<this.ifResponseComment.length;i++)
                            {
                                this.$set(this.ifResponseComment,i,false);
                            }
                            this.init();
                        }
                        else
                        {
                            this.$message.error("回复评论失败");
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
                else
                {
                    this.$message.error("回复不能为空");
                }
            // });
        },

        // 清空
        clear(){
            this.commentForm.comment_content = "";
        },

        // 取消
        close(index){
            this.commentForm.comment_content = "";
            this.$set(this.ifResponseComment,index,false);
        },

        handleCurrentChange(val){
            this.searchForm.pageIndex = val;
            this.init();
        },
        pagesizeChange(val){
            this.searchForm.pageSize = val;
            this.init();
        },
    },
    created(){
        this.init();
    },
}
</script>

<style>
    .guestRank .el-rate
    {
        display: inline-block;
    }
</style>

<style lang="scss" scoped>
    .commentManageWrapper
    {
        height:100%;
        overflow:auto;
    }
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
    .pagination1
    {
        float: right;
    }
</style>
