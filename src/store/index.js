import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        userName:null,
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
    },
    mutations:{
        setUsername(state,value){
            state.userName = value;
            window.localStorage.setItem('userName',value);
        },
        removeUsername(state,value){
            state.userName = null;
            window.localStorage.removeItem('userName');
        },
    }
})

// 其实想要改变vuex中state的值,一般可以直接写this.$stote.state.xxx=xxx  或者通过commit/dispatch
// 来改写。但是在vuex的严格模式下，只能通过后者来进行修改；后者可以进行状态记录，回滚等的操作