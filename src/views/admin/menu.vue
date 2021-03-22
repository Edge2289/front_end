<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item label="菜单名称">
        <el-input
          v-model="queryParams.label"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.is_state"
          placeholder="菜单状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in visibleOptions"
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
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="label"
        label="菜单名称"
        :show-overflow-tooltip="true"
        width="180px"
      />
      <el-table-column prop="icon" label="图标" align="center" width="100px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="60px" />
      <el-table-column
        prop="vue_router_path"
        label="路径"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.menu_type == 'A'">{{
            scope.row.vue_router_path
          }}</span>
          <span v-else>{{ scope.row.vue_router_component }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_state" label="显示" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.is_state == 1 ? 'success' : 'danger'"
            disable-transitions
            >{{ scope.row.is_state == 1 ? "显示" : "隐藏" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="menu_type" label="菜单类型" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.menu_type == 'C' ? 'primary' : 'warning'"
            disable-transitions
            >{{ scope.row.menu_type == 'C' ? "目录" : "按钮" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_at }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="230"
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
            v-if="scope.row.menu_type != 'A'"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >新增</el-button
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

    <!-- 添加或修改菜单对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.pid"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                @select="handleNodeClick"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单标题" prop="label">
              <el-input v-model="form.label" placeholder="请输入菜单标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menu_type">
              <el-radio-group v-model="form.menu_type">
                <el-radio
                  v-if="menuTypeDisabled == 'C' || menuTypeDisabled == 'F'"
                  label="C"
                  >菜单</el-radio
                >
                <el-radio
                  v-if="menuTypeDisabled == 'A' || menuTypeDisabled == 'F'"
                  label="A"
                  >按钮</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menu_type == 'A'" label="请求方式">
              <el-radio-group v-model="form.method">
                <el-radio label="GET">GET</el-radio>
                <el-radio label="POST">POST</el-radio>
                <el-radio label="PUT">PUT</el-radio>
                <el-radio label="DELETE">DELETE</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <!--  图标选择器 -->
          <el-col :span="24">
            <el-form-item label="菜单图标" v-if="form.menu_type == 'C'">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input
                  slot="reference"
                  v-model="form.icon"
                  placeholder="点击选择图标"
                  readonly
                >
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px; width: 16px"
                  />
                  <i
                    v-else
                    slot="prefix"
                    class="el-icon-search el-input__icon"
                  />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <!--  图标选择器 -->

          <el-col :span="12">
            <el-form-item
              v-if="form.menu_type == 'C'"
              label="路由名称"
              prop="vue_router_name"
            >
              <el-input
                v-model="form.vue_router_name"
                placeholder="请输入路由名称"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              v-if="form.menu_type == 'C'"
              label="路由地址"
              prop="vue_router_path"
            >
              <el-input
                v-model="form.vue_router_path"
                placeholder="请输入路由地址"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menu_type == 'C'" :span="12">
            <el-form-item label="组件路径" prop="vue_router_component">
              <el-input
                v-model="form.vue_router_component"
                placeholder="请输入组件路径"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.menu_type == 'A'"
              label="接口路径"
              prop="api_path"
            >
              <el-input v-model="form.api_path" placeholder="请输入接口路径" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.is_state">
                <el-radio key="1" label="1">开启</el-radio>
                <el-radio key="0" label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
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
  getMenuList,
  saveMenuData,
  changeMenuData,
  delMenuData,
} from "@/api/manage/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import { dialogDrag } from "@/utils/directives";

export default {
  name: "Menu",
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 菜单状态数据字典
      visibleOptions: [],
      // 是否允许菜单和按钮
      menuTypeDisabled: "F",
      // 查询参数
      queryParams: {
        label: "",
        is_state: -1,
        type: "tree",
      },
      dialogVisible: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        label: [
          { required: true, message: "菜单标题不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.visibleOptions = [
      { dictLabel: "全部", dictValue: -1 },
      { dictLabel: "开启", dictValue: 1 },
      { dictLabel: "关闭", dictValue: 0 },
    ];
    console.log("this.$router", this.$router.currentRoute);
  },
  methods: {
    handleClose(done) {
      done();
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      getMenuList(this.queryParams).then((response) => {
        this.menuList = response.data;
        this.loading = false;
      });
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      getMenuList({ type: "tree" }).then((response) => {
        let recursiveMenuData = this.recursiveMenuList(response.data);
        const menu = { id: 0, label: "主类目", isButton: true, children: {} };
        // menu.push(recursiveMenuData)
        menu.children = recursiveMenuData;
        this.menuOptions = [menu];
      });
    },
    // 转换菜单列表
    recursiveMenuList(menuData) {
      let needData = [];
      let isReturn = true;
      menuData.forEach((item, index) => {
        if (item.menu_type == "A") {
          isReturn = false;
          return;
        }
        let sortData = JSON.parse(JSON.stringify(item));
        delete sortData["children"];
        needData[index] = sortData;
        if (item.children != undefined) {
          let map = this.recursiveMenuList(item["children"]);
          needData[index]["isButton"] = !!map;
          map && (needData[index]["children"] = map);
        } else {
          needData[index]["isButton"] = true;
        }
      });
      return isReturn == false ? isReturn : needData;
    },
    /** 转换菜单数据结构 不用动 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    handleNodeClick(row) {
      // 是下面存在按钮的话
      if (!row.isButton) {
        this.form.menu_type = "A";
        this.menuTypeDisabled = "A";
      } else {
        this.menuTypeDisabled = "F";
        this.form.menu_type = "C";
      }
      console.log("handleNodeClick", this.menuTypeDisabled);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: "",
        pid: 0,
        icon: undefined,
        method: "GET",
        menu_type: "C",
        sort: 50,
        is_state: "1",
        vue_router_name: "",
        vue_router_component: "",
        vue_router_path: "",
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.pid = row.id;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenuList({ id: row.id }).then((response) => {
        if (response.code != 200) {
          this.msgError(response.msg);
          return;
        }
        this.form = response.data.data[0];
        this.form.is_state = this.form.is_state == 1 ? "1" : "0";
        console.log("this.form", this.form);
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let requestBody = "";
          if (this.form.id == undefined || this.form.id == "") {
            requestBody = saveMenuData(this.form);
          } else {
            requestBody = changeMenuData(this.form);
          }
          requestBody.then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除菜单为"' + row.label + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delMenuData({ id: row.id });
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
<style>
.el-row {
  margin-bottom: 20px;
  /* &:last-child {
      margin-bottom: 0;
    } */
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
