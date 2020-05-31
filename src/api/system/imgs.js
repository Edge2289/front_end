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
 *  获取分组
 */
export function getImgsGroup() {

    return request({
        url: ApiUrl.getImgsGroup,
        method: 'post',
        data
    })
}
/**
 *  更新分组
 */
export function updateImgsGroup(data) {

    return request({
        url: ApiUrl.updateImgsGroup,
        method: 'post',
        data
    })
}

/**
 * 增加分组
 */
export function addImgsGroup(data) {

    return request({
        url: ApiUrl.addImgsGroup,
        method: 'post',
        data
    })
}

/**
 * 删除分组
 */
export function delImgsGroup(data) {

    return request({
        url: ApiUrl.delImgsGroup,
        method: 'post',
        data
    })
}
