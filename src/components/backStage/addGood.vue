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
            <el-form-item label="商品类型" prop="type">
                <el-input v-model="addForm.type"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="detail">
                <el-input v-model="addForm.detail"></el-input>
            </el-form-item>
            <el-form-item label="商品单位" prop="unit">
                <el-input v-model="addForm.unit"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="imgurl">
                <el-input v-model="addForm.imgurl"></el-input>
            </el-form-item>
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
            addForm:{
                name:"",
                price:"",
                type:"",
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
    methods:{
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
    }
}
</script>

<style scoped>

</style>
