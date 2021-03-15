import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'

/**
 * 获取角色请求接口
 */
export function getRoleList(data) {
  return request({
    url: ApiUrl.roleApi,
    method: 'get',
    param: data
  })
}

// 保存角色
export function saveRoleData(data) {
    return request({
      url: ApiUrl.roleApi,
      method: 'post',
      data
    })
}

// 变更用户
export function changeRoleData(data) {
    return request({
      url: ApiUrl.roleApi,
      method: 'put',
      data
    })
}

// 保存用户
export function delRoleData(data) {
    return request({
      url: ApiUrl.roleApi,
      method: 'delete',
      data
    })
}
  