<template>
    <div class="couponManageWrapper">
        管理优惠券页面
    </div>
</template>

<script>
export default {
    name:"couponManage",
    data(){
        return{
            couponList:[],
        }
    },
    created(){
        this.init();
    },
    methods:{
        init(){
            let params = {
                "method":"checkAllCoupon"
            };
            this.$http
            .post('/coupon',params)
            .then((data)=>{
                let responseData = data.data.data;
                for(let i = 0;i<responseData.length;i++)
                {
                    this.couponList.push(responseData[i]);
                }
                console.log(this.couponList);
            })
            .catch((err)=>{
                console.log(err);
            });
        },
    },
}
</script>

<style lang="scss" scoped>

</style>
