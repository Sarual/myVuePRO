// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标的样式表
import './assets/fonts/iconfont.css'

// 普通的代码
Vue.config.productionTip = false
Vue.use(ElementUI)
// 全局挂载请求的baseURL
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 挂载axios
Vue.prototype.$http = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
