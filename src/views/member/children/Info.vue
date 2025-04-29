<template>
  <div class="rating_page">
    <HeaderTop head-title="会员信息" goBack='true'></HeaderTop>
    <section class="profile-info">
      <section class="headportrait">
        <input type="file" class="profileinfopanel-upload" @change="uploadAvatar"/>
        <h2>头像</h2>
        <div class="headportrait-div">
          <img :src="getAvatarUrl" class="headportrait-div-top" alt=""/>
          <span class="headportrait-div-bottom">
              <IconPark :icon="Right"
                        theme="filled"
                        fill="#d8d8d8"
                        class="mr-1" :size="20"/>
          </span>
        </div>
      </section>
      <router-link to="/member/setNickname" class="info-router">
        <section class="headportrait headportraitwo">
          <h2>昵称</h2>
          <div class="headportrait-div">
            <p>{{ getNickname }}</p>
            <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
          </div>
        </section>
      </router-link>
      <router-link to="/member/setusername" class="info-router" v-if="!hasResetUsername">
        <section class="headportrait headportraitwo">
          <h2>用户名</h2>
          <div class="headportrait-div">
            <p>{{ getUsername }}</p>
            <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
          </div>
        </section>
      </router-link>
      <div class="info-router" v-if="hasResetUsername">
        <section class="headportrait headportraitwo">
          <h2>用户名</h2>
          <div class="headportrait-div">
            <p>{{ getUsername }}</p>
            <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
          </div>
        </section>
      </div>
      <section class="headportrait headportraitwo" @click="showGender = !showGender">
        <h2>性别</h2>
        <div class="headportrait-div">
          <p>{{ getGender }}</p>
          <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
        </div>
      </section>
      <section class="headportrait headportraitwo" @click="showDatePicker=true">
        <h2>出生年月</h2>
        <div class="headportrait-div">
          <p>{{ getBirthday }}</p>
          <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
        </div>
      </section>
      <router-link to="/profile/info/setSignature" class="info-router">
        <section class="headportrait headportraitwo">
          <h2>个性签名</h2>
          <div class="headportrait-div">
            <p>{{ getPersonalizedSignature }}</p>
            <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
          </div>
        </section>
      </router-link>
      <router-link to="/profile/info/school" class="info-router">
        <section class="headportrait headportraitwo">
          <h2>学校</h2>
          <div class="headportrait-div">
            <p>{{ getSchool }}</p>
            <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
          </div>
        </section>
      </router-link>
      <section class="headportrait headportraitwo">
        <h2>UID</h2>
        <div class="headportrait-div">
          <p>{{ getUid }}</p>
          <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
        </div>
      </section>
      <section class="headportrait headportraitwo headportraithree" @click="viewQrCode()">
        <h2>二维码名片</h2>
        <div class="headportrait-div">
            <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
        </div>
      </section>
      <section class="bind-phone">
        账号绑定
      </section>
      <section class="info-router" @click="changePhone">
        <section class="headportrait headportraitwo headportraithree">
          <h2><img src="@/assets/images/bindphone.png" style="display:inline-block;margin-right:.4rem;" alt="">手机</h2>
          <div class="headportrait-div">
            <p>{{ getPhone }}</p>
            <span class="headportrait-div-bottom">
                <IconPark :icon="Right"
                          theme="filled"
                          fill="#d8d8d8"
                          class="mr-1" :size="20"/>
            </span>
          </div>
        </section>
      </section>

      <section class="bind-phone">
        安全设置
      </section>
      <router-link to="/forget" class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <h2>登录密码</h2>
          <div class="headportrait-div">
            <p>修改</p>
            <span class="headportrait-div-bottom">
                <span class="headportrait-div-bottom">
                    <IconPark :icon="Right"
                              theme="filled"
                              fill="#d8d8d8"
                              class="mr-1" :size="20"
                    />
                </span>
            </span>
          </div>
        </section>
      </router-link>
      <section class="exitlogin" @click="exitLogin">退出登录</section>
    </section>

    <section class="coverpart" v-if="show">
      <section class="cover-background"></section>
      <section class="cover-content" :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
        <div class="sa-icon">
          <span class="sa-body"></span>
          <span class="sa-dot"></span>
        </div>
        <h2>是否退出登录</h2>
        <div class="sa-botton">
          <button class="waiting" @click="waitingThing">再等等</button>
          <div style="display:inline-block;">
            <button class="quitlogin" @click="outLogin">退出登录</button>
          </div>
        </div>
      </section>
    </section>
    <!--性别选择-->
    <section class="gender-info">
      <van-popup v-model:show="showGender" round position="bottom" :style="{height:'20%'}" @close="showGender = false"
                 closeable
                 close-icon="close"
                 :close-on-click-overlay="false">
        <van-cell-group inset class="mt-1">
          <van-cell title="男" clickable @click="changeGender(1)">
          </van-cell>
          <van-cell title="女" clickable @click="changeGender(2)">
          </van-cell>
          <van-cell title="保密" clickable @click="changeGender(0)">
          </van-cell>
        </van-cell-group>
        <van-button type="primary" round class="mt-1" size="small" block @click="showGender = false">取消</van-button>
      </van-popup>
    </section>
    <!--生日选择-->
    <section class="info-router">
      <van-popup v-model:show="showDatePicker" position="bottom">
        <van-date-picker @confirm="onDatePickerConfirm" @cancel="showDatePicker = false"
                         :min-date="minDate"/>
      </van-popup>
    </section>
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

const router = useRouter();

const {
  show,
  isEnter,
  isLeave,
  showAlert,
  alertText,
} = storeToRefs(useProfileStore());

const {
  exitLogin,
  waitingThing,
  signOut,
  changePhone,
  uploadAvatar,
  resetGender,
  resetBirthday,
  generateQrCode,
  getAvatarUrl,
  getNickname,
  getUsername,
  getGender,
  getBirthday,
  getPersonalizedSignature,
  getSchool,
  getUid,
  getQrCodeUrl,
  getPhone,
  hasResetUsername
} = useProfileStore();
// 性别选择
const showGender = ref(false);
// 日期选择器
const showDatePicker = ref(false);
// 最小日期选择
const minDate = ref(new Date('1950-01-01'));
// 是否展示二维码
const showQrCode = ref(false);

const outLogin = () => {
  signOut();
  router.push({name: Pages.login});
}

const changeGender = (gender: number) => {
  resetGender(gender);
  showGender.value = !showGender.value;
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
    padding: .4rem .4rem;
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