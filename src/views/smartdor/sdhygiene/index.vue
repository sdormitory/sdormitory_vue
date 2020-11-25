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
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['smartdor:sdhygiene:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['smartdor:sdhygiene:edit']"
        >修改</el-button>
      </el-col>
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

    <el-table v-loading="loading" :data="sdhygieneList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="卫生检查日期" align="center" prop="checkDate" :show-overflow-tooltip="true" />
      <el-table-column label="第几栋" align="center" prop="buildingNo" :formatter="buildingNoFormat" />
      <el-table-column label="楼层" align="center" prop="storey" :formatter="storeyFormat" />
      <el-table-column label="宿舍号" align="center" prop="dormitoryNo" :show-overflow-tooltip="true" />
      <el-table-column label="卫生扣分项" align="center" prop="deductIds" :formatter="hygieneDeductFormat" :show-overflow-tooltip="true" />
      <el-table-column label="总扣分" align="center" prop="totalPdeduct" :show-overflow-tooltip="true" />
      <el-table-column label="总得分" align="center" prop="totalScore" :show-overflow-tooltip="true" />

      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="修改时间" align="center" prop="modifyTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.modifyTime) }}</span>
        </template>
      </el-table-column> -->


      <el-table-column label="操作" align="center" width="100" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['smartdor:sdhygiene:edit']"
          />
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="10" class="mb8">
             <el-col :span="1.5">
               <el-form-item label="卫生检查日期">
                 <el-date-picker
                         v-model="form.checkDate"
                         size="small"
                         style="width: 140px"
                         value-format="yyyy-MM-dd"
                 />
               </el-form-item>
             </el-col>
        </el-row>
        <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
          <el-form-item label="宿舍栋号" prop="buildingNo">
           <el-select v-model="form.buildingNo" placeholder="宿舍栋号" clearable @change="change1">
             <el-option
               v-for="dict in buildingNoOptions"
               :key="dict.dictValue"
               :label="dict.dictLabel"
               :value="dict.dictValue"/>
           </el-select>
          </el-form-item>
          </el-col>
          </el-row>
          <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
           <el-form-item label="宿舍楼层" prop="storey">
            <el-select v-model="form.storey" placeholder="楼层" clearable @change="change2">
              <el-option
                v-for="dict in storeyOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"/>
            </el-select>
           </el-form-item>
           </el-col>
           </el-row>
           <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
           <el-form-item label="宿舍号" prop="bdormitoryId" >
              <el-select v-model="form.bdormitoryId"  placeholder="请选择"  @click.native="getPreValue"  >
                <el-option
                        v-for="item in bdormitoryOptions"
                        :key="item.id"
                        :label="item.dormitoryNo"
                        :value="item.id"
                />
              </el-select>
            </el-form-item>
        </el-col>
       </el-row>
       <el-row :gutter="10" class="mb8">
        <el-col :span="12" >
          <el-form-item label="卫生项">
            <el-select v-model="form.deductIds" multiple placeholder="请选择">
              <el-option
                      v-for="item in hygieneDeductOptions"
                      :key="item.id"
                      :label="item.deductOption"
                      :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
       </el-row>
        <el-row :gutter="10" class="mb8">
        <el-col :span="24">
         <el-form-item label="描述信息" prop="remark">
           <el-input type="textarea"  v-model="form.remark" placeholder="请输入描述信息" />
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
import { listSdHygiene, getSdHygiene, addSdHygiene, updateSdHygiene, delSdHygiene, exportSdHygiene} from "@/api/smartdor/sdhygiene";
import { listAllHygieneDeduct } from "@/api/sysset/hygienededuct";
import { getBDormitoryListByCol } from "@/api/basedata/bdormitory";

export default {
  name: "SdHygiene",
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
      sdhygieneList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 卫生扣分项
      hygieneDeductOptions: [],
      // 宿舍栋号
      buildingNoOptions: [],
      // 楼层
      storeyOptions: [],
      // 宿舍号
      bdormitoryOptions: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        checkDate: undefined
      },
      // 表单参数
      form: {},
      dialogImageUrl: '',
      dialogVisible: false,

      // 表单校验
      rules: {
        checkDate: [
          { required: true, message: "卫生检查日期不能为空", trigger: "blur" }
        ],
        buildingNo: [
          { required: true, message: "第几栋不能为空", trigger: "blur" }
        ],
        storey: [
          { required: true, message: "楼层不能为空", trigger: "blur" }
        ],
        bdormitoryId: [
          { required: true, message: "宿舍号不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.listAllHygieneDeduct();
    this.getDicts("sys_building").then(response => {
      this.buildingNoOptions = response.data;
    });
    this.getDicts("sys_storey").then(response => {
      this.storeyOptions = response.data;
    });
  },
  methods: {
    // change1(){
    //   this.bdormitoryOptions=[];
    //   this.form.bdormitoryId='';
    // },
    // change2(){
    //   this.bdormitoryOptions=[];
    //   this.form.bdormitoryId='';
    // },
    getPreValue(){
      if(this.form.buildingNo==undefined){
        alert("请先选择宿舍栋号");
        return;
      }else if(this.form.storey==undefined){
        alert("请先选择楼层");
        return;
      }
      // 获取栋号
     let buildingNo_dictValue=this.buildingNoOptions.find(val=>val.dictValue==this.form.buildingNo).dictValue

     // 获取楼层号
     let storey_dictValue=this.storeyOptions.find(val=>val.dictValue==this.form.storey).dictValue

       getBDormitoryListByCol(buildingNo_dictValue,storey_dictValue).then(response => {
          this.bdormitoryOptions = response.data;
        }
      );
    },


    /** 查询宿舍卫生列表 */
    getList() {
      this.loading = true;
      listSdHygiene(this.queryParams).then(response => {
          this.sdhygieneList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    listAllHygieneDeduct(){
      listAllHygieneDeduct().then(response => {
        this.hygieneDeductOptions = response.data;
      });
    },
   hygieneDeductFormat(row,column){
           let actions = [];
           Object.keys(this.hygieneDeductOptions).map((key) => {
               let deductIds = row.deductIds;
               if (deductIds) {
                   deductIds.forEach(value => {
                       if (this.hygieneDeductOptions[key].id == ('' + value)) {
                           actions.push(this.hygieneDeductOptions[key].deductOption)
                       }
                   })
               }
           })
           return actions.join(',')
    },
    buildingNoFormat(row, column) {
      return this.selectDictLabel(this.buildingNoOptions, row.buildingNo);
    },
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
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        checkDate: undefined,
        buildingNo: undefined,
        storey: undefined,
        dormitoryNo: undefined,
        deductIds:[],
        remark: undefined,
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
      this.title = "添加卫生检查信息";
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
      getSdHygiene(id).then(response => {
        this.form = response.data;
        this.form.deductIds = response.data.deductIds;
        this.open = true;
        this.title = "修改卫生检查信息";
      });

    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateSdHygiene(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addSdHygiene(this.form).then(response => {
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
      this.$confirm('是否确认删除卫生信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delSdHygiene(ids);
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
