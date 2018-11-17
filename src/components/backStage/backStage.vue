<template>
    <div class="wrapper">
        <menulist></menulist>
        <router-view></router-view>
    </div>
</template>

<script>
import menulist from "./menuList.vue";

export default {
    name: 'backStage',
    components:{
        menulist
    },
    data () {
        return {

        }
    },
    created(){
    },
    methods:{
        toGoodMange(){
            this.$router.push("/backStage/goodMange");
        },
        toUserMange(){
            this.$router.push("/backStage/userMange");
        },
        toOrderMange(){
            this.$router.push("/backStage/OrderMange");
        },
    },
}
</script>

<style scoped>
</style>
