<template>
  <div class="status-hero" :class="statusClass">
    <div class="icon">{{ statusIcon }}</div>
    <div class="main-text">{{ statusText }}</div>

    <div v-if="showCountdown" class="sub-text flashing">
      剩余支付时间 {{ countdownText }}
    </div>

    <div v-else-if="subText" class="sub-text">
      {{ subText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  orderStatus: number
  paymentStatus?: number
  countdownText?: string
}>()

const isPaid = computed(() =>
    props.paymentStatus === 2 || props.orderStatus === 3
)

const isPending = computed(() =>
    [0, 1].includes(props.orderStatus)
)

const isClosed = computed(() =>
    [5, 6].includes(props.orderStatus)
)

const showCountdown = computed(() =>
    isPending.value && !!props.countdownText
)

const statusText = computed(() => {
  if (isPaid.value) return '支付成功'
  if (isPending.value) return '等待付款'
  if (isClosed.value) return '订单已关闭'
  return '订单状态异常'
})

const subText = computed(() => {
  if (isPaid.value) return '感谢您的购买'
  if (isClosed.value) return '您可以重新下单'
  return ''
})

const statusIcon = computed(() => {
  if (isPaid.value) return '✅'
  if (isPending.value) return '⏳'
  if (isClosed.value) return '❌'
  return '⚠️'
})

const statusClass = computed(() => {
  if (isPaid.value) return 'paid'
  if (isPending.value) return 'pending'
  if (isClosed.value) return 'closed'
  return ''
})
</script>

<style scoped lang="scss">
.status-hero {
  margin: 12px;
  padding: 16px;
  border-radius: 16px;
  text-align: center;

  .icon {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .main-text {
    font-size: 16px;
    font-weight: 500;
  }

  .sub-text {
    margin-top: 4px;
    font-size: 12px;
  }

  &.pending {
    background: #fff7e6;
    color: #fa541c;
  }

  &.paid {
    background: #f6ffed;
    color: #52c41a;
  }

  &.closed {
    background: #f5f5f5;
    color: #999;
  }
}

.flashing {
  animation: flash 1s infinite;
}

@keyframes flash {
  50% { opacity: 0.3; }
}
</style>
