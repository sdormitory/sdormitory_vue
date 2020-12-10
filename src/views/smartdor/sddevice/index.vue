<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          style="width: 180px"
          @keyup.enter.native="handleQuery"
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
          v-hasPermi="['smartdor:sddevice:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['smartdor:sddevice:edit']"
        >修改</el-button>
      </el-col>
      <!--
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
      -->

    </el-row>

    <el-table v-loading="loading" :data="sddeviceList" >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="设备IP地址" align="center" prop="deviceIpAddress" />
      <el-table-column label="设备出入类型" align="center" prop="deviceAccessType" :formatter="accessTypeFormat" />
      <el-table-column label="设备号" align="center" prop="deviceNo" />
      <el-table-column label="设备名称" align="center" prop="deviceName"  />
      <el-table-column label="设备声音大小" align="center" prop="deviceSoundSize" />
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
      <el-table-column label="创建时间" align="center" prop="create_time" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="100" >
        <template slot-scope="scope">
          <el-button
                  size="mini"
                  circle type="success"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['smartdor:sddevice:edit']"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
            <el-form-item label="设备类型" prop="deviceAccessType">
             <el-select v-model="form.deviceAccessType" :disabled="false" placeholder="进入/出入"  clearable @change="">
               <el-option
                 v-for="dict in deviceAccessTypeOptions"
                 :key="dict.dictValue"
                 :label="dict.dictLabel"
                 :value="dict.dictValue"/>
             </el-select>
            </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="设备IP地址" prop="deviceIpAddress">
              <el-input v-model="form.deviceIpAddress" :readonly="false" />
              </el-form-item>
            </el-col>
            <el-button type="primary" v-if="isButton" style="margin-left:50px;" @click="handleSelectionDevice">获取设备信息</el-button>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="识别失败提示语" prop="tipsPairFail"  >
                <el-input v-model="form.tipsPairFail" :readonly="false" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="识别成功提示语" prop="appWelcomeMsg">
                <el-input v-model="form.appWelcomeMsg" :readonly="false" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="设备号" prop="sn">
                <el-input v-model="form.sn" :readonly="false" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="设备名称" prop="name">
                <el-input v-model="form.name" :readonly="false" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="活体判断" prop="cameraDetectType" >
                <el-select v-model="form.cameraDetectType" :disabled="true" placeholder="请选择">
                  <el-option
                    v-for="dict in cameraDetectTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="开门类型" prop="doorType">
                <el-select v-model="form.doorType" :disabled="true" placeholder="请选择" clearable  >
                  <el-option
                    v-for="dict in doorTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="图片质量" prop="picQualityRate"  >
                <el-input v-model="form.picQualityRate" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="识别成功后开门" prop="pairSuccessOpenDoor">
                <el-select v-model="form.pairSuccessOpenDoor" :disabled="true" placeholder="请选择" clearable  >
                  <el-option
                    v-for="dict in pairSuccessOpenDoorOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="身份证比对阈值" prop="idCardFaceFeaturePairNumber"  >
                <el-input v-model="form.idCardFaceFeaturePairNumber" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="设备维护时间" prop="deviceDefendTime"  >
                <el-input v-model="form.deviceDefendTime" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="识别成功后开门持续时间" prop="openDoorContinueTime"  >
                <el-input v-model="form.openDoorContinueTime" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="人脸比对的阈值" prop="faceFeaturePairNumber"  >
                <el-input v-model="form.faceFeaturePairNumber" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="设备声音大小" prop="deviceSoundSize"  >
                <el-input v-model="form.deviceSoundSize" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="人脸比对后等待时间" prop="faceFeaturePairSuccessOrFailWaitTime">
                <el-input v-model="form.faceFeaturePairSuccessOrFailWaitTime" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="开门条件" prop="openDoorType">
                <el-select v-model="form.openDoorType" :disabled="true" placeholder="请选择" clearable  >
                  <el-option
                    v-for="dict in openDoorTypeOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="补光灯设置" prop="fillLightTimes"  >
                <el-input v-model="form.fillLightTimes" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="息屏设置" prop="lowPowerTimes"  >
                <el-input v-model="form.lowPowerTimes" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="识别距离" prop="beginRecoDistance"  >
                <el-input v-model="form.beginRecoDistance" :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>


          <el-row :gutter="10" class="mb8" >
            <el-col :span="1.5">
              <el-form-item label="识别功能控制开关" prop="recognitionSwitch">
                <el-select v-model="form.recognitionSwitch" :disabled="true" placeholder="请选择" clearable  >
                  <el-option
                    v-for="dict in recognitionSwitchOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
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
import { listSdDevice, getSdDevice, addSdDevice, updateSdDevice, getSdDeviceInfo ,changeSdDeviceStatus} from "@/api/smartdor/sddevice";


export default {
  name: "SdDevice",
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
      sddeviceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示获取IP信息按钮
      isButton: false,
      // 设备出入类型
      deviceAccessTypeOptions: [],
      // 活体判断类型
      cameraDetectTypeOptions:[],
      // 开门条件
      openDoorTypeOptions:[],
      // 开门类型
      doorTypeOptions:[],
      // 识别功能控制开关
      recognitionSwitchOptions:[],
      // 识别成功后是否开门
      pairSuccessOpenDoorOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: undefined
      },
      // 表单参数
      form: {},
      dialogImageUrl: '',
      dialogVisible: false,

      // 表单校验
      rules: {
        deviceIpAddress: [
          { required: true, message: "设备IP地址不能为空", trigger: "blur" }
        ],
        tipsPairFail: [
          { required: true, message: "识别失败提示语不能为空", trigger: "blur" }
        ],
        appWelcomeMsg: [
          { required: true, message: "识别成功提示语不能为空", trigger: "blur" }
        ],
        sn: [
          { required: true, message: "设备号不能为空", trigger: "blur" }
        ],
        name:[
          { required: true, message: "设备名称不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() {

    this.getList();
    this.getDicts("device_access_type").then(response => {
      this.deviceAccessTypeOptions = response.data;
    });
    this.getDicts("door_type").then(response => {
      this.doorTypeOptions = response.data;
    });
    this.getDicts("camera_detect_type").then(response =>{
      this.cameraDetectTypeOptions = response.data;
    });
    this.getDicts("open_door_type").then(response =>{
      this.openDoorTypeOptions = response.data;
    })
    this.getDicts("recognition_switch").then(response =>{
      this.recognitionSwitchOptions = response.data;
    })
    this.getDicts("pair_success_open_door").then(response =>{
      this.pairSuccessOpenDoorOptions = response.data;
    })

  },
  methods: {

    /** 查询设备管理列表 */
    getList() {
      this.loading = true;
      listSdDevice(this.queryParams).then(response => {
          this.sddeviceList = response.data.list;
          console.log(response.data.list);
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    doorTypeFormat(row,column){
      return this.selectDictLabel(this.doorTypeOptions, this.form.doorType);
    }
    ,
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
    accessTypeFormat(row,column) {
      return this.selectDictLabel(this.deviceAccessTypeOptions, row.deviceAccessType);
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
        deviceAccessType: undefined,
        deviceIpAddress: undefined,
        sn: undefined,
        name: undefined,
        cameraDetectType: undefined,
        doorType: undefined,
        tipsPairFail: undefined,
        picQualityRate: undefined,
        pairSuccessOpenDoor: undefined,
        idCardFaceFeaturePairNumber: undefined,
        deviceDefendTime: undefined,
        openDoorContinueTime: undefined,
        faceFeaturePairNumber: undefined,
        deviceSoundSize: undefined,
        faceFeaturePairSuccessOrFailWaitTime:undefined,
        openDoorType: undefined,
        fillLightTimes: undefined,
        lowPowerTimes: undefined,
        beginRecoDistance: undefined,
        appWelcomeMsg: undefined,
        recognitionSwitch: undefined,
        status: undefined,
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
      this.isButton = true;
      this.reset();
      this.open = true;
      this.title = "添加设备信息";
    },
    handleUpdate(row) {
      this.isButton = false;
      this.reset();
      const id = row.id || this.ids
      getSdDevice(id).then(response => {
        this.form = response.data;
/*        this.form.sn = response.data.*/
        this.open = true;
        this.title = "修改设备信息";
      });

    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          if (this.form.id !== undefined) {
            updateSdDevice(this.form.id, this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.message);
              }
            });
          } else {
            addSdDevice(this.form).then(response => {
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
    /** 获取设备详细信息操作 **/
    handleSelectionDevice(){

      if(this.form.deviceIpAddress != undefined) {
        let IP = this.form.deviceIpAddress;
        getSdDeviceInfo().then(response => {
          this.msgSuccess(response.data.msg);
          this.form = response.data.data;
          this.form.deviceIpAddress = IP;
          this.doorTypeFormat();
        });
      } else {
        this.msgError("设备IP不能为空！")
      }

    },
    // 设备状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '""' + row.deviceName + '"设备吗?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return changeSdDeviceStatus(row.id, row.status);
      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },

  }
};
</script>
