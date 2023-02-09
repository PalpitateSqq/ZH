import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login.vue'
// 懒加载形式
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/login.vue')
// import Home from '../components/home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName:"users" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Rights = () => import(/* webpackChunkName:"Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"Rights_Roles" */ '../components/power/Roles.vue')
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
const Cate = () => import(/* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
const List = () => import(/* webpackChunkName:"goods" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add.vue')
// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName:"order" */ '../components/order/Order.vue')
// import Report from '../components/report/report.vue'
const Report = () => import(/* webpackChunkName:"report" */ '../components/report/report.vue')
import Test from '../components/test.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    // 路由重定向
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/test', component: Test },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取 token
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
