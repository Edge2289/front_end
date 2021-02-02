<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="任务名称" prop="roleName">
        <el-input
          v-model="queryParams.job_name"
          placeholder="请输入任务名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.is_state"
          placeholder="任务状态"
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
      <el-table-column type="selection" width="55" align="tab_id" />
      <el-table-column label="任务ID" prop="id" width="120" />
      <el-table-column label="任务名称" prop="job_name" width="120" />
      <el-table-column label="cron表达式" prop="cron_expression" width="120" />
      <el-table-column label="调用目标" prop="invoke_target" width="120" />
      <el-table-column label="执行状态" prop="entry_id" width="120" />
      <el-table-column label="任务状态" prop="is_state" width="120" />
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
            icon="el-icon-sort"
            @click="handleUpdate(scope.row)"
            >暂停/开启</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleJobLog(scope.row)"
            >日志</el-button
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

    <!-- 添加或修改对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" label-width="80px">
        <!-- 任务名称 -->
        <el-form-item
          prop="job_name"
          style="width: 50%; float: left"
          label-width="100px"
        >
          <span slot="label">
            <span class="span-box">
              <span style="color: red">*</span>
              <span> 任务名称 </span>
            </span>
          </span>
          <el-input v-model="form.job_name" placeholder="请输入任务名称" />
        </el-form-item>

        <!-- 任务分组 -->
        <el-form-item
          label="任务分组"
          prop="job_group"
          style="width: 50%; float: left"
          label-width="100px"
        >
          <el-input v-model="form.job_group" placeholder="请输入任务分组" />
        </el-form-item>

        <!-- 调用目标 -->
        <el-form-item
          prop="invoke_target"
          label-width="100px"
          style="width: 100%; float: left"
        >
          <span slot="label">
            <span class="span-box">
              <span style="color: red">*</span>
              <span> 调用目标 </span>
              <el-tooltip
                class="item"
                effect="dark"
                content="调用示例：func(t *Exec) PushParams(){...}, 填写pushParams 即可"
                placement="top"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </span>
          </span>
          <el-input v-model="form.invoke_target" placeholder="请输入调用目标" />
        </el-form-item>

        <!-- execution_policy -->
        <el-form-item
          prop="execution_policy"
          label-width="100px"
          style="width: 100%; float: left"
        >
          <span slot="label">
            <span class="span-box">
              <span> 目标参数 </span>
              <el-tooltip
                class="item"
                effect="dark"
                content="传输给调用目标参数, 格式：text:123,key:value"
                placement="top"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </span>
          </span>
          <el-input
            v-model="form.target_parameter"
            placeholder="请输入调用目标"
          />
        </el-form-item>

        <!-- cron_expression -->
        <el-form-item
          prop="cron_expression"
          style="width: 50%; float: left"
          label-width="100px"
        >
          <span slot="label">
            <span class="span-box">
              <span style="color: red">*</span>
              <span> cron表达式 </span>
            </span>
          </span>
          <el-input
            v-model="form.cron_expression"
            placeholder="请输入cron表达式"
          />
        </el-form-item>

        <el-form-item
          prop="is_concurrent"
          style="width: 50%; float: left"
          label-width="100px"
        >
          <span slot="label">
            <span class="span-box">
              <span> 是否并发 </span>
              <el-tooltip
                class="item"
                effect="dark"
                content="当任务执行时间大于设定下次时间，是否允许并发执行"
                placement="top"
              >
                <i class="el-icon-question" />
              </el-tooltip>
            </span>
          </span>
          <el-radio-group v-model="form.is_concurrent">
            <el-radio-button label="1"> 允许 </el-radio-button>
            <el-radio-button label="0"> 禁止 </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          prop="invoke_type"
          label-width="100px"
          style="width: 100%; float: left"
        >
          <span slot="label">
            <span class="span-box">
              <span> 调用类型 </span>
            </span>
          </span>
          <el-radio-group v-model="form.invoke_type">
            <el-radio-button label="interface"> 接口 </el-radio-button>
            <el-radio-button label="function"> 函数 </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item
          prop="execution_policy"
          label-width="100px"
          style="width: 100%; float: left"
        >
          <span slot="label">
            <span class="span-box">
              <span> 执行策略 </span>
            </span>
          </span>
          <el-radio-group v-model="form.execution_policy">
            <el-radio-button label="loop_execution"> 循环执行 </el-radio-button>
            <el-radio-button label="perform"> 执行一次 </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" style="width: 100%; float: left">
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

    <!-- 日志弹出框 -->
    <el-dialog
      v-dialogDrag
      :title="jobsTitle"
      :visible.sync="jobsOpen"
      width="80%"
    >
      <el-table :data="jobLogData" stripe style="width: 100%" height="250">
        <el-table-column prop="job_id" align="center" label="任务id" width="80"> </el-table-column>
        <el-table-column prop="start_time" label="开始日期" width="240"> </el-table-column>
        <el-table-column prop="end_time" label="结束日期" width="240"> </el-table-column>
        <el-table-column label="执行状态">
          <template slot-scope="scope">
            <span>{{ scope.row.is_state == 1? "执行成功": "执行失败"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="err_msg" label="异常信息">
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        v-show="jobLogQuery.total > 0"
        :total="jobLogQuery.total"
        :page.sync="jobLogQuery.page"
        :limit.sync="jobLogQuery.page_size"
        @pagination="getJobsLogList"
      />
      <!-- 分页 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getJobsList,
  delJob,
  updateJobsData,
  addJobsData,
  getJobLogList,
  changeJobExecution,
} from "@/api/system/system";
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
      // 日志弹窗
      jobsOpen: false,
      // 日志弹窗标题
      jobsTitle: "",
      isEdit: false,
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
        id: "",
        job_name: "",
        job_group: "",
        cron_expression: "",
        invoke_type: "interface",
        execution_policy: "loop_execution",
        is_concurrent: 0,
        invoke_target: "",
        is_state: 0,
        target_parameter: "",
      },
      jobLogQuery: {
        id: "",
        total: 1,
        page: 1,
        page_size: 10,
      },
      jobLogData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询标签列表 */
    getList() {
      this.loading = true;
      getJobsList(this.queryParams).then((response) => {
        this.loading = false;
        this.total = response.data.total;
        const tab_list = [];
        this.tab_list = response.data.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.jobsOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: "",
        job_name: "",
        job_group: "",
        cron_expression: "",
        invoke_type: "interface",
        execution_policy: "loop_execution",
        is_concurrent: 0,
        invoke_target: "",
        is_state: 0,
        target_parameter: "",
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
      this.queryParams.job_name = "";
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
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
      this.isEdit = false;
      this.form.is_state = 1;
    },
    // 打开任务日志
    handleJobLog(row) {
      this.jobsTitle = row.job_name;
      this.jobLogQuery.id = row.id;
      this.jobLogData = [];
      this.jobsOpen = true;
      this.getJobsLogList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.id || this.ids[0];
      getJobsList({ id: ids, is_state: -1 }).then((response) => {
        this.form = response.data.data[0];
        this.open = true;
        this.title = "修改任务";
        this.isEdit = false;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      let requestHeader = "";
      if (this.form.id != "") {
        requestHeader = updateJobsData(this.form);
      } else {
        requestHeader = addJobsData(this.form);
      }
      requestHeader.then((response) => {
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
      const tab_ids = row.id || this.ids;
      let text = "";
      if (row.job_name != undefined) {
        text = ": " + row.job_name;
      }
      this.$confirm("是否确认删除任务" + text + " ?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          delJob({
            id: tab_ids.join(","),
          }).then((response) => {
            if (response.code == 200) {
              this.msgSuccess(response.msg);
            } else {
              this.msgError(response.msg);
            }
          });
        })
        .catch(function () {});
      this.getList();
    },
    getJobsLogList() {
      getJobLogList(this.jobLogQuery).then((response) => {
        this.jobLogData = response.data.data;
        this.jobLogQuery.total = response.data.total
      })
    },
  },
};
</script>
