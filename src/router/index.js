import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '@/components/mainPage/mainPage.vue'
import login from "@/components/login.vue";
import register from "@/components/register.vue";
import goodList from "@/components/goodList/goodList.vue";

import guestBackStage from "@/components/guestBackStage/guestBackStage";
import guestInfo from "@/components/guestBackStage/guestInfo.vue";
import guestOrder from "@/components/guestBackStage/guestOrder.vue";
import cart from "@/components/guestBackStage/cart.vue";

import adminBackStage from "@/components/adminBackStage/adminBackStage.vue";
import goodMange from "@/components/adminBackStage/goodMange.vue";
import orderMange from "@/components/adminBackStage/orderMange.vue";
import userMange from "@/components/adminBackStage/userMange.vue";

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
        ],
    },
    // 登录路由
    {
        path:'/login',
        name:'login',
        component:login
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
            {
                path:"guestInfo",
                name:"guestInfo",
                component:guestInfo,
                meta:{
                    // requireAuth:true
                }
            },
            {
                path:"guestOrder",
                name:"guestOrder",
                component:guestOrder,
                meta:{
                    // requireAuth:true
                }
            },
            {
                path:"cart",
                name:"cart",
                component:cart,
                meta:{
                    // requireAuth:true
                },
            },
        ],
    },
    {
        path:'/goodList',
        name:'goodList',
        component:goodList,
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
