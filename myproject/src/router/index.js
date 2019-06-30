import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login/Login.vue"
import Home from '../components/Home'
import SideBar from '../components/SideBar.vue'
import Users from '../components/User/Users.vue'
import useElment from '../components/User/useElment.vue'
import Power from '../components/power.vue'
import Roles from '../components/roles.vue'
import GoodClass from '../components/Good/goodclass.vue'
import userTreeGrid from '../components/User/userTreeGrid.vue'
import GoodList from '../components/Good/goodlist.vue'
import GoodEvents from '../components/Good/goodevents.vue'
import Orders from '../components/orders.vue'
import Reports from '../components/reports.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      // name:'SideBar',
      // component:SideBar
      redirect: '/Home'
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children: [
        { path: '/users', component: Users },
        { path: '/rights', component: Power },
        { path: '/roles', component: Roles },
        { path: '/goods', component: GoodClass },
        { path: '/categories', component: GoodList },
        { path: '/params', component: GoodEvents },
        { path: '/orders', component: Orders },
        {path:'/reports',component:Reports}
      ]
    },
    {
      path: '/useElment',
      name: 'useElment',
      component: useElment
    },
    {
      path: '/userTreeGrid',
      component: userTreeGrid
    },
    //login添加登录路由
    {
      path: "/Login",
      name: "Login",
      component: Login
    }
  ]
})
