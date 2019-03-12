import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        userName:null,
        userId:null,
        power:null,
    },
    // vuex中的getters其实与VUE实例中的computed相类似
    getters:{
        getUsername(state){
            if(!state.userName)
            {
                state.userName = window.localStorage.getItem("userName");
            }
            return state.userName;
        },
        getUserid(state)
        {
            if(!state.userId)
            {
                state.userId = window.localStorage.getItem("userId");
            }
            return state.userId;
        }
    },
    mutations:{
        // mutations中，后一位的参数称之为载荷。官网上面倡导载荷应当是一个对象
        setUsername(state,userInfo){
            state.userName = userInfo.userName;
            state.userId = userInfo.userId;
            window.localStorage.setItem('userName',userInfo.userName);
            window.localStorage.setItem('userId',userInfo.userId);
        },
        removeUsername(state){
            state.userName = null;
            state.userId = null;
            window.localStorage.removeItem('userName');
            window.localStorage.removeItem('userId');
        },
    }
})

// 其实想要改变vuex中state的值,一般可以直接写this.$stote.state.xxx=xxx  或者通过commit/dispatch
// 来改写。但是在vuex的严格模式下，只能通过后者来进行修改；后者可以进行状态记录，回滚等的操作