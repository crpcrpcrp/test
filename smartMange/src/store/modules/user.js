import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Login, Logout, GetUserInfo } from '@/myApi/login'
import { MessageBox, Message } from 'element-ui'

const state = {
  token: getToken(),
  // tokenHead:getTokenHead(),
  avatar: '',       //头像，暂时没用
  RightsList: [],    //权限菜单列表
  MenuButton: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_RIGHTSlIST: (state, RightsList) => {
    state.RightsList = RightsList
  },
  // HEAD_TOKEN:(state,tokenHead) => {
  //   state.tokenHead = tokenHead
  // },
  SET_MENUBUTTON(state, MenuButton) {
    state.MenuButton = MenuButton
  }
}


const actions = {
  login({ commit }, userInfo) {
    const { username, password, vercode, type } = userInfo
    return new Promise((resolve, reject) => {
      Login({ username: username.trim(), password: password, vercode: vercode.trim(),type }).then(response => {
        const { data } = response;
        if (data.code == 200) {

          //sessionStorage.setItem('userName',username)
          //setTokenHead(data.data.tokenHead)
          setToken(data.data.string)
          //sessionStorage.setItem('token',data.data.token)
          //sessionStorage.setItem('tokenHead', data.data.tokenHead)
          resolve(data)
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  isGetInfo({ commit, state }, code) {
    return new Promise((resolve, reject) => {
      GetUserInfo().then(response => {
        const { data } = response
        if (data.code == 200) {
          commit('SET_RIGHTSlIST', data.data.pageMenuInfoList)   //用户菜单权限（在permission/generateRoutes 使用）
          commit('SET_MENUBUTTON', data.data.childMenuUrlButtonMap)   //用户页面权限（在相关页面使用）
          resolve(data.data)
        } else {
          console.log('已经成功登录但获取不到用户信息！')
          reject(data)
        }
      }).catch(error => {

        reject(error)
      })
    })
  },


  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      Logout().then(res => {          //用户登出接口
        if (res.data.code == 200) {
          commit('SET_TOKEN', '')
          // commit("HEAD_TOKEN",'')
          commit('SET_RIGHTSlIST', [])   //用户菜单权限（在permission/generateRoutes 使用）
          removeToken()
          resetRouter()
          resolve(res)
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

