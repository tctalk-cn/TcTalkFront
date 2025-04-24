<template>
  <div class="login-container">
    <!-- 顶部 -->
    <HeaderTop :head-title="loginWay? '登录':'密码登录'" goBack='true'>
      <template #changeLogin>
        <div slot="changeLogin" class="change_login" @click="changeLoginWay">{{ loginWay ? "密码登录" : "短信登录" }}
        </div>
      </template>
    </HeaderTop>
    <form class="login-form" v-if="loginWay">
      <section class="input_container phone_number">
        <input type="text" placeholder="账号密码随便输入" name="phone" maxlength="11" v-model="phoneNumber">
        <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">
          获取验证码
        </button>
        <button @click.prevent v-show="computedTime">已发送({{ computedTime }}s)</button>
      </section>
      <section class="input_container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
      </section>
    </form>
    <form class="login-form" v-else>
      <section class="input_container">
        <input type="text" placeholder="账号" v-model.lazy="userAccount" autocomplete="username"/>
      </section>
      <section class="input_container">
        <input v-if="!showPassword" type="password" placeholder="密码" v-model="passWord"
               autocomplete="current-password"/>
        <input v-else type="text" placeholder="密码" v-model="passWord" autocomplete="current-password"/>
        <div class="button_switch" :class="{change_to_text:showPassword}">
          <div class="circle_button" :class="{trans_to_right: showPassword}" @click="changePassWordType"></div>
          <span>显示</span>
        </div>
      </section>
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
        <div class="img_change_img">
          <img v-if="captchaCodeImg" :src="captchaCodeImg">
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login_tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <p class="login_tips">
      注册过的用户可凭账号密码登录
    </p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/forget" class="to_forget" v-if="!loginWay">重置密码？</router-link>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="handleCloseTip" :alertText="alertText"></alert-tip>
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
// import {removeStore} from "@/stores/local.ts";

// 登录方式，默认短信登录
const loginWay = ref(false);
// 是否显示密码
const showPassword = ref(false);
// 电话号码
const phoneNumber = ref(null);
// 短信验证码
const mobileCode = ref(null);
// 倒数记时
const computedTime = ref(0);
// 用户名
const userAccount = ref(null);
// 密码
const passWord = ref(null);
// 验证码
const codeNumber = ref(null);
// 显示提示组件
const showAlert = ref(false);
// 提示的内容
const alertText = ref(null);
// 验证码地址
const captchaCodeImg = ref();
// 提交uuid
const captchaUuidRef = ref();

const router = useRouter();

// // 设置token值
// const {setToken} = useProfileStore();

// 关闭提示
const handleCloseTip = () => {
  showAlert.value = false;
}

// 获取验证吗，non-live环境使用固定的图片，live环境使用真实的验证码
const getCaptchaCode = async () => {
  const {uuid, image} = await useCaptcha();
  captchaCodeImg.value = image;
  captchaUuidRef.value = uuid;
}

// 是否显示密码
const changePassWordType = () => {
  showPassword.value = !showPassword.value;
}
// 改变登录方式
const changeLoginWay = () => {
  loginWay.value = !loginWay.value;
}

// 判断手机号码
const rightPhoneNumber = computed(() => {
  return /^1\d{10}$/gi.test(phoneNumber.value);
});

// 发送登录信息
const mobileLogin = async () => {
  // 登录结果
  let loginResult = null;
  if (loginWay.value) {
    if (!rightPhoneNumber) {
      showAlert.value = true;
      alertText.value = '手机号码不正确';
      return
    } else if (!(/^\d{6}$/gi.test(mobileCode.value))) {
      showAlert.value = true;
      alertText.value = '短信验证码不正确';
      return;
    }
    // 手机号登录
  } else {
    if (!userAccount.value) {
      showAlert.value = true;
      alertText.value = '请输入手机号/邮箱/用户名';
      return;
    } else if (!passWord.value) {
      showAlert.value = true;
      alertText.value = '请输入密码';
      return;
    } else if (!codeNumber.value) {
      showAlert.value = true;
      alertText.value = '请输入验证码';
      return;
    }
    // // 首先清空本地Token
    // removeStore("TC_TOKEN");
    // 用户名登录
    loginResult = await useLogin(userAccount.value, passWord.value, captchaUuidRef.value, codeNumber.value);
    if (loginResult && loginResult.code === '200') {
      showDialog({
        title: '结果',
        message: '登入成功跳转到首页',
      }).then(() => {
        // setToken(loginResult.data.token);
        router.push({name: Pages.recommend, replace: true,});
      });
    } else {
      showAlert.value = true;
      alertText.value = loginResult.message;
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

  .change_login {
    position: absolute;
    @include ct;
    right: 0.75rem;
    @include sc(.7rem, #fff);
  }

  .login-form {
    background-color: #fff;
    margin-top: 0.5rem;

    .input_container {
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

      .right_phone_number {
        background-color: #4cd964;
      }
    }

    .phone_number {
      padding: .3rem .8rem;
    }

    .captcha_code_container {
      height: 2.2rem;

      .img_change_img {
        display: flex;
        align-items: center;

        img {
          @include wh(3.5rem, 1.5rem);
          margin-right: .2rem;
        }

        .change_img {
          display: flex;
          flex-wrap: wrap;
          width: 2rem;
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


.login_tips {
  @include sc(.5rem, red);
  padding: .4rem .6rem;
  line-height: .5rem;

  a {
    color: #3b95e9;
  }
}

.login_container {
  margin: 0 .5rem 1rem;
  @include sc(.7rem, #fff);
  background-color: #4cd964;
  padding: .5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}

.button_switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  @include wh(2rem, .7rem);
  padding: 0 .2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;

  .circle_button {
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

  .trans_to_right {
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

.change_to_text {
  background-color: #4cd964;
}

.to_forget {
  float: right;
  @include sc(.6rem, #3b95e9);
  margin-right: .3rem;
}

</style>