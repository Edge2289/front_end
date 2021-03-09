<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="is_state">
        <el-select
          v-model="queryParams.is_state"
          placeholder="分类状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          plain
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="tab_list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="tab_id" />
      <el-table-column label="分类名称" prop="tab_name" width="120" />
      <el-table-column label="分类备注" prop="tab_note" width="280" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.is_state"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.page_size"
      @pagination="getList"
    />

    <!-- 添加或修改标签配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类备注" prop="note">
          <el-input v-model="form.note" placeholder="请输入分类备注" />
        </el-form-item>
        <el-form-item label="权重" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.is_state">
            <el-radio :key="1" :label="1">开启</el-radio>
            <el-radio :key="0" :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="首页显示">
          <el-radio-group v-model="form.is_home">
            <el-radio :key="1" :label="1">开启</el-radio>
            <el-radio :key="0" :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategory,
  putCategory,
  addCategory,
  delCategory,
} from "@/api/article/category";
import qs from "qs";
// import { formatJson } from '@/utils'
import { dialogDrag } from "@/utils/directives";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 标签表格数据
      tab_list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [
        {
          dictValue: -1,
          dictLabel: "全部",
        },
        {
          dictValue: 1,
          dictLabel: "开启",
        },
        {
          dictValue: 0,
          dictLabel: "关闭",
        },
      ],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        name: undefined,
        is_state: -1,
      },
      // 表单参数
      form: {
        is_state: 1,
        is_home: 1,
        name: "",
        note: "",
        sort: 50,
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "标签名称不能为空", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" },
        ],
        roleSort: [
          { required: true, message: "标签顺序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询标签列表 */
    getList() {
      this.loading = true;
      const than = this;
      getCategory(this.queryParams).then((response) => {
        this.total = response.data.total;
        const tab_list = [];
        response.data.data.forEach((item, index) => {
          tab_list[index] = {
            tab_id: item.id,
            tab_name: item.name,
            tab_note: item.note,
            is_state: item.is_state,
            operator_name: item.operator_name,
            created_time: item.created_at,
          };
          console.log("tab_list", )
        });
        this.tab_list = tab_list;
        than.loading = false;
      });
    },
    // 标签状态修改
    handleStatusChange(row) {
      const text = row.is_state == "1" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.tab_name + '"标签吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          putCategory({
            id: row.tab_id,
            is_state: row.is_state,
            name: row.tab_name,
            note: row.tab_note,
          }).then((response) => {
            this.responseMessage(response);
          });
        })
        .catch(function (err) {
          row.is_state = row.is_state === "0" ? "1" : "0";
          this.msgError("系统错误，操作失败");
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.queryParams.page = 1;
      this.queryParams.name = undefined;
      this.queryParams.is_state = -1;
      //   this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.reset();
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.tab_id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分类";
      this.isEdit = false;
      this.form = {
        id: "",
        is_state: 1,
        is_home: 1,
        name: "",
        note: "",
        sort: 50,
      };
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cateId = row.tab_id || this.ids[0];
      getCategory({ id: cateId, is_state: -1 }).then((response) => {
        this.form = {
          id: response.data.data[0].id,
          name: response.data.data[0].name,
          note: response.data.data[0].note,
          is_state: response.data.data[0].is_state,
          is_home: response.data.data[0].is_home,
          sort: response.data.data[0].sort,
        };
      });
      this.open = true;
      this.title = "修改分类";
      this.isEdit = false;
    },
    /** 提交按钮 */
    submitForm: function () {
      let method = putCategory;
      if (this.form.id == "") {
        method = addCategory;
        delete this.form.id;
      }
      this.form.sort = parseInt(this.form.sort);
      method(this.form).then((response) => {
        if (response.code == 200) {
          this.open = false;
          this.msgSuccess(response.msg);
        } else {
          this.msgError(response.msg);
        }
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var array = [];
      const tab_ids = [row.tab_id] || this.ids;
      let text = "";
      if (row.tab_name != undefined) {
        text = ": " + row.tab_name;
      }
      this.$confirm("是否确认删除标签" + text + " ?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delCategory({ id: tab_ids.join(",") });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function (err) {});
    },
  },
};
</script>
