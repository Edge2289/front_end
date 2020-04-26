import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'

/**
 * 获取验证码
 */
export function getCodeImg() {
  return request({
    url: ApiUrl.getCodeImg
  })
}

export function login(data) {
  return request({
    url: ApiUrl.login,
    method: 'post',
    data
  })
}
