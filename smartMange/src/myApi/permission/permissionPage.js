import ajax from '@/utils/myRequest';
import { context } from "@/config/context";

export const getList = async (params) => {
    return await ajax.post(`${context}/organizationInfo/authCheck`, { ...params })
}


export const postList = async (params) => {
  return await ajax.post(`${context}/organizationInfo/auth`, { ...params })
}

export const changeUser = async (params) => {
  return await ajax.post(`${context}/organizationInfo/modifyEmployeeInfo`, { ...params })
}

export const uploadFile = async (params) => {
  return await ajax.post(`${context}/picture/upload/BUSINESS_LICENSE`, params)
}
export const selectList = async () => {
  return await ajax.post(`${context}/organizationInfo/getPark`)
}

export const selectLists = async (params) => {
  return await ajax.post(`${context}/organizationInfo/getApartment`,params)
}

