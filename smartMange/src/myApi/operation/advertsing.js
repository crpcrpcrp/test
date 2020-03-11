import request from '@/utils/myRequest'
import store from "@/store"



//广告管理页面list
export function advertList(data) {
    return request({
      url: '/advert/list',
      method: 'post',
      data:data
    })
}



//广告管理页面下啦
export function selectList() {
    return request({
      url: '/advert/list/select',
      method: 'post',
    })
}


//生效失效的切换
export function advertStatus(data) {
    return request({
      url: '/advert/status',
      method: 'post',
      data:data
    })
}

//详情
export function detail(data) {
    return request({
      url: `/advert/info/${data.id}`,
      method: 'post',
    })
}


//操作详情
export function inforLogs(data) {
    return request({
      url: `/advert/info/log`,
      method: 'post',
      data:data
    })
}


//更新的下啦
export function updataSelect(data) {
  return request({
    url: `/advert/add/select/web`,
    method: 'post',
    data:data
  })
}



//编辑 -- 进来时间就用这个详情下啦
export function infoSelect(data) {
  return request({
    url: `/advert/info/select`,
    method: 'post',
  })
}


//更新
export function advertAdd(data) {
  return request({
    url: `/advert/add`,
    method: 'post',
    data:data
  })
}


//更新时需要的接口
export function updateInfo(data) {
  return request({
    url: `/advert/update/info/${data.id}`,
    method: 'post',
  })
}



export function advertUpdate(data) {
  return request({
    url: `/advert/update`,
    method: 'post',
    data:data
  })
}



//状态
export function cahangeAdvertStatus(data) {
  return request({
    url: `/advert/status`,
    method: 'post',
    data:data
  })
}

//上传图片
export function up(data){
  return request({
    url:'/picture/upload/advert',
    method:'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
     },
     data:data
  })
}


