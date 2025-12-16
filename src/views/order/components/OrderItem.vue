<template>
  <div class="order-item">
    <!-- 订单头 -->
    <div class="order-header">
      <div class="header-top">
        <span class="order-no">订单号：{{ order.orderNo }}</span>
        <span class="order-status">{{ statusText }}</span>
      </div>

      <!-- 倒计时 / 时间展示 -->
      <span v-if="statusTimeText" class="order-time"
            :class="{warning: isWarning && !isOrderCompleted, flashing: flashing && !isOrderCompleted}">
        {{ statusTimeText }}
      </span>
    </div>

    <!-- 商品列表 -->
    <div class="order-body">
      <div v-for="item in order.items" :key="item.skuId" class="sku-item">
        <img :src="item?.skuImgUrl || defaultCover" alt=""/>
        <div class="sku-info">
          <div class="sku-name">{{ item.skuName }}</div>
          <div class="sku-meta">
            <span class="sku-quantity">x{{ item.quantity }}</span>
            <span class="sku-price">¥{{ item.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部栏 -->
    <div class="order-footer">
      <span class="order-summary">共 {{ order.items.length }} 件商品，合计 ¥{{ order.amountTotal }}</span>

      <div class="actions">
        <van-button
            v-if="showPayBtn && showPay !== false"
            size="small"
            type="primary"
            @click="$emit('pay', order)"
        >去支付</van-button>

        <van-button
            v-if="showCommentBtn"
            size="small"
            type="default"
            @click="$emit('comment', order)"
        >{{ order.commentStatus === 0 ? '去评价' : '追加评价' }}</van-button>

        <van-button
            v-if="showDetailBtn && showDetail !== false"
            size="small"
            type="default"
            @click="$emit('detail', order)"
        >查看详情</van-button>
      </div>
    </div>

    <!-- 评论星级区域 -->
    <div class="comment-preview">
      <!-- 已评价 -->
      <template v-if="order.commentStatus === 1 || order.commentStatus === 2">
        <div class="comment-stars">
          <van-rate
              v-model="order.userRating"
              :readonly="true"
              :count="5"
              void-icon="star-o"
              icon="star"
              color="#FFB800"
              void-color="#CCC"
              :size="20"
          />
          <span class="commented-text">已评价</span>
        </div>
      </template>

      <!-- 未评价 -->
      <template v-else>
        <div class="comment-stars placeholder" @click="$emit('comment', order)">
          <span class="comment-placeholder-text">商品好不好，评价一下吧</span>
          <van-rate
              v-model="order.userRating"
              :readonly="false"
              :count="5"
              void-icon="star-o"
              icon="star"
              color="#FFB800"
              void-color="#CCC"
              :size="20"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import defaultCover from "@/assets/images/vip.png";
import type { OrderDTO } from "@/models/order.ts";
import { computed } from "vue";
import { useOrderCountdown } from "@/views/order/components/useOrderCountdown.ts";

const props = defineProps<{
  order: OrderDTO;
  showPay?: boolean;
  showDetail?: boolean;
}>();
const emit = defineEmits(["pay", "comment", "detail"]);

// ================== 状态文案 ===================
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

// ================== 倒计时 ===================
const { countdownText, flashing, isWarning } = useOrderCountdown(props.order);

// ================== 订单完成态 ===================
const isOrderCompleted = computed(() => {
  const { orderStatus, paymentStatus } = props.order;
  return paymentStatus === 2 || orderStatus === 3 || orderStatus === 8;
});

// ================== 状态文本 ===================
const statusText = computed(() => {
  const { paymentStatus, orderStatus } = props.order;
  if ([10, 11, 20, 50].includes(paymentStatus)) return PaymentStatusMap[paymentStatus];
  return OrderStatusMap[orderStatus] || "未知状态";
});

// ================== 时间文案 ===================
const statusTimeText = computed(() => {
  const { orderStatus, paymentStatus, paymentTime, updateTime, expireTime } = props.order;
  const now = new Date();

  if (paymentStatus === 2 || orderStatus === 3) {
    return paymentTime ? `支付时间：${new Date(paymentTime).toLocaleString()}` : "";
  }

  if (orderStatus === 8) return "交易已完成";

  if ([5, 6].includes(orderStatus)) {
    return updateTime ? `关闭时间：${new Date(updateTime).toLocaleString()}` : "";
  }

  if ([0, 1].includes(orderStatus) && expireTime && new Date(expireTime) > now) {
    return `剩余支付时间 ${countdownText.value}`;
  }

  if (orderStatus === 1 && expireTime && new Date(expireTime) < now) {
    return "订单已过期";
  }

  return "";
});

// ================== 按钮逻辑 ===================
const showPayBtn = computed(() => {
  const { orderStatus, paymentStatus, expireTime } = props.order;
  const notExpired = expireTime && new Date(expireTime) > new Date();
  return [0, 1, 4].includes(orderStatus) && [0, 3].includes(paymentStatus) && notExpired;
});

const showCommentBtn = computed(() => {
  const { orderStatus, paymentStatus, commentStatus, commentCount, maxCommentCount, commentDeadline } = props.order;

  if (orderStatus !== 3 || paymentStatus !== 2) return false;
  if (commentStatus === 2) return false;
  if (maxCommentCount !== undefined && commentCount >= maxCommentCount) return false;
  if (commentDeadline && new Date(commentDeadline) < new Date()) return false;

  return true;
});

const showDetailBtn = computed(() => true);

// ================== 评论星级显示 ===================
const showCommentStar = computed(() => {
  const { commentStatus, commentCount } = props.order;
  return commentCount > 0 || commentStatus === 0;
});
</script>

<style scoped lang="scss">
.order-item {
  background: #fff;
  border-radius: 12px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);

  .order-header {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 0.7rem;

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .order-status {
      color: #ff5722;
      font-weight: 600;
      background: rgba(255, 87, 34, 0.1);
      padding: 0.1rem 0.4rem;
      border-radius: 12px;
      font-size: 0.75rem;
      white-space: nowrap;
    }

    .order-time {
      font-size: 0.7rem;
      color: #666;
      white-space: nowrap;

      &.warning {
        color: #ff9800;
        font-weight: 600;
      }

      &.flashing {
        color: red;
        animation: flash 1s infinite;
        font-weight: bold;
      }
    }

    @keyframes flash {
      50% { opacity: 0.2; }
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

        .sku-name {
          font-size: 0.88rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sku-meta {
          display: flex;
          justify-content: space-between;
          margin-top: 0.2rem;
          font-size: 0.75rem;

          .sku-price { color: #333; font-weight: 600; }
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
      margin-bottom: 0.4rem;
    }

    .actions {
      display: flex;
      gap: 0.6rem;

      .van-button {
        padding: 0 0.7rem;
        font-size: 0.78rem;
        border-radius: 20px;
      }
    }
  }

  .comment-preview {
    margin-top: 0.8rem;
    padding: 0.6rem 0.8rem;
    background: #fdf7f0;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    .comment-stars {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      &.placeholder {
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: rgba(255, 215, 30, 0.1);
          border-radius: 8px;
        }

        .comment-placeholder-text {
          font-size: 0.82rem;
          color: #ff9800;
        }
      }

      .commented-text {
        font-size: 0.78rem;
        color: #999;
      }
    }
  }

}
</style>
