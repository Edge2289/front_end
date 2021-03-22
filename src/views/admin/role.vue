<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.login_name"
          placeholder="请输入角色名称"
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
      <el-table-column label="角色名称" prop="name" width="120" />
      <el-table-column label="备注" prop="content" width="120" />
      <el-table-column label="状态" align="is_state" width="100">
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
            @click="handleOpenDrawer(scope.row)"
            >设置权限</el-button
          >
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

    <!-- 右侧权限限制 -->
    <el-drawer
      title="菜单设置"
      :visible.sync="drawer"
      direction="rtl"
      size="40%"
      :before-close="handleClose"
    >
      <el-tabs type="card" style="padding: 10px">
        <el-tab-pane label="角色菜单">
          <div style="text-align: right">
            <el-button type="primary" size="small" @click="sureRoleMenuList"
              >确认</el-button
            >
          </div>
          <el-tree
            ref="tree"
            :data="menuData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="expandedMenuKeys"
            :default-checked-keys="checkedMenuKeys"
            :props="defaultProps"
          >
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>

    <!-- 添加或修改标签配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px">
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
        :rules="saveManageValidator"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.content" placeholder="请输入备注" />
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
  getRoleList,
  saveRoleData,
  changeRoleData,
  delRoleData,
  roleMenuData,
} from "@/api/manage/role";
import { dialogDrag } from "@/utils/directives";
import c from "@/components/ImgLibrary/c";

export default {
  name: "Tab",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      drawer: false,
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
      // 角色数据
      roleOptions: [],
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
        name: "",
        is_state: -1,
      },
      // 表单参数
      form: {
        is_state: 1,
        content: "",
        name: "",
      },
      saveManageValidator: {
        name: [
          { required: true, trigger: "blur", validator: "请输入角色名！" },
        ],
      },
      // 菜单列表数据
      menuData: [],
      selectChangeRoleMenuId: "",
      // 当前角色选中的数据
      checkedMenuKeys: [],
      expandedMenuKeys: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {
    this.getList();
    // 先获取保存角色菜单数据
    roleMenuData({ type: "menuList" }).then((item) => {
      this.menuData = item.data;
    });
  },
  methods: {
    /** 查询标签列表 */
    getList() {
      this.loading = true;
      getRoleList(this.queryParams).then((response) => {
        if (response.code != 200) {
          this.responseMessage(response);
          this.tab_list = [];
          return;
        }
        // AdminRoleMap
        this.loading = false;
        this.total = response.data.total;
        this.tab_list = response.data.data;
      });
    },
    // 标签状态修改
    handleStatusChange(row) {
      const text = row.is_state == 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.name + '"角色吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          changeRoleData({
            content: row.content,
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
      this.title = "添加角色";
      this.form.is_state = 1;
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      const tabIds = row.id || this.ids[0];
      getRoleList({ id: tabIds, is_state: -1 }).then((response) => {
        if (response.code != 200) {
          this.responseMessage(response);
          return;
        }
        this.form = response.data.data[0];
        this.open = true;
        this.title = "修改角色";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      let requestHeader = "";
      if (this.form.name.trim == "") {
        this.msgError("请填写角色名称");
        return;
      }
      if (this.form.id !== undefined) {
        requestHeader = changeRoleData(this.form);
      } else {
        requestHeader = saveRoleData(this.form);
      }
      requestHeader.then((response) => {
        if (response.code == 200) {
          this.open = false;
        }
        this.responseMessage(response);
        this.getList();
      });
    },
    // 打开权限
    async handleOpenDrawer(row) {
      this.selectChangeRoleMenuId = row.id;
      this.drawer = true;
      roleMenuData({
        type: "roleMenu",
        role_id: row.id,
      }).then((item) => {
        this.checkedMenuKeys = item.data;
      });
    },
    // 确认修改菜单数据
    sureRoleMenuList() {
      let roleMenuMap = this.$refs.tree.getCheckedKeys();
      this.$refs.tree.getHalfCheckedKeys().forEach((item, key) => {
        roleMenuMap.push(item);
      });
      roleMenuData({
        role_id: this.selectChangeRoleMenuId,
        menuData: roleMenuMap.join(","),
        type: "saveRoleMenu",
      }).then((response) => {
        this.responseMessage(response);
      });
    },
    handleClose(done) {
      //清空
      this.selectChangeRoleMenuId = "";
      this.$refs.tree.setCheckedKeys([]);
      done();
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
          tab_ids = [row.id];
        }
      }
      this.$confirm("是否确认删除管理员" + text + " ?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          delRoleData({
            id: tab_ids.join(","),
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
