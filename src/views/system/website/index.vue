<template>
    <div style="padding: 20px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="站点配置" name="siteConfig">
              <!-- 站点配置 -->
              <el-table
                :data="siteConfigData"
                stripe
                style="width: 100%">
                <el-table-column
                  label="配置名字"
                  width="180">
                  <template slot-scope="scope">
                      <span>{{scope.row.date}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="配置键名"
                  width="180">
                  <template slot-scope="scope">
                      <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="配置键值">
                <template slot-scope="scope">
                    <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.address"></el-input>
                    <span v-show="!scope.row.show">{{scope.row.address}}</span>
                </template>
                </el-table-column>
                <el-table-column
                  label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="scope.row.show =true">编辑</el-button>
                        <el-button @click="saveConfig(scope.row)">保存</el-button> 
                        <!-- scope.row.show =false -->
                    </template>
                </el-table-column>
              </el-table>
              <!-- 站点配置 -->
            </el-tab-pane>
            <el-tab-pane label="博客配置" name="blogConfig">
              <!-- 博客配置 -->
              <el-table
                :data="blogConfigData"
                stripe
                style="width: 100%">
                <el-table-column
                  label="配置名字"
                  width="180">
                  <template slot-scope="scope">
                      <span>{{scope.row.date}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="配置键名"
                  width="180">
                  <template slot-scope="scope">
                      <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="配置键值">
                <template slot-scope="scope">
                    <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.address"></el-input>
                    <span v-show="!scope.row.show">{{scope.row.address}}</span>
                </template>
                </el-table-column>
                <el-table-column
                  label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="scope.row.show =true">编辑</el-button>
                        <el-button @click="saveConfig(scope.row)">保存</el-button> 
                        <!-- scope.row.show =false -->
                    </template>
                </el-table-column>
              </el-table>
              <!-- 博客配置 -->
            </el-tab-pane>
            <el-tab-pane label="爬虫管理" name="reptilesConfig">
              
              <!-- 爬虫管理 -->
              <el-table
                :data="reptilesConfigData"
                stripe
                style="width: 100%">
                <el-table-column
                  label="配置名字"
                  width="180">
                  <template slot-scope="scope">
                      <span>{{scope.row.date}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="配置键名"
                  width="180">
                  <template slot-scope="scope">
                      <span>{{scope.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="配置键值">
                <template slot-scope="scope">
                    <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.address"></el-input>
                    <span v-show="!scope.row.show">{{scope.row.address}}</span>
                </template>
                </el-table-column>
                <el-table-column
                  label="备注">
                <template slot-scope="scope">
                    <span>{{scope.row.address}}</span>
                </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="scope.row.show =true">编辑</el-button>
                        <el-button @click="saveConfig(scope.row)">保存</el-button> 
                        <!-- scope.row.show =false -->
                    </template>
                </el-table-column>
              </el-table>
              <!-- 爬虫管理 -->
              </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        activeName: 'siteConfig',
        // 站点配置
        siteConfigData: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          show:false
        }],
        // 博客配置
        blogConfigData: [{
          id: 3,
          date: '2016-05-02',
          name: '王小虎asdasd',
          address: 'asdasdas 1518 弄',
          show:false
        }],
        // 爬虫管理
        reptilesConfigData: [{
          id: 5,
          date: '2016-05-02',
          name: 'ddddd',
          address: 'sssss 1518 弄',
          show:false
        }]
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log("activeName", this.activeName)
        console.log(tab, event);
      },
      saveConfig(scope) {
        scope.show = false
        console.log("scope", scope);
      }
    }
  };
</script>
