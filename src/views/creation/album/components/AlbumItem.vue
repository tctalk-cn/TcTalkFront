<template>
  <div class="album-container">
    <!-- 修改这里 -->
    <div class="album-header">
      <!-- 左侧封面 -->
      <div class="album-cover">
        <router-link
            :to="{path: '/creative/albumDetail', query: {albumId: id,albumCreatorMemberId:albumCreatorMemberId}}">
          <van-image :src="coverUrl" :alt="name"/>
        </router-link>
      </div>
      <!-- 中间 统计信息 -->
      <div class="album-info">
        <div class="album-title">{{ name }}</div>
        <div class="album-count">
          <p v-if="showPlayCount"
             @click="router.push({path: '/creative/albumDetail', query: {albumId: id,albumCreatorMemberId:albumCreatorMemberId}})">
            <IconPark :icon="Play" theme="filled" :size="12"/>
            <span>{{ useNumberFormat(playCount || 0) }}</span>
          </p>
          <p v-if="showCommentCount">
            <IconPark :icon="Comment" theme="filled" :size="12" @click="onPlay"/>
            <span>{{ commentCount }}</span>
          </p>
          <p v-if="showLikeCount">
            <IconPark :icon="Like" theme="filled" :size="12" @click="onPlay"/>
            <span>{{ likeCount }}</span>
          </p>
          <p v-if="showSubscriptionCount">
            <IconPark :icon="Rss" theme="filled" :size="12" @click="onPlay"/>
            <span>{{ subscriptionCount }}</span>
          </p>
          <p v-if="showBarrageCount">
            <IconPark :icon="AlarmClock" theme="filled" :size="12" @click="onPlay"/>
            <span>{{ barrageCount }}</span>
          </p>
        </div>
      </div>
      <div class="album-right">
        <span>{{ formatDateTime(updateTime) }}</span>
      </div>
    </div>

    <div class="album-actions">
      <van-button hairline round size="small" @click.stop="onShare">分享</van-button>
      <van-button hairline round size="small" @click.stop="onViewData">数据</van-button>
      <van-button hairline round size="small" @click.stop="onEdit">编辑</van-button>
      <van-button hairline round size="small" @click.stop="onMore">...</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {AlarmClock, Headset, Play, Comment, Like, Rss} from "@icon-park/vue-next";
import {useNumberFormat} from "@/utils/number.ts";
import IconPark from "@/components/common/IconPark.vue";
import {formatDate} from "@/utils/date.ts";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps<{
  id: string;
  name: string;
  coverUrl: string;
  albumCreatorMemberId: string;
  creatorNickname: string;
  showPlayCount?: boolean;
  playCount?: number;
  showCommentCount?: boolean;
  commentCount?: number;
  showBarrageCount?: boolean;
  barrageCount?: number;
  showLikeCount?: boolean;
  likeCount?: number;
  showSubscriptionCount?: boolean;
  subscriptionCount?: number;
  onPlay?: () => void,
  onPin2Top?: () => void;
  updateTime?: string,
  onEdit?: () => void;
  onDelete?: () => void;
  onViewData?: () => void;
  onShare?: () => void;
  onMore?: () => void;
}>();
const formatDateTime = (time: string) => {
  if (time == null || time === '') {
    return 'N/A';
  }
  const currentTime = new Date().getTime();
  const updateDate = new Date(time).getTime();

  const diffInMs = currentTime - updateDate;
  const diffInMin = diffInMs / (1000 * 60);
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  // 如果小于1min，显示"刚刚更新"
  if (diffInMin < 1) {
    return `刚刚更新`;
  }
  // 如果在60分钟内，显示"X分钟前"
  if (diffInMin < 60) {
    return `${Math.floor(diffInMin)}分钟前更新`;
  }
  // 如果在24小时以内，显示"X小时前"
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}小时前更新`;
  }

  // 如果在30天以内，显示"X天前"
  if (diffInDays < 30) {
    return `${Math.floor(diffInDays)}天前更新`;
  }

  // 如果大于30天，显示"YYYY-MM-DD"
  return formatDate(updateDate, 'yyyy-MM-dd');
}
</script>
<style lang="scss">
.album-container {
  display: flex;
  background: $bc;
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  flex-direction: column;
  overflow: hidden;

  .album-header {
    display: flex;
    align-items: flex-start; /* 让子元素顶部对齐 */
    justify-content: space-between; /* 让标题和日期分开 */
    gap: 1rem; /* 让封面、统计信息、更新时间有间距 */
    background: $fc;

    .album-cover {
      width: 7rem;
      height: 5rem;
      border-radius: 0.2rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: 4rem 4rem;
      background-position: 1.5rem 0;
      background-repeat: no-repeat;
    }
  }

  .album-info {
    flex-grow: 1; /* 让它占据中间所有空间 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 5rem;

    .album-title {
      margin-left: 0.5rem;
      font-size: 1rem;
      font-family: 'Helvetica Neue', Tahoma, Arial, serif;
      flex-grow: 1; /* 让标题占满剩余空间 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .album-count {
      display: flex;
      font-size: 0.8rem !important;
      color: #999;
      gap: 0.2rem;
      margin-bottom: 0.8rem;
      margin-top: auto; /* 让它推到底部 */

      p {
        display: flex;
        align-items: center;
        margin-right: 0.4rem;

        span {
          margin-left: 0.2rem;
        }
      }
    }
  }


  .album-right {
    flex-shrink: 0; /* 防止被挤压 */
    font-size: 0.8rem !important;
    color: #999;
    margin-left: 1rem;
  }

  .album-actions {
    display: flex;
    gap: 0.2rem;
    align-items: center;
    justify-content: flex-end; /* 让图标对齐 */
    flex-shrink: 0; /* 确保不会被压缩 */
    margin-left: auto; /* 关键：推到最右侧 */
  }
}


</style>