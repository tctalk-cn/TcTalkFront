<template>
  <div class="upload-container">
    <HeaderTop go-back="true" :head-title="profileTitle">
      <!-- 其他插槽内容... -->
      <template #actions>
        <van-icon class="action-button" name="newspaper-o"/>
      </template>
    </HeaderTop>
    <section class="upload_container_style">
      <div class="upload_head">
        <van-uploader
            v-model="fileList"
            :after-read="afterRead"
            :max-size="100 * 1024 * 1024"
            accept="video/*"
            :preview-image="true"
            :preview-full-image="true"
        />
        <!-- 展示生成的关键帧图片，供用户选择 -->
        <div class="keyframes">
          <div v-for="(frame, index) in keyframes"
               :key="index"
               @click="selectCover(frame)">
            <van-image width="3rem" fit="contain" :src="frame"/>
          </div>
        </div>
        <!-- 用于渲染视频 -->
        <video ref="videoRef" @loadedmetadata="generateKeyframes" controls hidden></video>
        <!-- 隐藏的 canvas，用于生成关键帧 -->
        <canvas ref="canvasRef" style="display:none;"></canvas>
      </div>
    </section>
    <section class="container_style">
      <header class="header_style">
        <span>标题</span>
      </header>
      <router-link :to='{path: "/creative/videoUpload/setTitle"}' class="region_tag">
        <span>{{ title || '清晰填写主题，容易获得更多收听' }}</span>
      </router-link>
      <div class="header_style">
        <span>声音类型</span>
        <div class="more_type text-sm">
          <input type="radio" value="0" v-model="videoType" class="custom-radio">专辑
          <input type="radio" value="1" v-model="videoType" class="custom-radio">独立视频
        </div>
      </div>
      <div class="header_style" @click="showAlbumSelectDialog=!showAlbumSelectDialog">
        <span>专辑</span>
        <div class="more_type">
          <span class="ellipsis">{{ lastSelectedAlbumName }} <van-icon name="arrow"/></span>
        </div>
      </div>
    </section>
    <section class="container_style">
      <header class="header_style">
        <span>分区和标签</span>
        <div class="more_type" @click="">
          <span>
            <van-icon name="arrow"/>
          </span>
        </div>
      </header>
      <div class="region_tag">
        <span class="flex flex-wrap gap-1.5">
          <van-tag v-for="(tag, index) in usedTags"
                   :key="index"
                   plain
                   round
                   closeable
                   color="#ffe1e1"
                   text-color="#ad0000">
            {{ tag }}
          </van-tag>
        </span>
      </div>
      <div class="region_tag">
        <span>推荐</span>
        <span>
            <van-button icon="plus"
                        hairline
                        size="mini"
                        color="#aaa"
                        @click="showCustomerTagDialog=true">
               自定义
              </van-button>
              <van-button v-for="(tag, index) in tags"
                          :key="index" icon="plus"
                          hairline
                          plain
                          round
                          size="mini"
                          @click="addTags(tag)">
                {{ tag }}
              </van-button>
        </span>
      </div>
    </section>
    <section class="container_style">
      <header class="header_style">
        <span>简介</span>
      </header>
      <router-link :to='{path: "/creative/videoUpload/videoDescription"}' class="region_tag">
        <span>{{ videoDescription || '视频简介' }}</span>
      </router-link>
      <div class="header_style" @click="showPermissions = !showPermissions">
        <span>权限</span>
        <div class="more_type">
          <span class="ellipsis">{{ permissionsVal }} <van-icon name="arrow"/></span>
        </div>
      </div>
      <router-link :to='{path: "/confirmOrder/remark", query: {}}' class="header_style">
        <span>更多设置</span>
        <div class="more_type">
          <span class="ellipsis">
            <van-icon name="arrow"/>
          </span>
        </div>
      </router-link>
    </section>
    <section class="container_style">
      <router-link :to='{path: "/confirmOrder/remark", query: {}}' class="header_style">
        <span>动态</span>
        <div class="more_type">
          <span class="ellipsis">
            {{ '最新动态' }}
          <van-icon name="arrow"/>
          </span>
        </div>
      </router-link>
    </section>
    <section class="confirm_upload">
      <p>暂存</p>
      <p @click="publish" v-if="mediaId!==''&& mediaId!=undefined">更新</p>
      <p @click="publish" v-else>发布</p>
    </section>
    <loading v-if="showLoading"></loading>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
    <!--权限选择-->
    <section class="permission-info">
      <van-popup v-model:show="showPermissions" round position="bottom" :style="{height:'25%'}"
                 @close="showPermissions = false"
                 closeable
                 close-icon="close"
                 :close-on-click-overlay="false">
        <van-cell-group inset class="mt-1">
          <van-cell title="公开" clickable @click="changePermission(0)"></van-cell>
          <van-cell title="仅自己可见" clickable @click="changePermission(1)"></van-cell>
          <van-cell title="仅好友可见" clickable @click="changePermission(2)"></van-cell>
          <van-cell title="仅指定人群可见" clickable @click="changePermission(3)"></van-cell>
        </van-cell-group>
        <van-button type="primary" round class="mt-1" size="small" block @click="showPermissions = false">取消
        </van-button>
      </van-popup>
    </section>
    <!--自定义tag-->
    <section class="customer-tags">
      <van-dialog v-model:show="showCustomerTagDialog" title="自定义标签" show-cancel-button
                  @confirm="handleCustomerTagConfirm">
        <template #default>
          <van-field v-model="customerTag" placeholder="最多输入5个字符"/>
        </template>
      </van-dialog>
    </section>

    <!--切换专辑-->
    <section>
      <van-popup v-model:show="showAlbumSelectDialog" round position="bottom" :style="{height:'60%'}">
        <div class="album-select-container">
          <!-- 上半部分：标题 + 新建专辑按钮 -->
          <div class="album-header">
            <span class="album-title">请选择专辑</span>
            <van-button type="primary" size="small" @click="router.push({path:'/creative/albumCreate'})">新建专辑
            </van-button>
          </div>
          <van-list
              v-model:loading="loading"
              :finished="finished"
              finished-text=""
              @load="loadAlbumData('load')"
          >
            <div v-for="(item) in albumList"
                 :key="item.id"
                 :title="item.name">
              <div class="album-content">
                <div class="album-info" @click="selectAlbum(item.name,item.id)">
                  <div class="album-cover-image">
                    <van-image :src="item.coverUrl" :alt="item.name"/>
                  </div>
                  <p>
                    <span class="album-name">{{ item.name }}</span>
                  </p>
                </div>
                <!-- 右侧：操作按钮 -->
                <div class="last-selected">
                  <van-tag type="danger" plain v-if="usedAlbumId===item.id">上次选择</van-tag>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-popup>
    </section>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {onMounted, ref} from "vue";
import {useProfileStore} from "@/stores/member_store.ts";
import AlertTip from "@/components/common/AlertTip.vue";
import Loading from "@/components/common/Loading.vue";
import {storeToRefs} from "pinia";
import {Pages} from "@/router/pages.ts";
import {VideoDataCreator} from "@/models/video.ts";
import {useRoute, useRouter} from "vue-router";
import {useVideoStore} from "@/stores/video_store.ts";
import {useAlbumStore} from "@/stores/album_store.ts";
import {useTagStore} from "@/stores/tag_store.ts";
import {Album} from "@/models/album.ts";

const {loadAlbums, queryLastSelected} = useAlbumStore();
const {listTags} = useTagStore();
const {uploadVideo, uploadCover, resetPermission, resetState, videoCreator, queryMediaById} = useVideoStore();

const {permissionsVal, permissions, usedTags, title, videoDescription, usedAlbumId} = storeToRefs(useVideoStore());
const {tags} = storeToRefs(useTagStore());
const {tagList} = useProfileStore();

const {memberInfo} = storeToRefs(useProfileStore());
const router = useRouter();
const route = useRoute();
const profileTitle = ref("发布视频");
const fileList = ref([]);
const showAlert = ref(false);
const showLoading = ref(false);
const showAlbumSelectDialog = ref(false);
const alertText = ref("");
// 关键帧
const keyframes = ref([]);
// 视频
const videoRef = ref<HTMLVideoElement>(null);
// canvas
const canvasRef = ref(null);
const publishData = new VideoDataCreator();
const videoType = ref(0);
const lastSelectedAlbumName = ref("暂无专辑");
// 是否显示权限选择框
const showPermissions = ref(false);
// 是否显示自定义标签对话框
const showCustomerTagDialog = ref(false);
// 自定义对话框内容
const customerTag = ref("");
// 生成关键帧
const generateKeyframes = () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');
  const duration = video.duration;
  // 共生成10张图片
  const interval = duration / 9;
  // 清空之前的关键帧
  keyframes.value = [];
  // 临时存储关键帧数据
  let keyFramesGenerate = [];
  // 从视频头开始
  let currentTime = 0;
  const captureFrame = () => {
    video.currentTime = currentTime;
    video.addEventListener('seeked', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frameURL = canvas.toDataURL('image/png');
      // 将生成的关键帧暂存
      keyFramesGenerate.push(frameURL);
      // 每隔interval秒抓取一个关键帧
      currentTime += interval;
      if (currentTime < duration) {
        captureFrame();
      } else {
        // 所有关键帧生成完后一次性渲染
        keyframes.value = keyFramesGenerate;
        // 设置第一张关键帧为预览图
        if (keyFramesGenerate.length > 0) {
          fileList.value = [
            {
              url: keyFramesGenerate[0], // 将第一张关键帧的 URL 作为预览图
              isImage: true // 确保预览的是图片
            }
          ];
        }
      }
    }, {once: true});
  };
  captureFrame();
}
const afterRead = async (file) => {
  videoRef.value.src = URL.createObjectURL(file.file);
  videoRef.value.load();
  // 清空 fileList
  fileList.value = [];
  const newFile = {
    status: 'uploading',
    message: '上传中...',
    url: null,
  };
  const videoResp = await uploadVideo(file.file);
  newFile.status = "done";
  newFile.message = "上传完成";
  // 构造发布数据
  publishData.height = videoResp.height;
  publishData.width = videoResp.width;
  publishData.playUrl = videoResp.videoUrl;
  publishData.durationInMs = videoResp.durationInSec * 1000;
  publishData.sizeInBytes = videoResp.sizeInBytes;
};

const selectCover = async (frameURL: string) => {
  // 更新 fileList，将选择的关键帧作为封面
  fileList.value = [
    {
      url: frameURL, // 将关键帧的 URL 作为预览图
      isImage: true // 确保预览的是图片
    }
  ];
}

// 确认发布
const publish = async () => {
  // 用户未登录时弹出提示框
  if (!(memberInfo.value && memberInfo.value.id)) {
    showAlert.value = true;
    alertText.value = '请登录';
    return;
  }
  // 将 data URL 转换为 Blob
  const response = await fetch(fileList.value[0].url);
  const blob = await response.blob();
  const file = new File([blob], 'cover.png', {type: 'image/png'});
  publishData.coverUrl = await uploadCover(file);
  publishData.permissions = 0;
  publishData.tags = tagList();
  publishData.description = videoDescription.value;
  publishData.title = title.value;
  publishData.tags = usedTags.value.join(",");
  publishData.albumId = usedAlbumId.value;
  publishData.permissions = permissions.value;
  await videoCreator(publishData);
  // 创建成功后跳转
  await router.push({name: Pages.creativeCenter, replace: true});
}

// 修改权限
const changePermission = (permissions: number) => {
  showPermissions.value = false;
  resetPermission(permissions);
}

// 添加标签
const addTags = (tag: string) => {
  if (usedTags.value.length >= 5) {
    showAlert.value = true;
    alertText.value = '最多设置5个标签';
    return;
  }
  const tagsVal = tags.value;
  for (let i = 0; i < tagsVal.length; i++) {
    if (tagsVal[i] === tag) {
      // 从数组中移除匹配的值
      tagsVal.splice(i, 1);
      // 因为移除了元素，需要调整索引
      i--;
    }
  }
  usedTags.value.push(tag);
  tags.value = tagsVal;
}

// 处理输入自定义标签
const handleCustomerTagConfirm = () => {
  const tagVal = customerTag.value;
  if (tagVal == "") {
    showAlert.value = true;
    alertText.value = '不可以为空';
    return;
  }
  if (tagVal.length >= 5) {
    showAlert.value = true;
    alertText.value = '最多5个字符';
    return;
  }
  showCustomerTagDialog.value = false;
  addTags(tagVal);
  customerTag.value = "";
}
// 获取mediaId，在编辑使，会传入此值
const mediaId = ref<string | undefined>(route.query.mediaId as string | undefined);
const creatorMemberId = ref<string | undefined>(route.query.creatorMemberId as string | undefined);

onMounted(async () => {
  if (mediaId.value !== undefined) {
    let mediaLoaded = await queryMediaById(creatorMemberId.value, mediaId.value);
    usedAlbumId.value = mediaLoaded.albumId;
    lastSelectedAlbumName.value = mediaLoaded.albumName;
    title.value = mediaLoaded.title;
    videoType.value = mediaLoaded.mediaType;
    videoDescription.value = mediaLoaded.description;
    await resetPermission(mediaLoaded.permissions);
    fileList.value = [
      {
        url: mediaLoaded.coverUrl,
        isImage: true // 确保预览的是图片
      }];
  } else {
    resetState();
    // 列举专辑
    const lastSelectedAlbum = await queryLastSelected();
    if (lastSelectedAlbum !== null) {
      lastSelectedAlbumName.value = lastSelectedAlbum.name;
      usedAlbumId.value = lastSelectedAlbum.id;
    }
  }
  // 列举标签
  listTags();
})

const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  beginAlbumId: "0",
  pageSize: 6,
};
const albumList = ref<Album[]>([]);

// 加载专辑数据
const loadAlbumData = async (type = 'refresh') => {
  if (type === 'refresh') {
    searchParam.beginAlbumId = "0";
    refreshing.value = false;
  }
  const albums = await loadAlbums(searchParam.beginAlbumId, searchParam.pageSize);
  if (type == 'refresh') {
    albumList.value = albums;
    if (albums === null || albums.length === 0) {
      finished.value = true;
    }
    if (albums !== null && albums.length > 0) {
      searchParam.beginAlbumId = albums[albums.length - 1].id;
    }
  } else if (albums !== null && albums.length > 0) {
    albumList.value = albumList.value.concat(albums);
    loading.value = false;
    searchParam.beginAlbumId = albums[albums.length - 1].id;
  } else {
    // 没有更多了
    finished.value = true;
  }
}

// 更新选择的专辑
const selectAlbum = (choosedAlbumName: string, choosedAlbumId: string) => {
  lastSelectedAlbumName.value = choosedAlbumName;
  usedAlbumId.value = choosedAlbumId;
  showAlbumSelectDialog.value = false;
}
</script>

<style lang="scss" scoped>
.upload-container {
  padding-bottom: 3rem;
  background-color: $body-bg;
  font-size: $font-size-sm;

  .upload_container_style {
    background-color: #fff;
    margin-top: 0.5rem;
    padding: 0 0.7rem;
  }

  .container_style {
    background-color: #fff;
    margin-top: .4rem;
    padding: 0.6rem .7rem;

    .header_style {
      @include fj;
      line-height: 2rem;

      span {
        display: block;
      }

      span:nth-of-type(1) {
        @include sc(.7rem, #666);
      }

      .more_type {
        span:nth-of-type(1) {
          @include sc(.6rem, #aaa);
          width: 10rem;
          display: inline-block;
          text-align: right;
          vertical-align: middle;
        }

        svg {
          @include wh(.5rem, .5rem);
          fill: #ccc;
        }
      }
    }

    .region_tag {
      @include fj;
      border-top: 0.025rem solid #f5f5f5;

      span {
        @include sc(.6rem, #aaa);
        line-height: 2rem;
      }

      span:nth-of-type(2) {
        color: #aaa;
      }
    }

    .video_description {
      @include fj;
      border-top: 0.025rem #f5f5f5;

      span {
        @include sc(.6rem, #aaa);
        line-height: 2rem;
      }

      span:nth-of-type(2) {
        color: #aaa;
      }
    }

  }
}

.confirm_upload {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 3rem;
  z-index: 1000;

  p {
    line-height: 3rem;
    @include sc(.75rem, #fff);
  }

  p:nth-of-type(1) {
    background-color: #3c3c3c;
    flex: 5;
    text-align: center;
  }

  p:nth-of-type(2) {
    flex: 5;
    background-color: #56d176;
    text-align: center;
  }
}

.upload_tag {
  position: relative;
  margin-top: .2rem;

  div {
    display: flex;
    padding: 0 0 0 0.8rem;
    width: 100%;
    justify-content: flex-start;

    p {
      font-size: 0.8rem;
      color: #dfe2e8;
      margin-right: 0.5rem;
      padding: 0.25rem;
      border-radius: 0.2rem;
      background-color: #949495;

      .van-icon-fire-o {
        margin-right: 0.2rem;
      }
    }
  }
}

.album-select-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .album-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;

    .album-title {
      font-size: 1rem;
      font-weight: bold;
    }
  }


  .album-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 1rem;

    .album-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .album-cover-image {
      width: 4rem;
      height: 4rem;
      border-radius: 0.2rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: 2rem 2rem;
      background-repeat: no-repeat;
    }

    .album-name {
      font-size: 1rem;
      font-weight: bold;
    }

    .last-selected {
      display: flex;
      gap: 1rem;
    }

  }
}


.keyframes {
  display: flex; /* 设置为横向排版 */
  overflow-x: scroll; /* 启用横向滚动 */
  padding: 0.2rem; /* 使用 rem 作为单位 */
  scrollbar-width: none; /* 隐藏滚动条 (Firefox) */
}

.keyframes::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 (Chrome, Safari) */
}

.keyframe-item {
  flex-shrink: 0; /* 防止项目缩小 */
  margin-right: 0.5rem; /* 使用 rem 单位，设置关键帧间隔小一些 */
}

.keyframe-item img {
  width: 1rem; /* 调整图片的宽度 */
  height: auto; /* 保持图片的纵横比 */
  cursor: pointer; /* 鼠标悬停时显示为手型 */
  border-radius: 0.2rem; /* 圆角效果 */
  transition: transform 0.3s ease; /* 增加点击时的过渡动画 */
}

/* 自定义 radio 样式 */
.custom-radio {
  @apply appearance-none h-3 w-3 border border-gray-300 rounded-full checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500;
}
</style>
