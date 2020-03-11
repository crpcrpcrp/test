import request from '@/utils/myRequest'
import store from "@/store"



//广告管理页面list
export function webPageList(data) {
    return request({
      url: '/hFivePage/list',
      method: 'post',
      data:data
    })
}

//生效失效

export function invalid(data) {
    return request({
      url: '/hFivePage/invalid',
      method: 'post',
      data:data
    })
}


//下啦
export function getContentType(data) {
    return request({
      url: '/hFivePage/getContentType',
      method: 'post',
      data:data
    })
}


//添加
export function addWeb(data) {
    return request({
      url: '/hFivePage/add',
      method: 'post',
      data:data
    })
}


//生效
export function valid(data) {
    return request({
      url: '/hFivePage/valid',
      method: 'post',
      data:data
    })
}

//失效
export function isinvalid(data) {
    return request({
      url: '/hFivePage/invalid',
      method: 'post',
      data:data
    })
}

//修改
export function update(data) {
    return request({
      url: '/hFivePage/update',
      method: 'post',
      data:data
    })
}

//日志
export function logsByFiveId(data) {
    return request({
      url: '/hFivePage/logsByFiveId',
      method: 'post',
      data:data
    })
}


export function uploadPicture(data) {
  return request({
    url: '/hFivePage/uploadPicture',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
     },
    data:data
  })
}