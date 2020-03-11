import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import myViews from '@/layout/components/AppMain'
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    name: 'login', 
    component: () => import('@/views/login/index'),
    // component: () => import('@/views/login/msgLogin'),
    hidden: true
  },
  {
    path: '/adminLogin',
    name: 'adminLogin', 
    component: () => import('@/views/login/index'),
    // component: () => import('@/views/login/msgLogin'),
    hidden: true
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/login/register'),
    hidden: true
  },
  {
    path: '/retrievePwd',          // 企业找回密码
    name: 'retrievePwd',
    component: () => import('@/views/login/retrievePwd'),
    hidden: true
  },
  {
    path: '/adminRetrievePwd',     // 园区管理员找回密码
    name: 'adminRetrievePwd',
    component: () => import('@/views/login/adminRetrievePwd'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',           //哪怕在多级目录。因为面包屑是push的方式进行跳转，所以redirect在动态生成的时候需要从根目录开始写
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',     //这整个路由列表的第一个name将作为首页匹配依据。命名不能改变,且父级不能有meta（detail see:Breadcrumb/index）
        component: () => import('@/views/dashboard/admin'),
        meta: { title: '首页', icon: 'example' }
      },
      {
        path: 'changePwd',
        name: 'changePwd',     //这整个路由列表的第一个name将作为首页匹配依据。命名不能改变,且父级不能有meta（detail see:Breadcrumb/index）
        component: () => import('@/views/user/changePwd'),
        meta: { title: '修改密码', icon: 'example' },
        hidden: true,
      },
    ]
  }
]

//用来根据权限动态挂载的路由（一维数组，无需嵌套,嵌套结构来自数据请求）
export const asyncRoutes = [

  // 业务模块部

  {
    path: 'userList',
    name: 'userList',
    component: () => import('@/views/user/userList'),
    meta: { title: '角色列表', icon: 'table' }
  },
  {
    path: 'permission',
    name: 'permission',
    component: () => import('@/views/powerMange/permission'),
    meta: { title: '权限管理', icon: 'table' }
  },
  {
    path: 'role',
    name: 'role',
    component: () => import('@/views/powerMange/roleList'),
    meta: { title: '角色管理', icon: 'table' }
  },
  {
    path: 'admin',
    name: 'admin',
    component: () => import('@/views/powerMange/admin'),
    meta: { title: '用户管理', icon: 'table' }
  },
  {
    path: 'permissionPage',
    name: 'permissionPage',
    component: () => import('@/views/permissionPage/permissionPage'),
    meta: { title: '认证信息', icon: 'table' }
  }, {
    path: 'companyInfo',
    name: 'companyInfo',
    component: () => import('@/views/companyInfo/companyInfo'),
    meta: { title: '企业信息', icon: 'table' }
  },
  {
    path: 'gobackApplication',
    name: 'gobackApplication',
    component: () => import('@/views/gobackApplication/gobackApplication'),
    meta: { title: '复工申请', icon: 'table' }
  },
  {
    path: 'companyReWork',
    name: 'companyReWork',
    component: () => import('@/views/companyReWork/companyReWork'),
    meta: { title: '复工申请', icon: 'table' }
  },
  {
    path: 'personnelPage',
    name: 'personnelPage',
    component: () => import('@/views/personnel/personnelPage'),
    meta: { title: '员工申请', icon: 'table' }
  },
  {
    path: 'livingView',
    name: 'livingView',
    component: () => import('@/views/livingInfo/livingView'),
    meta: { title: '员工申请', icon: 'table' }
  },
  {
    path: 'd2',
    name: 'd2',
    component: () => import('@/views/building/building'),
    meta: { title: '园区列表', icon: 'table' }
  },
  ///  gobackApplication
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
