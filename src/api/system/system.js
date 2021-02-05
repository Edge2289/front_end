import request from '@/utils/request'
import { ApiUrl } from '../apiUrl/apiUrl'

/**
 *  获取站点配置
 */
export function getWebsiteConfig() {
  return request({
    url: ApiUrl.websiteConfig,
    method: 'get'
  })
}
/**
 *  保存站点配置
 */
export function saveWebsiteConfig(data) {
  return request({
    url: ApiUrl.websiteConfig,
    method: 'post',
    data
  })
}

/**
 *  获取任务列表
 */
export function getJobsList(data) {
  return request({
    url: ApiUrl.jobList,
    method: 'get',
    params: data
  })
}

/**
   *  更新任务数据
   */
export function updateJobsData(data) {
  return request({
    url: ApiUrl.jobList,
    method: 'put',
    data
  })
}

/**
   * 新增任务
   */
export function addJobsData(data) {
  return request({
    url: ApiUrl.jobList,
    method: 'post',
    data
  })
}

/**
   * 删除任务
   */
export function delJob(data) {
  return request({
    url: ApiUrl.jobList,
    method: 'DELETE',
    params: data
  })
}

/**
   * 获取任务日志
   */
export function getJobLogList(data) {
  return request({
    url: ApiUrl.jobLogList,
    method: 'get',
    params: data
  })
}

/**
   * 改变任务状态
   */
export function changeJobExecution(data) {
  return request({
    url: ApiUrl.changeExecution,
    method: 'post',
    data
  })
}
