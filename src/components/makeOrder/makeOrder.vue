<template>
    <div class="wrapper" v-loading="ifLoading">
        <headers></headers>
        <div>
            <searchInput></searchInput>
            <good-menu></good-menu>
        </div>
        <div class="mainBlock">
            <h2>请确认所有信息</h2>
            <div class="goodList">
                <el-table :data="goodList">
                    <!-- 下面这个是用来放图片的 -->
                    <el-table-column label="图片"></el-table-column>
                    <el-table-column label="商品名称" prop="good_name"></el-table-column>
                    <el-table-column label="单价" prop="good_price"></el-table-column>
                    <el-table-column label="单位" prop="good_unit"></el-table-column>
                    <el-table-column label="数量" prop="num"></el-table-column>
                    <el-table-column label="小计" prop="sum"></el-table-column>
                </el-table>
            </div>
            <div class="totalPrice">
                <h1>总价:￥{{this.totalPrice}}</h1>
            </div>
            <el-button @click="confirmOrder">确定生成</el-button>
            <el-button @click="cancelOrder"><router-link to="/guestBackStage/guestCart">取消生成</router-link></el-button>
        </div>
    </div>
</template>

<script>
import headers from "../global/headers.vue";
import searchInput from "./../global/searchInput.vue";
import goodMenu from "./../global/goodMenu.vue";

export default {
    name: 'makeOrder',
    components:{
        headers,
        searchInput,
        goodMenu
    },
    data(){
        return{
            ifLoading:false,
            goodList:[],
            totalPrice:"",
        }
    },
    created(){
        this.goodList = JSON.parse(window.localStorage.getItem("selectedGoodList"));
        this.totalPrice = window.localStorage.getItem("totalPrice");
    },
    methods:{
        // 最终确认生成订单
        confirmOrder(){
            this.$confirm('是否确定生成订单？？','提示',{
                confirmButtonText:"生成",
                cancelButtonText:"我再想想"
            })
            .then(() => {
                this.$message({
                    message:"正在生成，请稍后",
                    type:"success"
                });
                this.ifLoading = true;
                let params = {
                    "method":"makeGuestOrder",
                    "userName":"",
                    "goodList":"",
                };
                this.axios
                .post('/guestOrder',params)
                .then((data) => {
                    console.log(data);
                    this.ifLoading = false;
                    this.$router.push({path:"/makeOrderSuccess",name:"makeOrderSuccess"});
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch();
        },
        // 取消生成订单
        cancelOrder(){
            window.localStorage.removeItem('selectedGoodList');
        },
    },
}
</script>

<style lang="scss" scoped>

</style>

