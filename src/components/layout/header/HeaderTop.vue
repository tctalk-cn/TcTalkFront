<template>
  <header id='head_top'>
    <section class="head-left">
      <section class="head_goback" v-if="goBack">
        <van-icon name="arrow-left" size="20px" color="#fff" @click="backHome"/>
      </section>
      <slot name='logo'></slot>
    </section>

    <section class="head-center">
      <span class="title_text" v-if="headTitle">{{ headTitle }}</span>
    </section>

    <section class="head-right">
      <div class="header-search-wrapper" v-if="$slots.search">
        <slot name='search'></slot>
      </div>
      <div class="actions-wrapper" v-if="$slots.actions">
        <slot name='actions'></slot>
      </div>
      <router-link :to="memberInfo?.id ? '/profile':'/login'" v-if='signinUp' class="head_login">
        <svg class="user_avatar" v-if="memberInfo">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
        </svg>
        <span class="login_span" v-else>登录|注册</span>
      </router-link>
    </section>
  </header>
</template>

<script setup lang="ts">
import {useProfileStore} from "@/stores/member_store.ts";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";

const props = defineProps<{
  signinUp?: string;
  headTitle?: string;
  goBack?: string;
  goBackUrl?: string;
}>();
const {memberInfo} = storeToRefs(useProfileStore());
const router = useRouter();

function backHome() {
  if (props?.goBackUrl) {
    router.push({path: props?.goBackUrl});
  } else if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/");
  }
}
</script>

<style lang="scss" scoped>
#head_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: $blue;
  height: 1.95rem;
  padding: 0 0.5rem;
  position: sticky;
  top: 0;
  z-index: 100;

  .head-left, .head-center, .head-right {
    display: flex;
    align-items: center;
  }

  .head-left {
    flex: 1;
  }

  .head-center {
    flex: 2;
    justify-content: center;
    .title_text {
      color: #fff;
      font-weight: bold;
      font-size: 0.8rem;
    }
  }

  .head-right {
    flex: 1;
    justify-content: flex-end;
    gap: 0.3rem; // 间距稍微小一点

    .header-search-wrapper, .actions-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.2rem;  // 缩小按钮宽度
      height: 1.2rem; // 缩小按钮高度
      border-radius: 50%;
      background: rgba(255,255,255,0.15); // 背景透明度小一点
      backdrop-filter: blur(2px);          // blur 减小
      cursor: pointer;

      &:active { background: rgba(255,255,255,0.25); }

      :deep(.van-icon) {
        font-size: 16px; // icon 小一点
        color: #fff;
      }
    }

    .head_login {
      display: flex;
      align-items: center;
      color: #fff;

      .user_avatar {
        fill: #fff;
        width: 0.7rem; // 缩小头像
        height: 0.7rem;
      }

      .login_span {
        color: #fff;
        font-size: 0.65rem; // 缩小文字
      }
    }
  }

  .head_goback {
    margin-right: 0.3rem;
    van-icon {
      font-size: 18px; // 缩小返回按钮
    }
  }
}
</style>

