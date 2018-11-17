import Vue from 'vue'
import Router from 'vue-router'
import mainPage from '@/components/mainPage/mainPage.vue'
import login from "@/components/login.vue";
import register from "@/components/register.vue";
import cart from "@/components/cart/cart.vue";
import goodList from "@/components/goodList/goodList.vue";
import takeOrder from "@/components/takeOrder/takeOrder.vue";
import guestInfo from "@/components/information/guestInfo.vue";

import backStage from "@/components/backStage/backStage.vue";
import goodMange from "@/components/backStage/goodMange.vue";
import orderMange from "@/components/backStage/orderMange.vue";
import userMange from "@/components/backStage/userMange.vue";

import store from "../store"


Vue.use(Router)

const router = new Router({
    routes: [
    {
        path: '/',
        name: 'mainPage',
        component: mainPage,
    },
    {
        path: '/register',
        name: 'register',
        component: register
    },
    {
        path:'/backStage',
        name:'backStage',
        component:backStage,
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
    {
        path:'/login',
        name:'login',
        component:login
    },
    {
        path:'/cart',
        name:'cart',
        component:cart,
        meta:{
            requireAuth:true
        },
    },
    {
        path:'/takeOrder',
        name:'takeOrder',
        component:takeOrder,
        meta:{
            requireAuth:true
        }
    },
    {
        path:"/guestInfo",
        name:'guestInfo',
        component:guestInfo,
        meta:{
            requireAuth:true
        }
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
