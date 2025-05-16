<template>
  <div class="audience-data-container">
    <!-- 时间筛选 -->
    <van-tabs v-model:active="analyseType" @change="changeAnalyseType">
      <van-tab title="观众分析" name="audience"/>
      <van-tab title="观众画像" name="portrait"/>
      <van-tab title="观众评价" name="comment"/>
    </van-tabs>
    <!--观众画像-->
    <div class="audience-portrait-container" v-if="analyseType==='portrait'">
      <div class="audience-summary-container">
        <div class="audience-summary-title">
          观众特征总结
        </div>
        <van-cell-group inset>
          <van-cell>
            <template #icon>
              <van-icon name="manager-o" class="summary-icon"/>
            </template>
            <template #title>
              <div class="summary-title">男性，50以上岁居多</div>
            </template>
            <template #label>
              <div class="summary-label">性别年龄</div>
            </template>
          </van-cell>
          <van-cell>
            <template #icon>
              <van-icon name="shop-o" class="summary-icon"/>
            </template>
            <template #title>
              <div class="summary-title">三线，河南居多</div>
            </template>
            <template #label>
              <div class="summary-label">地域</div>
            </template>
          </van-cell>
          <van-cell>
            <template #icon>
              <van-icon name="bulb-o" class="summary-icon"/>
            </template>
            <template #title>
              <div class="summary-title">服务业居多</div>
            </template>
            <template #label>
              <div class="summary-label">兴趣职业</div>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
      <div class="audience-region-container">
        <div class="audience-region-title">观众区域</div>
        <div class="audience-region-summary" v-if="Object.keys(hotCitiesMapRef).length > 0">
          {{ Object.keys(hotCitiesMapRef)[0] }}最多
        </div>
        <div class="audience-region-summary" v-else>
          暂无
        </div>
        <div class="audience-region-chart">
          <!-- 柱状图 -->
          <v-chart :option="regionChartOption" style="width: 100%; height: 300px;"/>
        </div>
      </div>
    </div>
    <!--观众评价-->
    <div class="audience-comment-container" v-if="analyseType==='comment'">
      <div class="audience-hot-word-container">
        <div class="audience-hot-word-title">热门评论词</div>
        <div class="audience-hot-word-chart">
          <!-- 柱状图 -->
          <v-chart :option="hotWordChartOption" style="width: 100%; height: 300px;"/>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import {use} from "echarts/core";
import {LineChart, PieChart, BarChart} from "echarts/charts";
import {GridComponent, TooltipComponent, LegendComponent} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";
import VChart from "vue-echarts";
import {useAlbumStore} from "@/stores/album.js";
import {useRoute} from "vue-router";
import {MediaSummary} from "@/models/media_summary.ts";

use([LineChart, PieChart, BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const route = useRoute();
const {latest7DayPlayStats, queryHotWordsByAlbumId, queryRegionsByAlbumId} = useAlbumStore();

const albumId = route.query.albumId as string;
const albumCreatorMemberId = route.query.albumCreatorMemberId as string;

// 选项状态
const analyseType = ref("portrait");


// 媒体统计数据
const mediaSummaryData = ref({} as MediaSummary);

// 热点词map
const hotWordsMapRef = ref({});
// 热点城市map
const hotCitiesMapRef = ref<[]>({});

// 计算折线图数据
const regionChartOption = computed(() => {
  const hotCities = Object.keys(hotCitiesMapRef.value); // X 轴数据（词）
  const frequencies = Object.values(hotCitiesMapRef.value);// Y 轴数据（词频)
  return {
    tooltip: {
      trigger: "axis", // 柱状图用 "axis" 而不是 "item"
      axisPointer: {type: "shadow"}, // 轴指示器类型
      formatter: "{b}: {c}", // 格式化显示
    },
    xAxis: {
      type: "category", // X 轴使用类别
      data: hotCities, // 省份名称
      axisTick: {alignWithLabel: true},
    },
    yAxis: {
      type: "value", // Y 轴使用数值类型
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true, // 保持标签完整
    },
    series: [
      {
        type: "bar",
        data: frequencies, // 每个省份对应的数据
        barWidth: "40%", // 柱子宽度
        itemStyle: {
          color: "#4CAF50", // 统一柱子颜色
          barBorderRadius: [5, 5, 0, 0], // 圆角柱子
        },
        emphasis: {
          itemStyle: {
            color: "#2E7D32", // 强调时颜色变化
          },
        },
      },
    ],
  };
});


const hotWordChartOption = computed(() => {
  const hotWords = Object.keys(hotWordsMapRef.value); // X 轴数据（词）
  const frequencies = Object.values(hotWordsMapRef.value);// Y 轴数据（词频)
  return {
    tooltip: {
      trigger: "axis", // 柱状图用 "axis" 而不是 "item"
      axisPointer: {type: "shadow"}, // 轴指示器类型
      formatter: "{b}: {c}", // 格式化显示
    },
    xAxis: {
      type: "category", // X 轴使用类别
      data: hotWords, // 评论词名称
      axisTick: {alignWithLabel: true},
    },
    yAxis: {
      type: "value", // Y 轴使用数值类型
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "10%",
      containLabel: true, // 保持标签完整
    },
    series: [
      {
        type: "bar",
        data: frequencies, // 每个省份对应的数据
        barWidth: "40%", // 柱子宽度
        itemStyle: {
          color: "#3B82F6", // 统一柱子颜色
          barBorderRadius: [5, 5, 0, 0], // 圆角柱子
        },
        emphasis: {
          itemStyle: {
            color: "#1E40AF", // 强调时颜色变化
          },
        },
      },
    ],
  };
});

onMounted(async () => {
  mediaSummaryData.value = await latest7DayPlayStats(albumCreatorMemberId, albumId);
  hotWordsMapRef.value = await queryHotWordsByAlbumId(albumCreatorMemberId, albumId);
  hotCitiesMapRef.value = await queryRegionsByAlbumId(albumCreatorMemberId, albumId);
});
</script>

<style scoped lang="scss">
@import '@/assets/mixin';

.audience-data-container {
  background-color: $fc;
  padding: 0 1rem;

  .audience-portrait-container {
    .audience-summary-container {
      background: #fff;
      border-radius: 1rem !important;
      box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.1);
      padding: 1rem;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;

      .audience-summary-title {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 0.6rem;
      }

      .summary-icon {
        font-size: 1.6rem;
        color: #3b82f6;
        margin-right: 0.4rem;
      }

      .summary-title {
        font-size: 0.8rem;
        font-weight: bold;
      }

      .summary-label {
        font-size: 0.6rem;
        color: #888;
      }
    }

    .audience-region-container {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.1);
      padding: 1rem;

      .audience-region-title {
        font-size: 1rem;
        font-weight: bold;
      }

      .audience-region-summary {
        font-size: 0.8rem;
        color: #666;
      }

      .audience-region-chart {
        width: 100%;
      }
    }
  }

  .audience-comment-container {

    .audience-hot-word-container {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.1);
      padding: 1rem;

      .audience-hot-word-title {
        font-size: 1rem;
        font-weight: bold;
      }

      .audience-hot-word-summary {
        font-size: 0.8rem;
        color: #666;
      }

      .audience-hot-word-chart {
        width: 100%;
      }
    }
  }


  .data-types-filter {
    margin-top: 1rem !important;
    display: flex;
    justify-content: flex-start; /* 按钮靠左对齐 */
    gap: 1rem;
  }

  /* 统计框样式 */
  .stats-box {
    width: 100%;
    text-align: center;
    padding: 0.4rem 1rem;
    border-radius: 0.2rem;
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
    background-color: #f5f5f5 !important; /* 可根据需要设置背景色 */

    .stats-title {
      font-size: 0.8rem;
      color: #666;
    }

    .stats-value {
      margin-top: 0.5rem;
      font-size: 1.1rem;
      font-weight: bold;
      color: #333;
    }

    .stats-percentage {
      font-size: 0.8rem;
      color: #f56c6c;
    }
  }


}
</style>
