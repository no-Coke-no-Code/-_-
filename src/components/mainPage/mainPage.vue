<template>
    <div class="wrapper">
        <!-- <div class="leftMenuBlock">
            <el-button class="leftMenuBtn" @click="ifShowingLeftMenu" v-if="!ifShowing">展开</el-button>
            <el-button class="leftMenuBtn" @click="ifShowingLeftMenu" v-if="ifShowing">收起</el-button>
            <el-menu class="leftMenu" v-if="ifShowing">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span slot="title">导航一</span>
                    </template>
                    <el-menu-item-group>
                        <span slot="title">分组一</span>
                        <el-menu-item index="1-1">选项1</el-menu-item>
                        <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                        <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                        <span slot="title">选项4</span>
                    <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航四</span>
                </el-menu-item>

            <el-submenu index="1">
                <template slot="title">蔬菜</template>
                <el-menu-item index="叶类蔬菜">叶类蔬菜</el-menu-item>
                <el-menu-item index="地下蔬菜">地下蔬菜</el-menu-item>
                <el-menu-item index="山货">山货</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">水果</template>
                <el-menu-item index="苹果">苹果</el-menu-item>
                <el-menu-item index="雪梨">雪梨</el-menu-item>
                <el-menu-item index="香蕉">香蕉</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">海鲜</template>
                <el-menu-item index="鱼">鱼</el-menu-item>
                <el-menu-item index="龙虾">龙虾</el-menu-item>
                <el-menu-item index="鲍鱼">鲍鱼</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">肉类</template>
                <el-menu-item index="牛肉">牛肉</el-menu-item>
                <el-menu-item index="猪肉">猪肉</el-menu-item>
                <el-menu-item index="羊肉">羊肉</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">零食</template>
                <el-menu-item index="巧克力">巧克力</el-menu-item>
                <el-menu-item index="糖果">糖果</el-menu-item>
                <el-menu-item index="汽水">汽水</el-menu-item>
            </el-submenu>
            </el-menu>
        </div> -->
        <headers></headers>
        <div>
            <searchInput></searchInput>
            <good-menu></good-menu>
        </div>
        <rollPic></rollPic>
        <!-- <svg-icon icon-class="shengxian-shucai"></svg-icon> -->
        <div class="introduce">
            <ul>
                <li>
                    <div class="introduceItem">
                        <img src="../../assets/img/introduce/introducePic1.png"/>
                        <h2>准时送达</h2>
                        <p>我们确保你的商品准时送达</p>
                    </div>
                </li>
                <li>
                    <div class="introduceItem">
                        <img src="../../assets/img/introduce/introducePic2.png"/>
                        <h2>送货到家</h2>
                        <p>我们确保你的商品送货到家</p>
                    </div>
                </li>
                <li>
                    <div class="introduceItem">
                        <img src="../../assets/img/introduce/introducePic3.png"/>
                        <h2>准时送达</h2>
                        <p>我们确保你的商品准时送达</p>
                    </div>
                </li>
                <li>
                    <div class="introduceItem">
                        <img src="../../assets/img/introduce/introducePic4.png"/>
                        <h2>确保安全</h2>
                        <p>我们确保你的商品百分百安全无公害</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="blockArea">
            <div class="block">
                <good-block title="精品推介" type="jingping"></good-block>
            </div>
            <div class="block">
                <good-block title="劲爆新品" type="newGood"></good-block>
            </div>
            <div class="block">
                <good-block title="异国风情" type="foreignGood"></good-block>
            </div>
        </div>
        <footers></footers>
    </div>
</template>

<script>
import headers from "../global/headers.vue";
import rollPic from "./rollPic.vue";
import searchInput from "./../global/searchInput.vue";
import goodMenu from "./../global/goodMenu.vue";
import goodBlock from "./../goodList/goodBlock.vue";
import footers from "../global/footers.vue";

export default {
    name: 'mainPage',
    components:{
        headers,
        searchInput,
        rollPic,
        goodMenu,
        goodBlock,
        footers
    },
    data () {
        return {
            ifShowing:false,
        }
    },
    methods:{
        ifShowingLeftMenu(){
            this.ifShowing = !this.ifShowing;
        },
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        .leftMenuBlock
        {
            position: fixed;
            z-index: 10;
            .leftMenu
            {
                top: 40px;
                left: 0px;
                width: 150px;
                position: absolute
            }
            .leftMenuBtn
            {
                position: absolute;
                top: 0px;
                left: 0px;
            }
        }
        .introduce
        {
            margin: 50px;
            ul
            {
                display: flex;
                justify-content: space-between;
            }
            li
            {
                width: 20%;
                min-width: 250px;
                .introduceItem
                {
                    height: 350px;
                    text-align: center;
                    cursor: pointer;
                    transition: .2s ease;
                    border-radius: 3px;
                    box-shadow: 0 0 24px 0 rgba(82,94,102,0.15);
                    border: 1px solid #EEEFF3;
                    &:hover
                    {
                        transform: scale(1.05,1.05);
                        transition: .2s ease;
                        // border: 1px solid #2E9EFF;
                        box-shadow: 0 0 24px 0 rgba(82,94,102,0.15);
                    }
                    img
                    {
                        width: 100px;
                        height: 100px;
                        margin-top: 80px;
                    }
                }
            }
        }
        .blockArea
        {
            width: 90%;
            margin: 20px auto;
            .block
            {
                margin-top: 20px;
            }
        }
    }
</style>

