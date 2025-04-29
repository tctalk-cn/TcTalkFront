<template>
  <van-popup
      :show="visible"
      position="bottom"
      @update:show="val => emit('update:visible', val)"
  >
    <van-datetime-picker
        type="date"
        :min-date="new Date(1900, 0, 1)"
        :max-date="new Date()"
        @confirm="onConfirm"
    />
  </van-popup>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({ visible: Boolean })
const emit = defineEmits(['update:visible', 'confirm'])

const onConfirm = (value) => {
  emit('confirm', value)
  emit('update:visible', false)
}
</script>
