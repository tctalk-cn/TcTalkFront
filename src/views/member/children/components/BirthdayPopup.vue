<template>
  <van-popup
      :show="visible"

      position="bottom"
      :style="{ height: '40%' }"
      @update:show="val => emit('update:visible', val)"
  >
    <van-date-picker
        v-model="currentDate"
        :min-date="new Date(1950, 0, 1)"
        :max-date="new Date()"
        @confirm="onConfirm"
    />
  </van-popup>
</template>

<script setup>
import {computed, ref, watch} from "vue";

const props = defineProps({
  visible: Boolean,
  birthday: {
    type: String,
    default: '',
    validator: val => /^\d{4}-\d{2}-\d{2}$/.test(val)
  }
})

const emit = defineEmits(['update:visible', 'confirm'])
const currentDate = ref(['2000', '01', '01']) // 默认初始值
const today = computed(() => {
  const d = new Date()
  return [
    d.getFullYear().toString(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ]
})
// 监听 birthday 初始化 currentDate
watch(
    () => props.birthday,
    (val) => {
      if (val) {
        const parts = val.split('-')
        if (parts.length === 3) {
          const [y, m, d] = parts
          currentDate.value = [
            y,
            m?.padStart(2, '0') ?? '01',
            d?.padStart(2, '0') ?? '01'
          ]
        }
      }
    },
    {immediate: true}
)


const onConfirm = (value) => {
  emit('confirm', value)
  emit('update:visible', false)
}
</script>
