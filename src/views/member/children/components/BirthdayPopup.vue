<template>
  <van-popup
      :show="visible"
      position="bottom"
      :style="{ height: '40%' }"
      @update:show="val => emit('update:visible', val)"
  >
    <van-date-picker
        :min-date="new Date(1950, 0, 1)"
        :max-date="new Date()"
        @confirm="onConfirm"
    />
  </van-popup>
</template>

<script setup>
import {defineProps, defineEmits} from 'vue'

const props = defineProps({visible: Boolean})
const emit = defineEmits(['update:visible', 'confirm'])

const onConfirm = (value) => {
  emit('confirm', value)
  emit('update:visible', false)
}
</script>
