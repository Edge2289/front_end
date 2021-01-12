import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'

/**
 * 獲取文章
 */
export function getArticleList(data) {
  return request({
    url: ApiUrl.getArticleApi,
    method: 'get',
    params: data
  })
}
/**
 * 更新文章
 */
export function updateArticle(data) {
  return request({
    url: ApiUrl.updateArticleApi,
    method: 'put',
    data
  })
}
/**
 * 新增文章
 */
export function addArticle(data) {
  return request({
    url: ApiUrl.addArticleApi,
    method: 'post',
    data
  })
}
/**
 * 刪除文章
 */
export function delArticle(data) {
  return request({
    url: ApiUrl.delArticleApi,
    method: 'delete',
    data
  })
}

/**
 * 获取标签
 */
export function getLabel(data) {
  return request({
    url: ApiUrl.getLabel,
    method: 'get',
    params: data
  })
}

/**
 * 新增标签
 */
export function addLabel(data) {
  return request({
    url: ApiUrl.getLabel,
    method: 'post',
    data
  })
}

/**
 * 修改
 * 标签
 */
export function putLabel(data) {
  return request({
    url: ApiUrl.getLabel,
    method: 'put',
    data
  })
}

/**
 * 删除标签
 */
export function delLabel(data) {
  return request({
    url: ApiUrl.getLabel,
    method: 'delete',
    data
  })
}

