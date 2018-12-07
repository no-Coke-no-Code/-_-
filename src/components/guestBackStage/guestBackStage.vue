<template>
    <div class="wrapper">
        <guestMenuList></guestMenuList>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
import guestMenuList from "./guestMenuList.vue";

export default {
    name: 'guestBackStage',
    components:{
        guestMenuList
    },
}
</script>

<style scoped>
</style>
