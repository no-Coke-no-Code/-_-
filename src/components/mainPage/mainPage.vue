<template>
    <div class="wrapper">
        <headers></headers>
        <div>
            <searchInput></searchInput>
            <good-menu></good-menu>
        </div>
        <rollPic></rollPic>
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
    </div>
</template>

<script>
import headers from "../global/headers.vue";
import rollPic from "./rollPic.vue";
import searchInput from "./../global/searchInput.vue";
import goodMenu from "./../global/goodMenu.vue";
import goodBlock from "./../goodList/goodBlock.vue";

export default {
    name: 'mainPage',
    components:{
        headers,
        searchInput,
        rollPic,
        goodMenu,
        goodBlock,
    },
    data () {
        return {

        }
    },
    created(){
    },
    methods:{
    
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
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

