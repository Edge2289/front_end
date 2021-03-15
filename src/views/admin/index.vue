<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="管理员名称" prop="roleName">
        <el-input
          v-model="queryParams.login_name"
          placeholder="请输入管理员名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.is_state"
          placeholder="状态"
          clearableis_state
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
      <el-table-column type="selection" width="55" align="id" />
      <el-table-column label="登录账号" prop="login_name" width="120" />
      <el-table-column label="管理员名称" prop="name" width="120" />
      <el-table-column label="角色" prop="roleJoin" width="200" />
      <el-table-column label="状态" align="is_used" width="100">
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
          <span>{{ scope.row.created_at }}</span>
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
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="saveManageValidator"
      >
        <el-form-item label="登录账号" prop="login_name">
          <el-input
            v-model="form.login_name"
            placeholder="请输入管理员登录账号"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入管理员名称" />
        </el-form-item>
        <el-form-item label="密码" prop="passage">
          <el-input
            v-model="form.passage"
            placeholder="请输入管理员密码, 为空则不修改，新增默认为:123456"
          />
        </el-form-item>
        <el-form-item label="角色关联" prop="selectRoleMap">
          <el-select
            v-model="form.selectRoleMap"
            multiple
            collapse-tags
            style="margin-left: 20px"
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.is_state">
            <el-radio
              v-for="dict in addStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
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
  getAdminList,
  saveAdminData,
  changeAdminData,
  delAdminData,
} from "@/api/manage/admin";
import { getRoleList } from "@/api/manage/role";
import { dialogDrag } from "@/utils/directives";
import c from "@/components/ImgLibrary/c";

export default {
  name: "Tab",
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
      // 角色数据
      roleOptions: [],
      selectRoleMap: [],
      // 搜索状态数据字典
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
      // 新增
      addStatusOptions: [
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
        label: "",
        is_state: -1,
      },
      // 表单参数
      form: {
        is_state: 0,
        login_name: "",
        selectRoleMap: "",
        passage: "",
        name: "",
      },
      saveManageValidator: {
        login_name: [
          { required: true, trigger: "blur", validator: "请输入登录账号！" },
        ],
        name: [{ required: true, trigger: "blur", validator: "请输入名字！" }],
      },
    };
  },
  created() {
    this.getList();
    getRoleList({}).then((roleResponse) => {
      if (roleResponse.code != 200) {
        this.roleOptions = [];
        this.responseMessage(roleResponse);
      } else {
        this.roleOptions = roleResponse.data.data;
      }
    });
  },
  methods: {
    /** 查询标签列表 */
    getList() {
      this.loading = true;
      getAdminList(this.queryParams).then((response) => {
        if (response.code != 200) {
          this.responseMessage(response);
          this.tab_list = [];
          return;
        }
        response.data.data.forEach((item, key) => {
          let roleData = [];
          item.AdminRoleMap.forEach((itemRole) => {
            roleData.push(itemRole.RoleData.name);
          });
          response.data.data[key]["roleJoin"] = roleData.join(",");
          response.data.data[key]["is_state"] = item.is_used;
        });
        // AdminRoleMap
        this.loading = false;
        this.total = response.data.total;
        this.tab_list = response.data.data;
      });
    },
    // 标签状态修改
    handleStatusChange(row) {
      const text = row.is_state == 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.login_name + '"管理员吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          changeAdminData({
            login_name: row.login_name,
            name: row.name,
            is_state: row.is_state,
            id: row.id,
          });
        })
        .catch(function () {
          row.is_state = row.is_state == 0 ? 1 : 0;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        is_state: 0,
        login_name: "",
        selectRoleMap: "",
        passage: "",
        name: "",
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.page = 1;
      this.queryParams.page_size = 10;
      this.queryParams.login_name = "";
      this.queryParams.is_state = -1;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    async handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加管理员";
      this.isEdit = false;
      this.form.is_state = 1;
      this.selectRoleMap = [1];
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const tabIds = row.id || this.ids[0];
      console.log("tabIds", tabIds);
      getAdminList({ id: tabIds, is_state: -1 }).then((response) => {
        if (response.code != 200) {
          this.responseMessage(response);
          return;
        }
        this.form.id = response.data.data[0]["id"];
        this.form.is_state = response.data.data[0]["is_used"];
        this.form.login_name = response.data.data[0]["login_name"];
        this.form.passage = "";
        this.form.name = response.data.data[0]["name"];
        let roleIds = [];
        response.data.data[0].AdminRoleMap.forEach((item) => {
          if (item.r_id != 0) {
            roleIds.push(item.r_id);
          }
        });
        this.form.selectRoleMap = roleIds;
        this.open = true;
        this.title = "修改管理员";
      });
      //   })
    },
    /** 提交按钮 */
    submitForm: function () {
      let requestHeader = "";
      console.log("this.form", this.form);
      let formMap = this.form;
      if (
        formMap.login_name.trim == "" ||
        formMap.name.trim == "" ||
        formMap.selectRoleMap.length == 0
      ) {
        this.msgError("请填写完整数据");
        return;
      }
      formMap["admin_role_form"] = formMap.selectRoleMap.join(",");
      if (this.form.id !== undefined) {
        requestHeader = changeAdminData(formMap);
      } else {
        requestHeader = saveAdminData(formMap);
      }
      requestHeader.then((response) => {
        if (response.code == 200) {
          this.open = false;
        }
        this.responseMessage(response);
        this.getList();
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      let tab_ids = row.id || this.ids;
      let text = "";
      if (row != "") {
        if (row.login_name != undefined) {
          text = ": " + row.login_name;
        }
        if (row.id != undefined) {
        tab_ids = [row.id]
        }
      }
      this.$confirm("是否确认删除管理员" + text + " ?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          delAdminData({
            "id": tab_ids.join(","),
          }).then((response) => {
            this.responseMessage(response);
          });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>
