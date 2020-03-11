import request from '@/utils/myRequest'
import store from "@/store"

///scenes/getAdministrationsSelect

//获取侧边栏的菜单
export function getAllMenu() {
    return request({
      url: '/menu/list',
      method: 'post'
    })
}





export function updateMenu(data) {
  return request({
    url: '/systemManagement/menu/update',
    method: 'post',
    data:data
  })
}
//修改一级菜单
export function updateFirst(data) {
  return request({
    url: '/menu/sys/update/first',
    method: 'post',
    data:data
  })
}





//删除一级菜单
export function deleteFirst(data) {
  return request({
    url: `/menu/sys/delete/first/${data.id}`,
    method: 'post'
  })
}

//添加一级菜单
export function addFirstMenu(data) {
  return request({
    url: '/menu/sys/add/first',
    method: 'post',
    data:data
  })
}






//添加二级菜单
export function addSecondMenu(data) {
  return request({
    url: '/menu/sys/add/second',
    method: 'post',
    data:data
  })
}


//修改二级菜单
export function updateSecond(data) {
  return request({
    url: '/menu/sys/update/second',
    method: 'post',
    data:data
  })
}



//删除二级菜单
export function deletesSecond(data) {
  return request({
    url: `/menu/sys/delete/second/${data.id}`,
    method: 'post'
  })
}