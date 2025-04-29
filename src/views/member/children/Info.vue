<template>
  <div class="profile">
    <!-- 顶部标题 -->
    <HeaderTop head-title="会员信息" goBack="true"></HeaderTop>
    <!-- 基本信息：头像、昵称、用户名 -->
    <section class="profile__section">
      <div class="profile__item">
        <span class="profile__label">头像</span>
        <div class="profile__value">
          <van-image :src="getAvatarUrl" round width="40" height="40"/>
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
        <input type="file" class="profile__upload" @change="uploadAvatar"/>
      </div>

      <router-link to="/member/setNickname" class="profile__item">
        <span class="profile__label">昵称</span>
        <div class="profile__value">
          {{ getNickname }}
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </router-link>

      <router-link to="/member/setusername" class="profile__item">
        <span class="profile__label">用户名</span>
        <div class="profile__value">{{ getNickname }}
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </router-link>
    </section>
    <!-- 性别、生日、二维码、UID -->
    <section class="profile__section">
      <div class="profile__item" @click="showGenderPopup = !showGenderPopup">
        <span class="profile__label">性别</span>
        <div class="profile__value">
          {{ getGender }}
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>

        </div>
      </div>

      <div class="profile__item" @click="openBirthday">
        <span class="profile__label">出生日期</span>
        <div class="profile__value">
          {{ getBirthday }}
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </div>

      <div class="profile__item" @click="showQrcode = true">
        <span class="profile__label">二维码名片</span>
        <div class="profile__value">
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </div>
      <div class="profile__item" @click="showQrcode = true">
        <span class="profile__label">UID</span>
        <div class="profile__value">
          {{ getUid }}
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </div>
    </section>
    <!-- 学校信息 -->
    <section class="profile__title">
      学校设置
    </section>
    <section class="profile__section">
      <div class="profile__item" @click="openSex">
        <span class="profile__label">学校</span>
        <div class="profile__value">
          {{ getSchool }}
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>

        </div>
      </div>
    </section>
    <!-- 安全设置 -->
    <section class="profile__title">
      安全设置
    </section>
    <section class="profile__section">
      <router-link to="/member/setPassword" class="profile__item">
        <span class="profile__label">登录密码</span>
        <div class="profile__value">
          <span>修改</span>
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </router-link>
    </section>
    <!-- 账号绑定 -->
    <section class="profile__title">
      账号绑定
    </section>
    <section class="profile__section">
      <router-link to="/member/setPhone" class="profile__item">
        <span class="profile__label">手机号</span>
        <div class="profile__value">
          {{ getPhone }}
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </router-link>
      <div class="profile__item" @click="showExitDialog = true">
        <span class="profile__label">退出登录</span>
        <IconPark :icon="Right"
                  theme="filled"
                  fill="#d8d8d8"
                  class="mr-1" :size="20"/>
      </div>
    </section>
    <section class="profile__exit" @click="exitlogin">退出登录</section>
    <!-- 弹窗们（性别、生日、二维码、退出确认） -->
    <SexPopup v-model:visible="showGenderPopup" @confirm="changeGender"/>
    <BirthdayPopup v-model:visible="showBirthdayPopup" @confirm="setBirthday"/>
    <QrcodeDialog v-model:visible="showQrCode"/>
    <ExitConfirmDialog v-model:visible="showExitDialog"/>

    <!--二维码展示-->
    <section class="gender-info">
      <van-popup v-model:show="showQrCode" round position="bottom" :style="{height:'40%'}" @close="showQrCode = false"
                 closeable
                 close-icon="close"
                 :close-on-click-overlay="false">
        <van-image :src="getQrCodeUrl"/>
        <van-button type="primary" round class="mt-1" size="small" block @click="showQrCode = false">关闭</van-button>
      </van-popup>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/stores/member.ts";
import {Right} from "@icon-park/vue-next";
import IconPark from "@/components/common/IconPark.vue";
import AlertTip from "@/components/common/AlertTip.vue";
import {useRouter} from "vue-router";
import {Pages} from "@/router/pages.ts";
import {ref} from "vue";
import SexPopup from "@/views/member/children/components/SexPopup.vue";
import BirthdayPopup from "@/views/member/children/components/BirthdayPopup.vue";
import QrcodeDialog from "@/views/member/children/components/QrcodeDialog.vue";
import ExitConfirmDialog from "@/views/member/children/components/ExitConfirmDialog.vue";

const router = useRouter();

const {
  show,
  isEnter,
  isLeave,
  showAlert,
  alertText,
  getGender,
  generateQrCode,
  getAvatarUrl,
  getNickname,
  getUsername,
  getBirthday,
  getPersonalizedSignature,
  getSchool,
  getUid,
  getQrCodeUrl,
  getPhone,
  hasResetUsername
} = storeToRefs(useProfileStore());

const {
  exitLogin,
  waitingThing,
  signOut,
  changePhone,
  uploadAvatar,
  resetGender,
  resetBirthday,
} = useProfileStore();
// 性别选择
const showGenderPopup = ref(false);
// 日期选择器
const showBirthdayPopup = ref(false);
// 最小日期选择
const minDate = ref(new Date('1950-01-01'));
// 是否展示二维码
const showQrCode = ref(false);
// 是否展示退出框
const showExitDialog = ref(false);
const outLogin = () => {
  signOut();
  router.push({name: Pages.login});
}

const changeGender = (gender: number) => {
  resetGender(gender);
  showGenderPopup.value = !showGenderPopup.value;
}

const setBirthday = ({selectedValues}) => {
  resetBirthday(selectedValues.join('/'));
  showBirthdayPopup.value = !showBirthdayPopup.value;
}

const onDatePickerConfirm = ({selectedValues}) => {
  resetBirthday(selectedValues.join('/'));
  showDatePicker.value = false;
}

const viewQrCode = () => {
  if (getQrCodeUrl === null || getQrCodeUrl === "") {
    generateQrCode();
  }
  showQrCode.value = true;
}
</script>

<style lang="scss" scoped>

.profile {
  background-color: #f2f2f2;
  padding-top: 1.95rem;

  &__title {
    padding: .1rem .1rem;
    @include sc(.5rem, #666);
  }

  &__section {
    margin-bottom: 0.5rem;
    background-color: #fff;
    overflow: hidden;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    margin-top: .2rem;
    align-items: center;
    padding: .2rem .4rem;
    border-bottom: 0.05rem solid #ddd;
    background: #fff;

    &:last-child {
      border-bottom: none;
    }
  }

  &__label {
    @include sc(.6rem, #333);
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  &__value {
    text-align: left;
    display: flex;
    align-items: center;
    font-weight: 100;
    @include sc(.7rem, #999);
    margin-right: .2rem;
  }

  &__arrow {
    margin-left: 0.6rem;
    font-size: 1rem;
    color: #ccc;
  }

  &__upload {
    display: none;
  }

  &__icon {
    font-size: 1.2rem;
    color: #666;
  }

  &__exit {
    width: 96%;
    margin: 1.3rem auto 0;
    line-height: 1.5rem;
    @include borderRadius(0.2rem);
    text-align: center;
    background: #d8584a;
    @include sc(.6rem, #fff);
  }

  &__exit:active {
    opacity: .8;
    background: #C1C1C1;
  }
}


.rating_page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 202;
  padding-top: 1.95rem;
}

.profile-info {
  @include wh(100%, 3.1rem);

  .profileinfopanel-upload {
    display: block;
    position: absolute;
    opacity: 0;
    top: 2.35rem;
    left: 0;
    @include wh(100%, 3.1rem);
  }

  .headportrait {
    margin-top: .4rem;
    padding: .5rem .4rem;
    @include fj(space-between);
    align-items: center;
    border-top: 1px solid #ddd;
    background: #fff;

    h2 {
      @include sc(.6rem, #333);
      font-weight: 500;
      display: flex;
      align-items: center;
    }

    .headportrait-div {
      span {
        display: inline-block;

        svg {
          @include wh(100%, 100%);
        }
      }

      .headportrait-div-top {
        @include wh(2rem, 2rem);
        @include borderRadius(50%);
        vertical-align: middle;
        display: inline-block;
      }

      .headportrait-div-bottom {
        @include wh(.66667rem, 1.4rem);
        position: relative;
        top: 0.44rem;
      }
    }
  }

  .headportraitwo {
    margin-top: 0;
    padding: .3rem .4rem;

    .headportrait-div {
      @include fj(left);

      p {
        text-align: left;
        line-height: 1.39rem;
        @include sc(.7rem, #999);
        margin-right: .2rem;
        font-weight: 100;
        font-family: Arial;
      }

      .headportrait-div-bottom {
        top: 0;
      }
    }
  }

  .headportraithree {
    border-bottom: 1px solid #ddd;
  }

  .bind-phone {
    padding: .2rem .2rem;
    @include sc(.5rem, #666);
  }

  .exitlogin {
    width: 96%;
    margin: 1.3rem auto 0;
    line-height: 1.5rem;
    @include borderRadius(5px);
    text-align: center;
    background: #d8584a;
    @include sc(.6rem, #fff);

  }

  .exitlogin:active {
    opacity: .8;
    background: #C1C1C1;
  }
}

.info-router {
  display: block;
}

.coverpart {
  @include wh(100%, 100%);
  @include allcover;

  .cover-background {
    @include wh(100%, 100%);
    @include allcover;
    background: #000;
    z-index: 100;
    opacity: .2;
  }

  .cover-content {
    width: 94%;
    background: $fc;
    padding: 17px;
    position: absolute;
    top: 20%;
    left: 3%;
    z-index: 1000;
    @include borderRadius(5px);

    .sa-icon {
      @include wh(90px, 90px);
      border: 4px solid #f8bb86;
      @include borderRadius(50%);
      margin: 20px auto;
      position: relative;

      .sa-body {
        @include wh(5px, 47px);
        @include borderRadius(2px);
        background: #f8bb86;
        @include cl;
        top: 10px;
      }

      .sa-dot {
        @include wh(7px, 7px);
        @include borderRadius(50%);
        background: #f8bb86;
        @include cl;
        bottom: 10px;
      }
    }

    h2 {
      width: 100%;
      text-align: center;
      @include sc(30px, #575757);
      font-weight: 500;
      margin: 25px 0;
    }

    .sa-botton {
      width: 100%;
      text-align: center;

      button {
        display: inline-block;
        padding: .4rem 1rem;
        @include borderRadius(5px);
        @include sc(.6rem, $fc);
        letter-spacing: 1px;
        margin-top: 26px;
      }

      .waiting {
        background: #C1C1C1;
        margin-right: .4rem;
      }

      .quitlogin {
        background: rgb(221, 107, 85);
      }
    }

  }
}

@-webkit-keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, 100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    -webkit-transform: scale3d(.97, .97, .97);
    transform: scale3d(.97, .97, .97);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, 100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    -webkit-transform: scale3d(.97, .97, .97);
    transform: scale3d(.97, .97, .97);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@-webkit-keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  100% {
    opacity: 0;
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  100% {
    opacity: 0;
  }
}

body .coverpart .cover-animate {
  transition: all 1s;
  animation: bounceIn .6s;
}

body .coverpart .cover-animate-leave {
  animation: zoomOut .4s;
}

.router-slid-enter-active, .router-slid-leave-active {
  transition: all .4s;
}

.router-slid-enter, .router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
</style>