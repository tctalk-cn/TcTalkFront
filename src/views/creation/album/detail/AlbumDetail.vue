<template>
  <div class="album-detail-container">
    <HeaderTop go-back="true" :head-title="headerTitle" go-back-url="/creative/center/myAlbum">
      <!-- 其他插槽内容... -->
      <template #actions>
        <van-icon class="action-button" name="more-o" @click="showAlbumShare=true"/>
      </template>
    </HeaderTop>
    <header class="album-detail-header">
      <div class="header_cover_img_con">
        <img :src="albumInfo.coverUrl" class="header_cover_img" alt=""/>
      </div>
      <div class="description_header">
        <div class="description_top">
          <section class="description_left">
            <img :src="albumInfo.coverUrl" alt="">
          </section>
          <section class="description_right">
            <h4 class="description_title ellipsis">{{ albumInfo.name }}</h4>
            <p class="description_text">
              <img :src="creatorMember.avatarUrl" alt=""/>
              听友 {{ creatorMember.nickname }}({{ creatorMember.uid }})
            </p>
            <p class="description_promotion ellipsis">{{ albumInfo.sellPoint }}</p>
          </section>
        </div>
        <div class="description_statistics">
          <p>{{ albumInfo.commentCount }}<span>评论数</span></p>
          <p>{{ albumInfo.shareCount }}<span>分享数</span></p>
          <p>{{ albumInfo.viewsCount }}<span>播放量</span></p>
          <p>{{ albumInfo.subscriptionCount }}<span>订阅量</span></p>
        </div>
        <footer class="description_footer">
          <div class="flex flex-wrap gap-1">
            <van-tag v-for="(attrWithVal, index) in albumInfo.attributeValues"
                     :key="index"
                     class="ml-1"
                     mark
                     color="#ffe1e1" text-color="#ad0000"
                     type="primary">
              {{ attrWithVal.attributeValueName }}
            </van-tag>
          </div>
        </footer>
      </div>
    </header>
    <div class="album-detail-content">
      <h2 class="album-detail-title">{{ albumInfo.name }}</h2>
      <h3 class="album-detail-text">{{ albumInfo.description }}</h3>
    </div>
    <div class="album-creator-team">
      <span>创作团队</span>
      <p class="creator-team-text">
        <img :src="creatorMember.avatarUrl" alt=""/>
        听友 {{ creatorMember.nickname }}({{ creatorMember.uid }})
      </p>
    </div>
    <!--浮动面板-->
    <van-floating-panel v-model:height="height" :anchors="anchors">
      <div class="media-container">
        <div class="media-container__header">
          <van-grid :column-num="2" :border="false">
            <van-grid-item>
              <van-button v-if="latestListenHistory?.mediaTitle"
                          icon="play-circle"
                          type="default"
                          size="normal"
                          class="w-full text-xs"
              >
                继续播放
                <van-divider vertical :hairline="false"/>
                <span class="last-play-media-name">{{ latestListenHistory?.mediaTitle }}</span>
              </van-button>
              <van-button v-else icon="play-circle" type="default" size="normal" class="w-full text-xs">
                开始播放
                <van-divider vertical :hairline="false"/>
              </van-button>
            </van-grid-item>
            <van-grid-item>
              <van-button icon="add" type="default" size="normal" class="w-full text-xs"
                          v-if="!isSubscribed"
                          @click="addSubscription(albumInfo.creatorMemberId,albumInfo.id)">
                免费订阅
              </van-button>
              <van-button type="default" size="normal" class="w-full text-xs"
                          v-else
                          @click="cancelSubscription(albumInfo.creatorMemberId,albumInfo.id)">
                已订阅
              </van-button>
            </van-grid-item>
          </van-grid>
        </div>
        <div class="media-container__tabs">
          <!-- 内容 -->
          <van-tabs v-model:active="currentActivity" lazy-render @clickTab="onTabClick" animated :scrollspy="false">
            <van-tab v-for="(item) in mediaMenus" :key="item.name" :name="item.name">
              <template #title>
                <van-icon v-if="item.icon" :name="item.icon"/>
                <div v-if="!item.icon"> {{ item.label }}</div>
              </template>
            </van-tab>
          </van-tabs>
          <div class="media-container__content">
            <RouterView/>
          </div>
        </div>
      </div>
    </van-floating-panel>
    <van-share-sheet
        v-model:show="showAlbumShare"
        title="分享至"
        :options="shareOptions"
        @select="onAlbumShareSelect"
    />
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {onMounted, onUnmounted, ref, toRefs, watch} from "vue";
import {showToast} from "vant";
import {UmsMember} from "@/models/member.ts";
import {useRoute, useRouter} from "vue-router";
import {useAlbumStore} from "@/stores/album_store.ts";
import {useProfileStore} from "@/stores/member_store.ts";
import {MemberListenHistory} from "@/models/member_listen_history.ts";

const headerTitle = ref("专辑详情");
// 是否展示专辑的分享面板
const showAlbumShare = ref(false);
const {albumInfo, isSubscribed} = toRefs(useAlbumStore());
const {queryMemberById} = useProfileStore();
const {
  queryAlbum,
  isSubscribedByMember,
  addSubscription,
  cancelSubscription,
  lastListenHistory,
  applyCompleted
} = useAlbumStore();
const route = useRoute();
const router = useRouter();
const anchors = [
  Math.round(0.2 * window.innerHeight),
  Math.round(0.3 * window.innerHeight),
  Math.round(0.4 * window.innerHeight),
  Math.round(0.5 * window.innerHeight),
  Math.round(0.6 * window.innerHeight),
  Math.round(0.7 * window.innerHeight),
  Math.round(0.8 * window.innerHeight),
];
const height = ref(anchors[4]);
const creatorMember = ref({} as UmsMember)
const albumId = route.query.albumId as string;
const albumCreatorMemberId = route.query.albumCreatorMemberId as string;
const shareOptions = [
  [
    {name: '微信', icon: 'wechat'},
    {name: '朋友圈', icon: 'wechat-moments'},
    {name: '微博', icon: 'weibo'},
    {name: 'QQ', icon: 'qq'},
    {name: '私信好友', icon: 'friends-o'},
    {name: '我的动态', icon: 'manager-o'},
  ],
  [
    {name: '复制链接', icon: 'link'},
    {name: '分享海报', icon: 'poster'},
    {name: '二维码', icon: 'qrcode'},
    {name: '小程序码', icon: 'weapp-qrcode'},
    {name: '添加到桌面', icon: 'tv-o'},
  ],
  [
    {name: '申请完结', icon: 'completed', event: 'applyCompleted'},
    {name: '搜索声音', icon: 'search'},
    {name: '编辑专辑', icon: 'edit'},
    {name: '版权申诉', icon: 'shield-o'},
    {name: '跳过头尾', icon: 'arrow-double-right'},
    {name: '举报', icon: 'warning-o'},
    {name: '加到听单', icon: 'add-o'},
  ],
];
const mediaMenus: MenuItem[] = [
  {
    id: 1,
    label: '节目',
    name: 'albumShowList',
  },
  {
    id: 2,
    label: '视频',
    name: 'albumVideoList',
  },
  {
    id: 3,
    label: '评价',
    name: 'albumCommentList',
  },
  {
    id: 4,
    label: '找相似',
    name: 'albumSimilarRecommendList',
  },
  {
    id: 5,
    label: '更多',
    name: 'more',
    icon: 'more-o',
  }
];

const currentActivity = ref<string>(route.meta.menu as string ?? "albumVideoList");
watch(
    () => route.meta.menu,
    (menu) => {
      currentActivity.value = menu as string;
    }
);
// tab点击切换页面
const onTabClick = (tab) => {
  currentActivity.value = tab.name;
  router.push({
    name: tab.name,
    query:
        {
          albumId: albumId,
          albumName: albumInfo.value.name,
          albumCreatorMemberId: albumCreatorMemberId,
          commentCount: albumInfo.value.commentCount,
          recommendPercent: albumInfo.value.recommendPercent,
          averagePercent: albumInfo.value.averagePercent,
          poorPercent: albumInfo.value.poorPercent,
        },
  });
}
const latestListenHistory = ref<MemberListenHistory>(null);
// 初始化加载
onMounted(async () => {
  window.addEventListener('resize', updateAnchors);
  // 根据当前路由的 meta 信息设置 currentActivity
  if (route.meta.menu) {
    currentActivity.value = route.meta.menu as string;
  }
  await queryAlbum(albumCreatorMemberId, albumId);
  isSubscribed.value = await isSubscribedByMember(albumCreatorMemberId, albumId);
  creatorMember.value = await queryMemberById(albumInfo.value.creatorMemberId);
  latestListenHistory.value = await lastListenHistory(albumId);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateAnchors);
});

const updateAnchors = () => {
  const h = window.innerHeight;
  anchors.splice(0, anchors.length,
      Math.round(0.2 * h), Math.round(0.3 * h), Math.round(0.4 * h),
      Math.round(0.5 * h), Math.round(0.6 * h), Math.round(0.7 * h), Math.round(0.8 * h)
  );
};


const onAlbumShareSelect = (option) => {
  switch (option.event) {
    case 'applyCompleted':
      applyCompleted(albumId).then((res) => {
        showAlbumShare.value = false;
        showToast('申请已提交');
      });

  }
}
</script>

<style lang="scss" scoped>
.album-detail-container {
  padding-bottom: 3rem;
  background-color: #202020;
  height: 100vh;

  .album-detail-header {
    position: relative;

    .header_cover_img_con {
      height: 100%;
      overflow: hidden;
      position: absolute;
      width: 100%;

      .header_cover_img {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        filter: blur(10px);
      }
    }

    .description_header {
      position: relative;
      z-index: 10;
      background-color: rgba(119, 103, 137, .43);
      padding: 0.4rem 0 0.4rem 0.4rem;
      width: 100%;
      overflow: hidden;

      .description_top {
        display: flex;

        .description_left {
          margin-right: 0.3rem;

          img {
            @include wh(5.9rem, 5.9rem);
            display: block;
            border-radius: 0.15rem;
            box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.1);
          }
        }

        .description_right {
          flex: 1;
          margin-left: 0.5rem;

          .description_title {
            @include sc(1rem, #fff);
            font-weight: bold;
            width: 100%;
            margin-bottom: 0.3rem;
          }

          .description_text {

            img {
              @include wh(1.5rem, 1.5rem);
              display: inline-block;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 0.2rem;
            }

            @include sc(.8rem, #fff);
            margin-bottom: 0.3rem;
          }

          .description_promotion {
            @include sc(.5rem, #fff);
            width: 11.5rem;
          }
        }

        .description_arrow {
          @include ct;
          right: 0.3rem;
          z-index: 11;
        }
      }

      .description_statistics {
        position: relative;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        width: 100%;
        display: flex;
        justify-content: space-evenly;

        p {
          @include sc(1rem, #dfe2e8);

          span {
            margin-left: 0.2rem;
            font-weight: bold; // 设置字体加粗
          }
        }
      }

      .description_footer {
        @include fj;
        margin-top: 0.8rem;
        padding-right: 1rem;
      }
    }
  }

  .album-detail-content {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1.25rem;

    .album-detail-title {
      text-align: left;
      font-size: $font-size-lg;
      font-weight: bold;
      color: #fff;
    }

    .album-detail-text {
      margin-top: 0.5rem;
      text-align: left;
      font-size: $font-size-md;
      color: #f8f8f8;
    }
  }

  .album-creator-team {
    position: relative;
    top: 0;
    left: 1rem;
    margin-right: 2rem;
    bottom: 0;
    padding: 0.25rem;
    background-color: rgba(237, 237, 237, 0.8); /* 0.8 为透明度，可根据需要调整 */
    border-radius: 0.5rem; /* 设置圆角 */

    span {
      text-align: left;
      font-weight: bold;
      @include sc(1rem, #fff);
      margin-bottom: 0.4rem;
    }

    .creator-team-text {
      @include sc(.8rem, #fff);
      margin-bottom: 0.3rem;

      img {
        @include wh(4rem, 4rem);
        display: inline-block;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 0.2rem;
      }

    }
  }

}

.media-container {

  &____header {

  }

  &__tabs {
    margin-bottom: 0.5rem;
  }

  &__content {
    padding: 0 0.5rem;
  }
}
</style>