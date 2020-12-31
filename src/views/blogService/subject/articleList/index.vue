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
            @keyup.enter.native="getCareselect"
          />
        </div>
        <div class="head-container">
          <el-tree
            ref="tree"
            v-loading="cateLoading"
            :data="cateOptions"
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
            <el-button type="primary" icon="el-icon-search" size="mini" plain @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" plain @click="resetQuery">重置</el-button>
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
          :data="articleList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" align="center" />
          <el-table-column label="编号" width="50" align="center" prop="id" />
          <el-table-column label="文章名称" align="center" prop="title" :show-overflow-tooltip="true" />
          <el-table-column label="文章作者" align="center" prop="nick" :show-overflow-tooltip="true" />
          <el-table-column label="文章配图">
            　　<template slot-scope="scope">
              　　　　<img :src="scope.row.img" width="40" height="40" class="head_pic">
            　　</template>
          </el-table-column>
          <el-table-column label="文章分类" align="center" prop="cate_id" width="120" />
          <el-table-column label="点赞数" align="center" prop="click_num" width="120" />
          <el-table-column label="总阅读量" align="center" prop="read_num" width="120" />
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
              <span>{{ scope.row.createTime }}</span>
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
import { getArticleList, delArticle, updateArticle, getLabel } from '@/api/article/article'
import { getCategory } from '@/api/article/category'
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
      // 文章表格数据
      articleList: null,
      // 弹出层标题
      title: '',
      // 分类树选项
      cateOptions: [],
      // 分类名称
      cateName: undefined,
      // 状态数据字典
      statusOptions: [{
        'dictValue': 1,
        'dictLabel': '开启'
      }, {
        'dictValue': 0,
        'dictLabel': '关闭'
      }, {
        'dictValue': -1,
        'dictLabel': '全部'
      }],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 30,
        nick: '',
        title: '',
        is_state: -1,
        cate_id: 0
      }
    }
  },
  watch: {
    // 根据名称筛选分类树
    cateName(val) {
      this.getCareselect()
    }
  },
  created() {
    this.getList()
    this.getCareselect()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      getArticleList(this.queryParams).then(
        response => {
          this.articleList = response.data.list
          this.total = response.data.count
          this.loading = false
          console.log('response.data', response.data)
        }
      )
    },
    /** 查询分类下拉树结构 */
    getCareselect() {
      getCategory({
        'page': 1,
        'page_sieze': 1000,
        'is_state': 1,
        'name': this.cateName == undefined ? '' : this.cateName
      }).then(response => {
        this.cateOptions = response.data.list
      })
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.loading = true
      this.queryParams.cate_id = data.id
      this.getList()
    },
    // 文章状态修改
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
        username: undefined,
        nickName: undefined,
        password: undefined,
        title: undefined,
        nick: undefined,
        is_state: -1,
        remark: undefined,
        postIds: undefined,
        roleIds: undefined
      }
      this.getList()
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset()
      // this.getTreeselect()
      this.$router.push({ path: '/subject/articleEdit', query: this.otherQuery })
    },
    /** 删除操作 */
    handleDelete(row) {

    },
    /** 更新操作 */
    handleUpdate(row) {
      const id = row.id || this.ids[0]
      this.$router.push({ path: '/subject/articleEdit?articleId=' + id, query: this.otherQuery })
    }
  }
}
</script>
