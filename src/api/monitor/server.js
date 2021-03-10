import request from '@/utils/request'
import { ApiUrl } from '../apiUrl/apiUrl'


// 获取系统数据
export function getServer() {
  return request({
    url: '/api/blog/pub/system/configuration', // 假地址 自行替换
    method: 'get'
  })
}


// 获取流量数据
export function getTallyData(data) {
  return request({
    url: ApiUrl.getTallyData, // 假地址 自行替换
    method: 'get',
    params: data
  })
}

// 获取分析页
export function getAnalysisData(data) {
  return request({
    url: ApiUrl.getAnalysisData, // 假地址 自行替换
    method: 'get',
    params: data
  })
}

// 获取监控数据
export function getMonitorData(data) {
  return request({
    url: ApiUrl.getMonitorData, // 假地址 自行替换
    method: 'get',
    params: data
  })
}


