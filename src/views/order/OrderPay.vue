<template>
  <div class="order-pay-container">
    <van-nav-bar
        title="订单支付"
        left-arrow
        @click-left="onBack"
    />

    <!-- 订单信息 -->
    <div class="order-info-card">
      <div class="order-title">{{ plan.planName }}</div>
      <div class="order-price">¥ {{ plan.promotionPrice }}</div>
      <div class="order-desc">{{ plan.planDescription }}</div>
    </div>

    <!-- 支付方式 -->
    <div class="pay-method-section">
      <div class="section-title">选择支付方式</div>
      <van-cell-group>
        <van-cell
            title="微信支付"
            clickable
            :class="{ active: payMethod === 'WECHAT' }"
            @click="payMethod = 'WECHAT'"
        >
          <template #right-icon>
            <van-icon name="wechat" />
          </template>
        </van-cell>

        <van-cell
            title="支付宝"
            clickable
            :class="{ active: payMethod === 'ALIPAY' }"
            @click="payMethod = 'ALIPAY'"
        >
          <template #right-icon>
            <van-icon name="alipay" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 支付按钮 -->
    <div class="submit-wrapper">
      <van-button type="primary" block @click="onPay">立即支付 ¥ {{ plan.promotionPrice }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';
import { useProfileStore } from '@/stores/member_store.js';

const route = useRoute();
const router = useRouter();
const { listEnabledPlans } = useProfileStore();

const plan = ref<any>({});
const payMethod = ref<'WECHAT' | 'ALIPAY'>('WECHAT');

onMounted(async () => {
  const categoryCode = route.query.categoryCode as string;
  const index = Number(route.query.index || 0);

  const plans = await listEnabledPlans(categoryCode);
  if (!plans || plans.length === 0) {
    Toast("没有可用的会员方案");
    return;
  }
  plan.value = plans[index].memberPlan;
});

const onBack = () => {
  router.back();
};

const onPay = () => {
  if (!plan.value.planId) return;

  Toast.loading("正在发起支付...");

  // 模拟支付接口
  setTimeout(() => {
    Toast.clear();
    // 假设支付成功，跳转到支付结果页
    router.replace({
      path: '/order/result',
      query: {
        status: 'success', // success / fail
        planName: plan.value.planName,
        price: plan.value.promotionPrice
      }
    });
  }, 1000);
};
</script>

<style scoped lang="scss">
.order-pay-container {
  background: #f8f8f8;
  height: 100vh;

  .order-info-card {
    background: #fff;
    margin: 12px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);

    .order-title { font-size: 18px; font-weight: bold; }
    .order-price { font-size: 20px; color: #ff4444; margin: 8px 0; font-weight: bold; }
    .order-desc { font-size: 14px; color: #555; line-height: 1.4; }
  }

  .pay-method-section {
    margin: 12px;
    .section-title { font-size: 16px; margin-bottom: 8px; }
    .van-cell.active { background: #e6f7ff; }
  }

  .submit-wrapper { margin: 20px 12px; }
}
</style>
