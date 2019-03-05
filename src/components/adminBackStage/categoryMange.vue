<template>
    <div class="wrapper">
        <el-form class="addCategory" ref="addCategoryForm" :model="addCategoryForm" :rules="rule">
            <el-form-item label="请输入需要新增的商品类别名:" prop="addCategory">
                <el-input v-model="addCategoryForm.addCategoryName"></el-input>
            </el-form-item>
            <el-button type="primary" @click="confirmAddCategory">添加</el-button>
        </el-form>
        <div class="checkCategory">
            <el-table :data="categoryList">
                <el-table-column prop="category_name"></el-table-column>
            </el-table>
        </div>
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
                return new Error(callback('商品类别名不能为空'));
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
            checkCategory:"",
            categoryList:[],
            rule:{
                addCategory:[
                    {validator:categoryRule,trigger:'blur'}
                ],
            },
        }
    },
    created(){
        this.init();
    },
    methods:{
        confirmAddCategory(){
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
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        margin-left: 320px;
    }
</style>
