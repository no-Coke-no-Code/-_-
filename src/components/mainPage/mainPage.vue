<template>
    <div class="wrapper">
        <headers></headers>
        <rollPic></rollPic>
    </div>
</template>

<script>
import headers from "../global/headers.vue";
import rollPic from "./rollPic.vue";

export default {
    name: 'mainPage',
    components:{
        headers,
        rollPic
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

<style scoped>
</style>
