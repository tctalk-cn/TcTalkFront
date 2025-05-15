<template>
  <div class="show-container">
    <!-- 修改这里 -->
    <div class="show-header">
      <div class="show-title">{{ title }}</div>
      <div class="show-right">
        <span>{{ formatDate(new Date(createTime), 'yyyy-MM') }}</span>
      </div>
    </div>
    <div class="show-tag">
      <van-tag type="default" plain v-if="mediaType==0">视频</van-tag>
      <van-tag type="default" plain v-if="mediaType==1">音频</van-tag>
      <van-tag type="primary" plain v-if="pin2Top" class="ml-1">置顶</van-tag>
    </div>
    <div class="show-footer">
      <div class="show-count">
        <p v-if="showPlayCount">
          <IconPark :icon="mediaType==0?Play:Headset"
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
        <van-icon name="video-o" v-if="mediaType==0" @click="onPlay"/>
        <van-icon name="music-o" v-if="mediaType==1" @click="onPlay"/>
        <van-icon name="more-o" @click="showMoreDialog = !showMoreDialog"/>
      </div>
    </div>
  </div>
  <!--更多操作弹出框-->
  <section>
    <van-popup v-model:show="showMoreDialog" round position="bottom" :style="{height:'60%'}"
               @close="showMoreDialog = false"
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
import {ref} from "vue";
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
</script>
<style lang="scss">

.show-container {
  display: flex;
  margin: 0.2rem 0.2rem;
  background-color: #fff;
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;

  .show-header {
    display: flex;
    justify-content: space-between; /* 让标题和日期分开 */
    align-items: center;
    margin-bottom: 0.4rem;

    .show-title {
      font-size: 1rem;
      font-family: Arial, serif;
      flex-grow: 1; /* 让标题占满剩余空间 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .show-right {
      flex-shrink: 0; /* 防止被挤压 */
      font-size: 0.8rem !important;
      color: #999;
      margin-left: 1rem;
    }
  }

  .show-tag {
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
      font-size: 0.8rem !important;
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
      gap: 0.2rem;
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