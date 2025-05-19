<template>
  <div class="album-title-container">
    <HeaderTop head-title="标题" go-back='true'>
      <template #actions>
        <van-icon @click="confirm">确认</van-icon>
      </template>
    </HeaderTop>
    <section class="album-title-input">
      <textarea class="w-full textarea" v-model="name" placeholder="请输入标题"></textarea>
    </section>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {useRouter} from "vue-router";
import {storeToRefs} from "pinia";
import {Pages} from "@/router/pages.ts";
import {onMounted, ref} from "vue";
import {useAlbumStore} from "@/stores/album.ts";

const router = useRouter();
const showLoading = ref(true);
const {name} = storeToRefs(useAlbumStore());
onMounted(() => {
  showLoading.value = false;
})
const confirm = () => {
  router.push({name: Pages.albumCreate,});
}
</script>

<style lang="scss" scoped>
@import '@/assets/mixin';

.album-title-container {
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

  .album-title-input {
    padding-top: 1.95rem !important;
    flex: 1 !important;

    .textarea {
      @include sc(.6rem, #000);
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0.5rem;
      resize: none;
      box-sizing: border-box;
    }
  }
}


</style>
