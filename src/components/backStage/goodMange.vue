<template>
    <div class="wrapper">
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
                    <el-select v-model="searchForm.type">
                        <el-option
                            v-for="item in typeList"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-select v-model="searchForm.price">
                        <el-option
                            v-for="item in priceList"
                            :label="item"
                            :value="item"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品来源地">
                    <el-select v-model="searchForm.from">
                        <el-option
                            v-for="item in fromList"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
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
        <el-table>

        </el-table>

        <!-- 增改子组件 -->
        <addgood :dialogState="addDialogState"></addgood>
        <editgood :dialogState="editDialogState"></editgood>
    </div>
</template>


<script>


export default {
    name: 'goodMange',
    data(){
        return{
            priceList:[
                "0-99",
                "100-399",
                "400-699",
                "700-999",
                "1000-9999"
            ],
            typeofList:[
                "",
            ],
            fromList:[
                "",
            ],
            searchForm:{
                id:"",
                name:"",
                price:"",
                type:"",
                from:"",
            },
            // 这个是从服务器返回所要显示到表格中的对象数组
            resultGoods:[],
            // 增加商品信息弹窗状态
            addDialogState:false,
            // 编辑商品信息弹窗状态
            editDialogState:false,
        }
    },
    created(){
        this.init();
    },
    methods:{
        // 重新请求商品信息操作
        init(){
            let params = {
                "method":"searchAll"
            };
            this.$http.post("/goodMange",params)
            .then((data) => {
                // 返回的应该是一个对象数组，包含所有的商品
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
        },

        // 新增商品操作
        add(){

        },
        // 根据商品信息查找商品操作
        search(){

        },
        // 重置操作
        refresh(){

        },
    },
}
</script>

<style scoped>
    .wrapper
    {
        padding-left: 310px;
    }
</style>
