<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <!-- 变更用户名 -->
              <el-tab-pane label="修改登录名" name="修改登录名">
                <account :user="user" />
              </el-tab-pane>
              <!-- 修改密码 -->
              <el-tab-pane label="修改密码" name="修改密码">
                <UpdatePwd />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import UpdatePwd from './components/UpdatePwd'

export default {
  name: 'Profile',
  components: { UserCard, UpdatePwd, Account },
  data() {
    return {
      user: {},
      activeTab: '修改登录名'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    }
  }
}
</script>
