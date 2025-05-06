<template>

  <van-popup
      :show="visible"
      round
      position="bottom"
      :style="{height:'40%'}"
      @update:show="val => emit('update:visible', val)"
  >
    <van-image :src="getQrCodeUrl"/>
    <van-button
        type="primary"
        round class="mt-1"
        size="small"
        block
        @click="onConfirm">关闭
    </van-button>
  </van-popup>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'

const props = defineProps({visible: Boolean, getQrCodeUrl: String})
const emit = defineEmits(['update:visible'])
const onConfirm = (value) => {
  emit('confirm', value)
  emit('update:visible', false)
}
</script>

