<template>
    <div class="wrapper userInfo">
        <div class="userHeadImg">
            <img :src="userHeadImg" class="userHead"  @click="showHeadImgDialog"/>
            <p>点击头像进行更改</p>
        </div>
        <template>
            <el-dialog :visible.sync="ifshowing" title="上传新的头像" class="userHeadImgDialog">
                <!-- <el-upload
                class="avatar-uploader"
                action="http://localhost:3333/guestInfo/getGuestHeadImg"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="dialogBtnGroup">
                    <el-button  @click="confirmHeadImg">确定上传</el-button>
                    <el-button @click="cancelHeadImgDialog">取消</el-button>
                </div> -->

                <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="http://localhost:3333/guestInfo/changeGuestHeadImg"
                    :data="{userNickname:editForm.nickname}"
                    :on-success="handleSuccess"
                    :limit="1"
                    :file-list="fileList"
                    :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="confirmImg">确定上传</el-button> -->
                </el-upload>
                <div slot="footer" style="overflow:hidden;padding-top:0px !important;">
                    <el-button style="margin-left: 20px;" size="small" type="success" @click="confirmImg">确定上传</el-button>
                    <el-button size="small" @click="cancelImg" class="cancelBtn">取消</el-button>
                </div>
            </el-dialog>
        </template>
        <el-form :inline="true" :model="editForm" :rules="rules" ref="guestInfoForm" class="guestInfoForm">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="账号">
                        <el-input v-model="editForm.nickname" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="真实姓名">
                        <el-input v-model="editForm.realname" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="性别">
                        <el-input v-model="editForm.sex" :disabled="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="editForm.password"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="editForm.phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-col :span="24">
                <el-form-item label="送货地址" prop="address">
                    <el-input v-model="editForm.address" style="width:780px;"></el-input>
                </el-form-item>
            </el-col>
            <div class="btnGrounp" v-if="ifChanged">
                <el-button type="primary" @click="saveChange">保存</el-button>
                <el-button type="danger" @click="removeChange">取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name:"guestInfo",
    created(){
        this.init();
        console.log(this.userName);
    },
    computed:{
        userName(){
            return this.$store.state.userName;
        },
    },
    data(){
        var password = function(rule,value,callback){
            if(value == "")
            {
                callback(new Error("密码不为空"));
            }
            if(value.length > 20)
            {
                callback(new Error("密码过长"));
            }
            else
            {
                callback();
            }
        };
        var phone = function(rule,value,callback){
            if(value == "")
            {
                callback(new Error("联系电话不能为空"));
            }
            let regExp = /^[0-9]{11}$/;
            if(!regExp.test(value))
            {
                callback(new Error("请输入符合格式的联系电话"));
            }
            else
            {
                callback();
            }
        };
        return{
            fileList:[],
            currentHeadImg:"",
            previewImg:"",
            user:"",
            editForm:{
                // 这个需要从别的组件传过来
                nickname:"",
                realname:"",
                password:"",
                sex:"",
                phone:"",
                address:"",
                email:""
            },
            newUserHeadImg:"",
            userHeadImg:"",
            ifshowing:false,
            imageUrl:"",
            temForm:{},
            ifChanged:false,
            rules:{
                realname:[
                    {required:true,message:"不能为空",trigger:['blur','change']}
                ],
                password:[
                    {
                        required:true,
                        validator:password,
                        trigger:['blur','change']
                    }
                ],
                address:[
                    {
                        required:true,
                        message:"地址不能为空",
                        trigger:["blur","change"],
                    }
                ],
                phone:[
                    {
                        required:true,
                        validator:phone,
                        trigger:["blur","change"],
                    }
                ],
                email:[
                    {
                        required:true,
                        message:"邮箱不能为空",
                        trigger:["blur","change"],
                    }
                ],
            },
        }
    },
    watch:{
        // 共有两种方式监听对象当中具体属性的变化
        // 1.通过computed返回一个变量，然后再监听变量
        // 2.直接通过引号将对象属性括起来监听
        'editForm.password'(){
            if(this.editForm.password != this.temForm.password)
            {
                this.ifChanged = true;
            }
        },
        'editForm.address'(){
            if(this.editForm.address != this.temForm.address)
            {
                this.ifChanged = true;
            }
        },
        'editForm.phone'(){
            if(this.editForm.phone != this.temForm.phone)
            {
                this.ifChanged = true;
            }
        },
        'editForm.email'(){
            if(this.editForm.email != this.temForm.email)
            {
                this.ifChanged = true;
            }
        },
    },
    methods:{
        cancelImg(){
            this.ifshowing = false;
            this.fileList = [];
        },
        handleSuccess(res){
            if(res.data)
            {
                this.ifshowing = false;
                this.fileList = [];
                this.init();
            }
        },
        confirmImg(){
            this.$refs.upload.submit();
        },
        init(){
            let params = {
                "method":"refresh",
                "userName":this.$store.state.userName
                // "userName":this.editForm.nickname
            };
            this.$http
            .post("/guestInfo",params)
            .then((data) => {
                let responseData = data.data.data[0];
                console.log(responseData);
                this.editForm.nickname = responseData.user_nickname;
                this.editForm.realname = responseData.user_realname;
                this.editForm.password = responseData.user_password;
                this.editForm.phone = responseData.user_phone;
                this.editForm.address = responseData.user_address;
                this.editForm.email = responseData.user_email;
                if(responseData.user_headImg == ""||responseData.user_headImg==undefined)
                {
                    this.userHeadImg = require('D:/hemashengxian/hema/static/pic/userHeadImg/noHeadImg.png');
                }
                else
                {
                    this.userHeadImg = responseData.user_headImg;
                }
                this.currentHeadImg = responseData.user_headImg;
                if(responseData.user_sex == "m")
                {
                    this.editForm.sex = "男";
                }
                else
                {
                    this.editForm.sex = "女";
                }
                this.temForm = JSON.parse(JSON.stringify(this.editForm));
                console.log(this.temForm);
            })
            .catch((err) => {
                console.log(err);
            });
        },
        saveChange(){
            this.$refs["guestInfoForm"].validate((valid) => {
                if(valid)
                {
                    this.ifChanged = false;
                    let params = {
                        "method":"updateUserInfo",
                        "userInfo":this.editForm,
                    };
                    this.$http.post('/guestInfo',params)
                    .then(() => {
                        this.$message({
                            message:"保存成功",
                            type:"success"
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                }
            });
        },
        removeChange(){
            console.log(this.editForm);
            console.log(this.temForm);
            this.editForm = JSON.parse(JSON.stringify(this.temForm));
            this.ifChanged = false;
            this.$message({
                message:"已取消更改",
                type:"warning"
            });
        },
        // 点击用户头像跳出弹窗事件
        showHeadImgDialog(){
            this.ifshowing = true;
        },
        // 弹窗中确定更改头像按钮
        // 此时用户已经上传，所以如果不再操作的话，需要删除旧的用户头像
        confirmHeadImg(){
            // this.$refs.upload.submit();
            let params = {
                "userName":this.userName,
                "newUserHeadImg":this.previewImg
            };
            if(params.newUserHeadImg == "")
            {
                this.ifshowing = false;
            }
            else
            {
                this.$http
                .post("/guestInfo/changeGuestHeadImg",params)
                .then((data) => {
                    console.log(data);
                    this.previewImg = "";
                    this.$message({
                        message:"已保存更改",
                        type:"success"
                    });
                    let params2 = {
                        "deleteImg":"D:/hemashengxian/hema/static/pic/userHeadImg/" + this.currentHeadImg,
                    };
                    console.log(params2,"将要删除的原来的头像");
                    this.$http
                    .post('/guestInfo/deleteGuestHeadImg',params2)
                    .then((data)=>{
                        console.log(data);
                        this.imageUrl = "";
                        this.$forceUpdate();
                        this.ifshowing = false;
                        this.previewImg = "";
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        },
        // 弹窗中取消按钮
        // 此时用户已经上传图片到服务器了；如果此时不想变更图片，需要将刚刚新增的图片删除
        cancelHeadImgDialog(){
            if(this.previewImg == "")
            {
                this.ifshowing = false;
            }
            else
            {
                let params = {
                    "deleteImg":this.previewImg
                };
                console.log(params);
                this.$http
                .post('/guestInfo/deleteGuestHeadImg',params)
                .then((data)=>{
                    // 这里应当返回删除状态
                    console.log(data);
                    this.imageUrl = "";
                    this.$forceUpdate();
                    this.$message({
                        message:"已取消更改头像",
                        type:"warning"
                    });
                    this.ifshowing = false;
                    this.previewImg = "";
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
        },

        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            console.log('文件信息',file);
            this.previewImg = file.response.data;
            // 这里的正则表达式尚需要修改(无效？？？)
            // D:\hemashengxian\hema\static\pic\userHeadImg/20191136053_headImg.jpg
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
        }
    },
}
</script>


<style>
    .userInfo .el-form-item .el-form-item__label
    {
        width: 100px !important;
    }
</style>

<style lang="scss" scoped>
    // 用户的头像框样式
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .userHeadImg
    {
        text-align: center;
        height: 300px;
        .userHead
        {
            border-radius: 50%;
            width: 200px;
            height: 200px;
            transition: .2s ease;
            margin-bottom: 30px;
            &:hover
            {
                transform: scale(1.01,1.01);
                cursor: pointer;
                transition: .2s ease;
            }
        }
    }
    .userInfo
    {
        height: calc(100% - 40px);
        padding: 30px;
        overflow: auto;
        box-sizing: border-box;
        .el-form--inline>.el-form-item__label
        {
            display: inline-block;
            width: 80px !important;
        }
    }

    .guestInfoForm
    {
        max-width: 1400px;
        margin: 0px auto;
    }
    .cancelBtn
    {
        float: right;
    }
    .btnGrounp
    {
        float: right;
        margin-right: 10%;
    }
</style>