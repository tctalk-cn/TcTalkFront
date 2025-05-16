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
          <div class="album-data-title">声音数据
            <van-icon name="arrow" size="10"
                      @click="router.push({path: '/creative/albumDetail', query: {albumId: albumId,albumCreatorMemberId:albumCreatorMemberId}})"/>
          </div>
          <div class="album-data-count">
            <p>
              <IconPark :icon="Play" theme="filled" :size="12"/>
              <span>{{ albumInfo.viewsCount }}</span>
            </p>
            <p>
              <IconPark :icon="Comment" theme="filled" :size="12"/>
              <span>{{ albumInfo.commentCount }}</span>
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
import {Album} from "@/models/album.ts";

const {
  queryAlbum
} = useAlbumStore();
const route = useRoute();
const router = useRouter();
const albumId = route.query.albumId as string;
const albumCreatorMemberId = route.query.albumCreatorMemberId as string;
const albumInfo = ref({} as Album);
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
  albumInfo.value = await queryAlbum(albumCreatorMemberId, albumId);
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


</script>

<style scoped lang="scss">

.album-data-container {
  padding-top: 1.95rem;
  background-color: $bc;
  overflow-y: auto;

  .album-data-content {
    padding: 0.5rem 0.5rem;
    display: flex;
    flex-direction: column;

    .album-data-header {
      display: flex;
      align-items: flex-end; /* 让子元素顶部对齐 */
      gap: 1rem; /* 让封面、统计信息、更新时间有间距 */
      background-color: $fc;
      padding: 0.5rem 1rem;
      border-radius: 0.4rem;
      box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);

      .album-data-cover {
        width: 5rem;
        height: 5rem;
        border-radius: 0.5rem;
        overflow: hidden;
        background-color: #e7e7e7;
        background-image: url("@/assets/images/tv.png");
        background-size: 5rem 5rem;
        background-position: 1.5rem 0;
        background-repeat: no-repeat;
      }

      .album-data-info {
        flex-grow: 1; /* 让它占据中间所有空间 */
        display: flex;
        flex-direction: column;
        justify-content: center;

        .album-data-title {
          margin-left: 0.5rem;
          font-family: Arial, serif;
          font-size: 0.8rem !important;
          color: #999;
          flex-grow: 1; /* 让标题占满剩余空间 */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .album-data-count {
          display: flex;
          font-size: 0.8rem !important;
          color: #999;
          gap: 0.2rem;
          margin-bottom: 0.2rem;
          margin-top: 0.5rem;

          p {
            display: flex;
            align-items: center;
            margin-right: 0.4rem;

            span {
              margin-left: 0.2rem;
            }
          }
        }
      }


    }

    .album-data-main {
      margin-top: 0.2rem;
      border-radius: 0.4rem;
      box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);

    }
  }


}
</style>