import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import axios from 'axios'
Vue.prototype.$http = axios
// 设置根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 预处理，在每次访问前在请求头加入 token，展示进度条 NProgress.start();
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必不可少
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done();
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 导入 NProgress 包对应的 js、css
import NProgress from 'nprogress'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
// 定义全局过滤器
Vue.filter('dataFormat', originVal => {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
