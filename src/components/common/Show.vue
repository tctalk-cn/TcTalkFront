<template>
  <div class="show-container">
    <!-- 修改这里 -->
    <div class="show-header">
      <div class="show-title">{{ title }}</div>
      <div class="show-right">
        <span>{{ displayDate }}</span>
      </div>
    </div>
    <div class="show-tag">
      <van-tag type="default" plain v-if="isVideo">视频</van-tag>
      <van-tag type="default" plain v-if="isAudio">音频</van-tag>
      <van-tag type="primary" plain v-if="pin2Top" class="ml-1">置顶</van-tag>
    </div>
    <div class="show-footer">
      <div class="show-count">
        <p v-if="showPlayCount">
          <IconPark :icon="isVideo?Play:Headset"
                    theme="filled"
                    :size="12"
                    @click="onPlay"/>
          <span> {{ useNumberFormat(playCount || 0) }}</span>
        </p>
        <p v-if="showCommentCount">
          <IconPark :icon="AlarmClock"
                    theme="filled"
                    :size="12"
                    @click="onPlay"/>
          <span> {{ useFormatDuring(durationInMs / 1000 || 0) }}</span>
        </p>
      </div>
      <div class="show-actions">
        <van-icon name="video-o" v-if="isVideo" @click="onPlay"/>
        <van-icon name="music-o" v-if="isAudio" @click="onPlay"/>
        <van-icon name="more-o" @click="showMoreDialog = !showMoreDialog"/>
      </div>
    </div>
  </div>
  <!--更多操作弹出框-->
  <section>
    <van-popup v-model:show="showMoreDialog" round position="bottom" :style="{height:'60%'}"
               closeable
               close-icon="close"
               :close-on-click-overlay="false">
      <div class="show-popup-content">
        <van-cell-group>
          <van-cell title="置顶" icon="back-top" @click="handlePin2Top"/>
          <van-cell title="编辑" icon="edit" @click="onEdit"/>
          <van-cell title="下载" icon="down"/>
          <van-cell title="删除" icon="delete-o" @click="onDelete"/>
        </van-cell-group>
      </div>
    </van-popup>
  </section>
</template>

<script setup lang="ts">
import {AlarmClock, Headset, Play} from "@icon-park/vue-next";
import {useFormatDuring, useNumberFormat} from "@/utils/number.ts";
import IconPark from "@/components/common/IconPark.vue";
import {formatDate} from "@/utils/date.ts";
import {computed, ref} from "vue";
import {showToast} from "vant";

const props = defineProps<{
  playCount?: number
  commentCount?: number
  title: string
  description: string
  showPlayCount?: boolean
  showCommentCount?: boolean
  onPlay?: () => void,
  onPin2Top?: () => void;
  mediaType: number,
  createTime?: string,
  durationInMs: number,
  pin2Top: boolean,
  onEdit?: () => void;
  onDelete?: () => void;
}>();
const showMoreDialog = ref(false);
const handlePin2Top = () => {
  // 首先操作置顶
  if (props.onPin2Top) {
    props.onPin2Top();
    showMoreDialog.value = false;
    showToast('此声音已置顶');
  }
}
const isVideo = computed(() => props.mediaType === 0);
const isAudio = computed(() => props.mediaType === 1);
const displayDate = computed(() => {
  return props.createTime ? formatDate(new Date(props.createTime), 'yyyy-MM') : '--';
});
</script>
<style lang="scss" scoped>

.show-container {
  display: flex;
  margin: 0.2rem 0.2rem;
  background-color: #fff;
  border-radius: $border-radius;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.08);
  padding: $padding-sm $padding;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .show-header {
    display: flex;
    justify-content: space-between; /* 让标题和日期分开 */
    align-items: center;
    margin-bottom: 0.4rem;
    border-bottom: 0.1rem solid #f0f0f0;

    .show-title {
      font-size: $font-size-mx;
      font-family: Arial, serif;
      font-weight: bold;
      color: #333;
      flex-grow: 1; /* 让标题占满剩余空间 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .show-right {
      flex-shrink: 0; /* 防止被挤压 */
      font-size: $font-size;
      color: #999;
      margin-left: 1rem;
    }
  }

  .show-tag {
    display: flex;
    gap: $gap-xs;
    margin-top: 0.4rem;
    margin-bottom: 0.4rem;
  }

  .show-footer {
    display: flex;
    align-items: center;
    margin-top: auto; /* Pushes the footer to the bottom */
    width: 100%; /* 让 footer 占满 .program-description */

    .show-count {
      flex-grow: 1; // 让它占据剩余空间
      display: flex;
      font-size: $font-size;
      color: #999;
      gap: 0.3rem;
      align-items: center;

      p {
        display: flex;
        align-items: center; /* Ensures icons and text in each <p> are vertically centered */
        margin-right: 0.4rem;

        span {
          margin-left: 0.2rem;
        }
      }
    }

    .show-actions {
      display: flex;
      gap: $gap-xs;
      align-items: center;
      justify-content: flex-end; /* 让图标对齐 */
      flex-shrink: 0; /* 确保不会被压缩 */
      margin-left: auto; /* 关键：推到最右侧 */
    }
  }

}

.show-popup-content {
  margin-top: 1.5rem !important;
  padding: 1rem 1rem;
}


</style>