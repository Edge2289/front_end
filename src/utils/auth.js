import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/common/encryption/crypto.js'

const TokenKey = 'authToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  sessionStorage.setItem(TokenKey, token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  sessionStorage.removeItem('r')
  sessionStorage.removeItem('m')
  sessionStorage.removeItem('r')
  return Cookies.remove(TokenKey)
}

/**
 * 保存用户信息
 * 加密的
 */
export function setUserData(data) {
  sessionStorage.setItem('u', encrypt(JSON.stringify(data)))
  sessionStorage.setItem('m', encrypt(JSON.stringify(data['menu'])))
  sessionStorage.setItem('r', encrypt(JSON.stringify(data['role'])))
}


/**
 * 获取用户信息
 */
export function getUserData() {
  return JSON.parse(decrypt(sessionStorage.getItem('u')))
}
