<template>
  <div class="sound-detail-container">
    <HeaderTop go-back="true" head-title="作品详情">
      <!-- 其他插槽内容... -->
      <template #actions>
        <van-icon class="action-button" name="newspaper-o"/>
      </template>
    </HeaderTop>
    <div class="sound-detail-content">
      <!--媒体播放器信息-->
      <div class="media-play" :class="{ open: isCommentDrawerOpen }">
        <VideoPlayer
            :living="false"
            :is-live="false"
            :video="{
            albumId:route.query.albumId as string,
            mediaId: route.query.mediaId as string,
            creatorMemberId: route.query.creatorMemberId as string,
            title: mediaData.title,
            cover: mediaData.coverUrl,
            duration: mediaData.durationInMs/1000,
            playUrl: mediaData.playUrl,
            commentCount: mediaData.commentCount,
            shareCount: mediaData.shareCount,
            playCount: mediaData.playCount,
            collectionCount: mediaData.collectionCount,
            barrageCount: mediaData.barrageCount,
            creatorAvatarUrl:creatorMemberInfo?.avatarUrl,
            followed:followed,
            isPraisedByCurrentUser:isPraisedByCurrentUser,
            praisedCount:mediaData.praisedCount,
            isCollectByCurrentUser:isCollectByCurrentUser,
          }"
            @handle-comment="handleComment"
            @handle-add-attend="addMemberFollowed(route.query.creatorMemberId as string)"
            @handle-collection=""
            @handle-praised=""
            @handle-share=""
        />
      </div>
      <!--媒体评论相关信息-->
      <div class="media-message" :class="{ open: isCommentDrawerOpen }">
        <!--创建者信息-->
        <div class="up-container">
          <div class="up-face">
            <a :href="'/'">
              <img :src="creatorMemberInfo?.avatarUrl" :alt="creatorMemberInfo?.nickname"/>
            </a>
          </div>
          <div class="up-info-wrapper">
            <p class="up-anchor">主播：<span>{{ creatorMemberInfo?.nickname }}</span></p>
            <p class="up-count">
              <span class="up-attended">
                关注：{{ memberStatisticsInfo?.attendCount }}
              </span>
              <span class="up-fans">粉丝：{{ memberStatisticsInfo?.fansCount }}</span>
            </p>
          </div>
          <div class="up-followed-container" v-if="!isSelf(route.query.creatorMemberId as string)">
            <van-button size="mini" icon="plus" color="#FF69B4" plain hairline round v-if="!followed">
              关注
            </van-button>
            <van-button size="mini" plain hairline round v-if="followed">
              取消关注
            </van-button>
          </div>
        </div>
        <!--分割线-->
        <van-divider/>
        <!--Tab信息-->
        <div class="sound-tab-container">
          <van-tabs v-model:active="currentActivityTab" lazy-render @clickTab="onTabClick"
                    animated
                    scrollspy
                    type="card"
                    class="overflow-y-auto">
            <van-tab v-for="(item) in mediaInteractionMenus" :key="item.name" :name="item.name">
              <template #title>
                <div>
                  <van-icon :name="item.icon"/>
                  {{ item.label }}
                </div>
              </template>
            </van-tab>
          </van-tabs>
          <div>
            <CommentList v-if="currentActivityTab === 'mediaComments'"
                         :mediaId="route.query.mediaId as string"
                         :mediaCreatorMemberId="route.query.creatorMemberId as string">

            </CommentList>
            <SoundIntroduction v-if="currentActivityTab === 'mediaIntroduction'"
                               :title="mediaData?.title"
                               :description="mediaData?.description"
                               :media-creator-member-id="route.query.mediaId as string"
                               :media-id="route.query.creatorMemberId as string">

            </SoundIntroduction>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import VideoPlayer from "@/views/sound/VideoPlayer.vue";
import {useVideoStore} from "@/stores/video_store.ts";
import {useProfileStore} from "@/stores/member_store.ts";
import {storeToRefs} from "pinia";
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {UmsMember} from "@/models/member.ts";
import {MemberStatisticsInfo} from "@/models/member_statistics_info.ts";
import CommentList from "@/views/sound/comment/CommentList.vue";
import SoundIntroduction from "@/views/sound/comment/SoundIntroduction.vue";

const route = useRoute();
const {queryMediaById} = useVideoStore();
const {mediaData} = storeToRefs(useVideoStore());
const {queryMemberById, getMemberStatisticsById, isFollowed, addMemberFollowed, isSelf} = useProfileStore();
const creatorMemberInfo = ref<UmsMember>(null);
const memberStatisticsInfo = ref<MemberStatisticsInfo>(null);
// 是否已关注
const followed = ref<Boolean>(false);
// 加载状态
const loading = ref(true);
// 此媒体是否被当前用户点赞
const isPraisedByCurrentUser = ref<boolean>(false);
// 是否被当前用户收藏
const isCollectByCurrentUser = ref<boolean>(false);
// 是否展示评论盒子
const isCommentDrawerOpen = ref<boolean>(false);
// 当前活跃按钮
const currentActivityTab = ref<string>("mediaComments");
// 媒体交互按钮
const mediaInteractionMenus = [
  {
    id: 1,
    label: '简介',
    name: 'mediaIntroduction',
    icon: 'edit',
  },
  {
    id: 2,
    label: '评论',
    name: 'mediaComments',
    icon: 'chat-o',
  },
];

onMounted(async () => {
  // 设置加载中
  loading.value = true;
  // 加载完成
  mediaData.value = await queryMediaById(route.query.creatorMemberId as string, route.query.mediaId as string);
  // 加载基础信息
  creatorMemberInfo.value = await queryMemberById(route.query.creatorMemberId as string);
  // 加载统计信息
  memberStatisticsInfo.value = await getMemberStatisticsById(route.query.creatorMemberId as string);
  // 加载关注信息
  followed.value = await isFollowed(route.query.creatorMemberId as string);
  // 加载完成
  loading.value = false;
});


watch(
    () => route.meta.menu,
    (menu) => {
      currentActivityTab.value = menu as string;
    }
);
// tab点击切换页面
const onTabClick = (tab) => {
  currentActivityTab.value = tab.name;
}

/**
 * 处理评论
 */
const handleComment = () => {
  isCommentDrawerOpen.value = !isCommentDrawerOpen.value;
}


</script>

<style lang="scss" scoped>
.sound-detail-container {
  display: flex;
  flex-direction: column;
  margin: 0 0;
  background-color: #fff;
  height: 100vh;
  z-index: 10;

  .sound-detail-content {
    display: flex;
    flex-direction: column;
    height: 100%; // 确保内容区域占满父容器
    .media-play {
      position: relative;
      flex: 1; // 占据剩余空间
      overflow: hidden;
      transition: transform 0.3s ease; // 平滑过渡效果
      transform: translateY(0); // 初始位置

      &.open {
        transform: translateY(-50vh); // 移动位置，露出 .up-container
      }
    }

    .media-message {
      position: absolute;
      display: flex;
      flex-direction: column; /* 垂直布局 */
      bottom: 0;
      width: 100%;
      height: 50vh; // 高度
      background: #fff;
      border-radius: 2rem 2rem 0 0;
      transition: transform 0.3s ease; // 平滑过渡效果
      transform: translateY(100%); // 初始位置

      &.open {
        transform: translateY(0); // 显示在视口内
      }

      .up-container {
        display: flex; /* Aligns face and info wrapper side by side */
        margin-top: 0.5rem;

        .up-face {
          position: absolute;

          left: 0.8rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background-color: #dddddd;
          border: 0.2rem solid #fff;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }

        .up-info-wrapper {
          margin-left: 4rem; // 控制与 .up-face 的间距
          display: flex;
          flex-direction: column;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex-grow: 1;
          justify-content: space-between; /* Space elements evenly */

          .up-anchor {
            margin: 0;
            line-height: 1.5rem;
            font-size: 1rem;
            color: #212121;
          }

          .up-count {
            margin-top: 0.3rem;
            line-height: 0.8rem !important;
            font-size: 0.8rem;
            color: #999999;

            .up-fans {
              margin-left: 1rem !important;
            }
          }
        }

        .up-followed-container {
          display: flex;
          justify-content: flex-end; /* Aligns the button to the right */
          margin-right: 0.5rem !important;
          margin-top: 0.5rem;
        }
      }

      .sound-tab-container {
        flex-grow: 1;
        overflow-y: auto; /* 仅 sound-tab-container 启用滚动 */
      }
    }
  }
}
</style>