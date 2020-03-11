import Cookies from 'js-cookie'

const TokenKey = 'token'
const userNameKey = 'userNameKey'
const tokenHeadKey = 'tokenHead'
const message = 'loginForm'

export function getToken() {
  return Cookies.get(TokenKey) 
  //return sessionStorage.setItem('token',token)   //设置一天过期，一天内免重复登陆！
}


export function setToken(token) {
  return Cookies.set(TokenKey, token,{ expires: 0.5 }) 
  //return sessionStorage.setItem('token',token)   //设置一天过期，一天内免重复登陆！
}





export function removeToken() {
  //  Cookies.remove(tokenHeadKey)
   Cookies.remove(TokenKey)
}




export function setUserName(userName) {
  return Cookies.set(userNameKey, userName,{ expires: 0.5 })   //设置一天过期，一天内免重复登陆！
}

export function getUserName() {
  return Cookies.get(userNameKey)
}

export function removeUserName() {
  return Cookies.remove(userNameKey)
}


export function setUserMessage(loginForm) {
  Cookies.set('username', loginForm.username, { expires: 7 })
  Cookies.set('password', loginForm.password, { expires: 7 })
}

export function removeUserMessage(loginForm) {
  Cookies.remove('username')
  Cookies.remove('password')
}

export function getUserMessage() {
  return {
    username:Cookies.get('username'),
    password:Cookies.get('password'),
    vercode:'0000',
  }
}

// 设置cookie 移除cookie 通用方法
export function setCookies(cookieObj) {
  Object.keys(cookieObj).forEach( item => {
    if(item && cookieObj[item]) Cookies.set(item, cookieObj[item], { expires: 7 });
  });
}

export function removeCookies(cookieObj) {
  if(cookieObj instanceof Array) {
    cookieObj.forEach(item=>{
      if(item) Cookies.remove(item);
    })
  } else {
    Object.keys(cookieObj).forEach( item => {
      if(item) Cookies.remove(item);
    });
  }
}

export function getCookieValue(name) {
  return Cookies.get(name) || '';
}