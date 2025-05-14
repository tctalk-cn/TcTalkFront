<template>
  <div class="center-container">
    <HeaderTop go-back="true" :head-title="profileTitle" go-back-url="/member">
      <!-- 其他插槽内容... -->
      <template #actions>
        <van-icon class="action-button" name="newspaper-o"/>
      </template>
    </HeaderTop>
    <!-- 用户信息区域 -->
    <div class="center-container__user-info">
      <!-- 导航栏 -->
      <div class="user-info__header">
        <img class="user-info__avatar" :src="getAvatarUrl" alt=""/>
        <div class="user-info__details">
          <p>昵称：{{ getNickname }}</p>
          <p>等级：
            <van-tag type="danger" color="#ffe1e1" text-color="#ad0000">{{ getMemberLevelName }}</van-tag>
          </p>
          <span>TC账号：{{ getUid }}</span>
        </div>
        <div class="user-info__action">
          <van-button color="#ff69b4" size="normal" @click="handlePublishClick">
            发布
          </van-button>
        </div>
      </div>
      <div class="center-container__stats">
        <div class="flex justify-evenly mb-2 mt-4">
          <p class="text-sm text-gray-300">{{ getWorksCount }}作品</p>
          <p class="text-sm text-gray-300">{{ getLikesCount }}获赞</p>
          <p class="text-sm text-gray-300">{{ getAttendCount }}关注</p>
          <p class="text-sm text-gray-300">{{ getFansCount }}粉丝</p>
        </div>
      </div>
    </div>
    <!-- 内容区域-->
    <div class="center-container__tabs">
      <van-tabs v-model:active="currentTab" lazy-render @clickTab="onTabClick" animated scrollspy>
        <van-tab v-for="(item) in profileTabs" :key="item.name" :name="item.name">
          <template #title>
            <van-icon v-if="item.icon" :name="item.icon"/>
            <div v-if="!item.icon"> {{ item.label }}</div>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <div class="center-container__content">
      <RouterView/>
    </div>
  </div>
  <!--引入上传组件-->
  <UploadPopup v-model="showUpload"/>

</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/stores/member_store.ts";
import {useRoute, useRouter} from "vue-router";
import UploadPopup from "@/views/creation/components/UploadPopup.vue";

const profileTitle = ref("创作中心");

const {
  getAvatarUrl,
  getNickname,
  getUid,
  getMemberLevelName,
  getWorksCount,
  getLikesCount,
  getAttendCount,
  getFansCount
} = storeToRefs(useProfileStore());

const router = useRouter();
const route = useRoute();

const profileTabs: MenuItem[] = [
  {id: 1, label: '专辑', name: 'album'},
  {id: 2, label: '声音', name: 'audio'},
  {id: 3, label: '视频', name: 'video'},
  {id: 4, label: '动态', name: 'dt'},
  {id: 5, label: '收藏', name: 'favorites'},
  {id: 6, label: '笔记', name: 'notes'},
  {id: 7, label: '更多', name: 'more', icon: 'more-o'},
];
const showUpload = ref(false);

const currentTab = ref<MenuItem["name"]>(route.meta.menu as MenuItem["name"]);

watch(
    () => route.meta.menu,
    (menu) => {
      currentTab.value = menu as MenuItem["name"];
    }
);

// tab点击切换页面
interface TabClickEvent {
  name: MenuItem["name"];
  title: string;
}

const onTabClick = (tab: TabClickEvent) => {
  currentTab.value = tab.name;
  router.push({name: tab.name});
};

const handlePublishClick = () => {
  showUpload.value = true
}

</script>

<style lang="scss" scoped>
.center-container {
  display: flex;
  flex-direction: column;
  padding-top: 1.95rem;
  height: 100vh; // 视口高度

  &__user-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: $blue;

    .user-info__header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info__avatar {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      object-fit: cover;
      border: 0.1rem solid #fff;
    }

    .user-info__details {
      p {
        margin: 0;
        font-size: $font-size-mx;
        color: #fff;
      }

      span {
        font-size: $font-size;
        color: #c1c1c1;
      }
    }

    .user-info__action .van-button {
      padding: 0.5rem 1rem;
    }
  }

  &__stats {
    width: 100%;
    padding: 1rem;
  }

  &__tabs {
    margin-bottom: 0.5rem;
  }

  &__content {
    padding: 0 0.5rem;
  }

  .content-container {
    flex: 1; // 占据剩余空间
    overflow-y: auto;
  }
}
</style>