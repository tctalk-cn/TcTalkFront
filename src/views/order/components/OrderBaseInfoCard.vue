<template>
  <div class="card base-info">
    <div>订单号：{{ order.orderNo }}</div>
    <div>创建时间：{{ order.createTime }}</div>
    <div v-if="order.paymentTime">
      支付时间：{{ order.paymentTime }}
    </div>
    <div>支付方式：{{ order.paymentMethod || '未支付' }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ order: any }>()
</script>
