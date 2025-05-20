<template>
  <div class="phone-page">
    <HeaderTop head-title="设置手机号" go-back="true"/>

    <section class="phone-form">
      <section class="phone-form__body">
        <input
            type="tel"
            placeholder="请输入手机号"
            :class="{ 'phone-form__input--error': isInvalid }"
            v-model="phone"
            @input="validatePhone"
        />
        <div>
          <p v-if="showTips">手机号将用于登录和身份验证</p>
          <p v-else class="phone-form__error-msg">请输入有效的手机号（11位数字）</p>
        </div>
      </section>

      <section class="phone-form__submit">
        <button :class="{ 'is-active': isValid }" @click="submitPhone">确认设置</button>
      </section>
    </section>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useProfileStore} from "@/stores/member_store.ts";

const router = useRouter();
const {changePhone} = useProfileStore(); // 假设 store 中有此方法

const phone = ref("");
const isInvalid = ref(false);
const isValid = ref(false);
const showTips = ref(true);

// 简单正则验证手机号
const validatePhone = () => {
  const pattern = /^1\d{10}$/;
  if (!pattern.test(phone.value)) {
    isInvalid.value = true;
    showTips.value = false;
    isValid.value = false;
    return false;
  } else {
    isInvalid.value = false;
    showTips.value = true;
    isValid.value = true;
    return true;
  }
};

const submitPhone = () => {
  if (!validatePhone()) return;
  changePhone(phone.value); // 假设存在该方法
  router.go(-1);
};
</script>

<style scoped lang="scss">
.phone-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 202;
  background: #f2f2f2;
}

.phone-form {
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

    .phone-form__input--error {
      border-color: #ea3106;
    }

    p {
      width: 100%;
      font-size: 0.4rem;
      color: #666;
      padding: 0.4rem 0 1rem;
    }

    .phone-form__error-msg {
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

