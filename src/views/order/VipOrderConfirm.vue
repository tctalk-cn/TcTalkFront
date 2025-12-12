<template>
  <div v-if="orderForConfirm" class="order-confirm-container">
    <HeaderTop go-back="true" head-title="确认订单">
    </HeaderTop>
    <div class="scroll-content">
      <OrderProductCard
          :productName="orderForConfirm.productName"
          :skuImgUrl="orderForConfirm.orderItemDTO?.skuImgUrl"
          :promotionAmount="orderForConfirm.orderItemDTO?.promotionAmount"
          :originalPrice="orderForConfirm.orderItemDTO?.originalPrice"
          :promotionLabelDesc="orderForConfirm.orderVipExtDTO?.promotionLabelDesc"
          :productDesc="orderForConfirm.productDesc"
          :countdownText="countdownText"
      />

      <OrderDurationCard :duration="orderForConfirm.orderVipExtDTO.duration"/>

      <BenefitList :benefits="orderForConfirm.orderVipExtDTO.benefits" class="card benefit-list"/>

      <AutoRenewNotice v-if="showAutoRenew"
                       :renewPrice="orderForConfirm.orderVipExtDTO.renewPrice"
      />
    </div>

    <OrderPayBar
        :amountPayable="orderForConfirm.amountPayable"
        :payMethod="payMethod"
        :agree="agree"
        :submitting="submitting"
        @update:payMethod="handlePayMethodChange"
        @update:agree="handleAgreeChange"
        @submit-order="onSubmitOrder"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, type Ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {closeToast, showLoadingToast, showToast} from 'vant';
import {useOrderStore} from "@/stores/order_store.ts";
import {VipOrderDTO} from "@/models/order.ts";
import AutoRenewNotice from "@/views/order/components/AutoRenewNotice.vue";
import BenefitList from "@/views/order/components/BenefitList.vue";
import {usePayStore} from "@/stores/pay_store.ts";

// 导入抽象的子组件
import OrderProductCard from '@/views/order/components/OrderProductCard.vue';
import OrderDurationCard from '@/views/order/components/OrderDurationCard.vue';
import OrderPayBar from '@/views/order/components/OrderPayBar.vue';
import HeaderTop from "@/components/layout/header/HeaderTop.vue";

const route = useRoute();
const router = useRouter();
const {findVipOrderDetail} = useOrderStore();
const {generateRequestId, createAndPay} = usePayStore();

const showAutoRenew = ref(false);
const orderForConfirm: Ref<VipOrderDTO | null> = ref(null);
const agree = ref(false);
const payMethod = ref<'WECHAT' | 'ALIPAY'>('ALIPAY');
const submitting = ref(false);

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

  orderForConfirm.value = res.data;

  // 自动续费显示
  if (orderForConfirm.value.orderVipExtDTO?.billingMode === 'RECURRING') {
    showAutoRenew.value = true;
  }

  // 支付倒计时
  if (orderForConfirm.value.expireTime) {
    const expireTimestamp = new Date(orderForConfirm.value.expireTime).getTime();
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

const onSubmitOrder = async () => {
  if (!agree.value) {
    showToast('请阅读并同意《会员服务协议》');
    return;
  }

  if (submitting.value) {
    return;
  }

  if (remainingSeconds.value <= 0) {
    showToast('当前订单已过期，请重新下单');
    return;
  }

  submitting.value = true;

  const loading = showLoadingToast({
    message: "创建支付单中...",
    forbidClick: true,
    duration: 0
  });

  try {
    const order = orderForConfirm.value!;

    // 1. 生成支付请求 ID
    const reqRes = await generateRequestId({
      orderId: order.id,
      orderNo: order.orderNo,
      channelCode: payMethod.value,
      bizType: 'PAY'
    });

    if (reqRes?.code !== '200') {
      showToast(reqRes?.message || '生成支付请求失败');
      return;
    }
    const requestId = reqRes.data;

    // 2. 创建支付单并支付
    const payRes = await createAndPay({
      orderId: order.id,
      orderNo: order.orderNo,
      channelCode: payMethod.value,
      requestId: requestId,
      clientType: 'H5',
      bizType: 'PAY',
    });

    if (payRes?.code !== '200') {
      showToast(payRes?.message || '创建支付单失败');
      return;
    }

    const payResponse = payRes.data;

    if (payResponse.internalPaySuccess) {
      // 内部支付成功
      await router.push(`/order/paySuccess?recordId=${payResponse.paymentRecordId}`);
    } else if (payResponse.payUrl) {
      // 外部 H5 支付
      const payWindow = window.open("", "_blank");
      if (payWindow) {
        payWindow.document.write(payResponse.payUrl);
        payWindow.document.close();
      } else {
        showToast('支付页面未能自动打开，请检查浏览器设置');
      }

      // 自身跳转到支付状态页
      await router.replace({
        path: '/pay/paymentResult',
        query: {
          paymentRecordId: payResponse.paymentRecordId,
        }
      });
    }

  } catch (error) {
    console.error("支付提交异常:", error);
    showToast("网络错误，请稍后重试");
  } finally {
    closeToast();
    submitting.value = false;
  }
};
</script>

<style scoped lang="scss">
.order-confirm-container {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 8rem; // 留出底部 PayBar 的空间
  display: flex;
  flex-direction: column;
  height: 100vh;

  .scroll-content {
    flex: 1;
    overflow-y: auto;
  }

  .card {
    background: #fff;
    margin: 12px;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .benefit-list {
    margin: 12px;
    padding: 12px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}
</style>