<template>
  <div class="video-play">
    <div class="video-imag">
      <VanImage :src="picUrl" :alt="title" radius="2" height="6rem" width="7rem" />
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
          <van-button hairline round size="mini">分享</van-button>
          <van-button hairline round size="mini">数据</van-button>
          <van-button hairline round size="mini">编辑</van-button>
          <van-button hairline round size="mini">...</van-button>
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
  margin: 0.4rem 0.2rem;
  background-color: #fff;
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  padding: 0.2rem;

  .video-imag {
    width: 7rem;
    height: 6rem;
    flex-shrink: 0; /* Prevents image from shrinking */
    border-radius: 0.2rem;
    overflow: hidden;
    background-color: #e7e7e7;
    background-image: url("@/assets/images/tv.png");
    background-size: 7rem 7rem;
    background-position: 1.5rem 0;
    background-repeat: no-repeat;
    transition: all 0.3s;
    padding-right: 0.1rem;
  }

  .video-description {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-left: 0.4rem;
    overflow: hidden;

    .video-header {
      display: flex;
      justify-content: space-between; /* 让标题和日期分开 */
      align-items: center;

      .video-title {
        font-size: 1rem;
        margin-bottom: 0.2rem;
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
        font-size: 0.8rem !important;
        color: #999;
        display: flex;
        justify-content: flex-start;
        gap: 0.3rem;

        p {
          display: flex;
          align-items: center; /* Ensures icons and text in each <p> are vertically centered */
          margin-right: 0.4rem;

          span {
            margin-left: 0.2rem;
          }
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