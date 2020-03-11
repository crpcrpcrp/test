import { MessageBox, Message } from 'element-ui'
import axios from 'axios'
import store from '@/store'
import { getToken, getTokenHead } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 开发环境代表代理的路径，生产环境用后端域名
  timeout: 6000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (getToken()) {  //登陆不需要添加token
      config.headers["token"] = getToken();
    }
    // config.headers["token"] = 'm/l1/BZC6um0hkxn+giiwZO6YJp9DzBdt5/OJliTbSUh885+s0oZMPYB57XrL8Iw'
    return config
  },
  error => {
    //console.log(err,'err')
    return Promise.reject(error)
  }
)

service.defaults.transformRequest.push((data, headers) => {
  store.dispatch('req/updateReqNum', { reqNum: 1, type: "add" });
  // Do whatever you want to transform the req
  return data;
});
service.defaults.validateStatus = status => {
  //
  store.dispatch('req/updateReqNum', { reqNum: 1, type: "reduce" });
  return status >= 200 && status < 300; // default
};

service.interceptors.response.use(
  response => {
    const res = response.data
    const code = response.status
    if (res.code == 800000) { //token过期的情况下
      store.dispatch('user/resetToken').then(() => {    //先清除token，此时除了停留当前页面预览，任何路由都会拦截至登陆界面
        Message({
          message: '登陆过期，请重新登陆',
          type: 'error',
          duration: 3 * 1000
        })
        location.reload()                    //点击确定，刷新页面会触发路由拦截到login界面
      })
    }

    //因为登接口在vuex里面用的，包了async的。出错的话可以在这里拦截处理，其他的就在业务代码模块统一处理
    if (res.code !== 200 && response.config.url == '/user/sys/login') {
      Message({
        message: response.data.msg || 'Error',
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(response)
    } else if(res.code === 104 || res.code === 105 || res.code === 106) {
      // console.log('8888888888888888888888888888888888')
      store.dispatch('user/resetToken').then(() => {    
        Message({
          message: '登陆过期，请重新登陆',
          type: 'error',
          duration: 2 * 1000
        })
        location.reload()                  
      })
    } else {
      return response
    }
  },
  error => {
    if(error.response.status == 500 ) {
      const { data } = error.response;
      if(data && data.message) {
        Message({
          message: data.message,
          type: 'error',
          duration: 2 * 1000
        })
      }
    }
    if (error.response.status == 500 && (error.response.data.code == 600  
      || error.response.data.code == 104  || error.response.data.code == 105  || error.response.data.code == 106)
      ) {
      store.dispatch('user/resetToken').then(() => {    //先清除token，此时除了停留当前页面预览，任何路由都会拦截至登陆界面
        Message({
          message: '登陆过期，请重新登陆',
          type: 'error',
          duration: 2 * 1000
        })
        location.reload()                    //点击确定，刷新页面会触发路由拦截到login界面
      })
    } else {
      return Promise.reject(error)
    }
  }
)


export default service
