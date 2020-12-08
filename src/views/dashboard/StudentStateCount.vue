<template>

  <div class="">
    <el-button @click="handleOpen()" style="background-color: red; color: white;">开闸</el-button>
    <!-- 内容主体区域 -->
    <el-form
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
      style="text-align: center"
      label-width="85px"
    >
    <el-row :gutter="10" class="mb8">
    <el-form-item label="宿舍栋号">
      <el-select v-model="formInline.region" placeholder="请选择栋号" style="width: 180px">
        <el-option label="1栋" value="shanghai"></el-option>
        <el-option label="2栋" value="beijing"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="楼层">
      <el-select v-model="formInline.region" placeholder="请选择楼层" style="width: 180px">
        <el-option label="一层" value="shanghai"></el-option>
        <el-option label="二层" value="beijing"></el-option>
      </el-select>
    </el-form-item>

      <el-form-item label="宿舍号">
        <el-input
          v-model="formInline.user"
          placeholder="请输入宿舍号" style="width: 180px"
        ></el-input>
      </el-form-item>

    </el-row>
    <el-row :gutter="10" class="mb8">
      <el-form-item label="请选择日期">
        <el-date-picker
          v-model="value2"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="width: 180px"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>

       </el-row>
    </el-form>

    <el-collapse accordion style="margin-bottom: 15px;" @change="show = !show">
      <el-collapse-item>
        <template slot="title">
          <el-divider><el-tag class="text">缺勤学生详情，请点击展开</el-tag></el-divider>
        </template>
        <div>
          <el-card
            class="box-card flow title-font"
            style="width: 226px"
            v-for="(room, index) in roomData"
            :key="index"
          >
            <div slot="header" class="clearfix">
              <span>姓名：张三</span>
            </div>

            <el-alert type="info" :closable="false" >
              地址：1栋1楼001宿舍
            </el-alert>
          </el-card>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-card
      v-show="show"
      class="box-card flow title-font"
      style="width: 226px"
      v-for="(room, index) in roomData"
      :key="index"

    >
      <div slot="header" class="clearfix">
        <span>{{ room.roomName }}</span>
        <span style="float: right; padding: 3px 0" type="text"
          >宿舍总人数:{{ room.total }}</span
        >
      </div>

      <span class="text item" style="margin: 0 15px">
        <el-badge
          :value="room.normal"
          :v-if="room.normal"
          class="item"
          type="success"

        >
          <el-button size="small" > 正常</el-button>
        </el-badge>
      </span>

      <span class="text item" style="margin: 0 15px">
        <el-badge :value="room.leave" :v-if="room.leave" class="item" type="primary">
          <el-button size="small" > 请假</el-button>
        </el-badge>
      </span>

      <span class="text item" style="margin: 0 15px">
        <el-badge
          :value="room.comebacklate"
          :v-if="room.comebacklate"
          class="item"
          type="warning"
        >
          <el-button size="small"> 晚归</el-button>
        </el-badge>
      </span>

      <span class="text item" style="margin: 0 15px">
        <el-badge :value="room.absence" :v-if="room.absence" class="item">
          <el-button size="small"> 缺勤</el-button>
        </el-badge>
      </span>
    </el-card>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

import { AIOpen} from "@/api/smartdor/aidevice";

export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      show: true,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      formInline: {
        user: "",
        region: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },

      value2: "",
      roomData: [
        {
          roomName: "1栋3楼001",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋4楼001",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "2栋1楼001",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "2栋1楼002",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "2栋1楼003",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "2栋1楼004",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋4楼002",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋4楼003",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋4楼005",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋4楼006",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋4楼007",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋5楼001",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋5楼002",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋5楼003",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
        {
          roomName: "1栋5楼004",
          normal: 4,
          leave: 3,
          comebacklate: 2,
          absence: 1,
          total: 10,
        },
      ],
    };
  },
  // 监听属性 类似于data概念
  computed: {},
  // 监控data中的数据变化
  watch: {},
  // 方法集合
  methods: {
    //   change(){
    //       alert(1)
    //       this.show = false;
    //   }
    // 特殊情况调用AI人脸识别开闸接口(比如游客)
    handleOpen() {
      this.$confirm('确定开闸？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return AIOpen();
        }).then(() => {
          this.msgSuccess("开闸成功!!!");
        }).catch(function() {
          this.msgSuccess("异常!!!");
        });
    },
  },
  // 生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, // 生命周期 - 创建之前
  beforeMount() {}, // 生命周期 - 挂载之前
  beforeUpdate() {}, // 生命周期 - 更新之前
  updated() {}, // 生命周期 - 更新之后
  beforeDestroy() {}, // 生命周期 - 销毁之前
  destroyed() {}, // 生命周期 - 销毁完成
  activated() {}, // 如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>

.title-font{
  font-weight: bold;
      font-size: 16px;
    color: #606266;
}
.text {
  font-size: 16px;

}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
.flow {
  float: left;
  margin: 5px;
}
</style>
