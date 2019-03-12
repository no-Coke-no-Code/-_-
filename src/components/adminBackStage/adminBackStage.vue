<template>
    <div class="wrapper">
        <adminBackStageMenuList></adminBackStageMenuList>
        <router-view></router-view>
    </div>
</template>

<script>
import adminBackStageMenuList from "./adminBackStageMenuList.vue";

export default {
    name: 'backStage',
    components:{
        adminBackStageMenuList
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

<style lang="scss" scoped>
    .wrapper
    {
        height: 100%;
    }
</style>

