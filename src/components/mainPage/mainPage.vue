<template>
    <div class="wrapper">
        <headers></headers>
        <div>
            <searchInput></searchInput>
            <good-menu></good-menu>
        </div>
        <rollPic></rollPic>
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
                        <h2>准时送达</h2>
                        <p>我们确保你的商品准时送达</p>
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
                        <h2>准时送达</h2>
                        <p>我们确保你的商品准时送达</p>
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

        }
    },
    methods:{
    
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
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

