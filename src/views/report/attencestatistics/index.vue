<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="日期">
        <el-date-picker
          v-model="queryParams.accessDate"
          size="small"
          style="width: 140px"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="AttenceStaList" @selection-change="handleSelectionChange">
      <el-table-column label="日期" align="center" prop="accessDate" :show-overflow-tooltip="true" />
      <el-table-column label="宿舍栋号" align="center" prop="buildingNo" :show-overflow-tooltip="true" />
      <el-table-column label="楼层" align="center" prop="storey" :show-overflow-tooltip="true" />
      <el-table-column label="宿舍号" align="center" prop="dormitoryNo" :show-overflow-tooltip="true" />
      <el-table-column label="每个宿舍总人数" align="center" prop="totalCount" :show-overflow-tooltip="true" />
      <el-table-column label="每个宿舍正常出勤人数" align="center" prop="normalAttenceCount" :show-overflow-tooltip="true" />
      <el-table-column label="正常出勤率" align="center" prop="normalAttenceRate" :show-overflow-tooltip="true" />

    </el-table>


    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


    <bargraph :id="'bargraph'" :data="option2" style="height:350px;margin-top: 30px;"  ></bargraph>


  </div>
</template>



<script>
  import bargraph from '../../dashboard/attendanceChart'
  import { listAttenceStatistics} from "@/api/report/attencestatistics";

  export default {
    name: "index",
    data(){
      return{
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
        AttenceStaList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          accessDate: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
        },
        option2:{
          title: {
            text: '考勤统计',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value',
            max: 100,
            min: 0
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '8%',
            containLabel: true
          },
          series: [
            {
              name: '到勤率',
              data: [],
              type: 'bar',
              barWidth:80,
            },
            ]
        }
      }
    },
    components:{
      bargraph
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询任务量列表 */
      getList() {
        this.loading = true;
        listAttenceStatistics(this.queryParams).then(response => {
            this.AttenceStaList = response.data.list;
            this.total = response.data.total;
            this.loading = false;
          let xAxisData = [];
          let seriesData = [];
          for (let i = 0; i < response.data.list.length; i++) {
            let dormitory = response.data.list[i].buildingNo+"-"+response.data.list[i].storey+"-"+response.data.list[i].dormitoryNo;
            let attendanceRate = response.data.list[i].normalAttenceRate;
            xAxisData.push(dormitory);
            seriesData.push(parseInt(attendanceRate));
          }
          this.option2.xAxis.data = xAxisData;
          this.option2.series[0].data = seriesData;

        });
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
      }
    }
  }
</script>




