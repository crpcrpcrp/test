import request from '@/utils/myRequest'
import store from "@/store/index"


//获取用户列表
export function getUserList(data) {
    return request({
      url: '/user/list',
      method: 'post',
      data:data
    })
}


//获取用户详细信息
export function getUserDetail(data) {
  return request({
    url: `/user/info/${data.id}`,
    method: 'post',
  })
}


//
export function cancel(data) {
  return request({
    url: `/user/cancel/${data.id}`,
    method: 'post',
  })
}



//重置
export function resetPas(data) {
  return request({
    url: `/user/reset/${data.id}`,
    method: 'post',
  })
}

// 用户修改密码
export function modifyPwd(data) {
  return request({
    url: '/admin/admin/password/reset',
    method: 'post',
    data,
  })
}