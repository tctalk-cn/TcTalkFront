<template>
  <div class="order-item">
    <!-- 订单头 -->
    <div class="order-header">
      <span class="order-no">订单号：{{ order.orderNo }}</span>
      <span class="order-status">{{ statusText }}</span>
    </div>

    <!-- 商品列表 -->
    <div class="order-body">
      <div v-for="item in order.items" :key="item.skuId" class="sku-item">
        <img :src="item?.skuImgUrl || defaultCover" alt="" />
        <div class="sku-info">
          <div class="sku-name">{{ item.skuName }}</div>
          <div class="sku-meta">
            <span class="sku-quantity">x{{ item.quantity }}</span>
            <span class="sku-price">¥{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 订单底部 -->
    <div class="order-footer">
      <span class="order-summary">共 {{ order.items.length }} 件商品，合计 ¥{{ order.amountTotal }}</span>
      <div class="actions">
        <van-button
            v-if="showPayBtn"
            size="small"
            type="primary"
            @click="$emit('pay', order)"
        >去支付</van-button>

        <van-button
            v-if="showCommentBtn"
            size="small"
            type="default"
            @click="$emit('comment', order)"
        >评价</van-button>

        <van-button
            v-if="showDetailBtn"
            size="small"
            type="info"
            @click="$emit('detail', order)"
        >查看详情</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultCover from '@/assets/images/vip.png';
import type { OrderDTO } from "@/models/order.ts";
import { computed } from "vue";

const props = defineProps<{ order: OrderDTO }>();

const OrderStatusMap: Record<number, string> = {
  0: "创建",
  1: "待支付",
  2: "支付中",
  3: "支付成功",
  4: "支付失败",
  5: "取消",
  6: "关闭",
  7: "已退款",
  8: "交易完结",
};

const PaymentStatusMap: Record<number, string> = {
  0: "待支付",
  10: "内部扣款中",
  11: "内部扣款完成",
  20: "外部支付中",
  2: "已支付",
  3: "支付失败",
  4: "关闭",
  50: "手动处理流程",
};

const statusText = computed(() => {
  if ([10, 11, 20, 50].includes(props.order.paymentStatus)) {
    return PaymentStatusMap[props.order.paymentStatus];
  }
  return OrderStatusMap[props.order.orderStatus] || "未知状态";
});

const showPayBtn = computed(() => props.order.orderStatus === 1 || props.order.paymentStatus === 0);
const showCommentBtn = computed(() => props.order.orderStatus === 8);
const showDetailBtn = computed(() => true);
</script>

<style scoped lang="scss">
.order-item {
  background: #fff;
  border-radius: 12px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);

  .order-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 0.7rem;

    .order-status {
      color: #ff5722;
      font-weight: 600;
      background: rgba(255,87,34,0.1);
      padding: 0.1rem 0.4rem;
      border-radius: 12px;
      font-size: 0.75rem;
    }
  }

  .order-body {
    display: flex;
    flex-direction: column;

    .sku-item {
      display: flex;
      align-items: center;
      padding: 0.4rem 0;
      border-bottom: 1px solid #f2f2f2;

      &:last-child { border-bottom: none; }

      img {
        width: 2.6rem;
        height: 2.6rem;
        border-radius: 6px;
        object-fit: cover;
        margin-right: 0.6rem;
      }

      .sku-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .sku-name {
          font-weight: 500;
          font-size: 0.88rem;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 0.2rem;
        }

        .sku-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #999;

          .sku-price {
            color: #333;
            font-weight: 600;
          }
        }
      }
    }
  }

  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 0.7rem;

    .order-summary {
      font-size: 0.78rem;
      color: #666;
      margin-bottom: 0.4rem;
    }

    .actions {
      display: flex;
      gap: 0.6rem;

      .van-button {
        padding: 0 0.7rem;
        font-size: 0.78rem;
        min-width: 3.4rem;
        border-radius: 20px;
      }
    }
  }
}
</style>
