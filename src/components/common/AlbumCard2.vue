<template>
  <div class="album-card" @click="goDetail">
    <div class="image-container">
      <van-image :src="album.coverUrl" :alt="album.albumTitle"/>
    </div>
    <div class="album-info">
      <p class="title">{{ album.albumTitle }}</p>
      <p class="category">{{ album.categoryLevel1Name }}</p>
      <div class="count-info">
        <span class="icon-play"/>
        <span class="play-count">{{ album.viewsCount }}</span>
        <span class="icon-barrage"/>
        <span class="barrage-count">{{ album.subscriptionCount }}</span>
      </div>
      <div class="owner-info">
        <span class="icon-up"></span>
        <span class="owner">{{ album.creatorNickname }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {AlbumForRecallResp} from "@/models/album.ts";
import {defineProps} from "vue";

const props = defineProps<{
  album: AlbumForRecallResp
}>();

const router = useRouter();

const goDetail = () => {
  router.push({
    path: '/sound/soundDetail',
    query: {mediaId: props.album.albumId, creatorMemberId: props.album.creatorMemberId}
  });
};
</script>

<style lang="scss" scoped>
.album-card {
  cursor: pointer;

  .image-container {
    width: 6rem;
    height: 6rem;
    border-radius: 0.8rem;
    overflow: hidden;
    background-color: #e7e7e7;
  }

  .album-info {
    margin-top: 0.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-weight: bold;
      font-size: 0.9rem;
      color: #212121;
      line-height: 1.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .category {
      font-size: 0.8rem;
      color: #999;
      line-height: 1.4rem;
    }

    .count-info {
      font-size: 0.6875rem;
      color: #999;
      margin-top: 0.125rem;

      .icon-play {
        width: 0.875rem;
        height: 0.75rem;
        background-image: url("@/assets/images/ico-play.png");
        background-size: 100% 100%;
        display: inline-block;
        vertical-align: middle;
      }

      .icon-barrage {
        width: 0.875rem;
        height: 0.75rem;
        background-image: url("@/assets/images/ico-danmu.png");
        background-size: 100% 100%;
        display: inline-block;
        vertical-align: middle;
        margin-left: 0.625rem;
      }

      .play-count, .barrage-count {
        margin-left: 0.375rem;
      }
    }

    .owner-info {
      font-size: 0.8rem;
      color: #999;
      margin-top: 0.125rem;

      .icon-up {
        width: 0.8rem;
        height: 0.8rem;
        display: inline-block;
        vertical-align: middle;
        background-image: url("@/assets/images/ico-up.png");
        background-size: 100% 100%;
      }

      .owner {
        margin-left: 0.4rem;
      }
    }

    .action-buttons {
      margin-top: 0.125rem;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
