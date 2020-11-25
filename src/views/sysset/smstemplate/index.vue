<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">

      <el-form-item label="短信模板类型" prop="smsType">
        <el-select
          v-model="queryParams.smsType"
          placeholder="短信模板类型"
          clearable
          size="small"
          style="width: 180px">
          <el-option
            v-for="dict in smsTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="短信模板标题" prop="smsTitle">
        <el-input
          v-model="queryParams.smsTitle"
          placeholder="请输入短信模板标题"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="班级状态"
          clearable
          size="small"
          style="width: 180px">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['sysset:smstemplate:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sysset:smstemplate:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sysset:smstemplate:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="smstemplateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="短信模板类型" align="center" prop="smsType" :formatter="smsTypeFormat" />
      <el-table-column label="短信模板标题" align="center" prop="smsTitle" :show-overflow-tooltip="true" />
      <el-table-column label="短信模板内容" align="center" prop="smsContent" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="modifyTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifyTime) }}</span>
        </template>
      </el-table-column>


      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
                  v-model="scope.row.status"
                  active-value="1"
                  inactive-value="0"
                  @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>



      <el-table-column label="操作" align="center" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['sysset:smstemplate:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['sysset:smstemplate:remove']"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="10" class="mb8">

          <el-col :span="1.5">
           <el-form-item label="短信模板类型" prop="smsType">
            <el-select v-model="form.smsType" placeholder="短信模板类型" clearable >
              <el-option
                v-for="dict in smsTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"/>
            </el-select>
           </el-form-item>
           </el-col>

       <el-col :span="1.5">
        <el-form-item label="短信模板标题" prop="smsTitle">
          <el-input v-model="form.smsTitle" placeholder="请输入短信模板标题" />
        </el-form-item>
       </el-col>

       <el-col :span="24">
        <el-form-item label="短信模板内容" prop="smsContent">
          <el-input type="textarea"  v-model="form.smsContent" placeholder="请输入短信模板内容" />
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
import { listSmsTemplate, getSmsTemplate, addSmsTemplate, updateSmsTemplate, delSmsTemplate, exportSmsTemplate,changeSmsTemplateStatus} from "@/api/sysset/smstemplate";


export default {
  name: "Smstemplate",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 字典表格数据
      smstemplateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 短信类型
      smsTypeOptions: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        smsType: undefined,
        smsTitle: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        smsType: [
          { required: true, message: "短信模板类型不能为空", trigger: "blur" }
        ],
        smsTitle: [
          { required: true, message: "短信模板标题不能为空", trigger: "blur" }
        ],
        smsContent: [
          { required: true, message: "短信模板内容不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sms_type").then(response => {
      this.smsTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询短信模板列表 */
    getList() {
      this.loading = true;
      listSmsTemplate(this.queryParams).then(response => {
          this.smstemplateList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 字典设备状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    smsTypeFormat(row, column) {
      return this.selectDictLabel(this.smsTypeOptions, row.smsType);
    },
    // 短信模板状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.smsTitle + '"短信模板吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeSmsTemplateStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        smsType: undefined,
        smsTitle: undefined,
        smsContent: undefined,
        status: "1",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加短信模板信息";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSmsTemplate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改短信模板信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSmsTemplate(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addSmsTemplate(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除短信模板编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSmsTemplate(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有短信模板数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSmsTemplate(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

  }
};
</script>
