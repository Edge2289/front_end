import request from '@/utils/request'

export function getServer() {
  return request({
    url: '/api/blog/pub/system/configuration', // 假地址 自行替换
    method: 'get'
  })
}
