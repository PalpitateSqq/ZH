import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
Vue.prototype.$http = axios
// 设置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 预处理
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必不可少
  return config
})
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
