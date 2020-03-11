import request from '@/utils/myRequest'

// 登录获取验证码
export function getCode(params) {
  return request({
    url: '/private/login/code',
    method: 'post',
    data:params
  })
}

// 登录
export function login(params) {
  return request({
    url: '/private/login',
    method: 'post',
    data: params
  })
}

// 注册
export function register(params) {
  return request({
    url: '/private/register',
    method: 'post',
    data: params
  })
}



