import request from '@/utils/myRequest'
import store from "@/store"



//用户管理页面list
export function adminList(data) {
    return request({
      url: '/admin/list',
      method: 'post',
      data:data
    })
}

//所属单位
export function selectList() {
    return request({
      url: '/admin/select/list',
      method: 'post',
    })
}


//重置密码
export function resetPsw(data) {
    return request({
      url: `/admin/list/password/reset/${data.userNo}`,
      method: 'post',
    })
}

//封停
export function limit(data) {
    return request({
      url: `/admin/list/status/${data.userNo}`,
      method: 'post',
    })
}

//查看
export function detail(data) {
    return request({
      url: `/admin/list/info/${data.userNo}`,
      method: 'post',
    })
}


export function inforLogs(data) {
    return request({
      url: `/admin/info/logs`,
      method: 'post',
      data:data
    })
}



//添加角色
export function adminAdd(data) {
  return request({
    url: `/admin/add`,
    method: 'post',
    data:data
  })
}




export function selectAdd(data) {
  return request({
    url: `/admin/select/add`,
    method: 'post',
    data:data
  })
}