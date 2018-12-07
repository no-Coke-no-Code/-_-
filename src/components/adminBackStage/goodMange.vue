<template>
    <div class="wrapper" v-loading="ifLoading">
        <!-- 查询表格 -->
        <el-form :inline="true">
            <el-row>
                <el-form-item label="商品ID">
                    <el-input v-model="searchForm.id"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="searchForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品类别">
                    <el-select v-model="searchForm.type" clearable>
                        <el-option
                            v-for="item in typeList"
                            key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-select v-model="searchForm.price" clearable>
                        <el-option
                            v-for="item in priceList"
                            key="item"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品来源地">
                    <el-input v-model="searchForm.from"></el-input>
                </el-form-item>
                <el-form-item label="商品单位">
                    <el-input v-model="searchForm.unit"></el-input>
                </el-form-item>
            </el-row>
        </el-form>

        <!-- 按钮组 -->
        <div class="btn_wrapper">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
            <el-button icon="el-icon-refresh" @click="refresh">重置</el-button>
        </div>

        <!-- 展示数据表格 -->
        <el-table :data="resultGoods" border @row-dblclick="edit">
            <el-table-column label="商品ID" prop="good_id"></el-table-column>
            <el-table-column label="商品名称" prop="good_name"></el-table-column>
            <el-table-column label="商品价格" prop="good_price"></el-table-column>
            <el-table-column label="商品单位" prop="good_unit"></el-table-column>
            <el-table-column label="商品图片" prop="good_imgurl"></el-table-column>
            <el-table-column label="商品描述" prop="good_detail"></el-table-column>
            <el-table-column label="商品产地" prop="good_from"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope='scope'>
                    <el-button @click="deleting(scope.row)" type="danger" icon="delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
            @current-change="handleCurrentChange"
            @size-change="pagesizeChange"
            :current-page="searchForm.pageIndex"
            :page-size="searchForm.pageSize"
            :page-sizes="[10,50,70]"
            layout="total, sizes,prev, pager, next, jumper"
            :total="searchForm.total">
        </el-pagination>

        <!-- 增改子组件 -->
        <addgood v-if="addDialogState.state" :dialogState="addDialogState" @addSucceed="refresh"></addgood>
        <editgood v-if="editDialogState.state" :dialogState="editDialogState" :editDialog="editDialog" @editSucceed="refresh"></editgood>
    </div>
</template>


<script>
import addgood from "./addGood.vue";
import editgood from "./editGood.vue";

export default {
    name: 'goodMange',
    components:{
        addgood,
        editgood,
    },
    data(){
        return{
            priceList:[
                "0-99",
                "100-399",
                "400-699",
                "700-999",
                "1000-9999"
            ],
            // 搜索的条件对象
            searchForm:{
                id:"",
                name:"",
                price:"",
                type:"",
                from:"",
                unit:"",
                pageSize:10,
                pageIndex:1,
                total:0,
            },
            // 这个是从服务器返回所要显示到表格中的对象数组
            resultGoods:[],
            // 增加商品信息弹窗状态
            addDialogState:{
                state:false
            },
            // 编辑商品信息弹窗状态
            editDialogState:{
                state:false
            },
            // 所要传到编辑商品信息页的对象
            editDialog:{},
            ifLoading:false,
        }
    },
    // 页面刷新所进行的操作
    created(){
        this.init();
    },
    methods:{

        // 重新请求商品信息操作
        init(){
            let params = {
                "method":"searchGood",
                "ifAll":true,
                "pageIndex":this.searchForm.pageIndex,
                "pageSize":this.searchForm.pageSize,
            };
            this.ifLoading = true;
            this.$http.post("/goodMange",params)
            .then((data) => {
                // 返回的应该是一个对象数组，包含所有的商品
                this.resultGoods = data.data;
                this.searchForm.total = data.data.length
                this.ifLoading = false;
            })
            .catch((err) => {
                console.log(err);
            });
        },

        // 点击新增按钮操作
        add(){
            this.addDialogState.state = true;
        },
        // 双击商品行编辑的操作
        edit(rowdata){
            this.editDialog = rowdata;
            this.editDialogState.state = true;
        },
        // 根据商品信息查找商品操作
        search(){
            let params = {};
            let goodForm = {};
            if(this.searchForm.name==""&&this.searchForm.id==""&&this.searchForm.price==""&&this.searchForm.type==""&&this.searchForm.from=="")
            {
                params = {
                    "method":"searchGood",
                    "ifAll":true,
                    "pageIndex":this.searchForm.pageIndex,
                    "pageSize":this.searchForm.pageSize,
                };
            }
            else
            {
                params = {
                "method":"searchGood",
                "ifAll":false,
                "goodForm":this.searchForm
            };
            }
            // this.ifLoading = true;
            this.$http.post('/goodMange',params)
            .then((data) => {
                this.resultGoods = data.data;
                this.searchForm.total = data.data.length;
                console.log(this.resultGoods);
                console.log(data);
                // this.ifLoading = false;
                // alert(this.ifLoading);
            })
            .catch((err) => {
                console.log(err);
            });
        },
        // 点击删除按钮所执行的操作
        deleting(e){
            this.$confirm('确认删除该商品??','警告',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning'
            })
            .then(() => {
                let params = {
                    "method":'deleteGood',
                    "deleteId":e.good_id
                };
                this.$http.post('/goodMange',params)
                .then(() => {
                    this.$message({
                    type:'info',
                    message:'已删除',
                    });
                    this.init();
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch(() => {
                this.$message({
                    type:'info',
                    message:'已取消操作',
                });
            });
        },
        // 重置操作
        refresh(){
            this.searchForm.id = "";
            this.searchForm.name = "";
            this.searchForm.price = "";
            this.searchForm.type = "";
            this.searchForm.from = "";
            this.searchForm.unit = "";
            this.init();
        },

        // 跳页操作
        handleCurrentChange(val) {
            this.searchForm.pageIndex = val;
            this.init();
        },
        // 改变当前每页所含数据数操作
        pagesizeChange(size){
            this.searchForm.pageSize=size;
            this.init();
        }
    },
}
</script>

<style scoped>
    .wrapper
    {
        padding-left: 310px;
    }
</style>
