<template>
    <div class="wrapper">
        <!-- <el-table :data="responseData">
            <el-table-column>
                <template slot-scope='scope'>
                    <input type="checkbox" @click="ifChoosing(scope.row)"/>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" prop=""></el-table-column>
            <el-table-column label="商品单价" prop=""></el-table-column>
            <el-table-column label="商品数量" prop=""></el-table-column>
            <el-table-column label="商品小计" prop=""></el-table-column>
            <el-table-column label="操作">
                <template slot-scope='scope'>
                    <el-button @click="deleting(scope.row)" type="danger" icon="delete">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <p>共计:<span>￥{{total}}</span></p>
        <el-button @click="chooseAll">全选</el-button>
        <el-button @click="makeOrder">生成订单</el-button> -->
        这是购物车页面
    </div>
</template>

<script>
export default {
    name:'guestCart',
    data(){
        return{
            // 这是假数据，以后要改回来
            userName:"coke43",
            total:"",
            responseData:"",
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            let params = {
                "method":"refreshCart",
                "userName":this.userName
            };
            this.$http.post('/guestCart',params)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            })
        },

        chooseAll(){},

        makeOrder(){},
    },
}
</script>

<style lang="scss" scoped>

</style>

