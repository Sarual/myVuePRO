import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Login from '@/components/Login'
import Home from '@/components/Home'
Vue.use(Router)

const router = new Router({
  routes: [
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
        {
          path: '/welcome',
          component: Welcome
        }
      ]
    }
  ]
})
// 全局路由守卫
router.beforeEach((to, from, next) => {
  console.log('navigation-guards')
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

  // 如果用户访问的是登录页面直接放行
  if (to.path === '/login') return next()
  // 获取token（如果有token就放行）
  const tokenStr = sessionStorage.getItem('token')
  console.log(tokenStr)
  if (tokenStr) return next()
  // 如果没有tokenStr,就跳转到登录页
  return next('/login')
})
export default router
