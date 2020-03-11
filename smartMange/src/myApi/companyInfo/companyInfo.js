


import ajax from '@/utils/myRequest';
import { context } from "@/config/context";


// 获取员工审核列表
export const getReworkList = async (data = {}) => {
  return await ajax.post(`${context}/organizationInfo/list`, data)
}

// 获取员工详情
export const getVirusInfo = async (id) => {
  return await ajax.post(`${context}/virus/info/${id}`);
}

// 审核 1-通过，-1-驳回
export const reworkAudit = async (data) => {
  return await ajax.post(`${context}/organizationInfo/audit`, data)
}

// 获取二维码
export const getAuthType = async () => {
  return await ajax.post(`${context}/organizationInfo/getAuthType`);
}

