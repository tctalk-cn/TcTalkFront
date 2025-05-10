<template>
  <div class="nickname-page">
    <HeaderTop head-title="修改昵称" go-back="true"/>
    <section class="nickname-form">
      <section class="nickname-form__top">
        <van-form>
          <van-field
              v-model="nicknameRef"
              placeholder="输入昵称"
              rows="1"
              autosize
              clearable
              required
              :rules="[{ validator, message: '长度不合法' }]"
              :input-class="{ 'invalid-border': showError && !canSubmit }"
              @clear="clearInput"
          ></van-field>
          <div>
            <p v-if="showError && !canSubmit" class="nickname-form__error-msg">
              昵称长度在5到24位之间
            </p>
          </div>
        </van-form>
      </section>
      <section class="nickname-form__submit">
        <button :class="{ 'is-active': canSubmit }" @click="changeNickname">确认修改</button>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useProfileStore} from "@/stores/member_store.ts";
import {storeToRefs} from "pinia";

const {resetNickname} = useProfileStore();

const {getNickname} = storeToRefs(useProfileStore());
// 输入框双向绑定
const nicknameRef = ref(getNickname.value || "");
// 校验函数
const isValidLength = (val: string) => val.length >= 5 && val.length <= 24;
// 透明度按钮控制（computed 自动跟随）
const canSubmit = computed(() => isValidLength(nicknameRef.value));
// 显示提示文本颜色
const showError = ref(false);

// 路由
const router = useRouter();

// 提交修改
const changeNickname = () => {
  if (!canSubmit.value) {
    showError.value = true;
    return;
  }
  resetNickname(nicknameRef.value);
  router.go(-1);
};

// 清空输入框
const clearInput = () => {
  nicknameRef.value = "";
  showError.value = false;
};

// 用于 van-field rules
const validator = (val: string) => isValidLength(val);

</script>

<style lang="scss" scoped>
.nickname-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 202;
  background: #f2f2f2;
  padding-top: 1.95rem;
}

.nickname-form {
  margin: 0 auto;

  &__top {
    padding-top: 0.4rem;

    &__error-msg {
      @include sc(0.58rem, #ea3106);
      padding-top: 0.1rem;
    }

    .nickname-form__input--error {
      border: 1px solid #ea3106 !important;
    }
  }

  &__submit {
    width: 100%;
    background: #3199e8;

    button {
      display: block;
      width: 100%;
      background: none;
      line-height: 2rem;
      @include sc(0.7rem, #fff);
      opacity: 0.6;
      transition: opacity 0.3s;
    }

    .is-active {
      opacity: 1;
    }
  }
}

</style>