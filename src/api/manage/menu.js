import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'

/**
 * 获取角色请求接口
 */
export function getMenuList(data) {
  return request({
    url: ApiUrl.menuApi,
    method: 'get',
    params: data
  })
}

// 保存菜单
export function saveMenuData(data) {
    return request({
      url: ApiUrl.menuApi,
      method: 'post',
      data
    })
}
// 变更菜单
export function changeMenuData(data) {
    return request({
      url: ApiUrl.menuApi,
      method: 'put',
      data
    })
}

// 保存菜单
export function delMenuData(data) {
    return request({
      url: ApiUrl.menuApi,
      method: 'delete',
      params: data
    })
}
  