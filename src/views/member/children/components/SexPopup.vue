<template>
  <van-popup
      :show="visible"
      round
      position="bottom"
      :style="{ height: '20%' }"
      @update:show="val => emit('update:visible', val)"
  >
    <van-cell-group inset class="mt-1">
      <van-cell title="男" clickable @click="onClick(1)"/>
      <van-cell title="女" clickable @click="onClick(2)"/>
      <van-cell title="保密" clickable @click="onClick(0)"/>
    </van-cell-group>
    <van-button
        type="primary"
        round
        class="mt-1"
        size="small"
        block
        @click="emit('update:visible', false)">
      取消
    </van-button>
  </van-popup>
</template>

<script setup>
const props = defineProps({visible: Boolean})
const emit = defineEmits(['update:visible', 'confirm'])

const onClick = (value) => {
  emit('confirm', value)       // 把性别传出去
  emit('update:visible', false) // 关闭弹窗
}
</script>
