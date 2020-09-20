import { logout, getInfo } from '@/api/user'
import { login } from '@/api/common/login'
import { getToken, setToken, removeToken, setUserData } from '@/utils/auth'
import { encrypt, decrypt } from '@/common/encryption/crypto.js'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, uuid, code } = userInfo
    return new Promise((resolve, reject) => {
      
      let data = {
        "LoginName" : 1,
        "Name" : 1,
      }

      login({
        user_name: username.trim(),
        pwd: password,
        code: code,
        uuid: uuid
      }).then(response => {
        const { data } = response
        console.log("data", data)
        /**
         * 存储一些加密数据
         * 菜单数据
         * 用户数据
         */
        setUserData(data)
        setToken("asdasd")
        commit('SET_ROLES', ['admin'])
        commit('SET_NAME', data.LoginName)
        commit('SET_AVATAR', data.Name)
        commit('SET_INTRODUCTION', data.LoginName)

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve) => {
      data = sessionStorage.getItem('user_data')
      // data = decrypt(sessionStorage.getItem("user_data"))
      console.log('data', data)
      console.log(JSON.parse(data))

      // 这些是系统需要用的数据
      commit('SET_ROLES', ['admin'])
      commit('SET_NAME', data.LoginName)
      commit('SET_AVATAR', data.Name)
      commit('SET_INTRODUCTION', data.LoginName)
      resolve(data)
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
