<template>
  <div class="order-item">
    <div class="order-header">
      <span class="order-no">订单号：{{ order.orderNo }}</span>
      <span class="order-status">{{ order.statusText }}</span>
    </div>

    <div class="order-body">
      <div v-for="(item, index) in order.items" :key="item.skuId" class="sku-item">
        <img :src="item.skuImgUrl" alt="" />
        <div class="sku-info">
          <div class="sku-name">{{ item.skuName }}</div>
          <div class="sku-quantity">x{{ item.quantity }}</div>
        </div>
        <div class="sku-price">¥{{ item.payAmount }}</div>
      </div>
    </div>

    <div class="order-footer">
      <span>共 {{ order.items.length }} 件商品，合计 ¥{{ order.amountTotal }}</span>
      <div class="actions">
        <van-button v-if="order.payable" size="small" type="primary" @click="$emit('pay', order)">去支付</van-button>
        <van-button v-if="order.canComment" size="small" type="default" @click="$emit('comment', order)">评价</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  order: any; // 订单对象，包含 items
}>();
</script>

<style scoped lang="scss">
.order-item {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  padding: 0.5rem;

  .order-header { display: flex; justify-content: space-between; font-size: 0.75rem; color: #999; margin-bottom: 0.5rem; }

  .order-body { display: flex; flex-direction: column;

    .sku-item {
      display: flex; align-items: center; margin-bottom: 0.4rem;
      img { width: 2.4rem; height: 2.4rem; border-radius: 4px; object-fit: cover; margin-right: 0.5rem; }
      .sku-info { flex: 1; font-size: 0.8rem;
        .sku-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sku-quantity { color: #666; font-size: 0.7rem; }
      }
      .sku-price { font-size: 0.8rem; color: #333; }
    }
  }

  .order-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;
    .actions { display: flex; gap: 0.3rem; }
  }
}
</style>
