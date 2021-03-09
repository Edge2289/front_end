<template>
  <div class="app-container">
    <el-row>
      <el-col
        v-for="(item, index) in serverData"
        :key="index"
        :span="12"
        class="card-box"
      >
        <el-card style="margin: 10px">
          <div slot="header">
            <span>{{ item.title }}</span>
          </div>
          <!-- <div id="jumprate" :style="{ height: '200px', width: 300 }" /> -->
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%">
              <thead>
                <tr>
                  <th class="is-leaf"><div class="cell">属性</div></th>
                  <th class="is-leaf"><div class="cell">值</div></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item1, index1) in item.list" :key="index1">
                  <td>
                    <div class="cell">{{ item1.name }}</div>
                  </td>
                  <td>
                    <div class="cell">{{ item1.value }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <!-- 
          CPU使用详情
         -->
      <el-card class="box-card" style="width: 100%; margin: 10px">
        <div slot="header" class="clearfix" v-if="jumprateState">
          <span>CPU使用详情 从左到右 </span>
        </div>
        <div style="height: 430px">
          <template>
            <div id="jumprate">
              <div
                v-for="(item1, index1) in cpuData"
                :key="index1"
                :id="'jumprate' + (index1 + 1)"
                :style="{ height: '200px', width: '20%', float: 'left' }"
              />
            </div>
          </template>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { getServer } from "@/api/monitor/server";
import echarts from "echarts";
export default {
  name: "Server",
  data() {
    return {
      // 加载层信息
      loading: [],
      // 服务器信息
      server: [],
      serverData: [],
      cpuData: [],
      jumprateState: false
    };
  },
  created() {
    this.openLoading();
    this.getList();
  },
  methods: {
    /** 查询服务器信息 */
    getList() {
      getServer().then((response) => {
        this.server = response;
        this.assemblyData(response.data);
        this.loading.close();
      });
    },

    assemblyData(data) {
      // 服务器信息
      this.setServiceData(data);
      // 内存
      this.setRamData(data.RamUsed);
      this.setDiskData(data.Disk);
      this.cpuData = data.CpuUse.data;
      this.chart();
    },
    // 服务器
    setServiceData(data) {
      this.serverData[this.serverData.length] = {
        title: "服务器环境",
        list: [
          { name: "操作系统", value: data.Os.go_os },
          { name: "CPU 数量", value: data.Os.cpu_num },
          { name: "系统架构", value: data.Os.go_arch },
        ],
      };

      this.serverData[this.serverData.length] = {
        title: "项目环境",
        list: [
          { name: "go version", value: data.Os.go_version },
          { name: "goroutine", value: data.Os.num_goroutine },
          { name: "项目地址", value: data.Os.get_current_path },
        ],
      };
    },
    // 内存
    setRamData(data) {
      this.serverData[this.serverData.length] = {
        title: "内存",
        list: [
          { name: "总内存", value: data.total },
          { name: "已用内存", value: data.used },
          { name: "使用率", value: data.used_percent },
        ],
      };
    },
    // 磁盘信息
    setDiskData(data) {
      this.serverData[this.serverData.length] = {
        title: "磁盘信息",
        list: [
          { name: "总内存", value: data.total },
          { name: "已用内存", value: data.used },
          { name: "使用率", value: data.used_percent },
        ],
      };
    },

    chart() {
      // cpu 详情
      this.$nextTick(function () {
        for (let i = 0; i < this.cpuData.length; i++) {
          this.getOption(
            "jumprate" + (i + 1),
            Math.ceil(this.cpuData[i]),
            ""
          );
        }
        this.jumprateState = true;
      });
    },

    getOption(jumprate, point, text) {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById(jumprate));
      // 绘制图表，this.echarts1_option是数据
      let handred = 100;
      text = text == "" ? point + "%" : text + "\n" + point + "%";
      myChart.setOption({
        title: {
          text: text,
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "#4997BF",
            fontSize: "25",
          },
          data: ["cpu"],
        },
        tooltip: {
          formatter: function (params) {
            return params.name + "：" + params.percent + " %";
          },
        },
        legend: {
          show: false,
          itemGap: 12,
          data: ["使用率", "剩余"],
        },

        series: [
          {
            name: "circle",
            type: "pie",
            clockWise: true,
            radius: ["50%", "60%"],
            itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            data: [
              {
                value: point,
                name: "使用率",
                itemStyle: {
                  normal: {
                    color: {
                      // 颜色渐变
                      colorStops: [
                        {
                          offset: 0,
                          color: "#4FADFD", // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#28E8FA", // 100% 处的颜色1
                        },
                      ],
                    },
                    label: {
                      show: false,
                    },
                    labelLine: {
                      show: false,
                    },
                  },
                },
              },
              {
                name: "total",
                value: handred - point,
                itemStyle: {
                  normal: {
                    color: "#E1E8EE",
                  },
                },
              },
            ],
          },
        ],
      });
    },

    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "拼命读取中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
  },
};
</script>
