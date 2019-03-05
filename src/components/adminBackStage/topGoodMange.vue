<template>
    <div class="topGoodManageWrapper">
        <el-tabs v-model="currentType" @tab-click="handleClick">
            <el-tab-pane label="热销商品" name="topGood">
                <!-- :data为左手边框，v-model为右手边框 -->
                <!-- transfer大概用法：data用于规定数据的key,label,disabled v-model用于右边框数据的初始化 -->
                <el-transfer :titles="['所有商品','列表商品']" :data="data1" v-model="value1" @change="handleChange"></el-transfer>
            </el-tab-pane>
            <el-tab-pane label="劲爆新品" name="newGood">
                <el-transfer :titles="['所有商品','列表商品']" :data="data2" v-model="value2" @change="handleChange"></el-transfer>
            </el-tab-pane>
            <el-tab-pane label="异国风情" name="foreignGood">
                <el-transfer :titles="['所有商品','列表商品']" :data="data3" v-model="value3" @change="handleChange"></el-transfer>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    name:'topGoodMange',
    data(){
        return{
            allGood:[],
            data1:[],
            value1:[],
            data2:[],
            value2:[],
            data3:[],
            value3:[],
            currentType:'topGood',
        }
    },
    mounted(){
        this.init();
    },
    methods:{
        saving(){
            console.log(this.value1);
        },
        handleClick(tab){
            let currentTab = tab;
            if(currentTab == "热销商品")
            {
                this.currentType = "topGood";
            }
            else if(currentTab == '劲爆新品')
            {
                this.currentType = "newGood";
            }
            else if(currentTab == '异国风情')
            {
                this.currentType = "foreignGood";
            }
            this.init();
        },
        init(){
            this.data1 = [];
            this.data2 = [];
            this.data3 = [];
            this.value1 = [];
            this.value2 = [];
            this.value3 = [];
            // 先查询所有商品
            let params = {
                'method':'getAllGood',
            };
            this.$http
            .post('/topGoodMange',params)
            .then((data)=>{
                let responseData = data.data.data;
                this.allGood = responseData;
                for(let i =0;i<this.allGood.length;i++)
                {
                    this.data1.push({
                        key: this.allGood[i].good_id,
                        label: this.allGood[i].good_name
                    });
                    this.data2.push({
                        key: this.allGood[i].good_id,
                        label: this.allGood[i].good_name
                    });
                    this.data3.push({
                        key: this.allGood[i].good_id,
                        label: this.allGood[i].good_name
                    });
                }
                // 根据当前tab页，查询所要设置的模块的商品
                var method = '';
                if(this.currentType == 'topGood')
                {
                    method = "getTopGood";
                }
                else if(this.currentType == 'newGood')
                {
                    method = "getNewGood";
                }
                else if(this.currentType == 'foreignGood')
                {
                    method = "getForeignGood";
                }
                let params2 = {
                    'method':method
                };
                console.log(params2);
                this.$http
                .post('/topGoodMange',params2)
                .then((data)=>{
                    let responseData2 = data.data.data;
                    console.log(responseData2,'选中项商品');
                    console.log(this.allGood,'所有商品');
                    for(let i = 0;i<responseData2.length;i++)
                    {
                        for(let x = 0;x<this.allGood.length;x++)
                        {
                            if(responseData2[i].good_id == this.allGood[x].good_id)
                            {
                                console.log(this.currentType);
                                if(this.currentType == "topGood")
                                {
                                    this.value1.push(responseData2[i].good_id);
                                }
                                if(this.currentType == "newGood")
                                {
                                    this.value2.push(responseData2[i].good_id);
                                }
                                if(this.currentType == "foreignGood")
                                {
                                    this.value3.push(responseData2[i].good_id);
                                }
                            }
                        }
                    }
                    console.log(this.value1,"value1");
                    console.log(this.value2,"value2");
                    console.log(this.value3,"value3");
                })
                .catch((err)=>{
                    console.log(err);
                });
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        // 点击左右操作按钮时的方法
        action(api,method,goodId){
            let params = {
                'method':method,
                'good_id':goodId
            };
            this.$http
            .post(api,params)
            .then((data)=>{
                console.log(data);
                // this.init();
            })
            .catch((err)=>{
                console.log(err);
            });
        },
        handleChange(value, direction, movedKeys){
            var method = "";
            if(direction == 'left')
            {
                // 调用删除的接口
                if(this.currentType == 'topGood')
                {
                    method = "removeTopGood";
                }
                else if(this.currentType == 'newGood')
                {
                    method = "removeNewGood";
                }
                else if(this.currentType == 'foreignGood')
                {
                    method = "removeForeignGood";
                }
                this.action('/topGoodMange',method,movedKeys);
            }
            else
            {
                // 调用添加的接口
                if(this.currentType == 'topGood')
                {
                    method = "setTopGood";
                }
                else if(this.currentType == 'newGood')
                {
                    method = "setNewGood";
                }
                else if(this.currentType == 'foreignGood')
                {
                    method = "setForeignGood";
                }
                this.action('/topGoodMange',method,movedKeys);
            }
        },
    },
}
</script>

<style lang="scss" scoped>
    .topGoodManageWrapper
    {
        overflow: hidden;
        .topGood,.newGood,.foreignGood
        {
            background-color: #f7f7f7;
            height: 300px;
            margin-left: 10px;
            margin-top: 37px;
        }
    }
</style>
