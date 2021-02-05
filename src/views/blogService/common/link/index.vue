<template>
  <div>
    <el-button
      type="primary"
      @click="getLinks()"
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

      <el-table-column label="uri" align="center">
        <template slot-scope="{ row, $index }">
          <el-input
            v-model="row.uri"
            v-if="currentEdit === $index"
            @keyup.enter.native="finishEditClick(row)"
          ></el-input>
          <span v-else>{{ row.uri }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否显示" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_show"
            active-value='1'
            inactive-value='0'
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
  </div>
</template>

<script>
import { saveLink, getLinks, putLink, delLink } from "@/api/blog/public";

export default {
  data() {
    return {
      listloading: false,
      currentEdit: -1,
      tableData: [],
    };
  },
  created() {
    this.listloading = true;
    this.getLinks();
  },
  methods: {
    getLinks() {
        let tab_list = [];
      getLinks().then((response) => {
        response.data.forEach((item, index) => {
          tab_list[index] = {
            title: item.title,
            uri: item.uri,
            id: item.id,
            is_show: item.is_show == 1? '1': '0',
          };
        })
        this.tableData = tab_list
        console.log("this.tableData ", this.tableData, tab_list)
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
          delLink({
            id: row.id,
          }).then((response) => {
            this.responseMessage(response);
            this.getLinks();
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
      if (row.uri == "" || row.title == "" || row.is_show == "") {
        this.msgError("请填写完整数据");
        return;
      }
      let requestBody = "";
      if (row.id != "") {
        requestBody = putLink(row);
      } else {
        requestBody = saveLink(row);
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
      obj.uri = "";
      obj.is_show = 1;
      this.currentEdit = this.tableData.length;
      this.tableData.push(obj);
    },
    // 变更状态
    handleStatusChange(row) {
        console.log("row", row);
        putLink(row).then((response) => {
        this.responseMessage(response);
      });
    }
  },
};
</script>
