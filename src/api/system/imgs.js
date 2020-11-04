import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'

/**
 * 上传图片
 */
export function uploadImg(data) {
    return request({
        url: ApiUrl.uploadImgs,
        method: 'post',
        data
      })
}

/**
 *  获取图片文件
 */
export function getImgs(data) {
    return request({
        url: ApiUrl.searchImgs,
        method: 'get',
        params: data
      })
}

/**
 * 移动图片至分组
 */
export function mvImgs(data) {
    return request({
        url: ApiUrl.mvImgs,
        method: 'put',
        data
      })
}

/**
 * 删除图片
 */
export function delImgs(data) {
    return request({
        url: ApiUrl.delImgs,
        method: 'delete',
        data
      })
}

/**
 *  获取图片分组
 */
export function getGroupText(data) {
  return request({
    url: ApiUrl.getImgsGroup,
    method: 'get',
    data
  })
}

/**
 *  更新分组
 */
export function updateGroupText(data) {
    return request({
        url: ApiUrl.updateImgsGroup,
        method: 'put',
        data
      })
}

/**
 * 增加分组
 */
export function addGroupText(data) {
  return request({
    url: ApiUrl.addImgsGroup,
    method: 'post',
    data
  })
}

/**
 * 删除分组
 */
export function delGroupText(data) {
  return request({
    url: ApiUrl.delImgsGroup,
    method: 'DELETE',
    data
  })
}
