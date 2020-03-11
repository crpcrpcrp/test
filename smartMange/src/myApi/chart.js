import request from '@/utils/myRequest'
import store from "@/store/index"
// 按日期获取 诊室数据
export function GetDateRooms(params) {
    return request({
      url: '/app/v1/count/roomsclientsnum',
      method: 'get',
      params
    })
}

// 按日期获取 每天 的 每个诊室数据
export function GetDaysCount(params) {
  return request({
    url: '/app/v1/count/clientsnum',
    method: 'get',
    params
  })
}