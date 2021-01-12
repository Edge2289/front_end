<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="密钥名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入密钥名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="密钥状态"
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
        >导出</el-button>
      </el-col>
    </el-row>
    <br>
    <el-table v-loading="loading" :data="tab_list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="id" />
      <el-table-column label="应用名称" prop="app_name" width="120" />
      <el-table-column label="app_id" prop="app_id" width="120" />
      <el-table-column label="秘钥" prop="app_secret" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="应用描述" prop="app_desc" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->

    <!-- 添加或修改密钥配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="密钥名称" prop="app_name">
          <el-input v-model="form.app_name" placeholder="请输入密钥名称" />
        </el-form-item>
        <el-form-item label="app_id" prop="app_id">
          <!-- <el-input v-model="form.roleKey" placeholder="请输入权限字符" :disabled="isEdit" /> -->
          <el-input v-model="form.app_id" placeholder="自动生成,请勿填写" :disabled="true" />
        </el-form-item>
        <el-form-item label="secret" prop="app_secret">
          <el-input v-model="form.app_secret" placeholder="自动生成,请勿填写" :disabled="true" />
        </el-form-item>
        <el-form-item label="描述" prop="app_desc">
          <el-input v-model="form.app_desc" placeholder="请输入密钥名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <!-- <div style="margin-top: 20px;text-align: center;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div> -->

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
// import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from '@/api/system/role'
// import { treeselect as menuTreeselect, roleMenuTreeselect } from '@/api/system/menu'
// import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/api/system/dept'
// import { formatJson } from '@/utils'
import { dialogDrag } from '@/utils/directives'

export default {
  name: 'Role',
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
      total: 100,
      // 密钥表格数据
      tab_list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [{
        'dictValue': 1,
        'dictLabel': '开启'
      }, {
        'dictValue': 0,
        'dictLabel': '关闭'
      }],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {
        status: 1
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        app_name: [
          { required: true, message: '密钥名称不能为空', trigger: 'blur' }
        ],
        app_desc: [
          { required: true, message: '应用描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询密钥列表 */
    getList() {
      this.tab_list = [
        { 'id': 1, 'app_name': '天蓝色', 'app_id': 'red', 'app_secret': 'red', 'app_desc': 'red', 'status': 1, 'operator_name': '', 'created_at': '2020-07-15 02:02:03' },
        { 'id': 2, 'app_name': '天蓝色aa', 'app_id': 'red', 'app_secret': 'red', 'app_desc': 'red', 'status': 1, 'operator_name': '', 'created_at': '2020-07-15 02:02:03' },
        { 'id': 3, 'app_name': '天蓝色ss', 'app_id': 'red', 'app_secret': 'red', 'app_desc': 'red', 'status': 1, 'operator_name': '', 'created_at': '2020-07-15 02:02:03' },
        { 'id': 4, 'app_name': '天蓝色dd', 'app_id': 'red', 'app_secret': 'red', 'app_desc': 'red', 'status': 1, 'operator_name': '', 'created_at': '2020-07-15 02:02:03' }

      ]
      this.total = 10
    //   this.loading = true
    //   listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
    //     response => {
    //       this.tab_list = response.data.list
    //       this.total = response.data.count
    //       this.loading = false
    //     }
    //   )
    },
    handleSizeChange() {
      console.log('handleSizeChangesd', 'handleSizeChange')
    },
    handleCurrentChange() {
      console.log('handleCurrentChange', 'handleCurrentChange')
    },
    // 密钥状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      console.log('row.status', row.status)
      this.$confirm('确认要"' + text + '""' + row.app_name + '"密钥吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuIds: [],
        deptIds: [],
        remark: undefined
      }
    //   this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      //   this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加密钥'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.roleId || this.ids
      //   getRole(roleId).then(response => {
      //     this.form = response.data
      this.open = true
      this.title = '修改密钥'
    //   })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.roleId !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            updateRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys()
            addRole(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId !== undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys()
        console.log(this.getDeptAllCheckedKeys())
        dataScope(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.openDataScope = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tab_ids = row.tab_id || this.ids
      this.$confirm('是否确认删除密钥: ' + row.tab_name + ' ?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(tab_ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
    /** 导出按钮操作 */
    // handleExport() {
    //   this.$confirm('是否确认导出所有密钥数据项?', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.downloadLoading = true
    //     import('@/vendor/Export2Excel').then(excel => {
    //       const tHeader = ['密钥编号', '密钥名称', '权限字符', '显示顺序', '状态', '创建时间']
    //       const filterVal = ['roleId', 'roleName', 'roleKey', 'roleSort', 'status', 'createdAt']
    //       const list = this.tab_list
    //       const data = formatJson(filterVal, list)
    //       excel.export_json_to_excel({
    //         header: tHeader,
    //         data,
    //         filename: '密钥管理',
    //         autoWidth: true, // Optional
    //         bookType: 'xlsx' // Optional
    //       })
    //       this.downloadLoading = false
    //     })
    //   })
    // }
  }
}
</script>
