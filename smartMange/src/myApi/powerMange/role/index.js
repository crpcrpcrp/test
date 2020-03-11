import request from '@/utils/myRequest'
import store from "@/store/index"

///scenes/getAdministrationsSelect

//获取角色管理列表
export function getRoleList(data) {
    return request({
      url: '/role/list',
      method: 'post',
      data:data
    })
}


//所属单位列表
export function organizationList() {
  return request({
    url: '/role/select/list',
    method: 'post'
  })
}


//添加角色菜单列表
export function listMenu() {
  return request({
    url: '/role/add/list/menu',
    method: 'post'
  })
}


//添加角色
export function roleAdd(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data:data
  })
}


///
//查看
export function roleInfo(data) {
  return request({
    url:  `role/info/${data.id}`,
    method: 'post',
  })
}



//修改
export function updateRole(data) {
  return request({
    url:  `/role/update`,
    method: 'post',
    data:data
  })
}

//禁用开关
export function disable(data) {
  return request({
    url: `/role/disable/${data.id}`,
    method: 'post',
  })
}


//历史记录
export function getOperateHistory(data) {
  return request({
    url: `/role/info/logs`,
    method: 'post',
    data:data
  })
}




