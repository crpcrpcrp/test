import request from '@/utils/myRequest'

// 文件上传
export function uploadFile(params) {
    return request({
      url: '/admin/organizationResumeWorkInfo/resumeWorkFileUpload',
      method: 'post',
      headers: { 'content-type': 'multipart/form-data' },
      data: params
    })
}

// 企业复工申请
export function resumeWorkApply(params) {
  return request({
    url: '/admin/organizationResumeWorkInfo/resumeWorkApply',
    method: 'post',
    data: params
  })
}

// 企业认证情况
export function authCheck(params) {
  return request({
    url: '/admin/organizationInfo/authCheck',
    method: 'post',
    params
  })
}

// 企业复工申请审核情况
export function applyCheck(params) {
  return request({
    url: '/admin/organizationResumeWorkInfo/applyCheck',
    method: 'post',
    params
  })
}


