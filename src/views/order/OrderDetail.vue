<template>
  <div v-if="orderBasic" class="order-detail-container">
    <HeaderTop go-back="true" head-title="订单详情" />

    <div class="scroll-content">
      <!-- 订单状态 -->
<!--      <OrderStatusCard-->
<!--          :status-text="test"-->
<!--          :countdown-text="countdownText"-->
<!--          :warning="true"-->
<!--      />-->

      <!-- 商品信息（复用确认订单） -->
      <OrderProductCard
          :productName="orderBasic.productName"
          :skuImgUrl="orderBasic.orderItemDTO?.skuImgUrl"
          :promotionAmount="orderBasic.orderItemDTO?.promotionAmount"
          :originalPrice="orderBasic.orderItemDTO?.originalPrice"
          :promotionLabelDesc="orderBasic.orderVipExtDTO?.promotionLabelDesc"
          :productDesc="orderBasic.productDesc"
      />

      <!-- VIP 才有 -->
      <OrderDurationCard
          v-if="orderBasic.orderVipExtDTO"
          :duration="orderBasic.orderVipExtDTO.duration"
      />

      <BenefitList
          v-if="orderBasic.orderVipExtDTO"
          :benefits="orderBasic.orderVipExtDTO.benefits"
          class="card"
      />

      <AutoRenewNotice
          v-if="orderBasic.orderVipExtDTO?.billingMode === 'RECURRING'"
          :renewPrice="orderBasic.orderVipExtDTO.renewPrice"
      />

      <!-- 基础信息 -->
      <OrderBaseInfoCard :order="orderBasic" />
    </div>

    <!-- 底部操作 -->
    <OrderDetailActionBar
        :show-pay="true"
        :show-cancel="true"
        @pay="onPay"
        @cancel="onCancel"
    />
  </div>
</template>


<script setup lang="ts">
import {ref, onMounted, onUnmounted, type Ref} from 'vue';

// 导入抽象的子组件
import OrderProductCard from '@/views/order/components/OrderProductCard.vue';
import OrderDurationCard from '@/views/order/components/OrderDurationCard.vue';
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {useRoute, useRouter} from "vue-router";
import {useOrderStore} from "@/stores/order_store.ts";
import {VipOrderDTO} from "@/models/order.ts";
import {showToast} from "vant";
import BenefitList from "@/views/order/components/BenefitList.vue";
import AutoRenewNotice from "@/views/order/components/AutoRenewNotice.vue";
import OrderBaseInfoCard from "@/views/order/components/OrderBaseInfoCard.vue";
import OrderDetailActionBar from "@/views/order/components/OrderDetailActionBar.vue";

const route = useRoute();
const router = useRouter();
const {findVipOrderDetail} = useOrderStore();

const showAutoRenew = ref(false);
const orderBasic: Ref<VipOrderDTO | null> = ref(null);
const agree = ref(false);
const payMethod = ref<'WECHAT' | 'ALIPAY'>('ALIPAY');

// 倒计时状态
const remainingSeconds = ref(0);
const countdownText = ref('');
let timer: number | undefined;

// --- 生命周期与数据获取 ---

onMounted(async () => {
  const orderId = route.query.orderId as string;
  const orderNo = route.query.orderNo as string;

  if (timer) clearInterval(timer);

  const res = await findVipOrderDetail(orderId, orderNo);

  if (!res?.code || res?.code !== "200" || !res.data) {
    showToast(res?.message || "获取订单明细失败，请重试");
    await router.replace("/orderCenter/orders");
    return;
  }

  orderBasic.value = res.data;

  // 自动续费显示
  if (orderBasic.value.orderVipExtDTO?.billingMode === 'RECURRING') {
    showAutoRenew.value = true;
  }

  // 支付倒计时
  if (orderBasic.value.expireTime) {
    const expireTimestamp = new Date(orderBasic.value.expireTime).getTime();
    const now = Date.now();
    // 确保剩余秒数不为负
    remainingSeconds.value = Math.max(Math.floor((expireTimestamp - now) / 1000), 0);

    updateCountdown();

    if (remainingSeconds.value > 0) {
      timer = window.setInterval(() => {
        if (remainingSeconds.value > 0) {
          remainingSeconds.value--;
          updateCountdown();
        } else {
          countdownText.value = '已过期';
          clearInterval(timer);
          // 订单过期后，可以考虑禁用按钮或弹出提示
        }
      }, 1000);
    } else {
      countdownText.value = '已过期';
    }
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

// --- 事件与逻辑处理 ---

function updateCountdown() {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  countdownText.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 子组件 emit 更新
const handlePayMethodChange = (method: 'WECHAT' | 'ALIPAY') => {
  payMethod.value = method;
};
const handleAgreeChange = (value: boolean) => {
  agree.value = value;
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
