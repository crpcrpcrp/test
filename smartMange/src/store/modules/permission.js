import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import myViews from '@/layout/components/AppMain'
import store from "@/store"
/**
 * path与component路径名请务必统一
 */

const myData = {       //模拟后台传入的数据，模拟筛选而后动态添加路由
  "code": 0,
  "msg": "ok",
  "data": [
  
    {
      "id": "00003",
      "parentId": null,
      "parentName": null,
      "name": "主题设置",
      "url": "theme/",
      "order": 8,
      "icon": "table",
      "type": 1,
      "typeName": "模块",
      "children":[
        {
          "id": "00019",
          "parentId": "00001",
          "parentName": null,
          "name": "角色管理",
          "url": "role",
          "order": 5,
          "icon": null,
          "type": 2,
          "typeName": "菜单",
          "children": []
        },
      ],
    },
  ],
}

const state = {        //分开管理两个路由组
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {     //进行写入，将根据routes数组动态渲染
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {     
  getRightsList({rootState}){         //roonState用来取其他store模块的state（user）
    return new Promise(resolve => {
      mySort(rootState.user.RightsList)
      resolve(rootState.user.RightsList)
  })
},


  generateRoutes({ commit }, roles) {   //将这里进行权限请求获取；并筛选生成
    return new Promise(resolve => {
      var accessedRoutes = {}
      store.dispatch('permission/getRightsList').then(res => {
        var asyncData = deepClone(asyncRoutes)                       // 防止污染原路由path列表
        accessedRoutes = filterAsyncRoutes(res,asyncData)            // 进行路由匹配筛选和渲染配置
        accessedRoutes.push( { path: '*', redirect: '/404', hidden: true })     //404必须放最后。
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    })
  }
}


function mySort(data) {                 //递归对每个childen排序
  isSort(data)
  data.forEach(ele => {
    if(ele.children && ele.children.length){
      mySort(ele.children)
    }
  })
}
function isSort(arr){ 
  arr.sort((a, b) => {
    return a.Sort - b.Sort
  })
}


function deepClone(obj) {                  //深度克隆
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key]!==null) {
        result[key] = deepClone(obj[key]); //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

function filterAsyncRoutes(data,asyncData,fartherPaths,flag){         //根据数据筛选查找需要挂载的路由
  if(!data || !data.length || !asyncData || !asyncData.length){
      return []
  }
  var routes = [];
  data.forEach(item =>{
      //初始化预组成路由对象（针对父级）
      var comPath = '' 
      var obj = {}            
      obj.meta = {}
      obj.meta.title = item.name
      obj.meta.icon = item.icon
      obj.alwaysShow = true
      obj.children = []
      obj.component = Layout                            
      obj.path = '/' + item.url.split('/').join('')      
       
      obj.name = item.url.split('/').join('')   
      if(flag){                                     //针对第二层级之后做特殊处理
        obj.component = myViews                     //第二层开始不再使用layout，而是一个空的view,营造试图没有嵌套的假象;
        obj.path = item.url.split('/').join('')     //第二层开始path前面不要有斜杠
      }
      // 初始化完毕，开始查找真实路由对应赋值
      if(item.children && item.children.length){        //是父级并且不为空则递归 ---- 同时给所有父级菜单设置redirect
        comPath = fartherPaths ? `${fartherPaths}/${obj.path}` : obj.path;       //向下传递当前path，合并父级，自身，子级path作为redirect 
        obj.redirect = `${comPath}/${item.children[0].url}`                       //因为面包屑是push的方式进行跳转，所以需要从根目录开始写
        obj.children = filterAsyncRoutes(item.children,asyncData,comPath,true)
      }else{     //children为空      
        asyncData.forEach(ele =>{                     //查找真实路由，真实路由放弃如上初始化，只需要修改自定义的title跟icon即可。
          if(item.url == ele.path){
           // console.log(item.url, ele.path,    666)
            obj = ele
            obj.meta.title = item.name  
            obj.meta.icon = item.icon
          }
        })
      }
      routes.push(obj)
  })
  return routes
}

export default {
  namespaced: true,     //命名空间隔离
  state,
  mutations,
  actions
}
