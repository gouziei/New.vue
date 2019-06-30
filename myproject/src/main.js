// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

//引入router
import router from './router'
import ElTreeGrid from 'element-tree-grid'

// element-UI
import ELement from 'Element-ui'
// 引入axios
import axios from 'axios'

// 引入富文本
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)


// 引入样式
import './assets/css/index.css'
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ELement)
Vue.component(ElTreeGrid.name, ElTreeGrid)
// 拦截器
axios.interceptors.request.use(function (config) {
  // 在登录时不需要添加Authorization
  if (!config.url.includes('login')) {
    //这里的token每次都不一样
    config.headers.Authorization = window.localStorage.getItem('token')
  }
  return config
})
//加载到vue实例中去
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
