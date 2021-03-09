<template>
  <!-- 2*1布局 -->
  <div style="height: 1050px; width: 100%; margin-top: 20px; padding: 20px">
    <el-row
      :gutter="10"
      type="flex"
      class="grid-one-contentheight"
      style="margin: 0px"
      justify="center"
    >
      <el-col :span="16" style="height: 360px">
        <el-card class="box-card" style="width: 100%; margin: 0px">
          <div slot="header" class="clearfix">
            <span>博客流量动态图</span>
            <el-button style="float: right; padding: 3px 0" type="text"
              >最近七天</el-button
            >
          </div>
          <div
            :id="id"
            :class="className"
            :style="{ height: height, width: width }"
          />
        </el-card>
        <br />
        <!-- asdasd -->
        <el-card class="box-card" style="width: 100%; margin: 0px">
          <div slot="header" class="clearfix">
            <span>访问量最高文章</span>
          </div>
          <div style="height: 430px">
            <template>
              <div>
                <span
                  v-for="(v, element) in data.visitTopArticles"
                  :key="element"
                >
                  <span>{{ v.title }}</span>
                  <el-divider />
                </span>
              </div>
            </template>
          </div>
        </el-card>

        <!-- adsasdas a-->
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="width: 100%">
          <div slot="header" class="clearfix">
            <span>流量七天汇总图</span>
          </div>
          <el-row :gutter="20">
            <div id="myChart2" :style="{ height: '200px', width: width }" />
          </el-row>
        </el-card>
        <el-card class="box-card" style="width: 100%; margin-top: 10px">
          <div slot="header" class="clearfix">
            <span>跳出率</span>
          </div>
          <el-row :gutter="20">
            <div id="jumprate" :style="{ height: '200px', width: width }" />
          </el-row>
        </el-card>
        <el-card class="box-card" style="width: 100%; margin-top: 10px">
          <div slot="header" class="clearfix">
            <span>最新的留言</span>
          </div>
          <el-row :gutter="20">
            <template>
              <div>
                <span v-for="(v, element) in data.newComments" :key="element">
                  <span>{{ v.title }}</span>
                  <el-divider />
                </span>
              </div>
            </template>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <!-- 2*1布局 -->
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { getMonitorData } from "@/api/monitor/server";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "360px",
    },
  },
  data() {
    return {
      chart: null,
      data: {
        visitTopArticles: [],
        newComments: [],
      },
      drawLineData: {
        dateGroup: [],
        ip: [],
        uv: [],
        pv: [],
      },
      trafficCountData: {
        ip: 0,
        pv: 0,
        uv: 0,
      },
    };
  },
  created() {
    this.getMonitorDataHandle();
  },
  mounted() {
    this.jumpRate();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    getMonitorDataHandle() {
      getMonitorData().then((result) => {
        this.data = result.data;
        // ip
        result.data.traffic.ip.forEach((item, index) => {
          this.drawLineData.dateGroup.push(item.days.substring(0, 10));
          this.drawLineData.ip.push(item.count);
          this.trafficCountData.ip += item.count;
        });

        // uv
        result.data.traffic.uv.forEach((item, index) => {
          this.drawLineData.uv.push(item.count);
          this.trafficCountData.uv += item.count;
        });

        // pv
        result.data.traffic.pv.forEach((item, index) => {
          this.drawLineData.pv.push(item.count);
          this.trafficCountData.pv += item.count;
        });
        this.drawLine();
        this.initChart();
      });
    },
    jumpRate() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById("jumprate"));
      // 绘制图表，this.echarts1_option是数据
      myChart.setOption({
        tooltip: {
          formatter: "{a} <br/>{b} {c}%",
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        series: [
          {
            name: "跳出率",
            type: "gauge",
            detail: { formatter: "{value}%" },
            data: [{ value: 50, name: "" }],
          },
        ],
      });
    },
    initChart() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById("myChart2"));
      // 绘制图表，this.echarts1_option是数据
      myChart.setOption({
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        series: [
          {
            name: "访问来源",
            width: "100%",
            type: "pie",
            radius: "80%",
            hoverAnimation: true, // 是否开启 hover 在扇区上的放大动画效果
            data: [
              { name: "PV", value: this.trafficCountData.pv },
              { name: "UV", value: this.trafficCountData.uv },
              { name: "IP", value: this.trafficCountData.ip },
            ],
          },
        ],
      });
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById(this.id));

      function randomData() {
        return Math.round(Math.random() * 500);
      }
      // 绘制图表
      var option = {
        tooltip: {
          // 设置tip提示
          trigger: "axis",
        },

        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        legend: {
          // 设置区分（哪条线属于什么）
          data: ["PV", "UV", "IP"],
        },
        xAxis: {
          // 设置x轴
          type: "category",
          boundaryGap: false, // 坐标轴两边不留白
          data: this.drawLineData.dateGroup,
          name: "", // X轴 name
          nameTextStyle: {
            // 坐标轴名称的文字样式
            fontSize: 16,
            padding: [0, 0, 0, 20],
          },
          axisLine: {
            // 坐标轴轴线相关设置。
            lineStyle: {},
          },
        },
        yAxis: {
          name: "数量",
          nameTextStyle: {
            fontSize: 16,
            padding: [0, 0, 10, 0],
          },
          axisLine: {
            lineStyle: {},
          },
          type: "value",
        },
        series: [
          {
            name: "PV",
            data: this.drawLineData.pv,
            type: "line", // 类型为折线图
            lineStyle: {
              // 线条样式 => 必须使用normal属性
              normal: {
                color: "#8AE09F",
              },
            },
          },
          {
            name: "UV",
            data: this.drawLineData.uv,
            type: "line",
            lineStyle: {
              normal: {
                color: "#FA6F53",
              },
            },
          },
          {
            name: "IP",
            data: this.drawLineData.ip,
            type: "line",
            lineStyle: {
              normal: {
                color: "rgb(41, 58, 74)",
              },
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>
<style>
.text {
  font-size: 14px;
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
</style>
