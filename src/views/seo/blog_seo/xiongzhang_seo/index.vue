<template>
  <div class="app-container">
    待完善
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
      total: 0,
      // 标签表格数据
      tab_list: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      isEdit: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [{
            'dictValue': 1,
            'dictLabel': "开启"
        },{
            'dictValue': 0,
            'dictLabel': "关闭"
        }],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
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
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '标签名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '标签顺序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询标签列表 */
    getList() {
        this.tab_list = [
          {"tab_id":1, "tab_name": "天蓝色", "tab_color": "red", "is_state": 1, "operator_name": "", "created_at": "2020-07-15 02:02:03"},
         {"tab_id":2, "tab_name": "天蓝色aa", "tab_color": "red", "is_state": 1, "operator_name": "", "created_at": "2020-07-15 02:02:03"},
         {"tab_id":3, "tab_name": "天蓝色ss", "tab_color": "red", "is_state": 1, "operator_name": "", "created_at": "2020-07-15 02:02:03"},
         {"tab_id":4, "tab_name": "天蓝色dd", "tab_color": "red", "is_state": 1, "operator_name": "", "created_at": "2020-07-15 02:02:03"},
          
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
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data.list
      })
    },
    // 标签状态修改
    handleStatusChange(row) {
      const text = row.is_state === '0' ? '启用' : '停用'
      console.log("row.is_state", row.is_state)
      this.$confirm('确认要"' + text + '""' + row.tab_name + '"标签吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.tab_id, row.is_state)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.is_state = row.is_state === '0' ? '1' : '0'
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
      this.title = '添加标签'
      this.isEdit = false
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const roleId = row.roleId || this.ids
    //   getRole(roleId).then(response => {
    //     this.form = response.data
        this.open = true
        this.title = '修改标签'
        this.isEdit = true
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
      this.$confirm('是否确认删除标签: ' + row.tab_name + ' ?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(tab_ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    // handleExport() {
    //   this.$confirm('是否确认导出所有标签数据项?', '警告', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.downloadLoading = true
    //     import('@/vendor/Export2Excel').then(excel => {
    //       const tHeader = ['标签编号', '标签名称', '权限字符', '显示顺序', '状态', '创建时间']
    //       const filterVal = ['roleId', 'roleName', 'roleKey', 'roleSort', 'status', 'createdAt']
    //       const list = this.tab_list
    //       const data = formatJson(filterVal, list)
    //       excel.export_json_to_excel({
    //         header: tHeader,
    //         data,
    //         filename: '标签管理',
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
