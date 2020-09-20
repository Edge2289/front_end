<template>
  <el-dialog v-dialogDrag title="图片库" :visible.sync="dialogVisible" width="840px" :close-on-click-modal="false" :show-close="false">
    <el-container style="height: 450px; border: 1px solid #eee;border:none;line-height: 16px;">
      <el-aside class="img_menu" width="150px" style="font-size: 14px;padding: 0px;margin-top: 18px;background: white;">
        <div v-bind:class="{ img_menu_xuanzhong: searchSelectedGroup == -1 }" style="margin-left: 12px;cursor: pointer;" @click="selectGroup(-1)" :id="-1" @mouseover="changeActive($event)" @mouseout="removeActive($event)">全部图片</div>
        <div v-bind:class="{ img_menu_xuanzhong: searchSelectedGroup == 0 }" style="margin-left: 12px;cursor: pointer;" @click="selectGroup(0)" :id="0" @mouseover="changeActive($event)" @mouseout="removeActive($event)">未分组</div>
        <div v-bind:class="{ img_menu_xuanzhong: searchSelectedGroup == itemGroup.id }" style="cursor: pointer;" v-for="(itemGroup, indexGroup) in groupList" :id="itemGroup.id" @click="selectGroup(itemGroup.id)" :key="indexGroup" @mouseover="changeActive($event)" @mouseout="removeActive($event)">
          <a style="cursor: pointer;position: absolute;left: .6rem;" class="groupTextHidden" @click="editGroupText(itemGroup)">
            <i class="el-icon-edit" />
          </a>
          <span style="margin-left: 7px;">&nbsp;{{ itemGroup.name }}</span>
            <a style="float: right;cursor: pointer;" class="groupTextHidden" @click="delGroupText(itemGroup)">
              <i class="el-icon-delete" />
            </a>
        </div>
        <div style="margin-left: 12px;text-decoration: underline;" @click="newGroup()"><a>新增分组</a></div>
      </el-aside>

      <!-- 中间部分 -->
      <el-container>
        <el-header style="height: 36px; font-size: 12px">
          <el-row>
            <el-col :span="12">
              <el-dropdown trigger="click" @command="mvImgsGroup">
                <el-button type="primary" size="mini">
                  移动至
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item disabled>请选择分组</el-dropdown-item>
                  <el-dropdown-item :command="item.id" v-for="(item, key) in groupList" :id="item.id" :key="key">{{ item.name }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button type="danger" @click="delImgs" size="mini">删除</el-button>
            </el-col>
            <el-col :span="12" style="text-align: right;padding-right: 30px;">
              <el-upload class="upload-demo" :show-file-list="false" multiple :limit="3" action :http-request="httpRequest" :on-success="handleAvatarSuccess">
                <el-tooltip class="item" effect="dark" content="只能上传jpg/png文件，且不超过500kb" placement="top-start">
                  <el-button size="small">点击上传</el-button>
                </el-tooltip>
              </el-upload>
            </el-col>
          </el-row>
        </el-header>

        <el-main>
          <!-- one -->
          <div v-for="(imgItem, imgIndex) in imgList" v-on:click="clickImgs($event)" :key="imgIndex" :id="imgItem.id" :imgUrl="imgItem.url" class="block" style="width: 23%; padding: 2px;">
            <div class="img-paixun">
              <el-image :src="imgItem.url" style="width: 118px;height: 130px;" />
              <div class="demonstration" style="text-align: center;overflow:hidden;height: 16px;">{{ imgItem.name }}</div>
              <div class="select-mask">
                <img src="./img/chose.png" />
              </div>
            </div>
          </div>
        </el-main>
        <!-- 中间部分 -->
        <!-- 顶部的页码 -->
        <el-footer style="height: 40px;text-align: center;">
          <div class="block">
          <pagination
            style="margin-top: 20px"
            v-show="total>0"
            :total="total"
            small
            :page.sync="pageIndex"
            :limit.sync="pageSize"
            @pagination="getImgsList"
          />
        </div>
          <!-- 页码 -->
        </el-footer>
        <!-- 顶部的页码 -->
      </el-container>
    </el-container>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleMethod(0)">取 消</el-button>
      <el-button type="primary" @click="dialogVisibleMethod(1)">确 定</el-button>
    </span>

    <!-- 分组信息层 -->
    <el-dialog v-dialogDrag width="290px" :title="GroupTextTitle" :visible.sync="innerVisible" append-to-body>
      <el-input v-model="newEditGroupText" style="margin: 20px;width: 250px;" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="groupNewEdit()">确 定</el-button>
        <el-button @click="innerVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分组信息层 -->
  </el-dialog>
</template>

<script src="./c.js"></script>
<style scoped>
    @import './css.css';
</style>