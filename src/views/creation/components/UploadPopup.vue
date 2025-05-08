<!-- UploadPopup.vue -->
<template>
  <van-popup
      :show="modelValue"
      position="bottom"
      :style="{ height: '100%', background: '#f5f5f5' }"
      closeable
      @close="emit('update:modelValue', false)"
  >
    <div class="upload-container">
      <van-row :gutter="[20, 10]">
        <van-col span="24">
          <section class="spike">
            <div class="spike-header">
              <span class="spike-header-title">走进AI</span>
            </div>
            <div class="spike-content">
              <van-swipe :autoplay="3000" lazy-render/>
            </div>
          </section>
        </van-col>
        <van-col span="24">
          <van-grid clickable :column-num="2" :gutter="10">
            <van-grid-item text="必剪" to="/">
              <IconPark :icon="CuttingOne" theme="filled" :size="16"/>
              <p style="font-size: 0.75rem" class="mt-1">必剪</p>
            </van-grid-item>
            <van-grid-item icon="upgrade" text="上传视频" :to="{ path: '/creative/videoUpload' }"/>
          </van-grid>
        </van-col>
        <van-col span="24">
          <van-grid clickable :column-num="4" :gutter="10">
            <van-grid-item icon="diamond-o" text="创作专辑" to="/creative/albumCreate"/>
            <van-grid-item icon="description-o" text="写专栏" to="/"/>
            <van-grid-item icon="photograph" text="拍视频" url="https://github.com"/>
            <van-grid-item icon="live" text="开直播" url="https://github.com"/>
          </van-grid>
        </van-col>
      </van-row>
    </div>
  </van-popup>
</template>


<script setup lang="ts">
import {defineProps} from 'vue';
import IconPark from "@/components/common/IconPark.vue";
import {CuttingOne} from "@icon-park/vue-next";

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

</script>

<style scoped lang="scss">
.upload-container {
  margin-top: 2rem;

  .spike {
    margin-top: 0.4rem;
    background: $fc;

    &-header {
      padding-left: 0.4rem;
      display: inline-block;

      &-title {
        display: inline-block;
        height: 1.2rem;
        line-height: 1.2rem;
        font-size: 0.75rem;
        font-weight: bold;
      }
    }

    &-content {
      .van-card-full {
        background-color: #f1f1f1;
      }
    }
  }
}
</style>
