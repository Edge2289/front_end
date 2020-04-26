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
  return Cookies.remove(TokenKey)
}

/**
 * 保存用户信息
 * 加密的
 */
export function setUserData(data) {
  sessionStorage.setItem('user_data', JSON.stringify(data))
  sessionStorage.setItem('menu_data', encrypt(JSON.stringify(data['menu_data'])))
  sessionStorage.setItem('role_data', encrypt(JSON.stringify(data['role_data'])))
}
