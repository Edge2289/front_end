<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="链接内容" prop="roleName">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入链接内容"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="访问类型" prop="status">
        <el-select
          v-model="queryParams.type"
          placeholder="访问类型"
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

    <el-table v-loading="loading" :data="tab_list">
      <el-table-column fixed label="链接" prop="uri" width="260" />
      <el-table-column label="来源链接" prop="source_uri" width="260" />
      <el-table-column label="关键词" prop="key_word" width="100" />
      <el-table-column label="来源类型" prop="tab_name" width="50" />
      <el-table-column label="ip" prop="ip" width="90">
        <template slot-scope="scope">
          <a
            href="javascript:void(0);"
            style="color: blue; text-decoration: underline"
            @click="openSelectHandle(scope.row, 'ip')"
          >
            {{ scope.row.ip }}
          </a>
          <!-- <el-button size="small" @click="handle(scope.row)">编辑</el-button> -->
        </template>
      </el-table-column>
      <el-table-column label="cookie" prop="cookie" width="300">
        <!-- cookie -->
        <template slot-scope="scope">
          <a
            href="javascript:void(0);"
            style="color: blue; text-decoration: underline"
            @click="openSelectHandle(scope.row, 'cookie')"
          >
            {{ scope.row.cookie }}
          </a>
        </template>
      </el-table-column>
      <el-table-column label="user_agent" prop="user_agent" width="500" />
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
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.page_size"
      @pagination="getList"
    />

    <!-- 日志弹出框 -->
    <el-dialog
      v-dialogDrag
      :title="accessTitle"
      :visible.sync="open"
      width="80%"
    >
      <el-table v-loading="select_loading" :data="selectAccess" :max-height="300">
        <el-table-column fixed label="链接" prop="uri" width="260" />
        <el-table-column label="来源链接" prop="source_uri" width="260" />
        <el-table-column label="关键词" prop="key_word" width="100" />
        <el-table-column label="ip" prop="ip" width="90">
          <template slot-scope="scope">
            {{ scope.row.ip }}
          </template>
        </el-table-column>
        <el-table-column label="cookie" prop="cookie" width="300">
          <!-- cookie -->
          <template slot-scope="scope">
            {{ scope.row.cookie }}
          </template>
        </el-table-column>
        <el-table-column label="user_agent" prop="user_agent" width="500" />
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
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="select_total > 0"
        :total="select_total"
        :page.sync="selectQueryParams.page"
        :limit.sync="selectQueryParams.page_size"
        @pagination="getSelectList"
      />
      <!-- 分页 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTallyData } from "@/api/monitor/server";
import { dialogDrag } from "@/utils/directives";

export default {
  name: "Tab",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      open: false,
      // 标签表格数据
      tab_list: [],
      // 搜索状态数据字典
      statusOptions: [
        {
          dictValue: 0,
          dictLabel: "全部",
        },
        {
          dictValue: 1,
          dictLabel: "搜索",
        },
        {
          dictValue: 2,
          dictLabel: "分类",
        },
        {
          dictValue: 3,
          dictLabel: "标签",
        },
        {
          dictValue: 4,
          dictLabel: "文章详情",
        },
      ],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        title: "",
        type: 0,
      },
      // 查询参数
      selectQueryParams: {
        select_page: 1,
        select_page_size: 10,
      },
      // 选择的
      selectAccess: [],
      select_loading: false,
      select_total: 0,
      accessTitle: "",
      // 表单参数
      form: {
        is_state: 0,
      },
      defaultProps: {
        children: "children",
        label: "label",
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
      getTallyData(this.queryParams).then((response) => {
        this.loading = false;
        this.total = response.data.total;
        this.tab_list = response.data.data;
      });
    },
    getSelectList() {
      this.select_loading = true;
      this.selectQueryParams['page'] = this.selectQueryParams['select_page']
      this.selectQueryParams['page_size'] = this.selectQueryParams['select_page_size']
      getTallyData(this.selectQueryParams).then((response) => {
        this.select_loading = false;
        this.select_total = response.data.total;
        this.selectAccess = response.data.data;
      });
    },
    cancel() {
      this.open = false;
      this.select_loading = false;
      this.selectQueryParams['ip'] = '';
      this.selectQueryParams['cookie'] = '';
    },
    // 表单重置
    reset() {
      this.form = {
        page: 1,
        page_size: 10,
        title: "",
        type: 0,
      };
    },
    openSelectHandle(row, type) {
      if (type == "ip") {
        this.selectQueryParams["ip"] = row.ip;
        this.accessTitle = type + "搜索列表:" + row.ip;
      } else {
        this.accessTitle = type + "搜索列表:" + row.cookie;
        this.selectQueryParams["cookie"] = row.cookie;
      }
      this.open = true;
      this.getSelectList()
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
      this.queryParams.label = "";
      this.queryParams.is_state = -1;
      this.handleQuery();
    },
  },
};
</script>
