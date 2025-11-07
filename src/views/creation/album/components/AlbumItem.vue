<template>
  <div class="album-card">
    <div class="album-card__header">
      <router-link
          class="album-card__cover"
          :to="{ path: '/creative/albumCreativeDetail', query: { albumId: id, albumCreatorMemberId } }"
      >
        <van-image :src="coverUrl" :alt="name"/>
      </router-link>

      <div class="album-card__info">
        <div class="album-card__title">{{ name }}</div>
        <div class="album-card__stats">
          <p v-if="showPlayCount" @click="navigateToDetail">
            <IconPark :icon="Play" theme="filled" :size="12"/>
            <span>{{ useNumberFormat(playCount || 0) }}</span>
          </p>
          <p v-if="showCommentCount">
            <IconPark :icon="Comment" theme="filled" :size="12"/>
            <span>{{ commentCount }}</span>
          </p>
          <p v-if="showLikeCount">
            <IconPark :icon="Like" theme="filled" :size="12"/>
            <span>{{ likeCount }}</span>
          </p>
          <p v-if="showSubscriptionCount">
            <IconPark :icon="Rss" theme="filled" :size="12"/>
            <span>{{ subscriptionCount }}</span>
          </p>
          <p v-if="showBarrageCount">
            <IconPark :icon="AlarmClock" theme="filled" :size="12"/>
            <span>{{ barrageCount }}</span>
          </p>
        </div>
      </div>

      <div class="album-card__update-time">{{ formatDateTime(updateTime) }}</div>
    </div>

    <div class="album-card__actions">
      <van-button type="primary" size="mini" @click="props.onShare">分享</van-button>
      <van-button type="default" size="mini" @click="props.onViewData">数据</van-button>
      <van-button type="default" size="mini" @click="props.onEdit">编辑</van-button>
      <van-button type="default" size="mini" @click="props.onMore">...</van-button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {AlarmClock, Comment, Like, Play, Rss} from '@icon-park/vue-next'
import IconPark from '@/components/common/IconPark.vue'
import {useNumberFormat} from '@/utils/number.ts'
import {formatDate} from '@/utils/date.ts'
import {useRouter} from 'vue-router'

const router = useRouter()

const props = defineProps({
  id: String,
  name: String,
  coverUrl: String,
  albumCreatorMemberId: String,
  creatorNickname: String,
  showPlayCount: Boolean,
  playCount: Number,
  showCommentCount: Boolean,
  commentCount: Number,
  showBarrageCount: Boolean,
  barrageCount: Number,
  showLikeCount: Boolean,
  likeCount: Number,
  showSubscriptionCount: Boolean,
  subscriptionCount: Number,
  onPlay: Function,
  onPin2Top: Function,
  updateTime: String,
  onEdit: Function,
  onDelete: Function,
  onViewData: Function,
  onShare: Function,
  onMore: Function,
})

const formatDateTime = (time?: string) => {
  if (!time) return 'N/A'
  const now = Date.now()
  const updated = new Date(time).getTime()
  const diffMin = (now - updated) / 60000
  const diffHour = diffMin / 60
  const diffDay = diffHour / 24

  if (diffMin < 1) return '刚刚更新'
  if (diffMin < 60) return `${Math.floor(diffMin)}分钟前更新`
  if (diffHour < 24) return `${Math.floor(diffHour)}小时前更新`
  if (diffDay < 30) return `${Math.floor(diffDay)}天前更新`

  return formatDate(updated, 'yyyy-MM-dd')
}

const navigateToDetail = () => {
  router.push({
    path: '/creative/albumCreativeDetail',
    query: {albumId: props.id, albumCreatorMemberId: props.albumCreatorMemberId}
  })
}
</script>

<style lang="scss" scoped>

.album-card {
  display: flex;
  flex-direction: column;
  background: $fc;
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding-bottom: 0.5rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.5rem 0.2rem;
  }

  &__cover {
    width: 7rem;
    height: 5rem;
    border-radius: 0.2rem;
    overflow: hidden;
    background: #e7e7e7 url('@/assets/images/tv.png') no-repeat 1.5rem 0 / 4rem 4rem;
  }

  &__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 5rem;
  }

  &__title {
    margin-left: 0.5rem;
    font-size: $font-size-mx;
    font-family: 'Helvetica Neue', Tahoma, Arial, serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__stats {
    display: flex;
    gap: 0.2rem;
    font-size: $font-size;
    color: #999;
    margin: auto 0 0.8rem 0.5rem;

    p {
      display: flex;
      align-items: center;
      margin-right: 0.4rem;

      span {
        margin-left: 0.2rem;
      }
    }
  }

  &__update-time {
    font-size: $font-size;
    color: #999;
    flex-shrink: 0;
    margin-left: 1rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: flex-end;
  }
}
</style>
