<template>
  <div class="login-container">
    <!-- 顶部 -->
    <HeaderTop :head-title="isSmsLogin ? '登录' : '密码登录'" goBack="true">
      <template #changeLogin>
        <div class="login-mode-toggle" @click="changeLoginWay">
          {{ isSmsLogin ? "密码登录" : "短信登录" }}
        </div>
      </template>
    </HeaderTop>

    <form class="login-form" v-if="isSmsLogin">
      <section class="input-container sms-phone-section">
        <input
            type="text"
            placeholder="账号密码随便输入"
            name="phone"
            maxlength="11"
            v-model="smsPhoneNumber"
        />
        <button
            @click.prevent="getVerifyCode"
            :class="{ 'right-phone-number': rightPhoneNumber }"
            v-show="!smsCountdown"
        >
          获取验证码
        </button>
        <button @click.prevent v-show="smsCountdown">
          已发送({{ smsCountdown }}s)
        </button>
      </section>

      <section class="input-container">
        <input
            type="text"
            placeholder="验证码"
            name="mobileCode"
            maxlength="6"
            v-model="smsCode"
        />
      </section>
    </form>

    <form class="login-form" v-else>
      <section class="input-container">
        <input
            type="text"
            placeholder="账号"
            v-model.lazy="accountUsername"
            autocomplete="username"
        />
      </section>

      <section class="input-container">
        <input
            v-if="!isPasswordVisible"
            type="password"
            placeholder="密码"
            v-model="loginPassword"
            autocomplete="current-password"
        />
        <input
            v-else
            type="text"
            placeholder="密码"
            v-model="loginPassword"
            autocomplete="current-password"
        />
        <div class="button-switch" :class="{ 'change-to-text': isPasswordVisible }">
          <div
              class="circle-button"
              :class="{ 'trans-to-right': isPasswordVisible }"
              @click="changePassWordType"
          ></div>
          <span>显示</span>
        </div>
      </section>

      <section class="input-container captcha-code-section">
        <input
            type="text"
            placeholder="验证码"
            maxlength="4"
            v-model="captchaCode"
        />
        <div class="img-change-img">
          <img v-if="captchaImageUrl" :src="captchaImageUrl"/>
          <div class="change-img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>

    <p class="login-tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <p class="login-tips">
      注册过的用户可凭账号密码登录
    </p>

    <div class="login-submit-button" @click="mobileLogin">登录</div>

    <router-link to="/forget" class="forgot-password-link" v-if="!isSmsLogin">
      重置密码？
    </router-link>

    <alert-tip
        v-if="showAlert"
        :showHide="showAlert"
        @closeTip="closeAlert"
        :alertText="alertMessage"
    ></alert-tip>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import AlertTip from "@/components/common/AlertTip.vue";
import HeaderTop from "@/components/layout/header/HeaderTop.vue";

import {useRouter} from "vue-router";
import {Pages} from "@/router/pages.ts";
import {showDialog} from "vant";
import {useProfileStore} from "@/stores/member.ts";
import {useCaptcha, useLogin} from "@/api/login/login_api.ts";

// 登录方式，默认短信登录
const isSmsLogin = ref(false);
// 是否显示密码
const isPasswordVisible = ref(false);
// 电话号码
const smsPhoneNumber = ref(null);
// 短信验证码
const smsCode = ref(null);
// 倒数记时
const smsCountdown = ref(0);
// 用户名
const accountUsername = ref(null);
// 密码
const loginPassword = ref(null);
// 验证码
const captchaCode = ref(null);
// 显示提示组件
const showAlert = ref(false);
// 提示的内容
const alertMessage = ref(null);
// 验证码地址
const captchaImageUrl = ref();
// 提交uuid
const captchaUuidRef = ref();

const router = useRouter();

// 设置token值
const {setToken, clearToken, loadMemberInfo} = useProfileStore();

// 关闭提示
const closeAlert = () => {
  showAlert.value = false;
}

// 获取验证吗，non-live环境使用固定的图片，live环境使用真实的验证码
const getCaptchaCode = async () => {
  const {uuid, image} = await useCaptcha();
  captchaImageUrl.value = image;
  captchaUuidRef.value = uuid;
}

// 是否显示密码
const changePassWordType = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
}
// 改变登录方式
const changeLoginWay = () => {
  isSmsLogin.value = !isSmsLogin.value;
}

// 判断手机号码
const rightPhoneNumber = computed(() => {
  return /^1\d{10}$/gi.test(smsPhoneNumber.value);
});

// 发送登录信息
const mobileLogin = async () => {
  // 登录结果
  let loginResult = null;
  if (isSmsLogin.value) {
    if (!rightPhoneNumber) {
      showAlert.value = true;
      alertMessage.value = '手机号码不正确';
      return
    } else if (!(/^\d{6}$/gi.test(smsCode.value))) {
      showAlert.value = true;
      alertMessage.value = '短信验证码不正确';
      return;
    }
    // 手机号登录
  } else {
    if (!accountUsername.value) {
      showAlert.value = true;
      alertMessage.value = '请输入手机号/邮箱/用户名';
      return;
    } else if (!loginPassword.value) {
      showAlert.value = true;
      alertMessage.value = '请输入密码';
      return;
    } else if (!captchaCode.value) {
      showAlert.value = true;
      alertMessage.value = '请输入验证码';
      return;
    }
    // 首先清空本地Token
    clearToken();
    // 用户名登录
    loginResult = await useLogin(accountUsername.value, loginPassword.value, captchaUuidRef.value, captchaCode.value);
    if (loginResult && loginResult.code === '200') {
      showDialog({
        title: '结果',
        message: '登入成功跳转到首页',
      }).then(() => {
        // 设置token
        setToken(loginResult.data.token);
        // 加载登入用户信息并持久化
        loadMemberInfo();
        router.push({name: Pages.recommend, replace: true,});
      });
    } else {
      showAlert.value = true;
      alertMessage.value = loginResult.message;
    }
  }
}

const getVerifyCode = () => {

}
onMounted(() => {
  // 验证码赋值
  getCaptchaCode();
})
</script>

<style lang="scss" scoped>
.login-container {
  padding-top: 1.95rem;

  .login-mode-toggle {
    position: absolute;
    @include ct;
    right: 0.75rem;
    @include sc(.7rem, #fff);
  }

  .login-form {
    background-color: #fff;
    margin-top: 0.5rem;

    .input-container {
      display: flex;
      justify-content: space-between;
      padding: .6rem .8rem;
      border-bottom: 1px solid #f1f1f1;

      input {
        @include sc(.7rem, #666);
      }

      button {
        @include sc(.65rem, #fff);
        padding: .28rem .4rem;
        border: 1px;
        border-radius: 0.15rem;
      }

      .right-phone-number {
        background-color: #4cd964;
      }
    }

    .sms-phone-section {
      padding: .3rem .8rem;
    }

    .captcha-code-section {
      height: 2.2rem;

      .img-change-img {
        display: flex;
        align-items: center;

        img {
          @include wh(3.5rem, 1.5rem);
          margin-right: .2rem;
        }

        .change-img {
          display: flex;
          flex-wrap: wrap;
          width: 4rem;
          justify-content: center;

          p {
            @include sc(.55rem, #666);
          }

          p:nth-of-type(2) {
            color: #3b95e9;
            margin-top: .2rem;
          }
        }
      }
    }
  }
}

.login-tips {
  @include sc(.5rem, red);
  padding: .4rem .6rem;
  line-height: .5rem;

  a {
    color: #3b95e9;
  }
}

.login-submit-button {
  margin: 0 .5rem 1rem;
  @include sc(.7rem, #fff);
  background-color: #4cd964;
  padding: .5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}

.button-switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  @include wh(2.2rem, .7rem);
  padding: 0 .2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;

  .circle-button {
    transition: all .3s;
    position: absolute;
    top: -0.2rem;
    z-index: 1;
    left: -0.3rem;
    @include wh(1.2rem, 1.2rem);
    box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0, 0, 0, .1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }

  .trans-to-right {
    transform: translateX(1.3rem);
  }

  span {
    @include sc(.45rem, #fff);
    transform: translateY(.05rem);
    line-height: .6rem;
  }

  span:nth-of-type(2) {
    transform: translateY(-.08rem);
  }
}

.change-to-text {
  background-color: #4cd964;
}

.forgot-password-link {
  float: right;
  @include sc(.6rem, #3b95e9);
  margin-right: .3rem;
}


</style>