<template>
  <div class="username-page">
    <HeaderTop head-title="修改用户名" go-back="true" />

    <section class="username-form">
      <section class="username-form__body">
        <input
            type="text"
            placeholder="输入用户名"
            :class="{ 'username-form__input--error': isInvalid }"
            @input="validateUsername"
            v-model="username"
        />
        <div>
          <p v-if="showTips">用户名只能修改一次（5-24字符之间）</p>
          <p v-else class="username-form__error-msg">用户名长度在5到24位之间</p>
        </div>
      </section>

      <section class="username-form__submit">
        <button :class="{ 'is-active': isValid }" @click="submitUsername">确认修改</button>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/member.ts";

const router = useRouter();
const { resetUsername } = useProfileStore();

const username = ref("");
const isInvalid = ref(false);        // 是否显示红色边框
const isValid = ref(false);          // 是否可点击提交按钮
const showTips = ref(true);          // 是否显示默认提示信息

// 表单验证
const validateUsername = () => {
  const length = username.value.length;
  if (length < 5 || length > 24) {
    showTips.value = false;
    isInvalid.value = true;
    isValid.value = false;
    return false;
  } else {
    showTips.value = true;
    isInvalid.value = false;
    isValid.value = true;
    return true;
  }
};

// 提交用户名
const submitUsername = () => {
  if (!validateUsername()) return;
  resetUsername(username.value);
  router.go(-1);
};
</script>


<style lang="scss" scoped>

.username-page {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 202;
  background: #f2f2f2;
  padding-top: 1.95rem;
}

.username-form {
  margin: 0 auto;

  &__body {
    padding: 0.6rem 0.8rem;

    input {
      width: 100%;
      padding: 0.2rem 0.1rem;
      font-size: 0.7rem;
      line-height: 1.2rem;
      border: 1px solid #ddd;
      border-radius: 2px;
      background: none;
      display: block;
    }

    .username-form__input--error {
      border-color: #ea3106;
    }

    p {
      width: 100%;
      font-size: 0.4rem;
      color: #666;
      padding: 0.4rem 0 1rem;
    }

    .username-form__error-msg {
      font-size: 0.58rem;
      color: #ea3106;
      padding-top: 0.1rem;
    }
  }

  &__submit {
    width: 100%;
    background: #3199e8;

    button {
      width: 100%;
      background: none;
      display: block;
      line-height: 2rem;
      font-size: 0.7rem;
      color: #fff;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .is-active {
      opacity: 1;
    }
  }
}

</style>