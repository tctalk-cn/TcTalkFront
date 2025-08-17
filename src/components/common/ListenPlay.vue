<template>
  <div :class="['listen-play-container', backgroundClass]">
    <div class="listen-header">
      <div class="listen-tag">
        <span>{{ listenTag }}</span>
      </div>
      <div class="listen-actions">
        <van-icon name="ellipsis"/>
      </div>
    </div>
    <div class="listen-content">
      <VanImage :src="picUrl" :alt="title" radius="2"/>
      <div class="listen-description">
        <van-text-ellipsis :content="title"/>
      </div>
    </div>
    <div class="listen-footer">
      <div class="listen-play-icon">
        <van-icon name="play-circle"/>
      </div>
      <div class="listen-progress-bar" v-if="typ==1&&(mediaTotalDuration-mediaListenTo)>0">
        <van-slider v-model="ration" active-color="#666666">
          <template #button>
            <div class="listen-process-button"></div>
          </template>
        </van-slider>
      </div>
      <div class="listen-immediately" v-else>
        立即收听
      </div>
      <div class="listen-remaining-time">
        {{ remainingTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

const props = defineProps<{
  picUrl: string;
  title: string;
  mediaListenTo?: number;
  mediaTotalDuration?: number;
  index?: number;
  updateTime: string;
  // 1.最近收听；2.专辑订阅；3.最近热点；4.历史故事
  typ: number;
}>();
// 播放进度
const ration = ref(0);
// 剩余时间text
const remainingTime = ref("");
// 收听标签
const listenTag = ref("");
const backgroundStyles = ref({});
onMounted(() => {
  if (props.mediaListenTo && props.mediaListenTo && props.mediaTotalDuration > 0) {
    ration.value = props.mediaListenTo / props.mediaTotalDuration;
    remainingTime.value = formatReamingTimeText(props.mediaListenTo, props.mediaTotalDuration);
  }
  if (props.typ === 1) {
    if (props.index === 0) {
      listenTag.value = "正在收听";
    } else {
      listenTag.value = formatTag(props.updateTime);
    }
  } else if (props.typ === 2) {
    listenTag.value = "我的订阅";
  } else if (props.typ === 3) {
  } else {
  }
});

// 格式化剩余时间
const formatReamingTimeText = (mediaListenTo: number, mediaTotalDuration: number) => {
  if (mediaListenTo == null || mediaTotalDuration == null) {
    return '';
  }

  const remainingSec = mediaTotalDuration - mediaListenTo;
  const remainingInMin = remainingSec / 60;
  const remainingInHours = remainingSec / (60 * 60);

  if (remainingSec <= 0) {
    return `立即收听`;
  }
  // 如果小于1min，显示"即将完成"
  if (remainingInMin < 1) {
    return `剩${Math.floor(remainingSec)}秒`;
  }
  // 如果在60分钟内，显示"剩X分钟"
  if (remainingInMin < 60) {
    return `剩${Math.floor(remainingInMin)}分钟`;
  }
  // 显示"剩X小时"
  return `剩${Math.floor(remainingInHours)}小时`;
}

const formatTag = (updateTime: string) => {
  if (updateTime == null || updateTime === '') {
    return '';
  }
  const currentTime = new Date().getTime();
  const updateDate = new Date(updateTime).getTime();
  const diffInMs = currentTime - updateDate;
  const diffInMin = diffInMs / (1000 * 60);
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  // 如果小于1min，显示"刚刚更新"
  if (diffInMin < 60) {
    return `刚刚听过`;
  }
  // 如果在24小时以内，显示"X小时前"
  if (diffInHours < 24) {
    return `今日听过`;
  }
  // 如果在48小时以内，显示"X小时前"
  if (diffInHours < 48) {
    return `昨日听过`;
  }
  // 如果在30天以内，显示"X天前"
  if (diffInDays < 30) {
    return `最近听过`;
  } else {
    return `曾经听过`;
  }
}

const backgroundClass = computed(() => {
  if (props.index === 0) {
    return "background-default";
  }
  switch (props.typ) {
    case 1:
      return "background-recently-listened";
    case 2:
      return "background-album-subscription";
    case 3:
      return "background-hot-topic";
    case 4:
      return "background-historical-story";
    case 5:
      return "background-new-releases";
    case 6:
      return "background-soulful-sounds";
    default:
      return "background-default";
  }
});
</script>


<style lang="scss">

.listen-play-container {
  display: flex;
  flex-direction: column;
  width: 100%; /* 使容器宽度为父容器的 100% */
  height: auto; /* 高度根据内容自适应 */
  //background-color: #EEDFCC;
  /* 增加立体感 */
  border-radius: 0.5rem; /* 圆角 */
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1), 0 0.3rem 0.6rem rgba(0, 0, 0, 0.2);
  padding: 0.4rem;
  position: relative;
  align-items: center;
  margin: 0 auto; /* 居中显示 */
  overflow: hidden; /* 防止模糊背景超出容器边界 */
  color: #FFFFFF;

  /* 添加模糊背景 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    filter: blur(1rem); /* 模糊处理，增加朦胧美感 */
    z-index: -1; /* 将背景层置于内容下方 */
    border-radius: inherit; /* 保持和容器一致的圆角 */
  }

  .listen-header {
    display: flex;
    justify-content: space-between; /* 使内容分布在左右两边 */
    align-items: center; /* 确保垂直居中 */
    width: 100%; /* 确保容器宽度占满整个父容器 */
    font-size: 0.7rem;
    font-weight: 800;
    padding: 0.2rem;
    text-align: center;

    .listen-tag {
      font-family: Tahoma, Arial, serif;
    }

    .listen-actions {
    }
  }

  .listen-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    text-align: center;
    width: 100%; /* 宽度为 100% 以适应父容器 */
    margin-top: 0.5rem;

    .van-image {
      height: 7rem;
      border-radius: 2rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: cover;
    }

    .listen-description {
      font-size: 0.8rem;
      font-family: 'Helvetica Neue', Tahoma, Arial, serif;
      font-weight: 500;
      line-height: 1.5;
      letter-spacing: 0.5px;
      text-align: center;
      margin-top: 0.2rem;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 文字阴影 */
      background-clip: text;
    }
  }

  .listen-footer {
    margin-top: 1.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.1rem 0.2rem; /* 增加内边距，使按钮看起来更大 */
    background: #FFFFFF; /* 渐变背景，类似按钮 */
    width: 100%;
    border-radius: 1rem; /* 圆角按钮 */
    cursor: pointer; /* 鼠标悬停时显示手型 */
    transition: all 0.3s ease; /* 添加过渡效果，使悬停时的变化更加平滑 */
    box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1); /* 添加轻微阴影增加立体感 */
    border: 0.1rem solid #F5F5F5; /* 黑色描边，设置边框的粗细和颜色 */
    color: #000000;
    font-weight: 400;
    /* 左边：播放图标 */
    .listen-play-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: auto;
    }

    /* 中间：进度条 */
    .listen-progress-bar {
      flex-grow: 1; /* 使进度条占据剩余空间 */
      margin: 0 0.5rem;

      .listen-process-button {
        width: 1rem;
        color: #fff;
        font-size: 0.5rem;
        line-height: 1rem;
        text-align: center;
        background-color: #666666;
        border-radius: 8rem;
      }
    }

    .listen-immediately {
      flex-grow: 1; /* 使进度条占据剩余空间 */
      margin: 0 0.5rem;
      font-size: 0.5rem;
      line-height: 1rem;
      text-align: center;
    }

    /* 右边：剩余时间 */
    .listen-remaining-time {
      font-size: 0.5rem;
      color: #000;
    }
  }
}


.background-first::before {
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.8), rgba(211, 211, 211, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 80%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.3), transparent 80%);
}

.background-recently-listened::before {
  background: linear-gradient(135deg, rgba(139, 90, 0, 0.9), rgba(150, 205, 205, 0.2)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 60%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.3), transparent 60%);
}

.background-album-subscription::before {
  background: linear-gradient(135deg, rgba(70, 130, 180, 0.8), rgba(173, 216, 230, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 80%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.3), transparent 80%);
}

.background-hot-topic::before {
  background: linear-gradient(135deg, rgba(255, 69, 0, 0.8), rgba(255, 140, 0, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 80%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.3), transparent 80%);
}

.background-historical-story::before {
  background: linear-gradient(135deg, rgba(139, 0, 139, 0.8), rgba(218, 112, 214, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 80%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.3), transparent 80%);
}

/* Additional color themes */
.background-new-releases::before {
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.8), rgba(152, 251, 152, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.15), transparent 75%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.25), transparent 75%);
}

.background-soulful-sounds::before {
  background: linear-gradient(135deg, rgba(75, 0, 130, 0.8), rgba(138, 43, 226, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 85%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.3), transparent 85%);
}

.background-popular::before {
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.8), rgba(255, 255, 0, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.15), transparent 80%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.25), transparent 80%);
}

.background-default::before {
  background: linear-gradient(135deg, rgba(128, 128, 128, 0.8), rgba(211, 211, 211, 0.5)),
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 80%),
  radial-gradient(circle at bottom right, rgba(0, 0, 0, 0.3), transparent 80%);
}
</style>
