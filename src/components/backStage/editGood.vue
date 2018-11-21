<template>
    <el-dialog :visible.sync="dialogState.state" title="编辑商品">
        <el-form :inline="true" ref="editDialog" :model="editForm" :rules="rules">
            <el-form-item label="商品ID" prop="id">
                <el-input v-model="editForm.id"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="editForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-input v-model="editForm.price"></el-input>
            </el-form-item>
            <el-form-item label="商品来源" prop="from">
                <el-input v-model="editForm.from"></el-input>
            </el-form-item>
            <el-form-item label="商品类型" prop="type">
                <el-input v-model="editForm.type"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="type">
                <el-input v-model="editForm.detail"></el-input>
            </el-form-item>
        </el-form>
        <div class="btn-group">
            <el-button type="primary" @click="edit">编辑</el-button>
            <el-button @click="dialogState.state=false">取消</el-button>
        </div>
    </el-dialog>
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
            editForm:{
                id:this.editDialog.good_id,
                name:this.editDialog.good_name,
                price:this.editDialog.good_price,
                type:this.editDialog.category_name,
                from:this.editDialog.good_from,
                detail:this.editDialog.good_detail,
            },
            rules:{
                id:[
                    {required: true, message: "id不可为空", trigger: 'blur'}
                ],
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
            },
        }
    },
    methods:{
        edit(){
            let params = {
                "method":"editGood",
                "editId":this.editForm.id,
                "editName":this.editForm.name,
                "editPrice":this.editForm.price,
                "editType":this.editForm.type,
                "editFrom":this.editForm.from,
                "editDetail":this.editForm.detail,
            };
            this.$http.post('/goodMange',params)
            .then((data) => {
                alert(JSON.stringify(data));
                this.$emit("editSucceed");
                this.dialogState.state = false;
            })
            .catch((err) => {
                console.log(err);
            });
        },
    },
}
</script>

<style scoped>

</style>
