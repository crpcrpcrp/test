import request from '@/utils/myRequest'
import store from "@/store"
//页面的lsit
export function parkList(data) {
    return request({
      url: '/admin/park/list',
      method: 'post',
      data:data
    })
}



export function parkAdd(data) {
    return request({
      url: '/admin/park/add',
      method: 'post',
      data:data
    })
}


export function parkModify(data) {
  return request({
    url: '/admin/park/modify',
    method: 'post',
    data:data
  })
}

//地址需要改变
export function uploadFile(data) {
  return request({
    url: '/admin/excel/upload/park',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
     },
    data:data
  })
}


export function downLoadExcel(data) {
  return request({
    url: '/admin/excel/park',
    method: 'post',
    responseType:"blob",
    data:data
  })
}



export function downLoadDefault() {
  return request({
    url: '/admin/park/getParkImportTemplate',
    method: 'post'
  })
}


export function resetPassword(data) {
  return request({
    url: '/admin/park/resetPassword',
    method: 'post',
    data:data
  })
}



export function defaultPassword() {
  return request({
    url: '/admin/park/defaultPassword',
    method: 'post',
  })
}