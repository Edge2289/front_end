<template>
  <div class="app-container">
    <el-row>
      <el-col v-for="(item,index) in serverData" :key="index" :span="12" class="card-box">
        <el-card style="margin: 10px;">
          <div slot="header">
            <span>{{ item.title }}</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf"><div class="cell">属性</div></th>
                  <th class="is-leaf"><div class="cell">值</div></th>
                </tr>
              </thead>
              <tbody>

                <tr v-for="(item1, index1) in item.list" :key="index1">
                  <td><div class="cell">{{ item1.name }}</div></td>
                  <td><div class="cell">{{ item1.value }}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { getServer } from '@/api/monitor/server'
export default {
  name: 'Server',
  data() {
    return {
      // 加载层信息
      loading: [],
      // 服务器信息
      server: [],
      serverData: [
        { 'title': '服务器信息', 'list': [
          { 'name': '服务器架构', 'value': 'golang-vue' },
          { 'name': '操作系统', 'value': 'Linux' },
          { 'name': '核心数', 'value': '3' }
        ] },
        { 'title': '内存', 'list': [
          { 'name': '总内存', 'value': '5M' },
          { 'name': '已用内存', 'value': '2M' },
          { 'name': '使用率', 'value': '30%' }
        ] },
        { 'title': 'go 运行环境', 'list': [
          { 'name': 'go version', 'value': 'V1.10' },
          { 'name': 'Goroutine', 'value': '20' }
        ] },
        { 'title': '磁盘状态', 'list': [
          { 'name': '总共', 'value': '99' },
          { 'name': '可用', 'value': '80' }
        ] }
      ]
    }
  },
  created() {
    this.getList()
    // this.openLoading()
  },
  methods: {
    /** 查询服务器信息 */
    getList() {
    //   getServer().then(response => {
    //     this.server = response
    //     this.loading.close()
    //   })
    },
    // 打开加载层
    openLoading() {
    //   this.loading = this.$loading({
    //     lock: true,
    //     text: '拼命读取中',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    }
  }
}
</script>
