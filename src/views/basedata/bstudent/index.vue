<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="学员名称" prop="studentName">
        <el-input
          v-model="queryParams.studentName"
          placeholder="请输入学员名称"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
      <el-form-item label="班级" prop="className">
        <el-input
          v-model="queryParams.className"
          placeholder="请输入班级"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

     <el-form-item label="第几栋楼" prop="buildingNo">
       <el-select
         v-model="queryParams.buildingNo"
         placeholder="第几栋楼"
         clearable
         size="small"
         style="width: 180px">
         <el-option
           v-for="dict in buildingNoOptions"
           :key="dict.dictValue"
           :label="dict.dictLabel"
           :value="dict.dictValue"
         />
       </el-select>
     </el-form-item>

     <el-form-item label="楼层" prop="storey">
       <el-select
         v-model="queryParams.storey"
         placeholder="宿舍楼层"
         clearable
         size="small"
         style="width: 180px">
         <el-option
           v-for="dict in storeyOptions"
           :key="dict.dictValue"
           :label="dict.dictLabel"
           :value="dict.dictValue"
         />
       </el-select>
     </el-form-item>

      <el-form-item label="宿舍号" prop="dormitoryNo">
        <el-input
          v-model="queryParams.dormitoryNo"
          placeholder="请输入宿舍号"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="学员状态"
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
          v-hasPermi="['basedata:bstudent:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basedata:bstudent:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basedata:bstudent:remove']"
        >删除</el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="bstudentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="学员姓名" align="center" prop="studentName" :show-overflow-tooltip="true" />
      <el-table-column label="学号" align="center" prop="studentNo" :show-overflow-tooltip="true" />
      <el-table-column label="班级" align="center" prop="className" :show-overflow-tooltip="true" />
      <el-table-column label="手机号" align="center" prop="phone" :show-overflow-tooltip="true" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormat" />
      <el-table-column label="家长姓名" align="center" prop="parentName" :show-overflow-tooltip="true" />
      <el-table-column label="家长电话" align="center" prop="parentPhone" :show-overflow-tooltip="true" />
      <el-table-column label="第几栋" align="center" prop="buildingNo" :formatter="buildingNoFormat" />
      <el-table-column label="楼层" align="center" prop="storey" :formatter="storeyFormat" />
      <el-table-column label="宿舍号" align="center" prop="dormitoryNo" :show-overflow-tooltip="true" />
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



      <el-table-column label="操作" align="center" width="100" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['basedata:bstudent:edit']"
          />
          <el-button
                  size="mini"
                  circle type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['basedata:bstudent:remove']"
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
          <el-form-item label="学员姓名" prop="studentName">
            <el-input v-model="form.studentName" placeholder="请输入学员姓名"  />
          </el-form-item>
         </el-col>
         <el-col :span="1.5">
          <el-form-item label="学号" prop="studentNo">
            <el-input v-model="form.studentNo" placeholder="请输入学号"  :disabled="disabledInput"/>
          </el-form-item>
         </el-col>
         <el-col :span="1.5">
         <el-form-item label="班级" prop="classId">
            <el-select v-model="form.classId"  placeholder="请选择">
              <el-option
                      v-for="item1 in classOptions"
                      :key="item1.id"
                      :label="item1.className"
                      :value="item1.id"
              />
            </el-select>
          </el-form-item>
         </el-col>
          <el-col :span="1.5">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
              <el-form-item label="身份证号" prop="idcard">
                <el-input v-model="form.idcard" placeholder="请输入身份证号" />
              </el-form-item>
           </el-col>
           <el-col :span="1.5">
             <el-form-item label="性别">
               <el-select v-model="form.sex" placeholder="请选择">
                 <el-option
                         v-for="dict in sexOptions"
                         :key="dict.dictValue"
                         :label="dict.dictLabel"
                         :value="dict.dictValue"
                 />
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="1.5">
             <el-form-item label="年龄" prop="age">
               <el-input v-model="form.age" placeholder="请输入年龄" maxlength="3" />
             </el-form-item>
           </el-col>
           <el-col :span="1.5">
            <el-form-item label="家长姓名" prop="parentName">
              <el-input v-model="form.parentName" placeholder="请输入家长姓名"  />
            </el-form-item>
           </el-col>
           <el-col :span="1.5">
            <el-form-item label="家长电话" prop="parentPhone">
              <el-input v-model="form.parentPhone" placeholder="请输入家长电话"  />
            </el-form-item>
           </el-col>

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
         <el-col :span="1.5">
         <!-- <el-form-item label="宿舍号" prop="bdormitoryId">
             <el-select v-model="form.bdormitoryId"  placeholder="请选择">
               <el-option
                       v-for="item in bdormitoryOptions"
                       :key="item.id"
                       :label="`${item.buildingNo}-${item.storey}-${item.dormitoryNo}`"
                       :value="item.id"
               />
             </el-select>
           </el-form-item> -->

           <el-form-item label="宿舍号" prop="bdormitoryId" >
              <el-select v-model="form.bdormitoryId"  value-key="id"  placeholder="请选择"  >
                <el-option
                        v-for="item in bdormitoryOptions"
                        :key="item.id"
                        :label="item.dormitoryNo"
                        :value="item.id"
                />
              </el-select>
            </el-form-item>
        </el-col>

        <el-col :span="1.5">
         <el-form-item label="学员照片">
				   <el-upload
						   ref="upload"
						    :action="activeUrl"
								:data="form"
								:auto-upload="false"
								multiple="multiple"
								:on-change="uploadChange"
						   name="upload"
						   list-type="picture"
						   :limit="1"
						   :file-list="fileList"
						   :on-exceed="onExceed"
               :headers="headers"
						   :before-upload="beforeUpload"
						   :on-preview="handlePreview"
						   :on-success="handleSuccess"
						   :on-remove="handleRemove">
					   <i class="el-icon-plus"></i>
				   </el-upload>

            <el-input v-model="form.photo" type="hidden" />
			    </el-form-item>
        </el-col>
        </el-row>

				<el-row>
          <el-col :span="1.5" v-if="dialogVisible">
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
          </el-col>
          <el-col :span="1.5" v-if="dialogVisible">
            <img width="100" height="100" :src="dialogImageUrl" alt="">
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
import { listBStudent, getBStudent, addBStudent, updateBStudent, delBStudent, exportBStudent,changeBStudentStatus} from "@/api/basedata/bstudent";
import { listAllBClass } from "@/api/basedata/bclass";
import { getBDormitoryListByCol } from "@/api/basedata/bdormitory";
import { getToken } from '@/utils/auth'


export default {
  name: "BStudent",
  computed:{
    headers(){
      return {
        //'Content-Type': 'multipart/form-data',
        Authorization: "Bearer " + getToken()
      }
    }
  },
  data() {
    return {
		 //上传的路径
     activeUrl: '',
     //判断是否上传文件
     isHaveFile: false,
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
      bstudentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 班级
      classOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 宿舍栋号
      buildingNoOptions: [],
      // 楼层
      storeyOptions: [],
      // 宿舍号
      bdormitoryOptions: [],

      buildingNo :undefined,
      storey :undefined,
      bdormitoryId :undefined,

      fileList: [],
      photo:'',
		disabledInput:false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        studentName: undefined,
        studentNo: undefined,
        className: undefined,
        buildingNo: undefined,
        storey: undefined,
        dormitoryNo: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      dialogImageUrl: '',
      dialogVisible: false,

      // 表单校验
      rules: {
        studentName: [
          { required: true, message: "学员姓名不能为空", trigger: "blur" }
        ],
        studentNo: [
          { required: true, message: "学号不能为空", trigger: "blur" }
        ],
        classId: [
          { required: true, message: "班级不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        idcard: [
          //{ required: true, message: "身份证号不能为空", trigger: "blur" },
          {
            pattern: /^\d{17}(\d|x)$/,
            message: "你输入的身份证长度或格式错误",
            trigger: "blur"
          }
        ],
        parentName: [
          { required: true, message: "家长姓名不能为空", trigger: "blur" }
        ],
        parentPhone: [
          { required: true, message: "家长电话不能为空", trigger: "blur" }
        ],
        buildingNo: [
          { required: true, message: "第几栋不能为空", trigger: "blur" }
        ],
        storey: [
          { required: true, message: "楼层不能为空", trigger: "blur" }
        ],
        bdormitoryId: [
          { required: true, message: "宿舍号不能为空", trigger: "blur" }
        ],
        photo: [
          { required: true, message: '请上传学员照片' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.listAllBClass();
    this.getDicts("sys_building").then(response => {
      this.buildingNoOptions = response.data;
    });
    this.getDicts("sys_storey").then(response => {
      this.storeyOptions = response.data;
    });
    this.getDicts("sys_student_status").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
	  //this.form.bdormitoryId = this.bdormitoryOptions[0].id ;
  },
  methods: {
		//文件状态改变
      uploadChange: function (file, fileList) {
        if (fileList.length > 0) {
          this.isHaveFile = true;
        } else {
          this.isHaveFile = false;
        }
      },

      closeDialog: function (done) {
        this.$refs.upload.clearFiles();
        this.open = false;
        this.reset();
      },
     change1(){
      this.bdormitoryOptions=[];
      //this.form.bdormitoryId='';
			 // 获取栋号
			let buildingNo_dictValue=this.buildingNoOptions.find(val=>val.dictValue==this.form.buildingNo).dictValue
			// 获取楼层号
			let storey_dictValue=this.storeyOptions.find(val=>val.dictValue==this.form.storey).dictValue
			if(storey_dictValue==undefined){
				return ;
			}

			getBDormitoryListByCol(buildingNo_dictValue,storey_dictValue).then(response => {
			     this.bdormitoryOptions = response.data;
				console.log(this.bdormitoryOptions);
			   }
			 );

    },
    change2(){
      this.bdormitoryOptions=[];

			 // 获取栋号
			let buildingNo_dictValue=this.buildingNoOptions.find(val=>val.dictValue==this.form.buildingNo).dictValue;

			// 获取楼层号
			let storey_dictValue=this.storeyOptions.find(val=>val.dictValue==this.form.storey).dictValue;
			if(buildingNo_dictValue==undefined){
				return ;
			}


			  getBDormitoryListByCol(buildingNo_dictValue,storey_dictValue).then(response => {
			     this.bdormitoryOptions = response.data;
					 if(this.bdormitoryOptions.length<1){
						 this.form.bdormitoryId='';
					 }
			   }
			 );
    },
	 //文件上传成功的钩子函数
      handleSuccess(res, file) {
        if (this.form.id !== undefined) {
          //alert(res.message);
          console.log(res);
          if (res.code == 200) {
            this.$message({
              type: 'info',
              message: '操作成功',
              duration: 6000
            });
            //关闭弹出层
            this.open = false;
            this.getList();
            this.$refs.upload.clearFiles();
          } else {
            this.$message({
              type: 'info',
              message: '操作失败',
              duration: 6000
            });

          }
        }
       	this.getList();
				this.dialogImageUrl='';
      },
    //删除文件之前的钩子函数
    handleRemove(file, fileList) {
    		this.$message({
    		  type: 'info',
    			message: '已删除原有图片',
    			duration: 6000
    			});
					this.isHaveFile = false;
    },
    //点击列表中已上传的文件事的钩子函数
    handlePreview(file) {
    },
    //上传的文件个数超出设定时触发的函数
    onExceed(files, fileList) {
    		this.$message({
    		type: 'info',
    		message: '最多只能上传一个图片',
    		duration: 6000
    		});
     },
      //文件上传前的前的钩子函数
      //参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
    beforeUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isGIF = file.type === 'image/gif';
            const isPNG = file.type === 'image/png';
            const isBMP = file.type === 'image/bmp';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG && !isGIF && !isPNG && !isBMP) {
                  this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!');
            }
            if (!isLt2M) {
                  this.$message.error('上传图片大小不能超过 2MB!');
             }
    },



    /** 查询宿舍列表 */
    getList() {
      this.loading = true;
      listBStudent(this.queryParams).then(response => {
          this.bstudentList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    listAllBClass(){
      listAllBClass().then(response => {
        this.classOptions = response.data;
      });
    },
    // 字典设备状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    buildingNoFormat(row, column) {
      return this.selectDictLabel(this.buildingNoOptions, row.buildingNo);
    },
    storeyFormat(row, column) {
      return this.selectDictLabel(this.storeyOptions, row.storey);
    },
    sexFormat(row, column) {
      return this.selectDictLabel(this.sexOptions, row.sex);
    },
    bdormitoryFormat(row, column) {
      return this.selectDictLabel(this.bdormitoryOptions, row.bdormitoryId);
    },
    // 学员状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "有效" : "无效";
      this.$confirm('确认要将序号为"' + row.id + '"的学员设置为?'+ text, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeBStudentStatus(row.id, row.status);
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
        studentName: undefined,
        studentNo: undefined,
        classId: undefined,
        className: undefined,
        phone: undefined,
        idcard: undefined,
        sex: undefined,
        age: undefined,
        parentName: undefined,
        parentPhone: undefined,
        buildingNo: undefined,
        storey: undefined,
        dormitoryNo: undefined,
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
      this.title = "添加学员信息";
      this.disabledInput=false;

			//新增时隐藏被修改图片
			this.dialogVisible=false;
			this.activeUrl = 'http://localhost:9003/basedata/bstudent/createStu';
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
      getBStudent(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学员信息";
        //学号新增之后不可修改
        this.disabledInput=true;
		//显示被修改的图片信息
        this.dialogVisible = true;
        this.dialogImageUrl = 'http://localhost:9003/basedata/bstudent/getPhoto.do?id=' + this.form.id + '&width=200&height=200';
		    this.activeUrl = 'http://localhost:9003/basedata/bstudent/updateAndUpload';
		      getBDormitoryListByCol(this.form.buildingNo,this.form.storey).then(response => {
		     this.bdormitoryOptions = response.data;
            this.bdormitoryOptions.forEach(a=>{
              a.id = a.id.toString();
            })
		   }
		 )
      });

    },
    uploadSectionFile(param) {
    				var form = new FormData();
    				if(null !=	param){
    				var fileObj = param.file;
    					form.append("file", fileObj);
    				}
    },
    /** 提交按钮 */
		/*
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateBStudent(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addBStudent(this.form).then(response => {
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
		*/
	  /** 提交按钮 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id !== undefined) {
              if (!this.isHaveFile) {
                updateBStudent(this.form.id, this.form).then(response => {
                  if (response.code === 200) {
                    this.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                  } else {
                    this.msgError(response.message);
                  }
                });
              } else {

                if (this.form.age == undefined) {
                  this.form.age = '';
                }
                if (this.form.id == undefined) {
                  this.form.id = '';
                }
                if (this.form.sex == undefined) {
                  this.form.sex = 2;
                }
                if (this.form.idcard == undefined) {
                  this.form.idcard = '';
                }
                /*文件上传，附带表单数据*/
                this.$refs.upload.submit();
              }
            } else {
              if (this.isHaveFile) {
                if (this.form.age == undefined) {
                  this.form.age = '';
                }
                if (this.form.id == undefined) {
                  this.form.id = '';
                }
                if (this.form.sex == undefined) {
                  this.form.sex = 2;
                }
                if (this.form.idcard == undefined) {
                  this.form.idcard = '';
                }
                /*文件上传，附带表单数据*/
                this.$refs.upload.submit();
              } else {
                alert("请上传学员照片");
              }

            }
          }
        });
      },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除学员编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delBStudent(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportBStudent(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
