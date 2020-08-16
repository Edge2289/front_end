<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--分类数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="cateName"
            placeholder="请输入分类名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            v-loading="cateLoading"
            :data="deptOptions"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="文章标题" prop="title">
            <el-input
              v-model="queryParams.title"
              placeholder="请输入文章标题"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="作者昵称" prop="nick">
            <el-input
              v-model="queryParams.nick"
              placeholder="请输入作者昵称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="is_state">
            <el-select
              v-model="queryParams.is_state"
              placeholder="文章状态"
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
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" plain>搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" plain>重置</el-button>
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
        </el-row>

        <el-table
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="编号" width="50" align="center" prop="userId" />
          <el-table-column label="文章名称" align="center" prop="username" :show-overflow-tooltip="true" />
          <el-table-column label="文章作者" align="center" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="文章配图" align="center" prop="deptName" :show-overflow-tooltip="true" />
          <el-table-column label="文章分类" align="center" prop="phone" width="120" />
          <el-table-column label="点赞数" align="center" prop="phone" width="120" />
          <el-table-column label="评论数" align="center" prop="phone" width="120" />
          <el-table-column label="状态" width="50" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createdAt" width="165">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createdAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { getArticleList, getUdelArticleser, updateArticle, addArticle, getLabel} from '@/api/article/article'
import { getToken } from '@/utils/auth'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'User',
  components: { Treeselect },
  data() {
    return {
      // 分类遮罩层
      cateLoading: false,
      // 文章遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 分类树选项
      deptOptions: [{
          label: '青柠檬',
          children: []
        },{
          label: '蓝苹果',
          children: []
        },{
          label: '紫雪梨',
          children: []
        },{
          label: '红香蕉',
          children: []
        },{
          label: '黑西瓜',
          children: []
        }],
      // 分类名称
      cateName: undefined,
      // 状态数据字典
      statusOptions: [{
            'dictValue': 1,
            'dictLabel': "开启"
        },{
            'dictValue': 0,
            'dictLabel': "关闭"
        }],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        username: undefined,
        phone: undefined,
        status: undefined,
        deptId: undefined
      },
    }
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    // this.getTreeselect()
    // this.getDicts('sys_normal_disable').then(response => {
    //   this.statusOptions = response.data
    // })
    // this.getDicts('sys_user_sex').then(response => {
    //   this.sexOptions = response.data
    // })
    // this.getConfigKey('sys.user.initPassword').then(response => {
    //   this.initPassword = response.msg
    // })
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    /** 查询用户列表 */
    getList() {
      // this.loading = true
      getArticleList([]).then(
        response => {
          // this.userList = response.data.list
          // this.total = response.data.count
          // this.loading = false
          console.log("response.data", response.data);
        }
      )
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      // this.loading = true
      // this.queryParams.deptId = data.deptId
      // this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.username + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.userId, row.status)
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
    // 表单重置
    reset() {
      this.queryParams = {
        userId: undefined,
        deptId: undefined,
        username: undefined,
        nickName: undefined,
        password: undefined,
        title: undefined,
        nick: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        postIds: undefined,
        roleIds: undefined
      }
      // this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      // this.resetForm('queryForm')
      this.reset()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset()
      // this.getTreeselect()
      this.$router.push({ path: '/example/articleEdit?articleId='+123, query: this.otherQuery })
    },
    /** 删除操作 */
    handleDelete(row) {
      
    },
    /** 更新操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/example/articleEdit?'+row.id, query: this.otherQuery })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.userId !== undefined) {
            updateUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addUser(this.form).then(response => {
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
  }
}
</script>