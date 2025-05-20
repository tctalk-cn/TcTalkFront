<template>
  <div class="album-data-container">
    <HeaderTop go-back="true" :head-title="profileTitle"></HeaderTop>
    <div class="album-data-content">
      <div class="album-data-header">
        <!-- 左侧封面 -->
        <div class="album-data-cover">
          <router-link
              :to="{path: '/creative/albumDetail', query: {albumId: albumId,albumCreatorMemberId:albumCreatorMemberId}}">
            <van-image :src="albumInfo.coverUrl" :alt="albumInfo.name"/>
          </router-link>
        </div>
        <div class="album-data-info">
          <div class="album-data-title-bar" @click="goToAlbumDetail">
            <div class="album-data-title">声音数据</div>
            <van-icon name="arrow" size="14" color="#999"/>
          </div>
          <div class="album-data-count">
            <p>
              <IconPark :icon="Play" theme="filled" :size="12"/>
              <span>{{ albumInfo?.viewsCount }}</span>
            </p>
            <p>
              <IconPark :icon="Comment" theme="filled" :size="12"/>
              <span>{{ albumInfo?.commentCount }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="album-data-main">
        <!-- 内容 -->
        <van-tabs v-model:active="currentActivityTab" lazy-render @clickTab="onTabClick" animated scrollspy>
          <van-tab v-for="(item) in dataMenus" :key="item.name" :name="item.name">
            <template #title>
              <van-icon v-if="item.icon" :name="item.icon"/>
              <div v-if="!item.icon"> {{ item.label }}</div>
            </template>
          </van-tab>
        </van-tabs>
        <div class="mt-0.5">
          <RouterView :album-id="route.query.albumId" :albumCreatorMemberId="route.query.albumCreatorMemberId"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {onMounted, ref, watch} from "vue";
import {Comment, Play} from "@icon-park/vue-next";
import IconPark from "@/components/common/IconPark.vue";

const profileTitle = ref("专辑数据");
import {useRoute, useRouter} from "vue-router";
import {useAlbumStore} from "@/stores/album_store.ts";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/stores/member_store.ts";

const {
  queryAlbum
} = useAlbumStore();
const route = useRoute();
const router = useRouter();
const albumId = route.query.albumId as string;
const albumCreatorMemberId = route.query.albumCreatorMemberId as string;
const {albumInfo} = storeToRefs(useAlbumStore());
// 当前活跃按钮
const currentActivityTab = ref<string>("basicData");

interface MediaMenu {
  id: number,
  label: string,
  name: string,
  icon?: string,
}

const dataMenus: MediaMenu[] = [
  {
    id: 1,
    label: '基础数据',
    name: 'basicData',
  },
  {
    id: 2,
    label: '听众分析',
    name: 'audienceAnalysis',
  },
];

// 初始化加载
onMounted(async () => {
  await queryAlbum(albumCreatorMemberId, albumId);
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
  router.push({
    name: tab.name,
    query:
        {
          albumId: albumId,
          albumCreatorMemberId: albumCreatorMemberId,
        },
  });
}

const goToAlbumDetail = () => {
  router.push({
    path: '/creative/albumDetail',
    query: {albumId, albumCreatorMemberId}
  });
}
</script>

<style scoped lang="scss">

.album-data-container {
  background-color: $bc;
  overflow-y: auto;

  .album-data-content {
    padding: 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;

    .album-data-header {
      display: flex;
      align-items: center;
      gap: 1rem; /* 让封面、统计信息、更新时间有间距 */
      background-color: $fc;
      padding: 0.8rem 1rem;
      border-radius: 0.6rem;
      box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.05);

      .album-data-cover {
        width: 5rem;
        height: 5rem;
        border-radius: 0.6rem;
        overflow: hidden;
        background-color: #f2f2f2;
        background-image: url("@/assets/images/tv.png");
        background-size: 5rem 5rem;
        background-position: 1.5rem 0;
        background-repeat: no-repeat;

        van-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .album-data-info {
        flex-grow: 1; /* 让它占据中间所有空间 */
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .album-data-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;


          .album-data-title {
            font-size: $font-size-mx;
            font-weight: bold;
            color: #333;
          }

          .van-icon {
            transition: transform 0.2s;
          }

          &:hover .van-icon {
            transform: translateX(2px);
          }
        }

        .album-data-count {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;

          p {
            display: flex;
            align-items: center;
            font-size: $font-size;
            color: #666;

            span {
              margin-left: 0.2rem;
            }
          }
        }
      }


    }

    .album-data-main {
      margin-top: 1rem;
      border-radius: 0.6rem;
      background-color: #fff;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .van-tabs__wrap {
      background-color: #fff;
      border-bottom: 1px solid #eee;
      .van-tab {
        font-weight: 500;
        font-size: 0.9rem;
      }
    }

  }
}
</style>