<template>
  <div class="password-page">
    <HeaderTop head-title="修改密码" go-back="true" />

    <section class="password-form">
      <section class="password-form__body">
        <input
            type="password"
            placeholder="请输入新密码"
            v-model="password"
            :class="{ 'password-form__input--error': isPasswordInvalid }"
            @input="validatePassword"
        />
        <input
            type="password"
            placeholder="再次输入新密码"
            v-model="confirmPassword"
            :class="{ 'password-form__input--error': isConfirmInvalid }"
            @input="validateConfirmPassword"
        />
        <p v-if="tipVisible">密码需为6-20位字母或数字</p>
        <p v-else class="password-form__error-msg">{{ errorMsg }}</p>
      </section>

      <section class="password-form__submit">
        <button :class="{ 'is-active': isValid }" @click="submitPassword">确认修改</button>
      </section>
    </section>
  </div>
</template>


<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/member_store.ts";

const router = useRouter();
const { updatePassword } = useProfileStore(); // 假设有该方法

const password = ref("");
const confirmPassword = ref("");
const isPasswordInvalid = ref(false);
const isConfirmInvalid = ref(false);
const isValid = ref(false);
const tipVisible = ref(true);
const errorMsg = ref("");

// 校验密码格式
const validatePassword = () => {
  const valid = /^[A-Za-z0-9]{6,20}$/.test(password.value);
  isPasswordInvalid.value = !valid;
  if (!valid) {
    tipVisible.value = false;
    errorMsg.value = "密码格式不正确";
    isValid.value = false;
  } else {
    tipVisible.value = true;
    errorMsg.value = "";
    validateConfirmPassword(); // 同时校验两次输入是否一致
  }
};

// 校验确认密码是否一致
const validateConfirmPassword = () => {
  if (confirmPassword.value !== password.value || confirmPassword.value === "") {
    isConfirmInvalid.value = true;
    tipVisible.value = false;
    errorMsg.value = "两次密码不一致";
    isValid.value = false;
  } else {
    isConfirmInvalid.value = false;
    tipVisible.value = true;
    errorMsg.value = "";
    if (!isPasswordInvalid.value) isValid.value = true;
  }
};

// 提交
const submitPassword = () => {
  validatePassword();
  validateConfirmPassword();
  if (!isValid.value) return;
  updatePassword(password.value); // 假设存在此方法
  router.go(-1);
};
</script>


<style scoped lang="scss">
.password-page {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 202;
  background: #f2f2f2;
  padding-top: 1.95rem;
}

.password-form {
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
      margin-bottom: 0.4rem;
    }

    .password-form__input--error {
      border-color: #ea3106;
    }

    p {
      font-size: 0.4rem;
      color: #666;
      padding: 0.4rem 0 1rem;
    }

    .password-form__error-msg {
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
