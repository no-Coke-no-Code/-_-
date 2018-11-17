<template>
    <el-dialog :visible.sync="dialogState.state">

    </el-dialog>
</template>


<script>


export default {
    name: 'addGood',
    prop:[
        "dialogState"
    ],
    data(){
        return{
            goodInfo:{

            },
        }
    },
    method:{
        add(){
            let params = {
                "method":"addGood",
                "goodId":this.search
            };
            this.$http
            .post("/goodMange",params)
            .then(() => {

            })
            .catch((err) => {
                console.log(err);
            });
        },
    },
}
</script>

<style scoped>

</style>
