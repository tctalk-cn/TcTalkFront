<template>
  <HeaderTop go-back="true" :head-title="profileTitle" go-back-url="/member">
    <!-- 其他插槽内容... -->
    <template #actions>
      <van-icon class="action-button" name="newspaper-o"/>
    </template>
  </HeaderTop>
  <div class="user-container">
    <!-- 导航栏 -->
    <div class="author">
      <img :src="getAvatarUrl" class="privateImage" alt=""/>
      <div>
        <p>昵称：{{ getNickname }}</p>
        <p>等级：
          <van-tag round type="danger" color="#ffe1e1" text-color="#ad0000">{{ getMemberLevelName }}</van-tag>
        </p>
        <span>TC账号：{{ getUid }}</span>
      </div>
      <div class="ml-20">
        <van-button color="#ff69b4" size="small" @click="publish">
          发布
        </van-button>
      </div>
    </div>
    <div class="mt-28 w-full">
      <div class="flex justify-evenly mb-2 mt-4">
        <p class="text-sm text-gray-300">{{ getWorksCount }}作品</p>
        <p class="text-sm text-gray-300">{{ getLikesCount }}获赞</p>
        <p class="text-sm text-gray-300">{{ getAttendCount }}关注</p>
        <p class="text-sm text-gray-300">{{ getFansCount }}粉丝</p>
      </div>
    </div>
  </div>
  <!-- 内容 -->
  <div class="myContent">
    <van-tabs v-model:active="currentKey" lazy-render @clickTab="onTabClick" animated scrollspy>
      <van-tab v-for="(item) in menus" :key="item.name" :name="item.name">
        <template #title>
          <van-icon v-if="item.icon" :name="item.icon"/>
          <div v-if="!item.icon"> {{ item.label }}</div>
        </template>
      </van-tab>
    </van-tabs>
    <div class="mt-0.5">
      <RouterView/>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {ref} from "vue";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/stores/member.ts";

const profileTitle = ref("创作中心");

const {
  getAvatarUrl,
  getNickname,
  getUsername,
  getUid,
  getMemberLevelName,
  getWorksCount,
  getLikesCount,
  getAttendCount,
  getFansCount
} = storeToRefs(useProfileStore());

</script>

<style lang="scss" scoped>
.user-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $blue;

  .author {
    position: absolute;
    top: 2.0rem;
    left: 1rem;
    display: flex;
    align-items: center;

    img {
      width: 5rem;
      height: 5rem;
      border-radius: 50%;
      object-fit: cover;
      border: 0.1rem solid #fff;
    }

    div {
      margin-left: 1.0rem;

      p {
        margin: 0;
        font-size: 1.0rem;
        color: #fff;
      }

      span {
        font-size: 0.8rem;
        color: #c1c1c1;
      }
    }
  }
}

.upload-container {
  margin-top: 2rem;

  .spike {
    margin-top: 0.4rem;
    background: $fc;

    &-header {
      padding-left: 0.4rem;
      display: inline-block;

      &-title {
        display: inline-block;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0.75rem;
        font-weight: bold;
      }
    }

    &-content {
      height: auto;

      .van-card-full {
        background-color: #f1f1f1;
      }
    }
  }
}
</style>