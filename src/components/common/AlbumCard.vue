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
        <div class="album-card__desc" v-if="album.albumDesc">{{ album.albumDesc }}</div>
        <div class="album-card__stats">
          <!-- VIP 图标 -->
          <p v-if="album.paid">
            <IconPark :icon="Vip" theme="filled" :size="12" fill="#f5a623"/>
            <span>VIP</span>
          </p>
          <p v-if="showViewsCount" @click="navigateToDetail">
            <IconPark :icon="Play" theme="filled" :size="12"/>
            <span>{{ useNumberFormat(Number(album.viewsCount) || 0) }}</span>
          </p>
          <p v-if="showSubscriptionCount">
            <IconPark :icon="Rss" theme="filled" :size="12"/>
            <span>{{ album.subscriptionCount }}</span>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Play, Rss, Vip} from '@icon-park/vue-next'
import IconPark from '@/components/common/IconPark.vue'
import {useNumberFormat} from '@/utils/number.ts'
import {formatDate} from '@/utils/date.ts'
import {useRouter} from 'vue-router'
import {defineProps} from "vue";
import {AlbumForRecallResp} from "@/models/album.ts";

const router = useRouter()

const props = defineProps<{
  album: AlbumForRecallResp,
  showViewsCount: Boolean,
  showSubscriptionCount: Boolean,
}>();


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
  border-radius: 0.6rem;
  box-shadow: 0 0.1rem 0.2rem rgba(0,0,0,0.05);
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  min-height: 8rem; /* 或者比封面高度稍高一点 */
  background: $fc;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.2rem;
  }

  &__cover {
    width: 6rem;
    height: 6rem;
    box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    border-radius: 0.3rem;
    flex-shrink: 0; /* 防止 flex 布局压缩封面 */
    overflow: hidden;
    background: #e7e7e7 url('@/assets/images/tv.png') no-repeat 1.5rem 0 / 4rem 4rem;

    transition: transform 0.2s;
    &:hover {
      transform: scale(1.05);
    }
  }


  &__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0.5rem;
  }

  &__title {
    margin-left: 0.5rem;
    font-size: $font-size-mx;
    font-family: 'Helvetica Neue', Tahoma, Arial, serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
    color: #222;
  }

  &__desc {
    margin-left: 0.5rem;
    margin-top: 0.2rem;
    font-size: $font-size-sm;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* 限制显示2行 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    max-height: 2.8em; /* 控制两行的总高度 */
  }

  &__stats {
    display: flex;
    gap: 0.2rem;
    font-size: $font-size-xs;
    color: #999;
    margin: 0.5rem 0 0.8rem 0.5rem; /* 上方间距增加到0.5rem */

    p {
      display: flex;
      align-items: center;
      margin-right: 0.4rem;
      background: #f5f5f5;
      padding: 0.1rem 0.3rem;
      border-radius: 0.3rem;
      color: #555;

      span {
        margin-left: 0.2rem;
      }
    }

  }

}
</style>
