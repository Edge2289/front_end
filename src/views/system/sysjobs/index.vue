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
      <el-table-column label="任务ID" prop="tab_name" width="120" />
      <el-table-column label="任务名称" prop="tab_name" width="120" />
      <el-table-column label="cron表达式" prop="tab_name" width="120" />
      <el-table-column label="调用目标" prop="tab_name" width="120" />
      <el-table-column label="执行状态" prop="tab_name" width="120" />
      <el-table-column label="任务状态" prop="tab_name" width="120" />
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
          <el-input v-model="form.label" placeholder="请输入任务名称" />
        </el-form-item>

        <!-- 任务分组 -->
        <el-form-item
          label="任务分组"
          prop="job_group"
          style="width: 50%; float: left"
          label-width="100px"
        >
          <el-input v-model="form.label" placeholder="请输入任务分组" />
        </el-form-item>

        <!-- 调用目标 -->
        <el-form-item prop="invoke_target" label-width="100px" style="width: 100%; float: left">
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
          <el-input v-model="form.label" placeholder="请输入调用目标" />
        </el-form-item>

        <!-- execution_policy -->
        <el-form-item prop="execution_policy" label-width="100px" style="width: 100%; float: left">
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
          <el-input v-model="form.label" placeholder="请输入调用目标" />
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
          <el-input v-model="form.label" placeholder="请输入cron表达式" />
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
          <el-radio-group v-model="is_concurrent">
            <el-radio-button label="1"> 允许 </el-radio-button>
            <el-radio-button label="0"> 禁止 </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="job_group" label-width="100px" style="width: 100%; float: left">
          <span slot="label">
            <span class="span-box">
              <span> 调用类型 </span>
            </span>
          </span>
          <el-radio-group >
            <el-radio-button label="接口"></el-radio-button>
            <el-radio-button label="函数"></el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="job_group" label-width="100px" style="width: 100%; float: left">
          <span slot="label">
            <span class="span-box">
              <span> 执行策略 </span>
            </span>
          </span>
          <el-radio-group>
            <el-radio-button label="循环执行"></el-radio-button>
            <el-radio-button label="执行一次"></el-radio-button>
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
      width="500px"
    >
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getLabel, putLabel, addLabel, delLabel } from "@/api/article/article";
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
        is_concurrent: "允许",
      },
      is_concurrent: "0",
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
      getLabel(this.queryParams).then((response) => {
        this.loading = false;
        this.total = response.data.total;
        const tab_list = [];
        response.data.data.forEach((item, index) => {
          tab_list[index] = {
            tab_id: item.id,
            tab_name: item.label,
            tab_color: item.color,
            is_state: item.is_state,
            operator_name: item.operator_name,
            created_at: item.created_time,
          };
        });
        this.tab_list = tab_list;
      });
    },
    // 标签状态修改
    handleStatusChange(row) {
      const text = row.is_state == 1 ? "启用" : "停用";
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
          putLabel({
            label: row.tab_name,
            color: row.tab_color,
            is_state: row.is_state,
            id: row.tab_id,
          });
        })
        .catch(function () {
          row.is_state = row.is_state == 0 ? 1 : 0;
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
        label: "",
        color: "",
        is_state: -1,
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
      this.queryParams.label = "";
      this.queryParams.is_state = -1;
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
      this.title = "添加任务";
      this.isEdit = false;
      this.form.is_state = 1;
    },
    handleJobLog(row) {
      this.jobsOpen = true;
      this.jobsTitle = "任务001日志";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tabIds = row.tab_id || this.ids[0];
      getLabel({ id: tabIds, is_state: -1 }).then((response) => {
        this.form.label = response.data.data[0].label;
        this.form.is_state = response.data.data[0].is_state;
        this.form.color = response.data.data[0].color;
        this.form.id = response.data.data[0].id;
      });
      this.open = true;
      this.title = "修改标签";
      this.isEdit = false;
      //   })
    },
    /** 提交按钮 */
    submitForm: function () {
      let requestHeader = "";
      if (this.form.id !== undefined) {
        requestHeader = putLabel(this.form);
      } else {
        requestHeader = addLabel(this.form);
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
      const tab_ids = row.tab_id || this.ids;
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
          delLabel({
            id: tab_ids.join(","),
          }).then((response) => {
            console.log(response.data);
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
