import request from '@/utils/myRequest'
import store from "@/store"


//页面的lsit
export function activityList(data) {
    return request({
      url: '/activity/list',
      method: 'post',
      data:data
    })
}

//活动列表的下拉
export function activitySelect() {
    return request({
      url: '/activity/list/select',
      method: 'post'
    })
}

//图片上传接口
export function uploadActivity(data) {
  return request({
    url: '/picture/upload/activity',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
     },
    data:data
  })
}


//添加的按钮
export function activityAdd(data) {
  return request({
    url: '/activity/add',
    method: 'post',
    data:data
  })
}
