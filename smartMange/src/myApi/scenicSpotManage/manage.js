import request from '@/utils/myRequest'
import store from "@/store/index"

///scenes/getAdministrationsSelect

//获取管理处名称下拉框x
export function getManagePoint() {
    return request({
      url: '/scene/getOrganizationSelect',
      method: 'post'
    })
}


//获取景区名称
export function getScenesName() {
    return request({
      url: '/scene/getScenesSelect',
      method: 'post',
    })
}


//获取景区列表的list
export function getScenicList(data) {
  return request({
    url: '/scene/list',
    method: 'post',
    data:data
  })
}


//add景区
export function addScenic(data) {
  return request({
    url: '/scene/add',
    method: 'post',
    data:data
  })
}

//修改景区
export function editorScenic(data) {
  return request({
    url: `/scene/update`,
    method: 'post',
    data:data
  })
}

//删除景区
export function deleteScenic(data) {
  return request({
    url:'/scene/delete',
    method: 'post',
    data:data
  })
}

//景区操作记录
export function getOperateHistory(data) {
  return request({
    url:'/scene/logsBySceneId',
    method: 'post',
    data:data
  })
}


//景点列表
export function attractionsList(data) {
  return request({
    url:'/attractions/list',
    method: 'post',
    data:data
  })
}


//add景点
export function addAttraction(data) {
  return request({
    url:'/attractions/add',
    method: 'post',
    data:data
  })
}


//景点删除  /scenes/deleteAttraction
export function deleteAttraction(data) {
  return request({
    url:'/attractions/delete',
    method: 'post',
    data:data
  })
}

//更新景点
export function updateAttraction(data) {
  return request({
    url:'/attractions/update',
    method: 'post',
    data:data
  })
}


//删除照片
export function deletePicture(id) {
  return request({
    url:`/scenes/deletePicture?id=${id}`,
    method: 'post',
  })
}


//景点detail
export function getAttractionDetail(params) {
  return request({
    url:`/scenes/getAttractionDetail`,
    method: 'get',
    params
  })
}


//景点操作记录
export function getAttractionOperateHistory(data) {
  return request({
    url:`/attractions/logsByAttractionsId  `,
    method: 'post',
    data:data
  })
}

//上传图片
export function uploadPicture(data) {
  return request({
    url:`/attractions/uploadPicture`,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
     },
    data:data
  })
}