import request from '@/utils/myRequest'
import store from "@/store/index"
import { getUserMessage } from '@/utils/auth.js'




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
  
  
  