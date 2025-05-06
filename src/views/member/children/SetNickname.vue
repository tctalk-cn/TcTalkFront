<template>
  <div class="rating_page">
    <HeaderTop head-title="修改昵称" go-back="true"/>
    <section class="setnickname">
      <section class="setnickname-top">
        <van-form>
          <van-field
              v-model="nicknameRef"
              placeholder="输入昵称"
              rows="1"
              autosize
              clearable
              required
              :rules="[{ validator, message: '长度不合法' }]"
              @clear="clearInput"
          ></van-field>
          <div>
            <p class="unlikep">昵称长度在5到24位之间</p>
          </div>
        </van-form>
      </section>
      <section class="reset">
        <button :class="{fontopacity:opacityall}" @click="changeNickname">确认修改</button>
      </section>
    </section>
  </div>
</template>


<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useProfileStore} from "@/stores/member.ts";
import {storeToRefs} from "pinia";

const validator = (val) => {
  if (val.length < 5 || val.length > 24) {
    earn.value = false;
    opacityall.value = false;
    return false;
  } else {
    earn.value = true;
    opacityall.value = true;
    return true;
  }
};

const {getNickname} = storeToRefs(useProfileStore());
// 输入框提醒
const earn = ref(true);
// 输入框边框颜色
const bordercolor = ref(false);
// 字体透明度
const opacityall = ref(false);
// 输入框的内容
const nicknameRef = getNickname;
// // 新用户名
const {resetNickname} = useProfileStore();

const router = useRouter();

const nicknameCheck = () => {
  if (nicknameRef.value.length < 5 || nicknameRef.value.length > 24) {
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
const changeNickname = () => {
  let checkResult = nicknameCheck();
  if (!checkResult) {
    return;
  }
  resetNickname(nicknameRef.value);
  router.go(-1);
}

const clearInput = () => {
  nicknameRef.value = "";
  bordercolor.value = false;
  opacityall.value = false;

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

.setnickname {
  margin: 0 auto;

  .setnickname-top {
    padding-top: .4rem;

    .setname-input {
      border-color: #ea3106;
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