<template>
    <div class="wrapper">
        <headers></headers>
        <guestMenuList class="menuList"></guestMenuList>
        <!-- <keep-alive> -->
            <router-view></router-view>
        <!-- </keep-alive> -->
    </div>
</template>

<script>
import guestMenuList from "./guestMenuList.vue";
import headers from "../global/headers.vue";

export default {
    name: 'guestBackStage',
    components:{
        guestMenuList,
        headers,
    },
}
</script>

<style lang="scss" scoped>
    .wrapper
    {
        height: 100%;
        .menuList
        {
            height:calc(100% - 40px);
        }
    }
</style>

