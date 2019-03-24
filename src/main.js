// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"
import axios from 'axios'
import ElementUi from 'element-ui'
import vuePhotoZoomPro from "vue-photo-zoom-pro";
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/normal.scss';
import "@/assets/font.scss";
import "@/icons";
// 这里无法引入sass文件

Vue.use(vuePhotoZoomPro);
Vue.use(ElementUi);
Vue.config.productionTip = false;

// 对于axios的基本设置
axios.defaults.baseURL = "http://localhost:3333/";
Vue.prototype.$http = axios;    //从此在项目的其它位置$http即原axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
