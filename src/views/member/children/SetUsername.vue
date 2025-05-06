<template>
  <div class="rating_page">
    <HeaderTop head-title="修改用户名" go-back="true"/>
    <section class="setname">
      <section class="setname-top">
        <input type="text" placeholder="输入用户名" :class="{'setname-input':bordercolor}" @input="usernameCheck"
               v-model="usernameRef"/>
        <div>
          <p v-if="earn">用户名只能修改一次（5-24字符之间）</p>
          <p class="unlikep" v-else>用户名长度在5到24位之间</p>
        </div>
      </section>
      <section class="reset">
        <button :class="{fontopacity:opacityall}" @click="resetName">确认修改</button>
      </section>
    </section>
  </div>
</template>


<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useProfileStore} from "@/stores/member.ts";
// 输入框提醒
const earn = ref(true);
// 输入框边框颜色
const bordercolor = ref(false);
// 字体透明度
const opacityall = ref(false);
// 输入框的内容
const usernameRef = ref("");
// 新用户名
const {resetUsername} = useProfileStore();
const router = useRouter();
// 用户名check
const usernameCheck = () => {
  if (usernameRef.value.length < 5 || usernameRef.value.length > 24) {
    earn.value = false;
    bordercolor.value = true;
    opacityall.value = false;
    return false;
  } else {
    earn.value = true;
    bordercolor.value = false;
    opacityall.value = true;
    return true;
  }
}

const resetName = () => {
  let checkResult = usernameCheck();
  if (!checkResult) {
    return;
  }
  resetUsername(usernameRef.value);
  router.go(-1);
}
</script>

<style lang="scss" scoped>

.rating_page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 202;
  background: #f2f2f2;
  padding-top: 1.95rem;
}

.setname {
  margin: 0 auto;

  .setname-top {
    padding: .6rem .8rem;

    input {
      background: none;
      width: 15.2rem;
      border: 1px solid #ddd;
      @include borderRadius(2px);
      padding: .2rem .1rem;
      line-height: 1.2rem;
      font-size: .7rem;
      display: block;
    }

    .setname-input {
      border-color: #ea3106;
    }

    p {
      width: 100%;
      @include sc(.4rem, #666);
      padding: .4rem 0 1rem;
    }

    .unlikep {
      @include sc(.58rem, #ea3106);
      padding-top: .1rem;
    }
  }

  .reset {
    width: 100%;
    background: #3199e8;

    button {
      display: block;
      width: 100%;
      background: none;
      line-height: 2rem;
      @include sc(.7rem, #fff);
      opacity: .6;
      transition: all 1s;
    }

    .fontopacity {
      transition: all 1s;
      opacity: 1;
    }
  }
}
</style>