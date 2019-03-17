<template>
    <div>
        <el-dialog :visible.sync="dialogState.state" title="编辑商品">
            <el-form :inline="true" ref="editDialog" :model="editForm" :rules="rules">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input v-model="editForm.price"></el-input>
                </el-form-item>
                <el-form-item label="商品来源" prop="from">
                    <el-input v-model="editForm.from"></el-input>
                </el-form-item>
                <el-form-item label="商品类别" prop="type">
                    <el-select v-model="editForm.type" @change="initSubCatalog(editForm.type)">
                        <el-option 
                            v-for="item in categoryList" 
                            :label="item.category_name" 
                            :value="item.category_name" 
                            :key="item.category_name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品子类别" prop="subType">
                    <el-select v-model="editForm.subType">
                        <el-option 
                            v-for="item in subCatalogList" 
                            :label="item.subCatalog_name" 
                            :value="item.subCatalog_name" 
                            :key="item.subCatalog_name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品描述" prop="detail">
                    <el-input v-model="editForm.detail"></el-input>
                </el-form-item>
                <el-form-item label="商品单位" prop="unit">
                    <el-input v-model="editForm.unit"></el-input>
                </el-form-item>
                <el-form-item label="商品图片" prop="imgurl">
                    <img :src="editForm.imgurl" class="goodImg" @click="changeImg"/>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button type="primary" @click="edit">编辑</el-button>
                <el-button @click="dialogState.state=false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="ifChangeImg" title="更改图片" @close="cancelImg">
            <el-upload
            class="upload-demo"
            ref="upload"
            action="http://localhost:3333/goodMange/changeGoodImg"
            :data="{goodName:editForm.name}"
            :on-success="handleSuccess"
            :limit="1"
            :file-list="fileList"
            :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="confirmImg">确定上传</el-button>
            </el-upload>
            <el-button @click="cancelImg">取消</el-button>
        </el-dialog>
    </div>
</template>


<script>


export default {
    name: 'editGood',
    props:[
        'dialogState','editDialog'
    ],
    watch:{
        editDialog(val){
            console.log(val);
        },
    },
    data(){
        return{
            categoryList:[],
            subCatalogList:[],
            fileList:[],
            ifChangeImg:false,
            editForm:{
                id:this.editDialog.good_id,
                name:this.editDialog.good_name,
                price:this.editDialog.good_price,
                type:this.editDialog.category_name,
                subType:this.editDialog.subCatalog_name,
                from:this.editDialog.good_from,
                detail:this.editDialog.good_detail,
                unit:this.editDialog.good_unit,
                imgurl:this.editDialog.good_imgurl,
            },
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
        this.initSubCatalog(this.editForm.type);
        this.editForm.subType = this.editDialog.subCatalog_name;
    },
    methods:{
        refresh(){
            let params = {
                "method":"refreshGood",
                "good_name":this.editForm.name
            };
            this.$http.post('/goodMange',params).then((data)=>{
                let responseData = data.data.data[0];
                this.editForm.name = responseData.good_name;
                this.editForm.price = responseData.good_price;
                this.editForm.from = responseData.good_from;
                this.editForm.type = responseData.category_name;
                this.editForm.subType = responseData.subCatalog_name;
                this.editForm.detail = responseData.good_detail;
                this.editForm.unit = responseData.good_unit;
                this.editForm.imgurl = responseData.good_imgurl;
                this.$emit('changeImg',this.editForm.imgurl);
            }).catch((err)=>{
                console.log(err);
            });
        },

        handleSuccess(res){
            if(res.data)
            {
                this.dialogState.state = false;
                this.fileList = [];
                // this.refresh();
                this.$emit('changeImg',this.editForm.imgurl);
                // this.ifChangeImg = false;
            }
        },

        selectImg(){

        }, 
        confirmImg(){
            this.$refs.upload.submit();
        },
        cancelImg(){
            this.ifChangeImg = false;
            this.fileList = [];
        },

        changeImg(){
            this.ifChangeImg = !this.ifChangeImg;
        },

        // 编辑商品,成功的话传递状态给父组件，提醒它请求并初始化表格数据
        edit(){
            if(this.editForm.id==""||this.editForm.name==""||this.editForm.price==""||this.editForm.type==""||this.editForm.subType==""||this.editForm.from==""||this.editForm.detail==""||this.editForm.unit==""||this.editForm.imgurl=="")
            {
                this.$message({
                    message:"尚有信息未完善",
                    type:"error"
                });
                return false;
            }
            else
            {
                let params = {
                    "method":"editGood",
                    "editForm":this.editForm
                };
                this.$http.post('/goodMange',params)
                .then((data) => {
                    this.$emit("editSucceed");
                    this.dialogState.state = false;
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        },
        initCategory(){
            this.subCatalogList = [];
            this.editForm.subType = "";
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
        // 当父类型变化时,初始化子目录的列表
        initSubCatalog(catalogName){
            this.subCatalogList = [];
            this.editForm.subType = "";
            let params = {
                "method":"checkSubCatalog",
                "catalog_name":catalogName,
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
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },
    },
}
</script>

<style lang="scss" scoped>
    .el-form-item
    {
        display: block !important;
    }
    .goodImg
    {
        width:100px;
        height: 100px;
        &:hover
        {
            outline: 1px solid #409EFF;
            cursor: pointer;
        }
    }
</style>
