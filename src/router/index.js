import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '@/components/mainPage/mainPage.vue'
import login from "@/components/login.vue";
import register from "@/components/register.vue";
// import goodList from "@/components/goodList/goodList.vue";

import guestBackStage from "@/components/guestBackStage/guestBackStage";
import guestInfo from "@/components/guestBackStage/guestInfo.vue";
import guestOrder from "@/components/guestBackStage/guestOrder.vue";
import guestCart from "@/components/guestBackStage/guestCart.vue";
import guestCollect from "@/components/guestBackStage/guestCollect.vue";
import searchResult from "@/components/searchResult/searchResult.vue";
import guestCredit from "@/components/guestBackStage/guestCredit.vue";
// 在这里面路由注册模块可以使用懒加载的方式进行引入，有利于提高首屏的渲染速度提高体验
const goodDetail = (resolve) => {require(["@/components/goodList/goodDetail"],resolve)};
// 懒加载好像会引起一点奇怪的问题：二级路由跳到一级路由好像没有反应？？
// const makeOrder = (resolve) => {require(["@/components/makeOrder/makeOrder"]),resolve};
import makeOrder from "@/components/makeOrder/makeOrder.vue";
import makeOrderSuccess from "@/components/makeOrder/makeOrderSuccess.vue";
import myComment from "@/components/guestBackStage/myComment.vue";
import myCoupon from "@/components/guestBackStage/myCoupon.vue";
import couponCenter from "@/components/couponCenter/couponCenter.vue";

import adminLogin from "@/components/adminLogin.vue";
import adminBackStage from "@/components/adminBackStage/adminBackStage.vue";
import goodMange from "@/components/adminBackStage/goodMange.vue";
import orderMange from "@/components/adminBackStage/orderMange.vue";
import userMange from "@/components/adminBackStage/userMange.vue";
import categoryMange from "@/components/adminBackStage/categoryMange.vue";
import topGoodMange from "@/components/adminBackStage/topGoodMange.vue";
import commentManage from "@/components/adminBackStage/commentManage.vue";
import countManage from "@/components/adminBackStage/countManage.vue";
import couponManage from "@/components/adminBackStage/couponManage";
import store from "../store"


Vue.use(Router)

const router = new Router({
    routes: [
    // 主页路由
    {
        path: '/',
        name: 'mainPage',
        component: mainPage,
    },
    // 注册路由
    {
        path: '/register',
        name: 'register',
        component: register
    },
    // 后台管理路由
    {
        path:'/adminBackStage',
        name:'adminBackStage',
        component:adminBackStage,
        children:[
            {
                path:'goodMange',
                name:'goodMange',
                component:goodMange
            },
            {
                path:'orderMange',
                name:'orderMange',
                component:orderMange
            },
            {
                path:'userMange',
                name:'userMange',
                component:userMange
            },
            {
                path:'categoryMange',
                name:'categoryMange',
                component:categoryMange,
            },
            {
                path:'topGoodMange',
                name:'topGoodMange',
                component:topGoodMange,
            },
            {
                path:'commentManage',
                name:'commentManage',
                component:commentManage
            },
            {
                path:"countManage",
                name:"countManage",
                component:countManage,
            },
            {
                path:"couponManage",
                name:"couponManage",
                component:couponManage,
            }
        ],
    },
    // 用户登录路由
    {
        path:'/login',
        name:'login',
        component:login
    },
    // 管理员登录路由
    {
        path:"/adminLogin",
        name:"adminLogin",
        component: adminLogin,
    },
    // 用户后台路由(包括个人信息，购物车，订单列表)
    {
        path:"/guestBackStage",
        name:'guestBackStage',
        component:guestBackStage,
        meta:{
            // requireAuth:true
        },
        children:[
            // 用户个人信息路由
            {
                path:"guestInfo",
                name:"guestInfo",
                component:guestInfo,
                meta:{
                    // requireAuth:true
                }
            },
            // 用户订单路由
            {
                path:"guestOrder",
                name:"guestOrder",
                component:guestOrder,
                meta:{
                    // requireAuth:true
                }
            },
            {
                path:"guestCart",
                name:"guestCart",
                component:guestCart,
                meta:{
                    // requireAuth:true
                },
            },
            {
                path:"guestCollect",
                name:"guestCollect",
                component:guestCollect,
                meta:{
                    // requireAuth:true
                },
            },
            // 用户积分页面
            {
                path:"guestCredit",
                name:"guestCredit",
                component:guestCredit
            },
            // 用户个人评论页面
            {
                path:"myComment",
                name:"myComment",
                component:myComment,
            },
            // 用户优惠券页面
            {
                path:"myCoupon",
                name:"myCoupon",
                component:myCoupon,
            }
        ],
    },
    // 搜索结果列表路由
    {
        path:'/searchResult',
        name:"searchResult",
        component:searchResult
    },
    // 商品详情信息页面路由
    {
        path:"/goodDetail",
        name:"goodDetail",
        component:goodDetail
    },
    // 生成订单页面路由
    {
        path:"/makeOrder",
        name:'makeOrder',
        component:makeOrder,
    },
    // 生成订单成功页面路由
    {
        path:'/makeOrderSuccess',
        name:'makeOrderSuccess',
        component:makeOrderSuccess
    },
    // 抢券中心页面路由
    {
        path:"/couponCenter",
        name:"couponCenter",
        component:couponCenter,
    }
  ]
})

router.beforeEach((to,from,next) => {
  if(to.meta.requireAuth && !store.state.ifLogin)
  {
    next({
      path:'/login'
    });
  }
  else
  {
    next();
  }
});

export default router;
