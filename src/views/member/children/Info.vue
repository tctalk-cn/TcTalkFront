<template>
  <div class="profile">
    <!-- 顶部标题 -->
    <HeaderTop head-title="会员信息" goBack="true"></HeaderTop>
    <!-- 基本信息：头像、昵称、用户名 -->
    <section class="profile__section">
      <div class="profile__item">
        <span class="profile__label">头像</span>
        <div class="profile__value" @click="triggerAvatarUpload">
          <van-image :src="getAvatarUrl" round width="40" height="40"/>
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
        <input ref="avatarInput" type="file" class="profile__upload" @change="uploadAvatar"/>
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
      <router-link
          :to="hasResetUsername <= 0 ? '/member/setUsername' : ''"
          class="profile__item"
          @click.native.prevent="hasResetUsername > 0 && $event.preventDefault()"
      >
        <span class="profile__label">用户名</span>
        <div class="profile__value">
          {{ getUsername }}
          <IconPark
              v-if="hasResetUsername <= 0"
              :icon="Right"
              theme="filled"
              fill="#d8d8d8"
              class="mr-1"
              :size="20"
          />
          <span
              v-else
              class="mr-1"
              style="display: inline-block; width: 20px; height: 20px;"
          ></span>
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

      <div class="profile__item" @click="viewQrCode">
        <span class="profile__label">二维码名片</span>
        <div class="profile__value">
          <IconPark :icon="Right"
                    theme="filled"
                    fill="#d8d8d8"
                    class="mr-1" :size="20"/>
        </div>
      </div>
      <div class="profile__item">
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
      <div class="profile__item">
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
    </section>
    <section class="profile__exit" @click="showExitDialog = true">退出登录</section>
    <!-- 弹窗们（性别、生日、二维码、退出确认） -->
    <SexPopup v-model:visible="showGenderPopup" @confirm="changeGender"/>
    <BirthdayPopup v-model:visible="showBirthdayPopup" v-model:birthday="getBirthday" @confirm="setBirthday"/>
    <QrcodeDialog v-model:visible="showQrCode" v-model:getQrCodeUrl="getQrCodeUrl" @confirm="showQrCode=!showQrCode"/>
    <ExitConfirmDialog v-model:visible="showExitDialog" @confirm="outLogin"/>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <router-view v-slot="{ Component }">
      <transition name="router-slid" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/stores/member_store.ts";
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
  showAlert,
  alertText,
  getGender,
  getAvatarUrl,
  getNickname,
  getUsername,
  getBirthday,
  getSchool,
  getUid,
  getQrCodeUrl,
  getPhone,
  hasResetUsername
} = storeToRefs(useProfileStore());

const {
  signOut,
  uploadAvatar,
  resetGender,
  resetBirthday,
  generateQrCode
} = useProfileStore();
// 性别选择
const showGenderPopup = ref(false);
// 日期选择器
const showBirthdayPopup = ref(false);
// 是否展示二维码
const showQrCode = ref(false);
// 是否展示退出框
const showExitDialog = ref(false);
const avatarInput = ref<HTMLInputElement | null>(null);
const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

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

const viewQrCode = () => {
  if (getQrCodeUrl === null || getQrCodeUrl.value === "") {
    generateQrCode();
  }
  showQrCode.value = true;
}
// 打开生日选择
const openBirthday = () => {
  showBirthdayPopup.value = true
}
</script>

<style lang="scss" scoped>

.profile {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

</style>