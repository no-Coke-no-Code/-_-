<template>
    <div class="wrapper">
        <!-- 查询表格 -->
        <el-form :inline="true">
            <el-row>
                <el-form-item label="用户ID">
                    <el-input v-model="searchForm.id"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="searchForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名">
                    <el-input v-model="searchForm.realname"></el-input>
                </el-form-item>
                <el-form-item label="用户性别">
                    <el-select v-model="searchForm.sex" clearable>
                        <el-option label="男" value="m"></el-option>
                        <el-option label="女" value="f"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户住址">
                    <el-input v-model="searchForm.address"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="searchForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱">
                    <el-input v-model="searchForm.email"></el-input>
                </el-form-item>
            </el-row>
        </el-form>

        <!-- 按钮组 -->
        <div class="btn_wrapper">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="refresh">重置</el-button>
        </div>

        <!-- 展示数据表格 -->
        <el-table :data="resultUsers" border>
            <el-table-column label="ID" prop="user_id"></el-table-column>
            <el-table-column label="昵称" prop="user_nickname"></el-table-column>
            <el-table-column label="姓名" prop="user_realname"></el-table-column>
            <el-table-column label="性别" prop="user_sex"></el-table-column>
            <el-table-column label="固定地址" prop="user_address" min-width="100px"></el-table-column>
            <el-table-column label="联系电话" prop="user_phone"></el-table-column>
            <el-table-column label="邮箱" prop="user_email"></el-table-column>
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
    </div>
</template>


<script>


export default {
    name: 'userMange',
    data () {
        return {
            resultUsers:[],
            searchForm:{
                id:"",
                realname:"",
                nickname:"",
                sex:"",
                address:"",
                phone:"",
                email:"",
                pageSize:10,
                pageIndex:1,
                total:0,
            },
        }
    },
    methods:{
        init(){
            let params = {
                "method":"searchAll"
            };
            this.$http.post('/userMange',params)
            .then((data) => {
                console.log(data);
                this.resultUsers = data.data.responseData;
                this.searchForm.total = data.data.responseData.length;
            })
            .catch((err) => {
                console.log(err);
            });
        },
        search(){
            if(this.searchForm.nickname==""&&this.searchForm.realname==""&&this.searchForm.id==""&&this.searchForm.phone==""&&this.searchForm.email==""&&this.searchForm.address==""&&this.searchForm.sex=="")
            {
                this.init();
            }
            else
            {
                let params = {
                "method":"searchSome",
                "userForm":this.searchForm
                };
                this.$http.post('/userMange',params)
                .then((data) => {
                    console.log(data);
                    this.resultUsers = data.data.responseData;
                    this.searchForm.total = data.data.responseData.length;
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        },
        refresh(){
            this.searchForm.id = "";
            this.searchForm.realname = "";
            this.searchForm.nickname = "";
            this.searchForm.sex = "";
            this.searchForm.address = "";
            this.searchForm.phone = "";
            this.searchForm.email = "";
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
    created(){
        this.init();
    },
}
</script>

<style scoped>
    .wrapper
    {
        padding-left: 310px;
    }
</style>
