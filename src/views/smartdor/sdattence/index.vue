<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="日期">
        <el-date-picker
          v-model="queryParams.checkDate"
          size="small"
          style="width: 140px"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['smartdor:sdhygiene:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="sdattenceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="考勤类型" align="center" prop="deviceNo" :show-overflow-tooltip="true" :formatter="devicestatusFormat" />
      <el-table-column label="学号" align="center" prop="studentNo"  />
      <el-table-column label="学生姓名" align="center" prop="studentName"  /> >
      <el-table-column label="出入时间" align="center" prop="accessDate"  width="160" />
      <el-table-column label="考勤状态" align="center" prop="attenceStatus" :show-overflow-tooltip="true" :formatter="attencestatusFormat" />
      <el-table-column label="缺勤处理状态" align="center" prop="absenceProcessStatus" :show-overflow-tooltip="true"  :formatter="absenceProcessStatusFormat"/>
      <el-table-column label="创建时间" align="center" prop="createTimef" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            circle type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['smartdor:sdhygiene:remove']"
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


  </div>
</template>

<script>
  import { listsdattence,delSdattence} from "@/api/smartdor/sdattence.js";
  import {  getBStudentByNo} from "@/api/basedata/bstudent";

  export default {
    name: "sdattence",
    data() {
      return {
        studentName:'',
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
        sdattenceList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 考勤状态
        attenceStatusOptions: [],

        //考勤处理状态
        absenceProcessStatus:[],

        deviceOptions:[],

        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          checkDate: undefined
        },
        // 表单参数
        form: {},
        dialogVisible: false,
      };
    },
    created() {
      this.getList();
      this.getDicts("attence_status").then(response => {
        this.attenceStatusOptions = response.data;
      });

      this.getDicts("absence_process_status").then(response => {
        this.absenceProcessStatus = response.data;
      });

      this.getDicts("device_access_type").then(response => {
        console.log(response.data);
        this.deviceOptions = response.data;
      });
    },
    methods: {
      //回填考勤状态
      attencestatusFormat(row, column) {
        return this.selectDictLabel(this.attenceStatusOptions, row.attenceStatus);
      },
      //回填考勤状态处理
      absenceProcessStatusFormat(row, column) {
        return this.selectDictLabel(this.absenceProcessStatus, row.absenceProcessStatus);
      },
      //回填考勤类型
      devicestatusFormat(row, column) {
        return this.selectDictLabel(this.deviceOptions, 2);
      },
      /** 查询考勤记录列表 */
      getList() {
        this.loading = true;
        listsdattence(this.queryParams).then(response => {
            this.sdattenceList = response.data.list;
            this.total = response.data.total;
            this.loading = false;
          }
        );
      },
      /*studentNameFormat(row,column){
       getBStudentByNo(row.studentNo).then(response=>{
         this.studentName= response.data.studentName;

       })
        return this.studentName;
      },*/

      storeyFormat(row, column) {
        return this.selectDictLabel(this.storeyOptions, row.storey);
      },
      bdormitoryFormat(row, column) {
        return this.selectDictLabel(this.bdormitoryOptions, row.bdormitoryId);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除考勤信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSdattence(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有卫生信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSdHygiene(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
