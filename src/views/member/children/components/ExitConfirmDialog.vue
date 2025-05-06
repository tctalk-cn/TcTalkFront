<template>
  <van-dialog
      :show="visible"
      title="确认退出？"
      show-cancel-button
      @confirm="onConfirm"
      @update:show="val => emit('update:visible', val)"
  >
    退出后将返回登录页面
  </van-dialog>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
})
const emit = defineEmits(['update:visible', 'confirm'])

const onConfirm = () => {
  emit('confirm')
}
</script>
