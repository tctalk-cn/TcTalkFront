<template>
  <div class="order-list">
    <OrderItem
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @pay="handlePay"
    />
    <van-empty v-if="orders.length === 0" description="暂无订单"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import OrderItem from "@/views/order/components/OrderItem.vue";

const orders = ref<any[]>([]);

onMounted(async () => {
  // 调用接口加载待付款订单
  // orders.value = await fetchPendingPaymentOrders();
});

const handlePay = (order: any) => {
  console.log("去支付", order);
};
</script>

<style scoped lang="scss">
.order-list { padding: 0.5rem; }
</style>
