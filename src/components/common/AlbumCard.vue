<template>
  <div class="album-card">

    <div class="album-card__header">
      <router-link class="album-card__cover"
                   :to="{ path: '/creative/albumDetail', query: { albumId: album.albumId, } }">
        <van-image
            :src="album.coverUrl"
            :alt="album.albumTitle"
            style="width: 100%; height: 100%; object-fit: cover; display: block;"/>
      </router-link>
      <div class="album-card__info">
        <div class="album-card__title">{{ album.albumTitle }}</div>
        <div class="album-card__stats">
          <p v-if="showViewsCount" @click="navigateToDetail">
            <IconPark :icon="Play" theme="filled" :size="12"/>
            <span>{{ useNumberFormat(Number(album.viewsCount) || 0) }}</span>
          </p>
          <p v-if="showCommentCount">
            <IconPark :icon="Comment" theme="filled" :size="12"/>
            <span>{{ album.commentCount }}</span>
          </p>
          <p v-if="showLikeCount">
            <IconPark :icon="Like" theme="filled" :size="12"/>
            <span>{{ album.likeCount }}</span>
          </p>
          <p v-if="showSubscriptionCount">
            <IconPark :icon="Rss" theme="filled" :size="12"/>
            <span>{{ album.subscriptionCount }}</span>
          </p>
          <p v-if="showBarrageCount">
            <IconPark :icon="AlarmClock" theme="filled" :size="12"/>
            <span>{{ album.barrageCount }}</span>
          </p>
        </div>
      </div>

      <div class="album-card__update-time">{{ formatDateTime(album.publishTime) }}</div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {AlarmClock, Comment, Like, Play, Rss} from '@icon-park/vue-next'
import IconPark from '@/components/common/IconPark.vue'
import {useNumberFormat} from '@/utils/number.ts'
import {formatDate} from '@/utils/date.ts'
import {useRouter} from 'vue-router'
import {defineProps} from "vue";
import {AlbumForRecallResp} from "@/models/album.ts";

const router = useRouter()

const props = defineProps<{
  album: AlbumForRecallResp,
  showPlayCount: Boolean,
  showCommentCount: Boolean,
  showBarrageCount: Boolean,
  showLikeCount: Boolean,
  showViewsCount: Boolean,
  showSubscriptionCount: Boolean,
}>();


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
    path: '/creative/albumDetail',
    query: {albumId: props.album.albumId, albumCreatorMemberId: props.album.creatorMemberId}
  })
}
</script>

<style lang="scss" scoped>

.album-card {
  display: flex;
  flex-direction: column;
  min-height: 8rem; /* 或者比封面高度稍高一点 */
  background: $fc;
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding-bottom: 0.5rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.2rem;
  }

  &__cover {
    width: 7rem;
    height: 7rem;
    border-radius: 0.2rem;
    flex-shrink: 0; /* 防止 flex 布局压缩封面 */
    overflow: hidden;
    background: #e7e7e7 url('@/assets/images/tv.png') no-repeat 1.5rem 0 / 4rem 4rem;
  }

  &__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
}
</style>
