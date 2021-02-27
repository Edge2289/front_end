<template>
  <el-form>
    <el-form-item label="输入当前密码">
      <el-input v-model.trim="user.olg_pwd" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="user.new_pwd" />
    </el-form-item>
    <el-form-item label="确认密码">
      <el-input v-model.trim="user.secondary_pwd" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          olg_pwd: '',
          new_pwd: '',
          secondary_pwd: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
