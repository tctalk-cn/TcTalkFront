<template>
  <div class="video-title-container">
    <HeaderTop head-title="标题" go-back='true'>
      <template #actions>
        <van-icon @click="confirm" :class="{ disabled: !(title || '').trim() }">确认</van-icon>
      </template>
    </HeaderTop>
    <section class="video-title-input">
      <van-field
          v-model="title"
          type="textarea"
          maxlength="200"
          show-word-limit
          rows="10"
          placeholder="请输入标题"
      />
    </section>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {Pages} from "@/router/pages.ts";
import {onMounted, ref} from "vue";
import {useVideoStore} from "@/stores/video_store.ts";
import {showToast} from "vant";

const router = useRouter();
const showLoading = ref(true);
const {title} = storeToRefs(useVideoStore());
onMounted(() => {
  showLoading.value = false;
})
const confirm = () => {
  if (!title.val()) {
    showToast('标题不可以为空');
    return;
  }
  router.push({name: Pages.videoUpload,});
}
</script>

<style lang="scss" scoped>
.video-title-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .video-title-input {
    flex: 1 !important;
  }

  .disabled {
    color: #ccc;
    pointer-events: none;
  }
}

</style>
