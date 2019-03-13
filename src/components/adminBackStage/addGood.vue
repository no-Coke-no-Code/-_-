<template>
    <el-dialog :visible.sync="dialogState.state" title="新增商品">
        <el-form :inline="true" :rules="rules" ref="addGoodDialog" :model="addForm">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-input v-model="addForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品来源" prop="from">
                <el-input v-model="addForm.from"></el-input>
            </el-form-item>
            <el-form-item label="商品类别" prop="type">
                <el-select v-model="addForm.type" @change="initSubCatalog" clearable>
                    <el-option 
                        v-for="item in categoryList" 
                        :label="item.category_name" 
                        :value="item.category_name" 
                        :key="item.category_name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品子类别" prop="subType">
                <el-select v-model="addForm.subType" clearable>
                    <el-option 
                        v-for="item in subCatalogList" 
                        :label="item.subCatalog_name" 
                        :value="item.subCatalog_name" 
                        :key="item.subCatalog_name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品描述" prop="detail">
                <el-input v-model="addForm.detail"></el-input>
            </el-form-item>
            <el-form-item label="商品单位" prop="unit">
                <el-input v-model="addForm.unit"></el-input>
            </el-form-item>
            <!-- <el-form-item label="商品图片" prop="imgurl">
                <img :src="addForm.imgurl" class="goodImg" @click="changeImg"/>
            </el-form-item> -->
        </el-form>
        <div class="btn-group">
            <el-button type="primary" @click="add">添加</el-button>
            <el-button @click="dialogState.state=false">取消</el-button>
        </div>
    </el-dialog>
</template>


<script>


export default {
    name: 'addGood',
    props:[
        "dialogState"
    ],
    data(){
        return{
            categoryList:[],
            subCatalogList:[],
            addForm:{
                name:"",
                price:"",
                type:"",
                subType:"",
                from:"",
                detail:"",
                imgurl:"",
                unit:"",
            },
            // 输入框的验证规则
            rules:{
                name:[
                    {required: true, message: "姓名不可为空", trigger:'blur'}
                ],
                price:[
                    {required: true, message: "单价不可为空", trigger:'blur'}
                ],
                type:[
                    {required: true, message: "类型不可为空", trigger:'blur'}
                ],
                subType:[
                    { required: true, message: "子类型不可为空", trigger:'blur' }
                ],
                detail:[
                    {required: true, message: "描述不可为空", trigger:'blur'}
                ],
                from:[
                    {required: true, message: "来源地不可为空", trigger:'blur'}
                ],
                unit:[
                    {required: true, message: "单位不可为空", trigger:'blur'}
                ],
                imgurl:[
                    {required: true, message: "图片不可为空", trigger:'blur'}
                ],
            },
        }
    },

    created(){
        this.initCategory();
    },

    methods:{
        // changeImg(){
        //     this.ifChangeImg = !this.ifChangeImg;
        // },

        // 增加商品操作,成功以后返回状态给父组件，提醒他刷新
        add(){
            this.$refs["addGoodDialog"].validate((valid) => {
                if(valid)
                {
                    let params = {
                    "method":"addGood",
                    "addGoodForm":this.addForm,
                    };
                    this.$http
                    .post("/goodMange",params)
                    .then(() => {
                        this.$emit("addSucceed");
                        this.dialogState.state = false;
                        this.$message({
                            message:'添加商品成功',
                            type:'success'
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
                else
                {
                    console.log("error submit");
                    return false;
                }
            });
        },

        // 初始化类别列表
        initCategory(){
            this.subCatalogList = [];
            let params = {
                "method":"searchAllCategory"
            };
            this.$http
            .post('/goodMange',params)
            .then((data)=>{
                console.log(data);
                this.categoryList = data.data.data;
            })
            .catch((err)=>{
                console.log(err);
            });
        },

        // 初始化子类别列表
        initSubCatalog(){
            this.subCatalogList = [];
            this.addForm.subType = "";
            let params = {
                "method":"checkSubCatalog",
                "catalog_name":this.addForm.type,
            };
            this.$http
            .post('/categoryMange',params)
            .then((data)=>{
                let responseData = data.data;
                if(responseData.code == 0)
                {
                    for(let i = 0;i<responseData.data.length;i++)
                    {
                        this.subCatalogList.push(responseData.data[i]);
                    }
                    console.log(this.subCatalogList,'i want to see');
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
    }
}
</script>

<style lang="scss" scoped>
// .goodImg
//     {
//         width:100px;
//         height: 100px;
//         &:hover
//         {
//             outline: 1px solid #409EFF;
//             cursor: pointer;
//         }
//     }
</style>

