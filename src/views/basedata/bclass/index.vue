<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="班级名称" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班级名称"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="班主任" prop="classTeacherName">
        <el-input
          v-model="queryParams.classTeacherName"
          placeholder="请输入班主任名称"
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
          v-hasPermi="['basedata:bclass:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basedata:bclass:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basedata:bclass:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="bclassList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="班级名称" align="center" prop="className" :show-overflow-tooltip="true" />
      <el-table-column label="班主任" align="center" prop="classTeacherName" :show-overflow-tooltip="true" />
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
                  v-hasPermi="['basedata:bclass:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['basedata:bclass:remove']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
        <el-form-item label="班级名称" prop="className">
          <el-input v-model="form.className" placeholder="请输入班级名称" :disabled="disabledInput" />
        </el-form-item>
        </el-col>
        <el-col :span="1.5">
        <el-form-item label="班主任" prop="classTeacherId">
           <el-select v-model="form.classTeacherId"  placeholder="请选择">
             <el-option
                     v-for="item1 in userOptions"
                     :key="item1.id"
                     :label="item1.username"
                     :value="item1.id"
             />
           </el-select>
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
import { listBClass, getBClass, addBClass, updateBClass, delBClass, exportBClass,changeBClassStatus} from "@/api/basedata/bclass";
import { getClassTeacherList } from "@/api/system/user";

export default {
  name: "BClass",
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
      bclassList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 班主任
      userOptions: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        className: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        className: [
          { required: true, message: "班级名称不能为空", trigger: "blur" }
        ],
        classTeacherId: [
          { required: true, message: "班主任不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getClassTeacherList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询班级列表 */
    getList() {
      this.loading = true;
      listBClass(this.queryParams).then(response => {
          this.bclassList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    getClassTeacherList(){
      getClassTeacherList().then(response => {
        this.userOptions = response.data;
      });
    },
    // 字典设备状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 班级状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.className + '"班级吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeBClassStatus(row.id, row.status);
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
        className: undefined,
        classTeacherId: undefined,
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
      this.title = "添加班级信息";
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
      getBClass(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改班级信息";
        this.disabledInput=true;
        const userId=row.userId;
        this.form.userId=0;
        this.userOptions.map((item1)=>{
          if(item1.id===userId){
            this.form.userId=item1.id;
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateBClass(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addBClass(this.form).then(response => {
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
      this.$confirm('是否确认删除班级编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBClass(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有班级数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBClass(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    // 获取当前选中班主任的名称
    selectUser(val) {
      alert(val.label);
      this.form.username = val.label
    }
  }
};
</script>
