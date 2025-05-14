<template>
  <div class="video-play">
    <div class="video-image">
      <VanImage :src="picUrl" :alt="title" radius="2"  fit="cover" width="100%" height="100%"/>
    </div>
    <div class="video-description">
      <div class="video-header">
        <div class="video-title">{{ title }}</div>
        <div class="video-right">
          <IconPark :icon="Like"
                    theme="outline"
                    :size="12"
                    @click="onPlay"/>
        </div>
      </div>
      <div class="video-desc">
        <van-text-ellipsis
            rows="3"
            :content="description"
            expand-text="展开"
            collapse-text="收起"
        />
      </div>
      <div class="video-footer">
        <div class="video-count">
          <p v-if="showPlayCount">
            <IconPark :icon="video?Play:Headset"
                      theme="filled"
                      :size="12"
                      @click="onPlay"/>
            <span> {{ useNumberFormat(playCount || 0) }}</span>
          </p>
          <p v-if="showCommentCount">
            <IconPark :icon="Comments"
                      theme="filled"
                      :size="12"
                      @click="onPlay"/>
            <span> {{ useNumberFormat(commentCount || 0) }}</span>
          </p>
        </div>
        <div class="video-actions">
          <van-button icon="share-o" plain size="mini" round>分享</van-button>
          <van-button icon="chart-trending-o" plain size="mini" round>数据</van-button>
          <van-button icon="edit" plain size="mini" round>编辑</van-button>
          <van-button plain size="mini" round>...</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Comments, Headset, Like, Play} from "@icon-park/vue-next";
import {useNumberFormat} from "@/utils/number.ts";
import IconPark from "@/components/common/IconPark.vue";

defineProps<{
  picUrl: string
  playCount?: number
  commentCount?: number
  title: string
  description: string
  showPlayCount?: boolean
  showCommentCount?: boolean
  onPlay?: () => void,
  video?: boolean,
  live?: boolean,
}>();

</script>
<style lang="scss">
.video-play {
  display: flex;
  padding: 0.4rem;
  border-radius: 0.6rem;
  background-color: #fff;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
  gap: 0.6rem;

  &:hover {
    box-shadow: 0 0.4rem 1rem rgba(0, 0, 0, 0.1);
  }

  .video-image {
    width: 7rem;
    aspect-ratio: 16 / 9; // 更现代，自动计算高度
    flex-shrink: 0;
    border-radius: 0.4rem;
    overflow: hidden;
    background-color: #e7e7e7;
    background-image: url("@/assets/images/tv.png");
    background-size: 7rem 7rem;
    background-position: 1.5rem 0;
    background-repeat: no-repeat;
    transition: all 0.3s;
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.15);
  }

  .video-description {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .video-header {
      display: flex;
      justify-content: space-between; /* 让标题和日期分开 */
      align-items: center;
      margin-bottom: 0.4rem;

      .video-title {
        font-size: 1rem;
        font-weight: bold;
        color: #333;
        line-height: 1.4;
        font-family: Helvetica Neue, Tahoma, Arial, serif;
      }

      .video-right {
        flex-shrink: 0; /* 防止被挤压 */
        display: flex;
        justify-content: space-between;
      }

    }

    .video-desc {
      font-size: 0.6rem !important;
      color: #999;
      margin-bottom: 0.1rem;
    }

    .video-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto; /* Pushes the footer to the bottom */

      .video-count {
        display: flex;
        gap: 0.6rem;
        font-size: 0.75rem;
        color: #999;

        p {
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }
      }

      .video-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.2rem;
      }
    }

  }

}


</style>