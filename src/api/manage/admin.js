import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'
import { param } from '@/utils'

/**
 * 获取管理员请求接口
 */
export function getAdminList(data) {
    return request({
        url: ApiUrl.adminApi,
        method: 'get',
        params: data
    })
}

// 保存用户
export function saveAdminData(data) {
    return request({
        url: ApiUrl.adminApi,
        method: 'post',
        data
    })
}

// 变更用户
export function changeAdminData(data) {
    return request({
        url: ApiUrl.adminApi,
        method: 'put',
        data
    })
}

// 保存用户
export function delAdminData(data) {
    return request({
        url: ApiUrl.adminApi,
        method: 'delete',
        params: data
    })
}
