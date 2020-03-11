import ajax from '@/utils/myRequest';
import { context } from "@/config/context";


// 获取员工审核列表
export const getVirusList = async (data = {}) => {
    return await ajax.post(`${context}/virus/list`, data)
}
// 获取员工详情
export const getVirusInfo = async (id) => {
    return await ajax.post(`${context}/virus/info/${id}`);
}
// 审核 1-通过，-1-驳回
export const virusResult = async (data) => {
    return await ajax.post(`${context}/virus/result`, data)
}

// 获取二维码
export const getVirusQrCode = async () => {
    return await ajax.post(`${context}/virus/qrCode`);
}

// 获取审核状态下拉
export const getVirusListSelect = async () => {
    return await ajax.post(`${context}/virus/list/select`);
}

// 获取用户审核状态
export const getEmployeeAuthCheck = async () => {
    return await ajax.post(`${context}/employee/authCheck`);
}


