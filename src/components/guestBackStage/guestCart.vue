<template>
    <div class="wrapper">
        <table class="cartTable" v-if="responseData.length">
            <thead class="cartHead">
                <tr>
                    <th><input type="checkbox" @click="chooseAll" ref="chooseAll" v-model="ifChooseAll"/></th>
                    <th>商品名称</th>
                    <th>商品单价</th>
                    <th>商品数量</th>
                    <th>单位</th>
                    <th>小计</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody class="cartBody">
                <template v-for="(item,index) in responseData">
                    <tr>
                        <td>
                            <input type="checkbox" v-model="item.ifChoosing"  @click="selectChange(index)"/>
                        </td>
                        <td>
                            {{item.good_name}}
                        </td>
                        <td>
                            ￥{{item.good_price}}
                        </td>
                        <td>
                            <button @click="decreasing(index)" class="calculate" :disabled="item.num==1">-</button>
                            {{item.num}}
                            <button @click="adding(index)" class="calculate">+</button>
                        </td>
                        <td>
                            {{item.good_unit}}
                        </td>
                        <td>
                            ￥{{item.sum}}
                        </td>
                        <td>
                            <button @click="deleting(index)" class="deleting"><i class="el-icon-delete"></i>删除</button>
                        </td>
                    </tr>
                </template>
            </tbody>
            <tfoot>
                <td colspan="7">
                    <div>
                        <p>共计:<span class="totalMoney">￥{{this.total}}</span></p>
                        <button @click="makeOrder" class="ordering">
                            <router-link :to="targetUrl">
                            <i class="el-icon-edit"></i>生成订单
                            </router-link>
                        </button>
                    </div>
                </td>
            </tfoot>
        </table>
        <h2 v-if="!responseData.length">您的购物车空空如也哦   再去逛逛吧</h2>
    </div>
</template>

<script>
export default {
    name:'guestCart',
    data(){
        return{
            // 这是假数据，以后要改回来
            userName:"",
            total:0,
            responseData:[],
            ifChooseAll:true,
            goodNum:[],
            selectedNum:"",
            selectedGoodList:[],
            targetUrl:"/makeOrder",
        }
    },
    // 注意：在created阶段不能够获取到html元素(refs),因为这个阶段页面还没有被渲染出来
    created(){
        this.init();
        // 若生成订单，到时候要通过这东西删除购物车中的商品
        window.localStorage.removeItem('selectedGoodList');
        window.localStorage.removeItem('totalPrice');
        this.responseData = [];
        this.selectedGoodList = [];
    },
    methods:{
        init(){
            let params = {
                "method":"refreshCart",
                // "userName":this.userName
                "userName":this.$store.state.userName
            };
            this.$http.post('/guestCart',params)
            .then((data) => {
                this.total = 0;
                this.responseData = JSON.parse(JSON.stringify(data.data));
                if(this.responseData.data == 'empty')
                {
                    this.responseData = [];
                    return;
                }
                for(let i =0;i<this.responseData.length;i++)
                {
                    this.$set(this.responseData[i],"ifChoosing",true);
                    this.$set(this.responseData[i],"num",1)
                    this.$set(this.responseData[i],"sum",0);
                    this.responseData[i].sum = this.responseData[i].good_price;
                    if(this.responseData[i].ifChoosing)
                    {
                        this.total += this.responseData[i].sum;
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //这是关于element中的table中的一个坑。table里面的row里的项发生改变,视图不会立刻发生改变
        // 需要通过this.$set来进行更新视图
        // 坑:增加/减少按钮多按几下的话，视图会不更新，但是数据是会更新的

        selectChange(index){
            this.total = 0;
            this.selectedNum = 0;
            this.responseData[index].ifChoosing = !this.responseData[index].ifChoosing;
            for(let i = 0;i<this.responseData.length;i++)
            {
                if(this.responseData[i].ifChoosing == true)
                {
                    this.selectedNum ++;
                }
                else
                {
                    this.ifChooseAll = false;
                }
            }
            if(this.selectedNum == 0)
            {
                this.ifChooseAll = false;
            }
            if(this.selectedNum == this.responseData.length)
            {
                this.ifChooseAll = true;
            }
            this.getSum(index);
            this.getTotal();
        },

        decreasing(index){
            this.total = 0;
            this.$set(this.responseData[index],'num',this.responseData[index].num-1);
            this.getSum(index);
            this.getTotal();
        },

        adding(index){
            this.total = 0;
            this.$set(this.responseData[index],'num',this.responseData[index].num+1);
            this.getSum(index);
            this.getTotal();
        },

        getSum(index){
            this.responseData[index].sum = this.responseData[index].num * this.responseData[index].good_price;
        },
        getTotal(){
            for(let i = 0;i<this.responseData.length;i++)
            {
                if(this.responseData[i].ifChoosing)
                {
                    this.total += this.responseData[i].sum;
                }
            }
        },

        deleting(index){
            console.log(index);
            let deletes = this.responseData[index];
            console.log(deletes);
            this.responseData.splice(index,1);
            // 删除数据后需要对数据库进行操作，并且重新刷新购物车列表
            let params = {
                "method":"deleting",
                "good_id":deletes.good_id,
            };
            this.$http.post('/guestCart',params)
            .then((data) => {
                this.init();
            })
            .catch((err) => {
                console.log(err);
            });
        },

        chooseAll(){
            this.total = 0;
            let ifChooseAll = this.$refs.chooseAll;
            if(ifChooseAll.checked)
            {
                this.responseData.forEach(function(item,index){
                    item.ifChoosing = true;
                });
            }
            else
            {
                this.responseData.forEach(function(item,index){
                    item.ifChoosing = false;
                });
            }
            this.getTotal();
        },

        makeOrder(){
            for(let i = 0;i<this.responseData.length;i++)
            {
                if(this.responseData[i].ifChoosing == true)
                {
                    // this.selectedGoodList.push(this.responseData[i]);
                    // this.$set(this.selectedGoodList,i,this.responseData[i]);
                    this.selectedGoodList.push(this.responseData[i]);
                }
            }
            if(this.selectedGoodList.length == 0)
            {
                this.$message({
                    message:"请先选择商品，再生成订单",
                    type:"error"
                });
                console.log(this.$route);
                return;
            }
            else
            {
                window.localStorage.setItem('selectedGoodList',JSON.stringify(this.selectedGoodList));
                window.localStorage.setItem('totalPrice',this.total);
            }
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        overflow: none;
        padding: 50px 30px 0 320px;
        height: auto;
        .cartTable
        {
            width: 100%;
            border-radius: 5px;
            border-right: 1px solid black;
            border-left: 1px solid black;
            border-top: 1px solid #000;
            border-collapse: collapse;
            input[type='checkbox']
            {
                cursor: pointer;
            }
            .cartHead{
                background-color: #00C1DF;
            }
            td,th{
                border-bottom: 1px solid black;
                padding-top: 10px;
                padding-bottom: 10px;
                padding-right: 20px;
                padding-left: 20px;
            }
            th
            {
                font-size: 20px;
            }
            td
            {
                font-size: 18px;
                text-align: center;
                button[type='button']
                {
                    height: 15px;
                    width: 30px;
                }
            }
            .calculate,.deleting
            {
                color: white;
                font-weight: bolder;
                border:none;
                border-radius: 4px;
                outline: none;
                cursor: pointer;
            }
            .calculate
            {
                width: 20px;
                height: 20px;
                background: #00C1DF;
            }
            .deleting
            {
                width: 80px;
                height:30px;
                background-color: #f56c6c;
                i
                {
                    margin-right: 5px;
                }
            }
            tfoot
            {
                border-bottom: 1px solid black;
                div
                {
                    display: flex;
                    justify-content: space-between;
                    p
                    {
                        line-height: 40px;
                        .totalMoney
                        {
                            font-size: 24px;
                            font-weight: bolder;
                        }
                    }
                    .ordering
                    {
                        width: 80px;
                        height: 40px;
                        color: white;
                        font-weight: bolder;
                        border:none;
                        border-radius: 4px;
                        outline: none;
                        cursor: pointer;
                        background: #00C1DF;
                        line-height: 40px;
                        margin-right: 20px;
                        a
                        {
                            color: white;
                            display: block;
                            height: 100%;
                        }
                        &:hover
                        {
                            a
                            {
                                color: #c0c0c0;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

