import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { encrypt, decrypt } from '@/common/encryption/crypto.js'
import qs from 'qs';

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000000 // request timeout
})

const head = document.getElementsByTagName('head')
const meta = document.createElement('meta')
meta.name = 'referrer'
// 根据实际情况修改referrer的值，可选值参考上文
meta.content = 'origin'
head[0].appendChild(meta)

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }

    if (config.method != "get" && config.method != "delete") {
      config.data = qs.stringify(config.data);
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const code = response.data.code

    // 保存Token
    if (response.headers.authorization !== undefined) {
      const token = response.headers.authorization.substr(7)
      setToken(token)
    }
    if (code === 401) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 移除token
        removeToken()
        window.location.reload('/login');
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
      return false
    } else if (code === 400) {
      Message({
        message: response.data.msg,
        type: 'error',
        duration: 5 * 1000
      })
    } else if (code !== 200) {
      Notification.error({
        title: response.data.msg
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
