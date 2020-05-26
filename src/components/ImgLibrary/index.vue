<template>
<el-dialog
  v-dialogDrag
  title="图片库"
  :visible.sync="dialogVisible"
  width="840px"
  :close-on-click-modal	= "false"
  :show-close = false>

<el-container style="height: 450px; border: 1px solid #eee;border:none">
  <el-aside class="img_menu" width="150px" style="font-size: 14px;padding: 0px;margin-top: 18px;background: white;">
    <div class="img_menu_xuanzhong">
      全部图片
    </div>
    <div v-on:mouseover="changeActive($event)" v-on:mouseout="removeActive($event)">
      未分组
    </div>
    <div v-for="(item, index) in groupList" :key="index">
        <span style="cursor: pointer;" @click="editGroupText(item)">
            <i class="el-icon-edit"></i>
        </span>
        <span>
            &nbsp;{{item.name}}
        </span>
        <span style="float: right;cursor: pointer;" @click="delGroupText(item)">
            <i class="el-icon-delete"></i>
        </span>
        </div>
    <div @click="newGroup()">新增分组</div>
  </el-aside>
  
  <!-- 中间部分 -->
  <el-container>
    <el-header style="height: 36px; font-size: 12px">
      <el-row>
        <el-col :span="12">
          <el-dropdown trigger="click">
            <el-button type="primary" size="mini" >
              移动至<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>请选择分组</el-dropdown-item>
              <el-dropdown-item>黄金糕</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        <el-button type="danger" size="mini">删除</el-button>
        </el-col>
        <el-col :span="12" style="text-align: right;padding-right: 30px;">
           <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :show-file-list	= false
                multiple
                :limit="3">
                <el-tooltip class="item" effect="dark" content="只能上传jpg/png文件，且不超过500kb" placement="top-start">
                    <el-button size="small">点击上传</el-button>
                </el-tooltip>
                </el-upload>
        </el-col>
      </el-row>
    </el-header>
    
    <el-main>
  <div class="block" style="width: 24%; padding: 2px;">
    <div class="img-paixun">
      <el-image :src="src" style="width: 130px;height: 130px;"></el-image>
    <div class="demonstration" style="text-align: center;overflow:hidden;height: 16px;">saaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
    </div>
  </div>
  <div class="block" style="width: 24%; padding: 2px;">
    <div class="img-paixun">
      <el-image :src="src" style="width: 130px;height: 130px;"></el-image>
    <div class="demonstration" style="text-align: center;">默认</div>
    </div>
  </div>
    </el-main>
<!-- 中间部分 -->
    <!-- 顶部的页码 -->
    <el-footer style="height: 40px;text-align: center;">
      <div style="margin: 5px; ">

        <div style="width: 32px; height: 26px;border: 1px red solid;border-radius: 5px;
      border: 1px solid #462e2e;float: right;
      margin-left: 20px;    margin-right: 30px;">
          <i class="el-icon-d-arrow-right" style="padding: 5px;"></i>
        </div>
        <div style="width: 32px; height: 26px;border: 1px red solid;border-radius: 5px;
      border: 1px solid #462e2e;float: right;
      margin-left: 20px;">
          <i class="el-icon-d-arrow-left" style="padding: 5px;"></i>
        </div>
      </div>
    </el-footer>
    <!-- 顶部的页码 -->

  </el-container>
</el-container>



<span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleMethod(0)">取 消</el-button>
    <el-button type="primary" @click="dialogVisibleMethod(1)">确 定</el-button>
  </span>

<!-- 分组信息层 -->
<el-dialog
        v-dialogDrag
      width="290px"
      :title="GroupTextTitle"
      :visible.sync="innerVisible"
      append-to-body>
      
        <el-input v-model="newEditGroupText" style="margin: 20px;
    width: 250px;"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="groupNewEdit()">确 定</el-button>
            <el-button @click="innerVisible = false">取 消</el-button>
             </span>
    </el-dialog>
<!-- 分组信息层 -->
</el-dialog>
</template>


<script>
import { 
  getImgs, getGroupText, updateGroupText, 
  addGroupText, delImgs, delGroupText, 
  uploadImg, mvImgs 
  } from "@/api/system/imgs"

export default {
    props: ["dialogVisible"],

    name: 'ImgLibrary', // 定义名字
    data() {
      // 数据定义
        return {
            GroupTextTitle: "新增分组",
            newEditGroupText: "小学生",
            innerVisible: false,
            src: "",
            // 分组的列表
            groupList: [
                {"name" : "博客默认信息", "id" : 1},
                {"name" : "图标类", "id" : 2},
                {"name" : "车行类", "id" : 3},
                {"name" : "大型活动场合", "id" : 4},
                {"name" : "租房展示图", "id" : 5},
            ],
            // 图片列表 一页20条数据
            imgList: {},
            /**
             * 选中的图片 
             *  图片id  图片地址
             */
            selectedImgs: [],
            // 搜索选中的分组
            searchSelectedGroup: "",
            // 移动选中的分组
            mvSelectedGroup: "",
            // 删除选中的图片
            deleteSelectedImg: {},
            // 上传
            uploadImg: {},
            // 页码 默认为1开始 pageSize = 20
            page: 1,
        }
    },
    mounted(){},
    created(){
        /**
         * 页面加载初始执行
         * 
         * 获取图片分组 
         * 获取图片列表
         * 分页
         */
        this.getGroupText()

    },
    // 方法定义
    methods: {
        // 获取图片
        getImgs() {
            getImgs({
              cate_id: this.searchSelectedGroup
            }).then(res => {
                console.log("getGroupText", res)
            })
        },
        // 获取分组
        getGroupText() {
            getGroupText().then(res => {
                console.log("getGroupText", res)
            })
        },

        /**
         *  状态以及 所选的图片地址
         */
        dialogVisibleMethod(val) {
            console.log(val)
            this.$emit("changeDialogVisible", {status: val, selectedImgs : this.selectedImgs})
        },
        newGroup() {
            this.GroupTextTitle = "新增分组"
            this.newEditGroupText = ""
            this.innerVisible = true
        },
        groupNewEdit(){
            console.log(this.newEditGroupText)
            this.innerVisible = false
        },
        // 上传图片
        handleRemove(file) {
            console.log(file);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length } 个文件`);
        },
        beforeRemove(file) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        // 上传图片
        editGroupText(item) {
            // 编辑分组名字
            this.GroupTextTitle = "编辑分组信息"
            this.newEditGroupText = item.name
            this.innerVisible = true
            console.log(item)
        },
        delGroupText(item) {
            // 删除分组名字
            console.log(item)
        },
        // 分组特效
        changeActive($event){
             $event.currentTarget.className="img_menu_xuanzhong";
        },
        removeActive($event){
            $event.currentTarget.className="img_menu_xuanzhong";
        }
        // 分组特效
},
}
</script>
<style>
.img_menu_xuanzhong {
  background: rgba(48, 145, 242, 0.1);
    border-radius: 6px;
    color: #0e90d2;
}
.img_menu {
  padding-left: 0px;
}
.img_menu div {
  padding: 5px;
  padding-left: 20px;
}
.block {
    float: left;margin-bottom: 10px;
}
.img-paixun {
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.05);cursor: pointer;
    border-radius: 6px;
}
  .el-dialog__body {
    padding: 0px; margin: 0px;
  }
  .el-header {
    height: 32px;
    line-height: 36px;
  }
  
  .el-aside {
    color: #333;
  }
</style>