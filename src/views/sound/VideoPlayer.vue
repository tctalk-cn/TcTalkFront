<template>
  <div :class="videoPlayerState.fullscreen?'video-player fullscreen':'video-player'">
    <!-- 新增的透明图层 -->
    <video preload="auto"
           :title="video.title"
           playsinline
           autoplay
           style="width: 100%; height: 100%;"
           :style="videoPlayerState.isShowCover?{'display':'none'}:{'display':'block'}"
           ref="videoRef">
      <!-- 字幕文件 -->
      <track src="" kind="subtitles" srclang="zh" label="中文">
    </video>
    <div class="barrage">
      <SoundBarrage :opacity="isLive ? 1:0.75" ref="barrageRef"/>
    </div>
    <!--control bar-->
    <div class="controls" @click="showOrHideControls">
      <!--展示control bar-->
      <div :class="isLive?'control-bar live-control':'control-bar'"
           :style="videoPlayerState.isShowControlBar?{'display':'block'}:{'display':'none'}">
        <div v-if="!isLive">
          <div class="left">
            <span class="time" ref="currentTimeRef">00:00</span>
            <span class="split">/</span>
            <span class="total-duration">{{ formatDuration(video.duration, "0#:##") }}</span>
          </div>
          <div class="center">
            <div class="progress-wrapper" @click="(e)=>{changePlayPosition(e)}">
              <div class="progress" ref="progressRef"/>
            </div>
          </div>
          <div class="right">
            <div :class="videoPlayerState.barrageSwitch?'barrage-on':'barrage-off'"
                 @click="(e)=>{e.stopPropagation();onOrOff();}"/>
            <div class="fullscreen" @click="(e)=>{e.stopPropagation();entryOrExitFullscreen();}"/>
          </div>
        </div>
        <div v-else>
          <div class="left" ref="liveDurationRef"/>
          <div class="right">
            <div :class="videoPlayerState.barrageSwitch?'barrage-on':'barrage-off'"
                 @click="(e)=>{e.stopPropagation();onOrOff();}">
              <div class="fullscreen" @click="(e)=>{e.stopPropagation();entryOrExitFullscreen();}"/>
            </div>
          </div>
        </div>
      </div>
      <!--展示弹幕输入框-->
      <div class="barrage-bar"
           :style="videoPlayerState.isShowControlBar?{'display':'flex'}:{'display':'none'}">
        <van-field placeholder="请输入弹幕..."
                   class="barrage-input"
                   right-icon="chat-o"
                   @click="showDanMuDialog=!showDanMuDialog">
        </van-field>
        <!--展示play按钮-->
        <div :class="videoPlayerState.paused?'play-button play':'play-button pause'"
             @click="(e)=>{e.stopPropagation();playOrPause();}"/>
      </div>
    </div>
    <!--cover-->
    <div class="cover" :style="videoPlayerState.isShowCover?{'display':'block'}:{'display':'none'}">
      <div v-if="!isLive">
        <div class="title">
          av{{ video.title }}
        </div>
        <img class="pic" :src="video.cover" :alt="video.title"/>
        <div class="pre-play">
          <div class="duration">{{ formatDuration(video.duration, "0#:##:##") }}</div>
          <div class="preview"></div>
        </div>
      </div>
      <div v-else>
        <img class="pic" :src="video.cover" :alt="video.title"/>
        <div class="pre-play">
          <div class="preview" @click="playOrPause"/>
        </div>
      </div>
    </div>
    <!--waiting-->
    <div v-if="videoPlayerState.waiting">
      <div class="loading">
        <div class="wrapper">
          <img class="img" :src="loading" alt=""/>
          <span class="text">{{ !isLive ? "正在缓冲" : "" }}</span>
        </div>
      </div>
    </div>
    <div v-if="videoPlayerState.finish">
      <div class="finish-cover">
        <img :src="video.cover" :alt="video.title" class="cover-pic"/>
        <div class="cover-wrapper">
          <div class="replay" @click="playOrPause">
            <i class="replay-icon"/>
            <span>重新播放</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="living&&!videoPlayerState.isLive">
      <div class="notice-cover">
        <i/>
        <span>闲置中</span>
      </div>
    </div>

    <div class="right-bar">
      <div class="creator-member-img-container mb-1">
        <img :src="video.creatorAvatarUrl" alt="" class="creator-member-img"/>
        <!-- 未关注显示 -->
        <div v-if="!loading && !video.followed" @click="emits('handleAddAttend')" class="add-member-attend">
          <IconPark :icon="Plus"
                    theme="filled"
                    fill="#fff"
                    :size="16"/>
        </div>
      </div>
      <div>
        <van-icon @click="emits('handlePraised')" name="good-job" size="30"
                  :color="video.isPraisedByCurrentUser? '#f9476f':'#FFF'"/>
        <p>{{ video.praisedCount }}</p>
      </div>
      <div>
        <van-icon @click="emits('handleComment')" name="chat" size="30" :color="'#FFF'"/>
        <p>{{ video.commentCount }}</p>
      </div>
      <div>
        <van-icon @click="emits('handleCollection')" name="star" size="30"
                  :color="video.isCollectByCurrentUser?'#ffb701':'#FFF'"/>
        <p>{{ video.collectionCount }}</p>
      </div>
      <div>
        <van-icon @click="emits('handleShare')" name="share" size="30" color="#1989fa"/>
        <p>{{ video.shareCount }}</p>
      </div>
      <div>
        <img :src="video.creatorAvatarUrl" alt=""
             :class="videoPlayerState.paused?'creator-icon':'creator-icon rotate'"/>
      </div>
    </div>

  </div>
  <!-- 底部弹出弹幕对话框 -->
  <section class="danmu-dialog">
    <van-popup
        v-model:show="showDanMuDialog"
        position="bottom"
        round
        @click-overlay="showDanMuDialog=!showDanMuDialog"
        :style="{ height: '10%' }">
      <div class="danmu-input-container">
        <span>
          <van-icon name="font" size="25" color="#1989fa"/>
        </span>
        <span>
          <van-icon name="diamond-o" size="25"/>
        </span>
        <span class="media-barrage-input-container">
          <van-field placeholder="发个弹幕和观众互动吧"
                     v-model="barrageInput"
                     left-icon="user"
                     class="media-barrage-input-field">
             <template #button>
               <van-icon name="guide-o" size="20" color="#ee0a24" @click="sendBarrage"/>
            </template>
        </van-field>
        </span>
      </div>
    </van-popup>
  </section>
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import Hls from "hls.js";
import {useVideoPlayerStore} from "@/stores/video_player.ts";
import SoundBarrage from "@/views/sound/SoundBarrage.vue";
import {formatDuration} from "@/utils/string.ts";
import loading from "@/assets/images/loading.svg";
import {onBeforeUnmount, onMounted, watch} from "vue";
import {Plus} from "@icon-park/vue-next";
import IconPark from "@/components/common/IconPark.vue";
import {MemberListenHistoryCreator} from "@/models/member_listen_history.ts";

const {
  showOrHideControls,
  playOrPause,
  changePlayPosition,
  onOrOff,
  entryOrExitFullscreen,
  loadMediaBarrages,
  findBarrages,
  sendBarrages,
  resetBarrages,
  getListenHistory,
  addListenHistory
} = useVideoPlayerStore();

// 获取播放器的状态
const {
  videoPlayerState,
  videoRef,
  progressRef,
  liveDurationRef,
  currentTimeRef,
  showDanMuDialog,
  barrageInput,
  barrageRef,
  memberListenHistory
} = storeToRefs(useVideoPlayerStore());

const props = defineProps<{
  living: boolean; //直播中
  isLive?: boolean;
  liveTime?: number;
  video: {
    // 专辑ID
    albumId?: string;
    // 视频ID
    mediaId?: string,
    // 会员ID
    creatorMemberId?: string,
    title: string,
    cover: string,
    duration: number,
    playUrl: string, // 作废
    hlsUrl: string,
    commentCount?: number;
    shareCount?: number;
    playCount?: number;
    barrageCount?: number;
    collectionCount?: number;
    praisedCount?: number;
    creatorAvatarUrl: string;
    followed: Boolean;
    isPraisedByCurrentUser: Boolean;
    isCollectByCurrentUser: Boolean;
  };
}>();

// 定义父组件方法
const emits = defineEmits(["handleComment", "handleAddAttend", "handlePraised", "handleCollection", "handleShare"]);


const initPlayer = () => {
  const videoDOM = videoRef.value;
  if (!videoDOM) return;

  if (props.video.hlsUrl && props.video.hlsUrl.endsWith(".m3u8")) {
    if (Hls.isSupported()) {
      if (hls) {
        hls.destroy();
        hls = null;
      }
      hls = new Hls();
      hls.attachMedia(videoDOM);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("Video attached");
        hls!.loadSource(props.video.hlsUrl);
      });
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Manifest loaded, start play");
        safePlay(videoDOM);
      });
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("Hls error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("fatal network error encountered, try to recover");
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("fatal media error encountered, try to recover");
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoDOM.canPlayType("application/vnd.apple.mpegurl")) {
      videoDOM.src = props.video.hlsUrl;
    }
  }
};

watch(
    () => props.video.hlsUrl,
    (newUrl) => {
      if (newUrl) {
        initPlayer();
      }
    },
    { immediate: true }
);

// 是否在拖拽中
let isDragging = false;
let hls: Hls | null = null;
onMounted(async () => {
  const barrageComponent = barrageRef;
  const videoDOM = videoRef.value;
  const currentTimeDOM = currentTimeRef.value;
  const progressDOM = progressRef.value;
  initPlayer();
  // 调用play方法时触发
  videoDOM.addEventListener("play", play);

  // 暂停或者在缓冲后准备重新开始播放时触发
  videoDOM.addEventListener("playing", play);

  videoDOM.addEventListener("waiting", () => {
    videoPlayerState.value.waiting = true;
  });
  // 非直播时处理
  if (!props.living) {
    await loadMediaBarrages(props.video.mediaId, props.video.mediaId);
    videoDOM.addEventListener("timeupdate", () => {
      if (videoPlayerState.value.duration === 0) {
        videoPlayerState.value.duration = videoDOM.duration;
      }
      currentTimeDOM.innerHTML = formatDuration(videoDOM.currentTime, "0#:##");
      const progress = videoDOM.currentTime / videoDOM.duration * 100;
      progressDOM.style.width = `${progress}%`;
      if (videoPlayerState.value.barrageSwitch) {
        const currentTimeBarrageList = findBarrages(videoDOM.currentTime);
        currentTimeBarrageList.forEach((barrage) => {
          // 发送弹幕
          barrageRef.value.send(barrage);
        });
      }
    });
    videoDOM.addEventListener("ended", () => {
      currentTimeDOM.innerHTML = "00:00";
      progressDOM.style.width = "0";
      videoPlayerState.value.paused = true;
      videoPlayerState.value.isShowControlBar = false;
      videoPlayerState.value.isShowPlayBtn = false;
      videoPlayerState.value.fullscreen = false;
      videoPlayerState.value.finish = true;

      // 字幕还原
      resetBarrages();
      // 清除弹幕
      barrageComponent.value.clear();
    });

    // --------------进度条事件------------------
    // 总进度条宽度
    let width = 0;
    // 距离屏幕左边距离
    let left = 0;
    // 拖拽进度比例
    let rate = 0;
    progressDOM.addEventListener("touchstart", (e) => {
      e.stopPropagation();
      isDragging = true;
      const progressWrapperDOM = progressDOM.parentElement;
      width = progressWrapperDOM.offsetWidth;
      left = progressWrapperDOM.getBoundingClientRect().left;
      playOrPause();
    });
    progressDOM.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (!isDragging) {
        return;
      }
      const touch = e.touches[0];
      // 计算拖拽进度比例
      rate = (touch.clientX - left) / width;
      if (rate > 1) {
        rate = 1;
      } else if (rate < 0) {
        rate = 0;
      }
      const currentTime = videoDOM.duration * rate;
      progressDOM.style.width = `${rate * 100}%`;
      currentTimeDOM.innerHTML = formatDuration(currentTime, "0#:##");
    });
    progressDOM.addEventListener("touchend", () => {
      isDragging = false;

      videoDOM.currentTime = videoDOM.duration * rate;
      playOrPause();
    });
    videoPlayerState.value.paused = true;
    videoPlayerState.value.waiting = false;
  }
  // 加载播放历史信息
  memberListenHistory.value = await getListenHistory(props.video.mediaId);
  if (memberListenHistory.value !== null && memberListenHistory.value != undefined) {
    const listenHistory = memberListenHistory.value;
    if (listenHistory.mediaListenTo && videoDOM.duration) {
      // 计算拖拽进度比例
      let rate = listenHistory?.mediaListenTo / listenHistory.mediaTotalDuration;
      if (rate > 1) {
        rate = 1;
      } else if (rate < 0) {
        rate = 0;
      }
      const currentTime = videoDOM.duration * rate;
      videoDOM.currentTime = currentTime;
      progressDOM.style.width = `${rate * 100}%`;
      currentTimeDOM.innerHTML = formatDuration(currentTime, "0#:##");
    }
  }
});

/**
 * 发送弹幕
 */
const sendBarrage = async () => {
  // 发送弹幕
  await sendBarrages(props.video.creatorMemberId, props.video.mediaId, barrageInput.value, videoRef.value.currentTime);
  // 输入框还原
  barrageInput.value = "";
  // 隐藏弹幕对话框
  showDanMuDialog.value = false;
}

const safePlay = async (video: HTMLVideoElement) => {
  try {
    await video.play();
  } catch (err) {
    console.warn("Play failed:", err);
  }
};

onBeforeUnmount(() => {
  try {
    if (videoRef.value) {
      // 解绑
      videoRef.value.removeEventListener("play", play);
      videoRef.value.removeEventListener("playing", play);
      // videoRef.value.removeEventListener("waiting", waitingHandler);
      // videoRef.value.removeEventListener("timeupdate", timeUpdateHandler);
      // videoRef.value.removeEventListener("ended", endedHandler)
      // 创建收听历史
      addListenHistory({
        albumId: props.video.albumId,
        mediaId: props.video.mediaId,
        mediaTitle: props.video.title,
        mediaCoverUrl: props.video.cover,
        mediaListenTo: Math.floor(videoRef.value.currentTime),
        mediaTotalDuration: props.video.duration,
      } as MemberListenHistoryCreator);
    }
    if (hls) {
      hls.destroy();
      hls = null;
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
})

const play = () => {
  videoPlayerState.value.isShowCover = false;
  videoPlayerState.value.paused = false;
  videoPlayerState.value.waiting = false;
  videoPlayerState.value.barrageSwitch = true;
};


</script>
<style lang="scss" scoped>

.video-player {
  position: relative;
  height: 100%;

  &.fullscreen {
    // 通过上层的按钮控制
    //position: fixed;
    //top: 0;
    //left: 0;
    //right: 0;
    //bottom: 0;
    //z-index: 999;
  }

  .drag-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10; /* 保证拖拽层在最上层 */
    background-color: rgba(0, 0, 0, 0); /* 透明背景 */
  }

  video {
    background-color: #000000;
  }

  .barrage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    user-select: none;
  }

  .controls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;

    .barrage-bar {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 21;
      height: 3rem;
      padding: 0 1rem; /* 左右留出内边距 */
      display: flex;
      align-items: center; /* 垂直居中对齐 */
      background-color: #000000;

      .barrage-input {
        line-height: 2rem;
        color: #ffffff;
        font-size: 1rem;
        background-color: #333 !important; /* 可根据需要设置背景色 */
        margin: 0 !important; /* 去掉外边距 */
        border: none !important;
        box-shadow: none !important; /* 去掉阴影 */
        border-bottom: none !important; /* Specifically remove bottom border */
        border-radius: 0.5rem;

        /* 根据需要调整距离 */
        padding: 0.2rem !important;
      }

      .barrage-input::after,
      .barrage-input::before {
        display: none !important; /* Hide pseudo-elements */
      }


      .play-button {
        width: 2.5rem;
        height: 2.5rem;
        opacity: 0.85;
        background-size: 100% auto;
        margin-left: 1rem; /* 与输入框的间距 */
        flex-shrink: 0; /* 防止按钮缩小 */

        &.play {
          background-image: url("@/assets/images/tv-play.png");
        }

        &.pause {
          background-image: url("@/assets/images/tv-pause.png");
        }
      }
    }

    .control-bar {
      position: absolute;
      bottom: 3rem;
      width: 100%;
      height: 3rem;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2;

      &.live-control {
        background-color: transparent;
        background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.7));

        .left {
          margin-left: 1rem;
        }

      }

      .left {
        display: inline-block;
        line-height: 3rem;
        color: #ffffff;
        font-size: 1rem;
        font-family: arial, sans-serif;

        & > span {
          display: inline-block;
        }

        .time,
        .total-duration {
          width: 3.5rem;
        }

        .time {
          text-align: right;
        }

        .split {
          width: 0.6rem;
          text-align: center;
        }

        .total-duration {
          text-align: left;
        }
      }

      .center {
        position: absolute;
        left: 7.5rem;
        top: 1.5rem;
        right: 4.5rem;
        height: 0.1rem;

        .progress-wrapper {
          position: relative;
          height: 100%;
          background-color: #4c4c4c;

          .progress {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #de698c;

            &:after {
              content: "";
              display: block;
              position: absolute;
              top: -6.6px;
              right: -14px;
              width: 14px;
              height: 14px;
              background-color: #ffffff;
              box-shadow: 0.5px 0.5px 3px #000000;
              border-radius: 50%;
            }
          }
        }
      }

      .right {
        float: right;
        margin-right: 1rem;

        .barrage-on,
        .barrage-off {
          display: inline-block;
          width: 1.5rem;
          height: 1.5rem;
          margin-top: 0.8rem;
          background-size: 100% auto;
          bottom: 3rem;
        }

        .barrage-on {
          background-image: url("@/assets/images/barrage-on.png");
        }

        .barrage-off {
          background-image: url("@/assets/images/barrage-off.png");
        }

        .fullscreen {
          //display: inline-block;
          //width: 24px;
          //height: 24px;
          //margin-top: 10px;
          //margin-left: 16px;
          //background-image: url("@/assets/images/fullscreen.png");
          //background-size: 100% auto;
        }
      }
    }
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 15px;
    color: #ffffff;
    background-color: #7d7d7d;
    overflow: hidden;
    z-index: 20;

    .title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      text-align: center;
      line-height: 32px;
      z-index: 1;
    }

    .pic {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0.85;
      border-style: none;
    }

    .pre-play {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 14px;

      .duration {
        display: inline-block;
        padding: 0 8px;
        margin-left: 12px;
        font-size: 12px;
        line-height: 20px;
        border: 1px solid hsla(0, 0%, 100%, 0.6);
        background-color: hsla(0, 0%, 100%, 0.2);
        border-radius: 2px;
      }

      .preview {
        float: right;
        width: 46px;
        height: 46px;
        margin-right: 12px;
        margin-top: -20px;
        background: url("@/assets/images/tv-play.png");
        background-size: 100% auto;
      }
    }
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: #ffffff;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;

    .wrapper {
      text-align: center;

      .img {
        width: 40px;
        height: 40px;
      }

      .text {
        display: block;
        margin-top: 4px;
      }
    }
  }

  .finish-cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    overflow: hidden;

    .cover-pic {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    .cover-wrapper {
      position: relative;
      height: 100%;
      padding: 0 12px;
      font-size: 14px;
      color: #ffffff;
      background-color: rgba(0, 0, 0, 0.8);

      .replay {
        position: absolute;
        right: 0.8rem;
        bottom: 1.5rem;

        .replay-icon {
          display: inline-block;
          float: left;
          width: 1rem;
          height: 1rem;
          margin-top: 0.1rem;
          margin-right: 0.2rem;
          background-image: url("@/assets/images/ico-replay.png");
          background-size: 100% 100%;
        }
      }
    }
  }

  .notice-cover {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: #000000;

    .notice-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      i {
        display: block;
        width: 200px;
        height: 114px;
        background-image: url("@/assets/images/nocontent.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      span {
        display: block;
        text-align: center;
        font-size: 14px;
        color: #23ade5;
      }
    }
  }

  .right-bar {
    position: absolute;
    bottom: 14rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    z-index: 20;

    .creator-member-img-container {
      position: relative; // 确保子元素的绝对定位相对于该容器
      display: inline-block; // 根据需要调整布局

      .creator-member-img {
        border: 0.2rem solid #fff;
        width: 2.3rem;
        height: 2.3rem;
        border-radius: 50%;
        object-fit: cover;
      }

      .add-member-attend {
        position: absolute;
        bottom: -0.3rem; // 控制图标的垂直偏移，使其位于头像下方
        left: 50%; // 水平居中
        transform: translateX(-50%); // 将图标水平居中对齐头像
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 50%;
        background-color: #FF4F4F;
      }

    }

    /* 定义旋转动画 */
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .rotate {
      animation: rotate 5s linear infinite; /* 5s 是旋转速度，可以根据需要调整 */
    }

    .creator-icon {
      border: 0.2rem solid #fff;
      width: 2.3rem;
      height: 2.3rem;
      border-radius: 50%;
      object-fit: cover;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 0.4rem;

      p {
        font-size: 0.8rem;
        color: #fff;
      }
    }

  }

}

.danmu-dialog {


  .danmu-input-container {
    margin-top: 1.5rem;
    display: flex; /* 使子元素在同一行排列 */
    align-items: center; /* 垂直居中对齐 */
    width: 100%; /* 占满一行 */
    padding-right: 0.5rem;

    span {
      padding-left: 0.6rem;
    }

    .media-barrage-input-container {
      flex-grow: 1; /* 使输入框占据剩余空间 */

      .media-barrage-input-field {
        width: 100%; /* 确保输入框宽度为100% */
        flex-grow: 1; /* 使输入框占据剩余空间 */
        line-height: 1rem;
        font-size: 0.8rem;
        background-color: #f5f5f5 !important; /* 可根据需要设置背景色 */
        font-family: Helvetica Neue, Tahoma, Arial, serif;
        border-radius: 0.5rem;
        padding-right: 0.5rem;
      }
    }
  }
}
</style>