import request from '@/utils/request'
import { ApiUrl } from '@/api/apiUrl/apiUrl'

// 保存友情链接
export function saveLink(data) {
    return request({
        url: ApiUrl.blogLink,
        method: 'post',
        data
    })
}

/**
 *  获取友情链接
 */
export function getLinks() {
    return request({
        url: ApiUrl.blogLink,
        method: 'get',
    })
}

/**
 * 更新链接
 */
export function putLink(data) {
    return request({
        url: ApiUrl.blogLink,
        method: 'put',
        data: data
    })
}

/**
 * 删除友情链接
 */
export function delLink(data) {
    return request({
        url: ApiUrl.blogLink,
        method: 'delete',
        params: data
    })
}



//  ----------------------- banner ------------------------
/**
 * banner
 */
export function saveBanner(data) {
    return request({
        url: ApiUrl.blogBanner,
        method: 'post',
        data
    })
}

/**
 *  获取banner
 */
export function getBanners() {
    return request({
        url: ApiUrl.blogBanner,
        method: 'get',
    })
}

/**
 * 更新banner
 */
export function putBanner(data) {
    return request({
        url: ApiUrl.blogBanner,
        method: 'put',
        data: data
    })
}

/**
 * 删除banner
 */
export function delBanner(data) {
    return request({
        url: ApiUrl.blogBanner,
        method: 'delete',
        params: data
    })
}

//  ----------------------- banner ------------------------