<template>
  <div style="padding: 20px">
    <el-tabs v-model="activeName" v-loading="loading" @tab-click="handleClick">
      <el-tab-pane label="站点配置" name="siteConfig">
        <!-- 站点配置 -->
        <el-table :data="siteConfigData" stripe style="width: 100%">
          <el-table-column label="配置名字" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="配置键名" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.identify }}</span>
            </template>
          </el-table-column>

          <el-table-column label="配置键值">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.show"
                v-model="scope.row.value"
                placeholder="请输入键值"
              />
              <span
                v-if="!scope.row.show"
              >{{ scope.row.value }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.show"
                v-model="scope.row.note"
                placeholder="请输入备注"
              />
              <span v-if="!scope.row.show">{{ scope.row.note }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="changeConfig(scope.row)">编辑</el-button>
              <el-button @click="saveConfig(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 站点配置 -->
      </el-tab-pane>
      <el-tab-pane label="博客配置" name="blogConfig">
        <!-- 博客配置 -->
        <el-table :data="blogConfigData" stripe style="width: 100%">
          <el-table-column label="配置名字" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="配置键名" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.identify }}</span>
            </template>
          </el-table-column>

          <el-table-column label="配置键值">
            <template slot-scope="scope">
              <el-input
                v-show="scope.row.show"
                v-model="scope.row.value"
                placeholder="请输入键值"
              />
              <span
                v-show="!scope.row.show"
              >{{ scope.row.value }} </span>
            </template>
          </el-table-column>

          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input
                v-show="scope.row.show"
                v-model="scope.row.note"
                placeholder="请输入备注"
              />
              <span v-show="!scope.row.show">{{ scope.row.note }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="changeConfig(scope.row)">编辑</el-button>
              <el-button @click="saveConfig(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 博客配置 -->
      </el-tab-pane>
      <el-tab-pane label="爬虫管理" name="reptilesConfig">
        <!-- 爬虫管理 -->
        <el-table :data="reptilesConfigData" stripe style="width: 100%">
          <el-table-column label="配置名字" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="配置键名" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.identify }}</span>
            </template>
          </el-table-column>

          <el-table-column label="配置键值">
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.show"
                v-model="scope.row.value"
                placeholder="请输入键值"
              />
              <span v-if="!scope.row.show">{{ scope.row.value }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-input
                v-show="scope.row.show"
                v-model="scope.row.note"
                placeholder="请输入备注"
              />
              <span v-show="!scope.row.show">{{ scope.row.note }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="scope.row.show = scope.row.show == true ? false : true"
              >编辑</el-button>
              <el-button @click="saveConfig(scope.row)">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 爬虫管理 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getWebsiteConfig, saveWebsiteConfig } from '@/api/system/system'
export default {
  data() {
    return {
      activeName: 'siteConfig',
      loading: true,
      // 站点配置
      siteConfigData: [],
      // 博客配置
      blogConfigData: [],
      // 爬虫管理
      reptilesConfigData: []
    }
  },
  created() {
    this.getWebsiteConfig()
  },
  methods: {
    getWebsiteConfig() {
      getWebsiteConfig().then((response) => {
        this.loading = false
        // 配置
        const blogConfigData = []
        const siteConfigData = []
        const reptilesConfigData = []
        response.data.forEach((item, index) => {
          item.show = false
          switch (item.type) {
            case 1:
              // 博客配置
              blogConfigData[blogConfigData.length] = item
              break
            case 2:
              // 站点配置
              siteConfigData[siteConfigData.length] = item
              break
            case 3:
              // 爬虫管理
              reptilesConfigData[reptilesConfigData.length] = item
              break
          }
        })

        this.siteConfigData = siteConfigData
        this.blogConfigData = blogConfigData
        this.reptilesConfigData = reptilesConfigData
        // console.log(this.blogConfigData)
      })
    },
    handleClick(tab, event) {
      // console.log("activeName", this.activeName);
      // console.log(tab, event);
    },
    saveConfig(scope) {
      if (scope.value == '' || scope.note == '') {
        this.msgError('请输入完整信息')
        return
      }
      scope.show = false
      saveWebsiteConfig({
        'id': scope.id,
        'value': scope.value,
        'note': scope.note
      }).then((response) => {
        if (response.code == 200) {
          this.open = false
          this.msgSuccess(response.msg)
        } else {
          this.msgError(response.msg)
        }
        this.getWebsiteConfig()
      })
    },
    changeConfig(scope) {
      scope.show = (scope.show != true)
    }
  }
}
</script>
