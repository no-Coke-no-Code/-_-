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
    data () {
        return {

        }
    },
    created(){
    },
    methods:{
        toGuestInfo(){
            this.$router.push("/guestBackStage/goodMange");
        },
        toUserMange(){
            this.$router.push("/guestBackStage/userMange");
        },
        toOrderMange(){
            this.$router.push("/guestBackStage/OrderMange");
        },
    },
}
</script>

<style scoped>
</style>
