<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
      <el-form-item label="学号" prop="studentNo">
        <el-input
          v-model="queryParams.studentNo"
          placeholder="请输入学号"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="学生手机号" prop="studentPhone">
        <el-input
          v-model="queryParams.studentPhone"
          placeholder="请输入学生手机号"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="请假类型" prop="leaveType">
        <el-select
          v-model="queryParams.leaveType"
          placeholder="请假类型"
          clearable
          size="small"
          style="width: 180px">
          <el-option
            v-for="dict in leaveTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请假状态"
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
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="sdleaveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="学号" align="center" prop="studentNo" :show-overflow-tooltip="true" />
      <el-table-column label="学生姓名" align="center" prop="studentName" :show-overflow-tooltip="true" />
      <el-table-column label="学生手机号" align="center" prop="studentPhone" :show-overflow-tooltip="true" />
      <el-table-column label="请假类型" align="center" prop="leaveType" :formatter="leaveTypeFormat" />
      <el-table-column label="请假日期" align="center" prop="leaveDate" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180px">
        <template slot-scope="scope" v-if="scope.row.status==='2'">
          <el-button
                  @click="handleApproval(scope.row)"
                  v-hasPermi="['smartdor:sdleave:approval']"
                  style="background-color: #00aa00; color: white;"
          >审核</el-button>
          <el-button
                   @click="handleReject(scope.row)"
                   v-hasPermi="['smartdor:sdleave:reject']"
                   style="background-color: #ff5500; color: white;"
           >驳回</el-button>

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


       <el-col :span="24">
        <el-form-item label="驳回描述信息" prop="teacherDesc">
          <el-input type="textarea"  v-model="form.teacherDesc" placeholder="请输入驳回描述信息" />
        </el-form-item>
       </el-col>

     </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 学生请假信息导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px">
      <el-upload
        ref="upload"
        :limit="1"
        multiple="multiple"
        name="upload"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"/>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSdLeave, getSdLeave, exportSdLeave,approveStatus,reject, importTemplate} from "@/api/smartdor/sdleave";
import { getToken } from "@/utils/auth";

export default {
  name: "SdLeave",
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
      sdleaveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 短信类型
      leaveTypeOptions: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        studentNo: undefined,
        studentPhono: undefined,
        leaveType: undefined,
        status: undefined
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: "http://localhost:9003/smartdor/sdleave/importData"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        teacherDesc: [
          { required: true, message: "驳回描述信息不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("leave_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("leave_type").then(response => {
      this.leaveTypeOptions = response.data;
    });
  },
  methods: {
    /** 查询请假列表 */
    getList() {
      this.loading = true;
      listSdLeave(this.queryParams).then(response => {
          this.sdleaveList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    // 字典设备状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    leaveTypeFormat(row, column) {
      return this.selectDictLabel(this.leaveTypeOptions, row.leaveType);
    },
    // 审核通过
    handleApproval(row) {
      row.status ="3";
      this.$confirm('确定审核通过？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return approveStatus(row.id, row.status);
        }).then(() => {
          this.msgSuccess("审核通过!!!");
        }).catch(function() {
          this.msgSuccess("异常!!!");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 驳回按钮操作 */
    handleReject(row) {
      this.reset();
      const id = row.id || this.ids
      getSdLeave(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "驳回请假信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            this.form.status="5";
            reject(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("驳回成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {

          }
        }
      });
    },
    // 导入按钮操作
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.message, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 下载模板操作
    importTemplate() {
      importTemplate().then(response => {
        this.fileDownload(response.data, "请假信息下载模板.xlsx");
      });
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const ids = row.id || this.ids;
    //   this.$confirm('是否确认删除短信模板编号为"' + ids + '"的数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return delSmsTemplate(ids);
    //     }).then(() => {
    //       this.getList();
    //       this.msgSuccess("删除成功");
    //     }).catch(function() {});
    // },
    // /** 导出按钮操作 */
    // handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm('是否确认导出所有短信模板数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return exportSmsTemplate(queryParams);
    //     }).then(response => {
    //       this.download(response.msg);
    //     }).catch(function() {});
    // },

  }
};
</script>
