<template>
  <div class="comment-summary">
    <!-- 上方标题 + 查看全部 -->
    <div class="title-actions" @click="goToAllComments">
      <div class="title">我的评价</div>
      <div class="all-comments">查看全部 ></div>
    </div>

    <!-- 下方统计 -->
    <div class="stats">
      <img class="avatar" :src="avatarUrl" alt="用户头像" />
      <div class="stat-item">
        <div class="value">{{ memberTransactionStatistics.commentCount }}</div>
        <div class="label">已评价</div>
      </div>
      <div class="divider"></div>
      <div class="stat-item">
        <div class="value">{{ memberTransactionStatistics.commentLikeCount }}</div>
        <div class="label">获赞</div>
      </div>
      <div class="divider"></div>
      <div class="stat-item">
        <div class="value">{{ memberTransactionStatistics.commentReplyCount }}</div>
        <div class="label">获评论</div>
      </div>
      <div class="divider"></div>
      <div class="stat-item">
        <div class="value">{{ memberTransactionStatistics.commentViewCount }}</div>
        <div class="label">被浏览</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import {MemberTransactionStatistics} from "@/models/member_statistics_info.ts";

const router = useRouter();

const props = defineProps<{
  memberTransactionStatistics: MemberTransactionStatistics,
  avatarUrl?: string
}>();

const avatarUrl = props.avatarUrl || "https://via.placeholder.com/40";

const goToAllComments = () => {
  router.push({ path: "/orderComment/all" });
};
</script>

<style scoped lang="scss">
.comment-summary {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);

  .title-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    cursor: pointer;

    .title {
      font-weight: 600;
      font-size: 1rem;
    }

    .all-comments {
      font-size: 0.75rem;
      color: #999;
    }
  }

  .stats {
    display: flex;
    align-items: center;

    .avatar {
      @include wh(2.5rem, 2.5rem);
      border-radius: 50%;
      object-fit: cover;
      margin-right: 1rem;
      flex-shrink: 0; /* 保持头像固定大小 */
    }

    .stat-item {
      flex: 1; /* 平分剩余空间 */
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .value {
        font-size: 1rem;
        font-weight: 600;
        color: #ff5722;
      }

      .label {
        font-size: 0.75rem;
        color: #666;
        margin-top: 0.2rem;
      }
    }

    .divider {
      width: 1px;
      height: 28px;
      background: #eee;
    }
  }
}
</style>
