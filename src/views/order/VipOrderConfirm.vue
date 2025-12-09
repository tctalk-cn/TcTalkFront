<template>
  <div v-if="orderForConfirm" class="order-confirm-container">
    <!-- 顶部导航 -->
    <van-nav-bar
        title="确认订单"
        left-arrow
        @click-left="onBack"
        class="nav-bar"
    />

    <!-- 商品封面 -->
    <div class="product-cover-wrapper">
      <img
          :src="orderForConfirm.orderItemDTO?.skuImgUrl || defaultCover"
          alt="商品封面"
          class="product-cover"
      />
    </div>

    <!-- 商品信息卡片 -->
    <div class="card product-card">
      <div class="product-title">{{ orderForConfirm.productName }}</div>
      <div class="product-info">
        <span class="price-now">¥{{ orderForConfirm.orderItemDTO?.promotionAmount }}</span>
        <span class="price-origin">原价 ¥{{ orderForConfirm.orderItemDTO?.originalPrice }}</span>
      </div>
      <div class="product-desc">{{ orderForConfirm.productDesc }}</div>
    </div>

    <!-- 优惠标签 -->
    <div v-if="orderForConfirm.orderVipExtDTO?.promotionLabelDesc" class="promo-card card">
      <van-tag type="danger" class="promo-tag">{{ orderForConfirm.orderVipExtDTO.promotionLabelDesc }}</van-tag>
    </div>

    <!-- 自动续费提示 -->
    <AutoRenewNotice
        v-model:show="showAutoRenew"
        :renewPrice="orderForConfirm.orderVipExtDTO.renewPrice"
    />

    <!-- 会员有效期卡片 -->
    <div class="card duration-card">
      <div class="duration-text">有效期：{{ orderForConfirm.orderVipExtDTO.duration }} 月</div>
      <div class="duration-text">生效时间：支付后立即生效</div>
    </div>

    <!-- 会员权益卡片 -->
    <BenefitList :benefits="orderForConfirm.orderVipExtDTO.benefits" class="card"/>

    <!-- 支付方式卡片 -->
    <div class="card pay-card">
      <div class="section-title">支付方式</div>
      <van-cell-group>
        <van-cell
            title="微信支付"
            clickable
            :class="{ active: payMethod === 'WECHAT' }"
            @click="payMethod = 'WECHAT'"
        >
          <template #right-icon>
            <van-icon name="wechat" color="#1AAD19"/>
          </template>
        </van-cell>

        <van-cell
            title="支付宝"
            clickable
            :class="{ active: payMethod === 'ALIPAY' }"
            @click="payMethod = 'ALIPAY'"
        >
          <template #right-icon>
            <van-icon name="alipay" color="#1677FF"/>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 合计金额卡片 -->
    <div class="card total-card">
      <div class="total-text">应付金额：</div>
      <div class="total-price">¥ {{ orderForConfirm.amountPayable }}</div>
    </div>

    <!-- 协议 -->
    <div class="agreement-wrapper">
      <span @click="router.push('/protocol')" class="agreement-link">
        《会员服务协议》
      </span>
    </div>

    <!-- 提交订单按钮 -->
    <div class="submit-wrapper">
      <van-button
          type="primary"
          block
          round
          color="#ff4444"
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
import {showToast, Toast} from 'vant';
import {useOrderStore} from "@/stores/order_store.ts";
import {VipOrderDTO} from "@/models/order.ts";
import AutoRenewNotice from "@/views/order/components/AutoRenewNotice.vue";
import BenefitList from "@/views/order/components/BenefitList.vue";

const route = useRoute();
const router = useRouter();
const {findVipOrderDetail} = useOrderStore();
const showAutoRenew = ref(false);
const plan = ref<any>({});
const orderForConfirm = ref<VipOrderDTO>(null);
const agree = ref(false);
const payMethod = ref<'WECHAT' | 'ALIPAY'>('WECHAT');
import defaultCover from '@/assets/images/goods_default.png';

onMounted(async () => {
  const orderId = route.query.orderId as string;
  const orderNo = route.query.orderNo as string;
  const res = await findVipOrderDetail(orderId, orderNo);
  if (!res?.code || res?.code !== "200") {
    showToast(res?.message || "获取订单明细失败");
    return;
  }
  orderForConfirm.value = res.data;
  // 如果是自动续费计划，显示弹窗
  if (orderForConfirm.value.orderVipExtDTO?.billingMode === 'RECURRING') {
    showAutoRenew.value = true;
  }
});

const onBack = () => router.back();

const onSubmitOrder = () => {
  if (!agree.value) return;
  Toast.loading("创建订单中...");
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
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 16px;

  .card {
    background: #fff;
    margin: 12px;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .product-cover-wrapper {
    text-align: center;
    margin: 12px;
    img.product-cover {
      width: 100%;
      max-height: 180px;
      border-radius: 16px;
      object-fit: cover;
    }
  }

  .product-card .product-title {
    font-size: 18px;
    font-weight: bold;
  }

  .product-info {
    display: flex;
    align-items: baseline;
    margin: 8px 0;
    gap: 12px;
  }

  .price-now {
    font-size: 22px;
    font-weight: bold;
    color: #ff4444;
  }

  .price-origin {
    font-size: 14px;
    color: #999;
    text-decoration: line-through;
  }

  .product-desc {
    font-size: 14px;
    color: #555;
    line-height: 1.5;
  }

  .promo-tag {
    font-size: 13px;
    padding: 2px 6px;
  }

  .duration-card, .total-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }

  .total-price {
    font-size: 20px;
    color: #ff4444;
    font-weight: bold;
  }

  .pay-card .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .agreement-wrapper {
    margin: 8px 16px;
    text-align: right;
    font-size: 14px;

    .agreement-link {
      color: #1677FF;
      cursor: pointer;
    }
  }

  .submit-wrapper {
    margin: 16px;
  }

  .van-cell.active {
    background-color: #fff7f6 !important;
  }
}
</style>
