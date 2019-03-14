<template>
    <div class="wrapper">
        <el-form class="addCategory" ref="addCategoryForm" :model="addCategoryForm" :rules="rule" :inline="true">
            <el-form-item label="请输入需要新增的商品类别名:" prop="addCategoryName">
                <el-input v-model="addCategoryForm.addCategoryName"></el-input>
            </el-form-item>
        </el-form>
        <el-button class="addCatalog" type="primary" @click="confirmAddCategory">添加</el-button>
        <div class="checkCategory">
            <el-collapse accordion>
                <el-collapse-item v-for="(item,index) in categoryList" :name="index" :key="index" @click.native="getSubCatalog(item)">
                    <template slot="title">
                        <p class="catalogTitle">
                            <span class="catalogName">{{item.category_name}}</span>
                            <a @click.stop="addSubCatalog(item)" class="addSubCatalog">添加子类型</a>
                        </p>
                    </template>
                    <p class="subCatalogItem" v-for="(subCatalog,index) in subCatalogList">{{index+1}} . {{subCatalog}}</p>
                </el-collapse-item>
            </el-collapse>
        </div>

        <el-dialog :visible.sync='dialogVisible' custom-class='addSubCatalogDialog'>
            <el-form ref="addSubCatalogForm" :model="addSubCatalogForm" :rules="rule2">
                <el-form-item label="子类型名称" prop="subCatalogName">
                    <el-input v-model="addSubCatalogForm.subCatalogName"></el-input>
                </el-form-item>
                <div class="btn_group">
                    <el-button type="primary" @click="confirm">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name:'categoryMange',
    data(){
        var categoryRule = (rule,value,callback)=>{
        if(!value)
            {
                // return callback(new Error('商品类别名不能为空'));
                // return new Error(callback('商品类别名不能为空'));
                callback(new Error('商品类别名不能为空'));
            }
        else
            {
                let regExp = /^[\u4e00-\u9fa5]+$/;
                if(!regExp.test(value))
                {
                    // callback(new Error('商品类别名只能为中文'));
                    return new Error(callback('商品类别名只能为中文'));
                }
                else
                {
                    callback();
                }
            }
        };
        return{
            addCategoryForm:{
                addCategoryName:"",
            },
            addSubCatalogForm:{
                subCatalogName:"",
            },
            checkCategory:"",
            categoryList:[],
            rule:{
                addCategoryName:[
                    { required:true,validator:categoryRule,trigger:'blur' }
                ],
            },
            rule2:{
                subCatalogName:[
                    { required:true,validator:categoryRule,trigger:'blur' }
                ],
            },
            dialogVisible:false,
            subCatalogList:[],
        }
    },
    created(){
        this.init();
    },
    methods:{
        confirmAddCategory(){
            console.log(this.addCategoryForm.addCategoryName);
            this.$refs['addCategoryForm'].validate((valid)=>{
                if(valid)
                {
                    let params = {
                        'method':'addCategory',
                        'categoryName':this.addCategoryForm.addCategoryName
                    };
                    this.$http
                    .post('/categoryMange',params)
                    .then((data)=>{
                        let responseData = data.data;
                        if(responseData.code == "0")
                        {
                            this.$message({
                                message:"添加商品类别成功",
                                type:'success'
                            });
                            this.addCategoryForm.addCategoryName = "";
                            this.$refs['addCategoryForm'].resetFields();
                            this.init();
                        }
                        else
                        {
                            this.$message({
                                message:'返回数据失败',
                                type:'error'
                            });
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
                else
                {
                    this.$message(
                        {
                            message:"商品类别名不符合，请检查",
                            type:'error'
                        }
                    );
                }
            });
        },
        init(){
            let params = {
                "method":'checkCategory'
            };
            this.$http
            .post('/categoryMange',params)
            .then((data)=>{
                let responseData = data.data.data;
                console.log(responseData);
                this.categoryList = responseData;
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        addSubCatalog(item){
            this.dialogVisible = true;
            this.choosingCatalog = item.category_name;
        },
        getSubCatalog(item){
            this.subCatalogList = [];
            let params = {
                "method":"checkSubCatalog",
                "catalog_name":item.category_name
            };
            this.$http
            .post('/categoryMange',params)
            .then((data)=>{
                let responseData = data.data;
                if(responseData.code == 0)
                {
                    for(let i = 0;i<responseData.data.length;i++)
                    {
                        this.subCatalogList.push(responseData.data[i].subCatalog_name);
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        cancel(){
            this.addSubCatalogForm.subCatalogName = "";
            this.$refs['addSubCatalogForm'].resetFields();
            this.dialogVisible = false;
        },
        confirm(){
            this.$refs['addSubCatalogForm'].validate((valid)=>{
                if(valid)
                {
                    let params = {
                        "method":"addSubCatalog",
                        "catalog_name":this.choosingCatalog,
                        "subCatalog_name":this.addSubCatalogForm.subCatalogName,
                    };
                    this.$http
                    .post('/categoryMange',params)
                    .then((data)=>{
                        let responseData = data.data;
                        console.log(responseData);
                        if(responseData.code == 0)
                        {
                            this.$message.success("添加成功");
                            this.addSubCatalogForm.subCatalogName = "";
                            this.$refs['addSubCatalogForm'].resetFields();
                            this.dialogVisible = false;
                            this.init();
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    });
                }
                else
                {
                    this.$message.error("添加失败");
                }
            });
        },
    },
}
</script>

<style>
    .checkCategory .el-collapse-item__content
    {
        padding-bottom:10px !important;
    }
    .addSubCatalogDialog .el-dialog__header
    {
        padding:0px !important;
    }
</style>
<style lang="scss" scoped>
    .wrapper
    {
        margin-left: 320px;
        height: 100%;
        overflow: auto;
        .addCategory
        {
            margin-top:30px;
            margin-bottom:10px;
            padding-left:30px;
        }
        .addCatalog
        {
            margin-left:30px;
            margin-bottom:30px;
        }
        .addSubCatalog
        {
            margin-left: 50px;
            &:hover
            {
                color: blue;
                text-decoration: underline;
            }
        }
        .catalogTitle
        {
            width:100%;
            padding-left:50px;
            .catalogName
            {
                font-size: 16px;
            }
            .addSubCatalog
            {
                float:right;
                margin-right:50px;
            }
        }
        .subCatalogItem
        {
            margin-left: 100px;
            font-size:14px;
            line-height:40px;
        }
    }
</style>
