<template>
  <header id='head_top'>
    <slot name='logo'></slot>
    <slot name='search'></slot>
    <slot name="head-menu"></slot>
    <section class="head_goback" v-if="goBack">
      <van-icon name="arrow-left" size="20px" color="#fff" @click="backHome" style="z-index: 100"/>
    </section>
    <router-link :to="memberInfo&&memberInfo.id? '/profile':'/login'" v-if='signinUp' class="head_login">
      <svg class="user_avatar" v-if="memberInfo">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
      </svg>
      <span class="login_span" v-else><router-link to="/login">登录</router-link>|<router-link
          to="/register">注册</router-link></span>
    </router-link>
    <section class="title_head ellipsis" v-if="headTitle">
      <span class="title_text">{{ headTitle }}</span>
      <div class="actions">
        <slot name="actions">
        </slot>
      </div>
    </section>

    <slot name="edit"></slot>
    <slot name="msite-title"></slot>
    <slot name="changecity"></slot>
    <!-- 更改登录方式 -->
    <div class="change-login" v-if="$slots.changeLogin">
      <slot name="changeLogin"></slot>
    </div>
  </header>
</template>
<script setup lang="ts">
import {useProfileStore} from "@/stores/member.ts";
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
    return;
  }
  router.back();
}

</script>

<style lang="scss" scoped>
@import '@/assets/mixin';

#head_top {
  background-color: $blue;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  @include wh(100%, 1.95rem);

  .head_goback {
    left: 0.4rem;
    @include wh(0.6rem, 1rem);
    line-height: 2.2rem;
    margin-left: .4rem;
  }

  .head_login {
    right: 0.55rem;
    @include sc(0.65rem, #fff);
    @include ct;

    .login_span {
      color: #fff;
    }

    .user_avatar {
      fill: #fff;
      @include wh(.8rem, .8rem);
    }
  }

  .title_head {
    @include center;
    width: 100%;
    color: #fff;
    text-align: center;
    display: flex; /* 使用 flex 布局 */
    justify-content: space-between; /* 将标题和操作按钮分散对齐 */

    .title_text {
      @include sc(0.8rem, #fff);
      text-align: center;
      font-weight: bold;
      margin: 0 auto; /* 居中显示 */
    }

    .actions {
      @include sc(0.8rem, #fff);
      display: flex;
      align-items: center;
      margin-right: .4rem; /* 将 actions 推到右侧 */
    }
  }
}


</style>