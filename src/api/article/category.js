import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'

/**
 * 獲取文章
 */
export function getCategory(data) {
  return request({
    url: ApiUrl.getCate,
    method: 'get',
    params: data
  })
}
/**
 * 更新文章
 */
export function putCategory(data) {
  return request({
    url: ApiUrl.updateCate,
    method: 'put',
    data
  })
}
/**
 * 新增文章
 */
export function addCategory(data) {
  return request({
    url: ApiUrl.addCate,
    method: 'post',
    data
  })
}
/**
 * 刪除文章
 */
export function delCategory(data) {
  return request({
    url: ApiUrl.delCate,
    method: 'delete',
    data
  })
}
