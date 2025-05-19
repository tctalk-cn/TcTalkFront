<template>
  <div class="basic-data-container">
    <!-- 时间筛选 -->
    <van-tabs v-model:active="selectedTimeRange" @change="updateChartData">
      <van-tab title="昨天" name="yesterday"/>
      <van-tab title="近7日" name="7days"/>
      <van-tab title="近30日" name="30days"/>
      <van-tab title="近一年" name="1year"/>
    </van-tabs>

    <!-- 数据类型筛选 -->
    <div class="data-types-filter">
      <van-button @click="trafficStats" size="small" plain
                  :type="dataTypeFilterSelected==='traffic'?'danger':'default'">
        流量分析
      </van-button>
      <van-button @click="subscriptionStats" size="small" plain
                  :type="dataTypeFilterSelected==='subscription'?'danger':'default'">
        订阅分析
      </van-button>
    </div>

    <!-- 数据统计展示 -->
    <van-grid :column-num="3" :border="false" v-if="dataTypeFilterSelected==='traffic'">
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">播放量</p>
          <p class="stats-value">{{ playCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">点赞量</p>
          <p class="stats-value">{{ praisedCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">评论量</p>
          <p class="stats-value">{{ commentCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">收藏量</p>
          <p class="stats-value">{{ favoritesCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">分享量</p>
          <p class="stats-value">{{ shareCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">完播率</p>
          <p class="stats-value">{{ finishPlayRate }}%</p>
        </div>
      </van-grid-item>
    </van-grid>
    <van-grid :column-num="2" :border="false" v-else>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">吸粉量</p>
          <p class="stats-value">{{ incFansCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">吸粉率</p>
          <p class="stats-value">{{ incFansRate }}%</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">脱粉量</p>
          <p class="stats-value">{{ decFansCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">脱粉率</p>
          <p class="stats-value">{{ decFansRate }}%</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">不感兴趣量</p>
          <p class="stats-value">{{ noInterestedCount }}</p>
        </div>
      </van-grid-item>
      <van-grid-item style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
        <div class="stats-box">
          <p class="stats-title">不感兴趣率</p>
          <p class="stats-value">{{ noInterestedRate }}%</p>
        </div>
      </van-grid-item>
    </van-grid>
    <!-- 折线图 -->
    <v-chart :option="chartOption" style="width: 100%; height: 300px;"/>

  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from "vue";
import {use} from "echarts/core";
import {LineChart} from "echarts/charts";
import {GridComponent, TooltipComponent, LegendComponent} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";
import VChart from "vue-echarts";
import {useAlbumStore} from "@/stores/album_store.js";
import {useRoute} from "vue-router";
import {MediaSummary} from "@/models/media_summary.ts";

use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

const route = useRoute();
const {latest7DayPlayStats, yesterdayPlayStats, latest30DayPlayStats, latestOneYearDayPlayStats} = useAlbumStore();

const albumId = route.query.albumId as string;
const albumCreatorMemberId = route.query.albumCreatorMemberId as string;

// 选项状态
const selectedTimeRange = ref("7days");
// 数据筛选类型选择
const dataTypeFilterSelected = ref("traffic");

// 媒体统计数据
const mediaSummaryData = ref({} as MediaSummary);

// 计算统计数据
const playCount = computed(() => {
  const playCounts = mediaSummaryData.value.playCount || [];
  return playCounts.reduce((sum, count) => sum + count, 0);
});

// 计算统计数据
const praisedCount = computed(() => {
  const praisedCounts = mediaSummaryData.value.praisedCounts || [];
  return praisedCounts.reduce((sum, count) => sum + count, 0);
});

// 计算统计数据
const commentCount = computed(() => {
  const commentCounts = mediaSummaryData.value.commentCounts || [];
  return commentCounts.reduce((sum, count) => sum + count, 0);
});

// 计算统计数据
const shareCount = computed(() => {
  const shareCounts = mediaSummaryData.value.shareCounts || [];
  return shareCounts.reduce((sum, count) => sum + count, 0);
});

// 计算统计数据
const favoritesCount = computed(() => {
  const favoritesCounts = mediaSummaryData.value.favoritesCounts || [];
  return favoritesCounts.reduce((sum, count) => sum + count, 0);
});

// 计算统计数据
const finishPlayRate = computed(() => {
  const finishPlayCounts = mediaSummaryData.value.finishPlayCount || [];
  let totalFinishPlayCount = finishPlayCounts.reduce((sum, count) => sum + count, 0);
  const playCounts = mediaSummaryData.value.playCount || [];
  let totalPlayCounts = playCounts.reduce((sum, count) => sum + count, 0);
  if (totalPlayCounts <= 0) {
    return "0.0";
  }
  return Math.round((totalFinishPlayCount / totalPlayCounts) * 100)
});

// 计算统计数据
const incFansCount = computed(() => {
  const incFansCounts = mediaSummaryData.value.incFansCounts || [];
  return incFansCounts.reduce((sum, count) => sum + count, 0);
});

const incFansRate = computed(() => {
  const incFansCounts = mediaSummaryData.value.incFansCounts || [];
  let totalIncFansCounts = incFansCounts.reduce((sum, count) => sum + count, 0);
  const uniqueUsers = mediaSummaryData.value.uniqueUsers || [];
  let totalUniqueUsers = uniqueUsers.reduce((sum, count) => sum + count, 0);
  if (totalUniqueUsers <= 0) {
    return "0.0";
  }
  return Math.round((totalIncFansCounts / totalUniqueUsers) * 100)
});

// 计算统计数据
const decFansCount = computed(() => {
  const decFansCounts = mediaSummaryData.value.decFansCounts || [];
  return decFansCounts.reduce((sum, count) => sum + count, 0);
});

const decFansRate = computed(() => {
  const decFansCounts = mediaSummaryData.value.decFansCounts || [];
  let totalDecFansCounts = decFansCounts.reduce((sum, count) => sum + count, 0);
  const uniqueUsers = mediaSummaryData.value.uniqueUsers || [];
  let totalUniqueUsers = uniqueUsers.reduce((sum, count) => sum + count, 0);
  if (totalUniqueUsers <= 0) {
    return "0.0";
  }
  return Math.round((totalDecFansCounts / totalUniqueUsers) * 100)
});

// 计算统计数据
const noInterestedCount = computed(() => {
  const noInterestedCounts = mediaSummaryData.value.noInterestedCounts || [];
  return noInterestedCounts.reduce((sum, count) => sum + count, 0);
});

const noInterestedRate = computed(() => {
  const noInterestedCounts = mediaSummaryData.value.noInterestedCounts || [];
  let totalNoInterestedCounts = noInterestedCounts.reduce((sum, count) => sum + count, 0);
  const playCounts = mediaSummaryData.value.playCount || [];
  let totalPlayCounts = playCounts.reduce((sum, count) => sum + count, 0);
  if (totalPlayCounts <= 0) {
    return "0.0";
  }
  return Math.round((totalNoInterestedCounts / totalPlayCounts) * 100)
});


// 计算折线图数据
const chartOption = computed(() => {
  let legendTitles = [];
  let seriesData = [];
  if (dataTypeFilterSelected.value == "traffic") {
    legendTitles = ["播放量分析"];
    seriesData = [
      {
        name: "播放量分析",
        type: "line",
        data: mediaSummaryData.value.playCount,
        smooth: true,
      },
    ];
  } else if (dataTypeFilterSelected.value == "subscription") {
    legendTitles = ["订阅量", "新增订阅", "取消订阅"];
    seriesData = [
      {
        name: "订阅量",
        type: "line",
        data: mediaSummaryData.value.subscriptionCount,
        smooth: true,
      },
      {
        name: "新增订阅",
        type: "line",
        data: mediaSummaryData.value.incSubscriptionCount,
        smooth: true,
      },
      {
        name: "取消订阅",
        type: "line",
        data: mediaSummaryData.value.decSubscriptionCount,
        smooth: true,
      },
    ];
  }
  return {
    tooltip: {trigger: "axis"},
    legend: {
      data: legendTitles,
      orient: "horizontal", // 水平排列
      bottom: 0, // 放在底部
    },
    xAxis: {type: "category", data: mediaSummaryData.value.playDate},
    yAxis: {type: "value"},
    series: seriesData,
  };
});


// 更新数据
async function updateChartData() {
  if (selectedTimeRange.value === "yesterday") {
    mediaSummaryData.value = await yesterdayPlayStats(albumCreatorMemberId, albumId);
  } else if (selectedTimeRange.value === "7days") {
    mediaSummaryData.value = await latest7DayPlayStats(albumCreatorMemberId, albumId);
  } else if (selectedTimeRange.value === "30days") {
    mediaSummaryData.value = await latest30DayPlayStats(albumCreatorMemberId, albumId);
  } else if (selectedTimeRange.value === "1year") {
    mediaSummaryData.value = await latestOneYearDayPlayStats(albumCreatorMemberId, albumId);
  }
}

// 播放统计
const playStats = () => {
  dataTypeFilterSelected.value = "play"
}

// 流量统计
const trafficStats = () => {
  dataTypeFilterSelected.value = "traffic"
}

// 互动统计
const interactionStats = () => {
  dataTypeFilterSelected.value = "interaction"
}

// 互动统计
const subscriptionStats = () => {
  dataTypeFilterSelected.value = "subscription"
}

onMounted(async () => {
  mediaSummaryData.value = await latest7DayPlayStats(albumCreatorMemberId, albumId);
});
</script>

<style scoped lang="scss">
.basic-data-container {
  background-color: $fc;
  padding: 0 1rem;

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
