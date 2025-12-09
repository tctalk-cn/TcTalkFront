<template>
  <div class="pay-result-container">
    <van-nav-bar
        title="支付结果"
        left-arrow
        @click-left="onBack"
    />

    <!-- 顶部状态 -->
    <div class="status-area">
      <div v-if="status === 'success'" class="success-wrapper">
        <div class="circle-bg"></div>
        <svg class="checkmark" viewBox="0 0 52 52">
          <circle class="check-circle" cx="26" cy="26" r="25" />
          <path class="check" fill="none" d="M14 27l7 7 17-17"/>
        </svg>
        <div class="status-text">支付成功</div>
      </div>

      <div v-else-if="status === 'fail'" class="fail-wrapper">
        <van-icon name="cross" size="64px" color="#ff4444" />
        <div class="status-text">支付失败</div>
      </div>

      <div v-else class="pending-wrapper">
        <van-loading size="32px" color="#ff9900" />
        <div class="status-text">支付中...</div>
      </div>
    </div>

    <!-- 支付明细 -->
    <div class="result-card" v-if="paymentRecord">
      <div class="order-info">
        <div>商品: {{ paymentRecord.subject }}</div>
        <div>金额: ¥ {{ paymentRecord.amount }}</div>
        <div>订单号: {{ paymentRecord.orderNo }}</div>
        <div v-if="paymentRecord.paymentTime">支付时间: {{ formattedPaymentTime }}</div>
        <div v-if="status === 'fail' && paymentRecord.errorMessage" class="fail-info">
          支付失败原因: {{ paymentRecord.errorMessage }}
        </div>
      </div>

      <div class="button-group">
        <van-button
            type="primary"
            block
            @click="onGoMember"
            v-if="status === 'success'"
        >查看会员权益</van-button>

        <van-button
            type="default"
            block
            @click="onRetry"
            v-if="status === 'fail'"
        >重新支付</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePayStore } from "@/stores/pay_store.ts";
import { showToast } from "vant";
import { PaymentRecord } from "@/models/pay_record.ts";

const route = useRoute();
const router = useRouter();
const { findPayment } = usePayStore();

const status = ref<'success' | 'fail' | 'pending'>('pending');
const paymentRecord = ref<PaymentRecord | null>(null);
const pollingInterval = ref<number | null>(null);

const formattedPaymentTime = computed(() =>
    paymentRecord.value?.paymentTime
        ? new Date(paymentRecord.value.paymentTime).toLocaleString()
        : ''
);

const fetchPayment = async () => {
  const paymentRecordId = route.query.paymentRecordId as string;
  if (!paymentRecordId) return;

  const res = await findPayment(paymentRecordId);
  if (!res?.code || res.code !== "200") {
    showToast(res?.message || "获取支付单失败");
    return;
  }

  paymentRecord.value = res.data;

  switch (paymentRecord.value.tradeStatus) {
    case 2: status.value = 'success'; stopPolling(); break;
    case 0:
    case 1: status.value = 'pending'; startPolling(); break;
    default: status.value = 'fail'; stopPolling(); break;
  }
};

const startPolling = () => {
  if (pollingInterval.value) return;
  pollingInterval.value = window.setInterval(async () => {
    const paymentRecordId = paymentRecord.value?.id;
    if (!paymentRecordId) return;

    const res = await findPayment(paymentRecordId);
    if (!res?.code || res.code !== "200") return;

    paymentRecord.value = res.data;

    if (paymentRecord.value.tradeStatus === 2) {
      status.value = 'success';
      stopPolling();
    } else if (paymentRecord.value.tradeStatus === 3) {
      status.value = 'fail';
      stopPolling();
    }
  }, 3000);
};

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

onMounted(() => {
  fetchPayment();
});

const onBack = () => router.back();
const onGoMember = () => router.push('/member');
const onRetry = () => router.replace('/order/pay' + window.location.search);
</script>

<style scoped lang="scss">
.pay-result-container {
  background: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .status-area {
    margin-top: 24px;
    margin-bottom: 40px; // 增加底部间距
    text-align: center;
    padding:1rem;

    .status-text {
      font-size: 22px;
      font-weight: bold;
      margin-top: 12px;
    }

    .success-wrapper {
      position: relative;
      width: 140px;
      height: 140px;
      margin: 0 auto;

      .circle-bg {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, #4cd964, #2ed1b6);
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        animation: pulse 1.5s infinite;
      }

      .checkmark {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: 80px; height: 80px;

        .check-circle {
          fill: none;
          stroke: rgba(255,255,255,0.3);
          stroke-width: 4;
        }

        .check {
          stroke: #fff;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: drawCheck 0.6s 0.4s forwards;
        }
      }
    }

    .fail-wrapper, .pending-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .result-card {
    margin: 0 12px 40px; // 卡片与顶部状态保持间距
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    width: 90%;
    text-align: center;

    .order-info {
      font-size: 16px;
      color: #555;
      margin: 12px 0;
      line-height: 1.6;

      .fail-info { color: #ff4444; }
    }

    .button-group { margin-top: 16px; }
  }
}

@keyframes drawCheck {
  to { stroke-dashoffset: 0; }
}

@keyframes pulse {
  0%, 100% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
}
</style>
