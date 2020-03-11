import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'             // 路由跳转进度条
import 'nprogress/nprogress.css'              // progress bar style
import { getToken } from '@/utils/auth'       // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
NProgress.configure({ showSpinner: false })    // NProgress Configuration
const whiteList = ['/login', '/adminLogin', '/register', '/retrievePwd', '/adminRetrievePwd']                   // 设置重定向白名单（某些页面不经过token验证）

// 路由拦截判断登陆状态
router.beforeEach(async (to, from, next) => {
  NProgress.start()                             // beforeEach开始显示进度条
  document.title = getPageTitle(to.meta.title)  // set page title
  const hasToken = getToken()                  // 获取token判断用户是否登陆
  // 判断token
  console.log(hasToken)
  if (hasToken && hasToken != 'undefined') {    // 防止没取到token而误写入undefined的情况
    if (to.path === '/login') {                 // 登陆了就不能去login页面了跳转home
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.RightsList
      if (hasGetUserInfo.length) {         //检查userInfo(用户刷新操作可重新获取路由)，这里判断info有一个好处是在第二次进入页面有缓存hastoken的情况下，跳转任意路由顺便就请求info验证了token是否失效，失效返回401会被response拦截到login
        next()
      } else {
        try {                      //没有用户信息时，理论上这里只在初次打页面时获取一次
          await store.dispatch('user/isGetInfo')    //进行getInfo处理
          // 在info一切正常后开始获取权限信息
          const accessRoutes = await store.dispatch('permission/generateRoutes')    //获取路由权限列表
          router.addRoutes(accessRoutes)           //动态添加路由，isArray
          router.options.routes = accessRoutes
          next({ ...to, replace: true })           //获取资料和权限后，重新跳转to，使用replace直接替换，则不会在浏览器产生多余的历史记录
        } catch (error) {                          //一旦获取info异常，删除token并重新登陆（这里已经在response拦截器中做了）
          await store.dispatch('user/resetToken')
          Message.error(error.msg || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {       //去往页面在白名单自动放行\
      next()
    } else {
      next(`/login?redirect=${to.path}`)           //重定向的同时写入query - redirect便于登陆成功后对应跳转
      // next()
      NProgress.done()
    }
  }
})

//跳转完成后关闭进度条
router.afterEach(() => {
  NProgress.done()
})