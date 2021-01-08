<template>
  <el-main style="overflow: initial;">
    <div class="block" style="height:80%;width: 100%;">
      <!-- {{se lected}} -->
      <div style="height:30px;width:100%;margin: 0px;">
        <!-- 1*1布局 -->
        <el-row :gutter="10" type="flex" class="grid-one-contentheight" style="margin: 0px;" justify="center">
          <el-col :span="24">
            <h3 style="margin: 0px;">工作台</h3>
          </el-col>
        </el-row>
      </div>
      <div style="height:100px;width:100%;margin: 0px;">
        <!-- 1*1布局 -->
        <el-row :gutter="10" type="flex" class="grid-one-contentheight" style="margin: 0px;;" justify="center">
          <el-col :span="24">
            <div class="ant-page-header-content">
              <div class="ant-pro-page-container-detail">
                <div class="ant-pro-page-container-main">
                  <div class="ant-pro-page-container-row">
                    <div class="ant-pro-page-container-content">
                      <div class="antd-pro-pages-dashboard-workplace-style-pageHeaderContent">
                        <div class="antd-pro-pages-dashboard-workplace-style-avatar">
                          <span class="ant-avatar ant-avatar-lg ant-avatar-circle ant-avatar-image">
                            <img src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"></span>
                        </div>
                        <div class="antd-pro-pages-dashboard-workplace-style-content">
                          <div class="antd-pro-pages-dashboard-workplace-style-contentTitle">早安，Serati Ma，祝你开心每一天！</div>
                          <div>交互专家 |蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED</div>
                        </div>
                      </div>
                    </div>
                    <div class="ant-pro-page-container-extraContent">
                      <div class="antd-pro-pages-dashboard-workplace-style-extraContent">
                        <div class="antd-pro-pages-dashboard-workplace-style-statItem">
                          <div class="ant-statistic">
                            <div class="ant-statistic-title">项目数</div>
                            <div class="ant-statistic-content">
                              <span class="ant-statistic-content-value">
                                <span class="ant-statistic-content-value-int">56</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="antd-pro-pages-dashboard-workplace-style-statItem">
                          <div class="ant-statistic">
                            <div class="ant-statistic-title">团队内排名</div>
                            <div class="ant-statistic-content">
                              <span class="ant-statistic-content-value">
                                <span class="ant-statistic-content-value-int">8</span>
                              </span>
                              <span class="ant-statistic-content-suffix">/ 24</span></div></div></div><div class="antd-pro-pages-dashboard-workplace-style-statItem"><div class="ant-statistic"><div class="ant-statistic-title">项目访问</div><div class="ant-statistic-content"><span class="ant-statistic-content-value"><span class="ant-statistic-content-value-int">2,223</span></span></div></div></div></div></div></div></div></div></div>
          </el-col>
        </el-row>
      </div>
      <!-- 2*1布局 -->
      <div style="height:100%;width:100%">

        <el-row :gutter="10" type="flex" class="grid-one-contentheight" style="margin: 0px;" justify="center">
          <el-col :span="16" style="height: 360px;">
            <el-card class="box-card" style="width: 100%;margin: 0px;">
              <div slot="header" class="clearfix">
                <span>进行中的项目</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
              <div style="height: 240px;">

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;padding: 0px;">
                    鼠标悬浮时显示1q
                  </el-card>
                </el-col>

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;padding: 0px;">
                    鼠标悬浮时显示231
                  </el-card>
                </el-col>

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;padding: 0px;">
                    鼠标悬浮时显示asdasd
                  </el-card>
                </el-col>

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;">
                    鼠标悬浮时显示aaa
                  </el-card>
                </el-col>

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;">
                    鼠标悬浮时显示
                  </el-card>
                </el-col>

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;">
                    鼠标悬浮时显示
                  </el-card>
                </el-col>

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;">
                    鼠标悬浮时显示
                  </el-card>
                </el-col>

                <el-col :span="6">
                  <el-card shadow="hover" style="height: 120px;">
                    鼠标悬浮时显示
                  </el-card>
                </el-col>

              </div>
            </el-card>
            <br>
            <!-- asdasd -->
            <el-card class="box-card" style="width: 100%;margin: 0px;">
              <div slot="header" class="clearfix">
                <span>最近个人登录动态</span>
                <el-button style="float: right; padding: 3px 0" type="text">清空</el-button>
              </div>
              <div style="height: 240px;">
                <template>
                  <div>
                    <span>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</span>
                    <el-divider />
                    <span>少量的邪恶足以抵消全部高贵的品质, 害得人声名狼藉</span>
                  </div>
                </template>
              </div>
            </el-card>

            <!-- adsasdas a-->
          </el-col>
          <el-col :span="8">
            <el-card class="box-card" style="width: 100%">
              <div slot="header" class="clearfix">
                <span>快速开始 / 便捷导航</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
              <el-row :gutter="20">
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
                <el-col :span="6"><el-link>操作一</el-link></el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <!-- 2*1布局 -->
    </div>
  </el-main>
</template>

<style scoped>
    @import './aut.css';
</style>
<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
