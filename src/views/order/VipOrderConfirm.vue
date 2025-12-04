<template>
  <div class="order-confirm-container">
    <!-- 顶部栏 -->
    <van-nav-bar
        title="确认订单"
        left-arrow
        @click-left="onBack"
    />

    <!-- 商品信息 -->
    <div class="product-card">
      <div class="product-title">{{ plan.planName }}</div>
      <div class="product-info">
        <div class="price-now">¥ {{ plan.promotionPrice }}</div>
        <div class="price-origin">原价 ¥ {{ plan.originalPrice }}</div>
      </div>
      <div class="product-desc">{{ plan.planDescription }}</div>
    </div>

    <!-- 优惠信息 -->
    <div v-if="plan.promotionLabelDesc" class="promo-card">
      <van-tag type="warning">{{ plan.promotionLabelDesc }}</van-tag>
    </div>

    <!-- 支付方式 -->
    <div class="pay-method-section">
      <div class="section-title">支付方式</div>
      <van-cell-group>
        <van-cell
            title="微信支付"
            clickable
            :class="{ active: payMethod === 'WECHAT' }"
            @click="payMethod = 'WECHAT'"
        >
          <template #right-icon>
            <van-icon name="wechat"/>
          </template>
        </van-cell>

        <van-cell
            title="支付宝"
            clickable
            :class="{ active: payMethod === 'ALIPAY' }"
            @click="payMethod = 'ALIPAY'"
        >
          <template #right-icon>
            <van-icon name="alipay"/>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 合计 -->
    <div class="total-section">
      <div class="total-text">应付金额：</div>
      <div class="total-price">¥ {{ plan.promotionPrice }}</div>
    </div>

    <!-- 同意协议 -->
    <div class="agreement-wrapper">
      <label>
        <input type="checkbox" v-model="agree"/>
        我已阅读并同意《会员服务协议》
      </label>
    </div>

    <!-- 提交订单 -->
    <div class="submit-wrapper">
      <van-button
          type="primary"
          block
          :disabled="!agree"
          @click="onSubmitOrder"
      >
        提交订单
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {Toast} from 'vant';
import {useProfileStore} from '@/stores/member_store.js';

const route = useRoute();
const router = useRouter();
const {listEnabledPlans} = useProfileStore();

// --- 页面状态 ---
const plan = ref<any>({});
const agree = ref(false);
const payMethod = ref<'WECHAT' | 'ALIPAY'>('WECHAT');

// 加载用户选择的会员方案
onMounted(async () => {
  const orderId = route.query.orderId as string;
  const orderNo = route.query.orderNo as string;
  console.info(orderId);
  console.info(orderNo);
  const index = Number(route.query.index || 0);

  const plans = await listEnabledPlans(orderId);
  if (!plans || plans.length === 0) {
    Toast("没有可用的会员方案");
    return;
  }
  plan.value = plans[index].memberPlan;
});

// 返回
const onBack = () => {
  router.back();
};

// 提交订单
const onSubmitOrder = () => {
  if (!agree.value) return;

  // 这里发起后台创建订单请求
  console.log("创建订单:", {
    payMethod: payMethod.value,
    plan: plan.value,
  });

  Toast.loading("创建订单中...");

  // 假设创建成功，跳转到支付页
  setTimeout(() => {
    Toast.clear();
    router.push({
      path: "/order/pay",
      query: {
        planId: plan.value.planId,
        payMethod: payMethod.value,
      },
    });
  }, 800);
};
</script>

<style scoped lang="scss">
.order-confirm-container {
  background: #f8f8f8;
  height: 100vh;

  .product-card {
    background: #fff;
    margin: 12px;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .product-title {
      font-size: 18px;
      font-weight: bold;
    }

    .product-info {
      margin: 8px 0;
      display: flex;
      gap: 10px;

      .price-now {
        font-size: 20px;
        color: #ff4444;
        font-weight: bold;
      }

      .price-origin {
        font-size: 14px;
        text-decoration: line-through;
        color: #999;
      }
    }

    .product-desc {
      font-size: 14px;
      color: #555;
      line-height: 1.4;
    }
  }

  .promo-card {
    margin: 0 12px 12px 12px;
  }

  .pay-method-section {
    margin: 12px;

    .section-title {
      font-size: 16px;
      margin-bottom: 8px;
    }

    .van-cell.active {
      background: #e6f7ff;
    }
  }

  .total-section {
    margin: 16px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;

    .total-price {
      color: #ff4444;
      font-weight: bold;
    }
  }

  .agreement-wrapper {
    margin: 0 16px;
    font-size: 14px;
    color: #666;

    input {
      margin-right: 4px;
    }
  }

  .submit-wrapper {
    margin: 20px 16px;
  }
}
</style>
