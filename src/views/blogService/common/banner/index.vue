<template>
  <div>
    <el-button
      type="primary"
      @click="getBanners()"
      style="margin: 10px; float: right"
      >刷新数据</el-button
    >
    <el-button
      type="primary"
      @click="saveData()"
      style="margin: 10px; float: right"
      >新增数据</el-button
    >
    <el-table :data="tableData" style="width: 100%" :loading="listloading">
      <el-table-column label="名称" align="center">
        <template slot-scope="{ row, $index }">
          <el-input
            v-model="row.title"
            v-if="currentEdit === $index"
            @keyup.enter.native="finishEditClick(row)"
          ></el-input>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片" align="center">
        <template slot-scope="{ row }">
        <div class="img_kuang" style @click="changeDialogVisibleState(row)">
          <i v-if="row.img_uri == ''" class="el-icon-plus img_kuang_i" />
          <img
            v-if="row.img_uri != ''"
            :src="row.img_uri"
            class="avatar"
            style="width: 100%; height: 100%; display: block"
          />
        </div>
        </template>
      </el-table-column>

      <el-table-column label="跳转路径" align="center">
        <template slot-scope="{ row, $index }">
          <el-input
            v-model="row.jump_uri"
            v-if="currentEdit === $index"
            @keyup.enter.native="finishEditClick(row)"
          ></el-input>
          <span v-else>{{ row.jump_uri }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_show"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="finishEditClick(scope.row)"
            v-if="currentEdit === scope.$index"
            >完成</el-button
          >
          <el-button type="text" size="small" @click="editClick(scope)" v-else
            >编辑</el-button
          >
          <el-button
            @click="handleDelClick(scope.row, scope.$index)"
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <ImgLibrary
      :dialog-visible="dialogVisible"
      @changeDialogVisible="changeDialogVisible"
    />
  </div>
</template>

<script>
import ImgLibrary from "@/components/ImgLibrary"; // 图片选择
import {
  saveBanner,
  getBanners,
  putBanner,
  delBanner,
} from "@/api/blog/public";

export default {
  name: "",
  components: {
    ImgLibrary,
  },
  data() {
    return {
        selectRow: "",
      dialogVisible: false,
      listloading: false,
      currentEdit: -1,
      tableData: [],
      dialogImageUrl: "",
      dialogVisibleUrlState: true,
    };
  },
  created() {
    this.listloading = true;
    this.getBanners();
  },
  methods: {
    getBanners() {
      let tab_list = [];
      getBanners().then((response) => {
        response.data.forEach((item, index) => {
          tab_list[index] = {
            title: item.title,
            jump_uri: item.jump_uri,
            img_uri: item.img_uri,
            id: item.id,
            is_show: item.is_show == 1 ? "1" : "0",
          };
        });
        this.tableData = tab_list;
        console.log("this.tableData ", this.tableData, tab_list);
      });
    },
    // 删除
    handleDelClick(row, index) {
      if (row.id == "") {
        this.currentEdit = -1;
        this.tableData.splice(index, 1);
        return;
      }
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delBanner({
            id: row.id,
          }).then((response) => {
            this.responseMessage(response);
            this.getBanners();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //编辑
    editClick(scope) {
      if (this.currentEdit != -1) {
        this.msgError("存在未关闭的编辑框");
        return;
      }
      this.currentEdit = scope.$index;
    },
    // 完成
    finishEditClick(row) {
      if (row.img_uri == "" || row.jump_uri == "" || row.title == "" || row.is_show == "") {
        this.msgError("请填写完整数据");
        return;
      }
      let requestBody = "";
      if (row.id != "") {
        requestBody = putBanner(row);
      } else {
        requestBody = saveBanner(row);
      }
      requestBody.then((response) => {
        this.responseMessage(response);
      });

      this.currentEdit = -1;
    },
    // 保存
    saveData() {
      if (this.currentEdit != -1) {
        this.msgError("存在未关闭的编辑框");
        return;
      }
      let obj = {};
      obj.id = "";
      obj.title = "";
      obj.jump_uri = "";
      obj.img_uri = "";
      obj.is_show = 1;
      this.currentEdit = this.tableData.length;
      this.tableData.push(obj);
    },
    // 变更状态
    handleStatusChange(row) {
      if(row.id == '') return;
      putBanner(row).then((response) => {
        this.responseMessage(response);
      });
    },
    changeDialogVisibleState(row) {
        this.dialogVisible = true;
        this.selectRow = row;
    },
    changeDialogVisible(val) {
      this.dialogVisible = false;
      if (val.selectedImgs.length != 0 && val.status != 0) {
        this.selectRow.img_uri = val.selectedImgs[0].imgurl;
      }
      if (val.status == 1 && val.selectedImgs.length == 0) {
        this.selectRow.img_uri = "";
      }
    },
  },
};
</script>


<style>
.img_kuang {
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 38px;
  height: 38px;
  cursor: pointer;
  line-height: 48px;
  vertical-align: top;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: none;
}
.img_kuang_i {
  font-family: "element-icons" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  font-size: 28px;
  color: #8c939d;
}
</style>