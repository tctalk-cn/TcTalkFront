<template>
  <van-dialog
      :show="visible"
      title="我的二维码"
      show-cancel-button
      @update:show="val => emit('update:visible', val)"
  >
    <div class="qrcode-wrapper">
<!--      <img src="your-qrcode-url.png" alt="二维码" />-->
    </div>
  </van-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible'])
</script>

<style scoped>
.qrcode-wrapper {
  text-align: center;
  padding: 20px 0;
}
.qrcode-wrapper img {
  width: 150px;
  height: 150px;
}
</style>
