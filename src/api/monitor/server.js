import request from '@/utils/request'
import { ApiUrl } from '../apiUrl/apiUrl'

// 
export function getTallyData(data) {
  return request({
    url: ApiUrl.getTallyData, // 假地址 自行替换
    method: 'get',
    params: data
  })
}

export function getAnalysisData(data) {
  return request({
    url: ApiUrl.getAnalysisData, // 假地址 自行替换
    method: 'get',
    params: data
  })
}

export function getMonitorData(data) {
  return request({
    url: ApiUrl.getMonitorData, // 假地址 自行替换
    method: 'get',
    params: data
  })
}


