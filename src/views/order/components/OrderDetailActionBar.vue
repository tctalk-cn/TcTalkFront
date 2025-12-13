<template>
  <div class="action-bar">
    <van-button
        v-if="showPay"
        type="danger"
        block
        @click="$emit('pay')"
    >
      去支付
    </van-button>

    <van-button
        v-if="showCancel"
        type="default"
        block
        @click="$emit('cancel')"
    >
      取消订单
    </van-button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  showPay: boolean
  showCancel: boolean
}>()
</script>

<style scoped lang="scss">
.action-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 12px;
  background: #fff;
}
</style>
