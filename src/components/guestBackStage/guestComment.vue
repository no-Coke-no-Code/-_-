<template>
    <el-dialog :visible.sync="commentDialog" title="商品评价" @close="cancel" :show-close='false'>
        <el-form ref="commentForm" :rules="commentRules" :model="commentForm">
            <el-form-item prop="goodRank">
                <el-rate v-model="commentForm.goodRank"></el-rate>
            </el-form-item>
            <el-form-item prop="goodComment">
                <el-input type="textarea" resize="none" v-model="commentForm.goodComment" placeholder="请输入商品评价" class="goodComment"></el-input>
            </el-form-item>
        </el-form>
        <el-button @click="confirm">发表</el-button>
        <el-button @click="cancel">取消</el-button>
    </el-dialog>
</template>

<script>
export default {
    name:'guestComment',
    props:[
        "commentDialog",
        "commentGood",
        "commentOrder",
    ],
    data(){
        return{
            commentForm:{
                goodRank:null,
                goodComment:"",
            },
            commentRules:{
                goodRank:[
                    { type:'number',min:1,max:5,message:'评分不能为空' }
                ],
                goodComment:[
                    { required:true,message:'评论不能为空' }
                ],
            },
        }
    },
    // watch:{
    //     "commentForm.goodRank"(val){
    //         alert(val);
    //         alert(typeof val);
    //     },
    // },
    methods:{
        confirm(){
            this.$refs['commentForm'].validate((valid)=>{
                if(valid)
                {
                    console.log(this.commentForm);
                    console.log(this.commentGood,'评论的商品');
                    console.log(window.localStorage.getItem("userName"),"当前用户姓名");
                    console.log(window.localStorage.getItem("userId"),"当前用户ID");

                    let userName = window.localStorage.getItem("userName");
                    let userId = window.localStorage.getItem("userId");
                    let params = {
                        "method":'makeComment',
                        "good_name":this.commentGood.good_name,
                        "user_nickname":userName,
                        "user_id":userId,
                        "comment_content":this.commentForm.goodComment,
                        "comment_rank":this.commentForm.goodRank,
                        "comment_order":this.commentOrder
                    };
                    this.$http
                    .post('/comment',params)
                    .then((data)=>{
                        let responseData = data.data.data;
                        this.$message.success("成功发表评价");
                        this.$refs['commentForm'].resetFields();
                        this.$emit('closeDialog');
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
                else
                {
                    this.$message.error("尚有信息未完善");
                }
            });
        },
        cancel(){
            this.$refs['commentForm'].resetFields();
            this.$emit('closeDialog');
        },
    },
}
</script>
