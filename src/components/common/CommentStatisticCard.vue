<template>
  <div class="comment-statistic-card">
    <!-- 上部：推荐值 -->
    <div class="top-section">
      <span>推荐值 {{ Number(recommendPercent) * 100 }}%</span>
    </div>
    <!-- 中部：左侧图片和点评人数，右侧进度条 -->
    <div class="middle-section">
      <div class="left-side">
        <div v-if="Number(totalComments)<10" class="text-xl text-black font-bold mb-3">评分不足</div>
        <div v-else-if="Number(totalComments)<100" class="text-xl text-black font-bold mb-3">
          {{ Number(recommendPercent) * 100 }}%
        </div>
        <div v-else-if="Number(totalComments)<1000 && Number(recommendPercent) > 0.8"
             class="text-xl text-black font-bold mb-3">
          特别推荐
        </div>
        <div v-else-if="Number(totalComments)>=1000 && Number(recommendPercent) > 0.8"
             class="text-xl text-black font-bold mb-3">
          好评如潮
        </div>
        <div v-else class="text-xl text-black font-bold mb-3">
          {{ Number(recommendPercent) * 100 }}
        </div>
        <div>共有 {{ totalComments }} 人点评</div>
      </div>
      <div class="right-side">
        <div class="progress-item">
          <span>推荐</span>
          <van-progress :percentage="Number(recommendPercent)*100" stroke-width="2"/>
        </div>
        <div class="progress-item">
          <span>一般</span>
          <van-progress :percentage="Number(averagePercent)*100" stroke-width="2"/>
        </div>
        <div class="progress-item">
          <span>不行</span>
          <van-progress :percentage="Number(poorPercent)*100" stroke-width="2"/>
        </div>
      </div>
    </div>
    <van-divider contentPosition="center" style="font-size: 0.8rem">你愿意向其他听友推荐此专辑吗?</van-divider>
    <!-- 下部：三个按钮 -->
    <van-grid :column-num="3" :border="false">
      <van-grid-item>
        <van-button v-if="recommendedType===1" icon="good-job-o"
                    type="danger"
                    plain
                    @click="handleFeedback(1)"
                    size="small"
                    class="w-full text-xs">
          推荐
        </van-button>
        <van-button v-else icon="good-job-o"
                    type="default"
                    @click="handleFeedback(1)"
                    size="small"
                    class="w-full text-xs">
          推荐
        </van-button>
      </van-grid-item>
      <van-grid-item>
        <van-button v-if="recommendedType===2" icon="smile-o"
                    type="danger"
                    plain
                    @click="handleFeedback(2)"
                    size="small"
                    class="w-full text-xs">
          一般
        </van-button>
        <van-button v-else icon="smile-o"
                    type="default"
                    @click="handleFeedback(2)"
                    size="small"
                    class="w-full text-xs">
          一般
        </van-button>
      </van-grid-item>
      <van-grid-item>
        <van-button v-if="recommendedType===3" icon="warning-o"
                    type="danger"
                    plain
                    @click="handleFeedback(3)"
                    size="small"
                    class="w-full text-xs">
          一般
        </van-button>
        <van-button v-else icon="warning-o"
                    type="default"
                    @click="handleFeedback(3)"
                    size="small"
                    class="w-full text-xs">
          一般
        </van-button>
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalComments: string,
  recommendPercent: string,
  averagePercent: string,
  poorPercent: string,
  recommendedType?: number;
}>();

const emits = defineEmits(["feedbackHandler"]);

const handleFeedback = (type) => {
  // 处理用户反馈的逻辑
  emits("feedbackHandler", type);
};

</script>

<style lang="scss" scoped>

.comment-statistic-card {
  padding: 0.5rem;

  .top-section {
    text-align: left;
    font-size: $font-size;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .middle-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    max-height: 5rem;

    .left-side {
      padding-top: 0.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      @include sc(.8rem, #aaa);
      max-width: 8rem;
    }

    .right-side {
      flex: 1;
      margin-left: 2rem;
      font-size: $font-size-xs;
      gap: 1rem; /* Adjust spacing between <span> and <van-progress> */

      .progress-item {
        margin-bottom: 0.8rem;
        line-height: 1.5; /* 确保布局更均匀 */

        span {
          display: inline-block; /* 确保可以控制宽度和间距 */
          margin-right: 0.5rem; /* 调整右侧间距，拉开与 van-progress 的距离 */
          white-space: nowrap; /* 防止文字换行 */
        }

        .van-progress {
          display: inline-block; /* 避免 van-progress 占据整行 */
          width: 80%; /* 明确设置进度条宽度 */
          vertical-align: middle; /* 保持与文本对齐 */
        }
      }
    }
  }

  .bottom-section {
    display: flex;
    justify-content: space-between;
  }
}


</style>
