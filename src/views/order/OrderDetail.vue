<template>
  <div v-if="orderBasic" class="order-detail-container">
    <!-- 顶部 Header -->
    <HeaderTop go-back="true" head-title="订单详情" />

    <div class="scroll-content">
      <!-- 订单信息 -->
      <div class="card order-info-card">
        <div class="order-status-row">
          <span>订单号：{{ orderBasic.orderNo }}</span>
          <span :class="{ flashing: isCountdownActive }">{{ statusText }}</span>
        </div>
        <div class="order-time">
          {{ statusTimeText }}
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="card product-list-card">
        <div v-for="item in orderBasic.items" :key="item.skuId" class="sku-item">
          <img :src="item.skuImgUrl || defaultCover" alt="" />
          <div class="sku-info">
            <div class="sku-name">{{ item.skuName }}</div>
            <div class="sku-meta">
              <span>x{{ item.quantity }}</span>
              <span>¥{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 支付信息 -->
      <div class="card pay-info-card">
        <div>支付方式：{{ orderBasic.paymentMethod || '未支付' }}</div>
        <div>支付金额：¥{{ orderBasic.amountTotal }}</div>
        <div v-if="isCountdownActive" class="countdown-text">
          剩余支付时间：{{ countdownText }}
        </div>
      </div>

      <!-- 会员特有信息 -->
      <OrderDurationCard v-if="orderBasic.orderVipExtDTO" :duration="orderBasic.orderVipExtDTO.duration" />
      <BenefitList v-if="orderBasic.orderVipExtDTO" :benefits="orderBasic.orderVipExtDTO.benefits" class="card benefit-list" />
      <AutoRenewNotice v-if="orderBasic.orderVipExtDTO?.billingMode === 'RECURRING'" :renewPrice="orderBasic.orderVipExtDTO.renewPrice" />
    </div>

    <!-- 底部操作 -->
    <div class="bottom-bar">
      <van-button
          v-if="showPayBtn"
          type="primary"
          block
          @click="onPay"
      >去支付</van-button>
      <van-button
          v-if="showCancelBtn"
          type="default"
          block
          @click="onCancel"
      >取消订单</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, closeToast, showLoadingToast } from 'vant';
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import OrderDurationCard from "@/views/order/components/OrderDurationCard.vue";
import BenefitList from "@/views/order/components/BenefitList.vue";
import AutoRenewNotice from "@/views/order/components/AutoRenewNotice.vue";
import { useOrderStore } from "@/stores/order_store.ts";
import defaultCover from "@/assets/images/vip.png";
import {OrderDTO} from "@/models/order.ts";

const route = useRoute();
const router = useRouter();
const { findOrderBasic } = useOrderStore();

const orderBasic = ref<OrderDTO | null>(null);

// 支付倒计时
const remainingSeconds = ref(0);
const countdownText = ref('');
const isCountdownActive = ref(false);
let timer: number | undefined;

const statusText = computed(() => {
  if (!orderBasic.value) return '';
  const { orderStatus, paymentStatus } = orderBasic.value;
  if (paymentStatus === 2 || orderStatus === 3) return '已支付';
  if ([5, 6].includes(orderStatus)) return '已取消';
  if ([0, 1].includes(orderStatus)) return '待支付';
  return '未知状态';
});

const statusTimeText = computed(() => {
  if (!orderBasic.value) return '';
  const { paymentTime, updateTime, expireTime, orderStatus } = orderBasic.value;
  const now = Date.now();

  if (orderBasic.value.paymentStatus === 2 || orderStatus === 3) {
    return paymentTime ? `支付时间：${new Date(paymentTime).toLocaleString()}` : '';
  }
  if ([5, 6].includes(orderStatus)) {
    return updateTime ? `取消时间：${new Date(updateTime).toLocaleString()}` : '';
  }
  if ([0, 1].includes(orderStatus) && expireTime && new Date(expireTime).getTime() > now) {
    return countdownText.value;
  }
  if ([0, 1].includes(orderStatus) && expireTime && new Date(expireTime).getTime() <= now) {
    return `已过期（截止：${new Date(expireTime).toLocaleString()}）`;
  }
  return '';
});

const showPayBtn = computed(() => {
  if (!orderBasic.value) return false;
  const { orderStatus, paymentStatus, expireTime } = orderBasic.value;
  const notExpired = expireTime && new Date(expireTime).getTime() > Date.now();
  return [0, 1, 4].includes(orderStatus) && [0, 3].includes(paymentStatus) && notExpired;
});

const showCancelBtn = computed(() => {
  if (!orderBasic.value) return false;
  return [0, 1].includes(orderBasic.value.orderStatus);
});

// --- 生命周期 ---
onMounted(async () => {
  const orderId = route.query.orderId as string;
  const orderNo = route.query.orderNo as string;

  const res = await findOrderBasic(orderId, orderNo);
  if (!res?.code || res?.code !== '200' || !res.data) {
    showToast(res?.message || '获取订单明细失败');
    await router.replace('/orderCenter/orders');
    return;
  }
  orderBasic.value = res.data;

  if (orderBasic.value.expireTime) {
    const expireTimestamp = new Date(orderBasic.value.expireTime).getTime();
    remainingSeconds.value = Math.max(Math.floor((expireTimestamp - Date.now()) / 1000), 0);

    if (remainingSeconds.value > 0) {
      isCountdownActive.value = true;
      updateCountdown();
      timer = window.setInterval(() => {
        if (remainingSeconds.value > 0) {
          remainingSeconds.value--;
          updateCountdown();
        } else {
          countdownText.value = '已过期';
          isCountdownActive.value = false;
          clearInterval(timer);
        }
      }, 1000);
    } else {
      countdownText.value = '已过期';
      isCountdownActive.value = false;
    }
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// --- 倒计时更新 ---
function updateCountdown() {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  countdownText.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// --- 操作事件 ---
const onPay = () => {
  showToast('去支付逻辑，需调用支付接口');
};
const onCancel = () => {
  showToast('取消订单逻辑，需调用取消接口');
};
</script>

<style scoped lang="scss">
.order-detail-container {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 6rem;
  display: flex;
  flex-direction: column;

  .scroll-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  .card {
    background: #fff;
    margin-bottom: 12px;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .order-status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .flashing {
      color: red;
      font-weight: bold;
      animation: flash 1s infinite;
    }
  }

  @keyframes flash {
    50% { opacity: 0.2; }
  }

  .sku-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    img {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      margin-right: 12px;
    }

    .sku-info {
      flex: 1;
      .sku-name {
        font-weight: 500;
      }
      .sku-meta {
        display: flex;
        justify-content: space-between;
      }
    }
  }

  .bottom-bar {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 12px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .countdown-text {
    color: #f44336;
    font-weight: bold;
  }
}
</style>
