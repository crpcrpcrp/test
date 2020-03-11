import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons'         // icon
import '@/permission'    // 挂载路由后添加路由拦截器（守卫）

//粒子效果引入
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
Vue.use(ElementUI)

//提示二次封装
import '@/utils/messageBox.js'

// 语言设置成英文
// Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
