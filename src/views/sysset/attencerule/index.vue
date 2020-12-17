<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
       <el-form-item label="考勤规则类型" prop="attenceRuleType">
         <el-select
           v-model="queryParams.attenceRuleType"
           placeholder="考勤规则类型"
           clearable
           size="small"
           style="width: 180px">
           <el-option
             v-for="dict in attenceRuleTypeOptions"
             :key="dict.dictValue"
             :label="dict.dictLabel"
             :value="dict.dictValue"
           />
         </el-select>
       </el-form-item>

      <el-form-item label="考勤规则名称" prop="attenceRuleName">
        <el-input
          v-model="queryParams.attenceRuleName"
          placeholder="请输入考勤规则名称"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="考勤规则状态"
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
          v-hasPermi="['sysset:attencerule:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sysset:attencerule:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sysset:attencerule:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="attenceruleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="考勤规则类型" align="center" prop="attenceRuleType" :formatter="attenceRuleTypeFormat" />
      <el-table-column label="考勤规则名称" align="center" prop="attenceRuleName" :show-overflow-tooltip="true" />
      <el-table-column label="正常考勤日期(星期)" align="center" prop="attenceDay" :show-overflow-tooltip="true" />
      <el-table-column label="正常考勤开始时间" align="center" prop="attenceStartTime" :show-overflow-tooltip="true" />
      <el-table-column label="正常考勤结束时间" align="center" prop="attenceEndTime" :show-overflow-tooltip="true" />
      <el-table-column label="放假开始时间" align="center" prop="holidayStartDate" width="130">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.holidayStartDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="放假结束时间" align="center" prop="holidayEndDate" width="130">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.holidayEndDate) }}</span>
        </template>
      </el-table-column>

     <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="modifyTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifyTime) }}</span>
        </template>
      </el-table-column> -->


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
                  v-hasPermi="['sysset:attencerule:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['sysset:attencerule:remove']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
           <el-form-item label="考勤规则类型" prop="attenceRuleType">
            <el-select v-model="form.attenceRuleType" placeholder="考勤规则类型" clearable @change="changeRuleType" >
              <el-option
                v-for="dict in attenceRuleTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"/>
            </el-select>
           </el-form-item>
           </el-col>
       </el-row>

      <el-row :gutter="10" class="mb8">
       <el-col :span="1.5" style="width: 410px;">
        <el-form-item label="考勤规则名称" prop="attenceRuleName">
          <el-input v-model="form.attenceRuleName" placeholder="请输入考勤规则名称"  :disabled="disabledInput" />
        </el-form-item>
       </el-col>
      </el-row>
      <div id="between_time" v-show="flag1">
      <el-row :gutter="10" class="mb8">
       <el-col :span="24">
         <el-form-item label="正常考勤日期">
           <el-select v-model="form.attenceDay" multiple placeholder="请选择">
             <el-option
                     v-for="item in attenceDayOptions"
                     :key="item.dictValue"
                     :label="item.dictLabel"
                     :value="item.dictValue"
                     :disabled="item.status == 0"
             />
           </el-select>
         </el-form-item>
       </el-col>
       </el-row>
      <el-row :gutter="10" class="mb8" style="width: 800px;">
       <el-col :span="24" >
             <el-form-item label="正常考勤时间">
               <el-time-picker
                       v-model="form.attenceStartTime"
                       size="small"
                       style="width: 120px"
                       value-format="HH:mm"
                       format="HH:mm"
                       type="daterange"
                       start-placeholder="开始时间"
               />
             </el-form-item> 至
             <el-form-item>
               <el-time-picker
                       v-model="form.attenceEndTime"
                       size="small"
                       style="width: 120px"
                       value-format="HH:mm"
                       format="HH:mm"
                       type="daterange"
                       end-placeholder="结束时间"
               />
             </el-form-item>
       </el-col>
      </el-row>
      </div>
        <!-- id出现重复暂时加了个1 -->
      <div id="between_time1" v-show="flag">
      <el-row :gutter="10" class="mb8">
       <el-col :span="24" >
         <el-form-item label="放假开始时间">
           <el-date-picker
                   v-model="form.holidayStartDate"
                   type="datetime"
                   size="small"
                   style="width: 200px"
                   value-format="yyyy-MM-dd HH:mm:ss"
                   format="yyyy-MM-dd HH:mm"

           />
         </el-form-item>
       </el-col>
       </el-row>
      <el-row :gutter="10" class="mb8">
       <el-col :span="24">
         <el-form-item label="放假结束时间">
           <el-date-picker
                   v-model="form.holidayEndDate"
                   type="datetime"
                   size="small"
                   style="width: 200px"
                   value-format="yyyy-MM-dd HH:mm:ss"
                   format="yyyy-MM-dd HH:mm"
           />
         </el-form-item>
       </el-col>
     </el-row>
     </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAttenceRule, getAttenceRule, addAttenceRule, updateAttenceRule, delAttenceRule, exportAttenceRule,changeAttenceRuleStatus} from "@/api/sysset/attencerule";


export default {
  name: "AttenceRule",
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
      attenceruleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
     // 控制放假时间的隐藏和显示
      flag: true,
      flag1: true,
      // 状态数据字典
      statusOptions: [],
      attenceRuleTypeOptions: [],
      attenceDayOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        attenceRuleType: undefined,
        attenceRuleName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        attenceRuleType: [
          { required: true, message: "考勤规则类型不能为空", trigger: "blur" }
        ],
        attenceRuleName: [
          { required: true, message: "考勤规则名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("attence_rule_type").then(response => {
      this.attenceRuleTypeOptions = response.data;
    });
    this.getDicts("attence_day").then(response => {
      this.attenceDayOptions = response.data;
    });
  },
  methods: {
    /** 查询短信模板列表 */
    getList() {
      this.loading = true;
      listAttenceRule(this.queryParams).then(response => {
          this.attenceruleList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    changeRuleType(){
       let ruleType = this.form.attenceRuleType;
       if(ruleType=='1'){
            this.flag = false;
            this.flag1 = true;
       }else if(ruleType=='2'){
            this.flag = true;
            this.flag1 = false;
       }
    },
    // 字典设备状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    attenceRuleTypeFormat(row, column) {
      return this.selectDictLabel(this.attenceRuleTypeOptions, row.attenceRuleType);
    },
    attenceDayFormat(row, column) {
      return this.selectDictLabel(this.attenceDayOptions, row.attenceDay);
    },
    // 考勤规则状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.attenceRuleName + '"考勤规则吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeAttenceRuleStatus(row.id, row.status);
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
        attenceRuleType: undefined,
        attenceRuleName: undefined,
        attenceDay: undefined,
        attenceStartTime: undefined,
        attenceEndTime: undefined,
        holidayStartDate: undefined,
        holidayEndDate: undefined,
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
      this.title = "添加考勤规则信息";
      this.disabledInput=false;
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
      getAttenceRule(id).then(response => {
        this.form = response.data;
        this.form.attenceDay = JSON.parse(response.data.attenceDay);
        this.open = true;
        this.title = "修改考勤规则信息";
        this.disabledInput=true;
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.attenceDay = JSON.stringify(this.form.attenceDay )
          if (this.form.id !== undefined) {
            updateAttenceRule(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addAttenceRule(this.form).then(response => {
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
      this.$confirm('是否确认删除考勤规则编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAttenceRule(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有考勤规则数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAttenceRule(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

  }
};
</script>
