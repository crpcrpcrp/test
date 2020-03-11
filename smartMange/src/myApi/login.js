import request from '@/utils/myRequest'
import store from "@/store/index"
import { getUserMessage } from '@/utils/auth.js'

// 登陆接口post传参
export function Login(ops) {
  return request({
    url: '/private/login',
    method: 'post',
    data: {
      telephone: ops.username,
      code: ops.password,
      type: ops.type,
    }
  })
}

//退出登陆
export function Logout() {
  return request({
    url: '/admin/user/sys/logout',
    method: 'post',
  })
}


export function GetUserInfo() {
  return request({
    url: '/admin/menu/sys/tree/data',
    method: 'post',
  })
}

//用户信息
export function infor(code) {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

/***********************    企业用户注册相关    ***************************/

// 获取企业所在园区
export function getParkList(data) {
  return request({
    url: '/admin/organizationInfo/getPark',
    method: 'post',
    data,
  })
}
// 获取企业所在楼号
export function getApartmentList(data) {
  return request({
    url: '/admin/organizationInfo/getApartment',
    method: 'post',
    data,
  })
}

// 企业下拉接口，根据园区id，单元楼id 查询企业下拉列表
export function getOrganizationList(data) {
  return request({
    url: '/admin/organizationInfo/list/apartment/floor',
    method: 'post',
    data,
  })
}
// 忘记密码
export function resetPwd(data) {
  return request({
    url: '/private/password/reset',
    method: 'post',
    data,
  })
}

