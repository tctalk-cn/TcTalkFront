<template>
  <div v-if="orderForConfirm" class="order-confirm-container">
    <!-- 顶部导航 -->
    <van-nav-bar
        title="确认订单"
        left-arrow
        @click-left="onBack"
        class="nav-bar"
    />

    <!-- 滚动内容 -->
    <div class="scroll-content">
      <!-- 商品信息卡片（含倒计时和优惠标签） -->
      <div class="card product-card">
        <div class="product-header">
          <div class="product-title">{{ orderForConfirm.productName }}</div>
          <div v-if="remainingSeconds > 0" class="expire-countdown">{{ countdownText }}</div>
        </div>

        <div class="product-cover-wrapper">
          <img
              :src="orderForConfirm.orderItemDTO?.skuImgUrl || defaultCover"
              alt="商品封面"
              class="product-cover"
          />
        </div>

        <div class="product-info">
          <span class="price-now">¥{{ orderForConfirm.orderItemDTO?.promotionAmount }}</span>
          <span class="price-origin">原价 ¥{{ orderForConfirm.orderItemDTO?.originalPrice }}</span>
        </div>

        <div v-if="orderForConfirm.orderVipExtDTO?.promotionLabelDesc" class="promo-tag">
          {{ orderForConfirm.orderVipExtDTO.promotionLabelDesc }}
        </div>

        <div class="product-desc">{{ orderForConfirm.productDesc }}</div>
      </div>

      <!-- 会员有效期 -->
      <div class="card duration-card">
        <div class="duration-text">有效期：{{ orderForConfirm.orderVipExtDTO.duration }} 月</div>
        <div class="duration-text">生效时间：支付后立即生效</div>
      </div>

      <!-- 会员权益 -->
      <BenefitList :benefits="orderForConfirm.orderVipExtDTO.benefits" class="card benefit-list"/>

      <!-- 自动续费提示 -->
      <AutoRenewNotice v-if="showAutoRenew"
                       :renewPrice="orderForConfirm.orderVipExtDTO.renewPrice"
      />
    </div>

    <!-- 底部固定支付区 -->
    <div class="bottom-pay">
      <!-- 支付方式 -->
      <div class="card pay-card">
        <div class="section-title">支付方式</div>
        <van-cell-group>
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
        </van-cell-group>
      </div>

      <!-- 合计金额 -->
      <div class="card total-card">
        <div class="total-text">应付金额：</div>
        <div class="total-price">¥ {{ orderForConfirm.amountPayable }}</div>
      </div>

      <!-- 协议 + 勾选 -->
      <div class="agreement-wrapper">
        <van-checkbox v-model="agree" shape="round" class="agree-checkbox">
          <span>我已阅读并同意</span>
          <span @click.stop="router.push('/vipOrder/protocol')" class="agreement-link">《会员服务协议》</span>
        </van-checkbox>
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
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {closeToast, showLoadingToast, showToast} from 'vant';
import {useOrderStore} from "@/stores/order_store.ts";
import {VipOrderDTO} from "@/models/order.ts";
import AutoRenewNotice from "@/views/order/components/AutoRenewNotice.vue";
import BenefitList from "@/views/order/components/BenefitList.vue";
import defaultCover from '@/assets/images/goods_default.png';
import {usePayStore} from "@/stores/pay_store.ts";

const route = useRoute();
const router = useRouter();
const {findVipOrderDetail} = useOrderStore();
const {generateRequestId, createAndPay} = usePayStore();
const showAutoRenew = ref(false);
const orderForConfirm = ref<VipOrderDTO>(null);
const agree = ref(false);
const payMethod = ref<'WECHAT' | 'ALIPAY'>('ALIPAY');
const submitting = ref(false);
// 倒计时
const remainingSeconds = ref(0);
const countdownText = ref('');
let timer: number | undefined;

onMounted(async () => {
  const orderId = route.query.orderId as string;
  const orderNo = route.query.orderNo as string;
  const res = await findVipOrderDetail(orderId, orderNo);
  if (!res?.code || res?.code !== "200") {
    showToast(res?.message || "获取订单明细失败");
    return;
  }
  orderForConfirm.value = res.data;

  // 自动续费显示
  if (orderForConfirm.value.orderVipExtDTO?.billingMode === 'RECURRING') {
    showAutoRenew.value = true;
  }

  // 支付倒计时
  if (orderForConfirm.value?.expireTime) {
    const expireTimestamp = new Date(orderForConfirm.value.expireTime).getTime();
    const now = Date.now();
    remainingSeconds.value = Math.max(Math.floor((expireTimestamp - now) / 1000), 0);
    updateCountdown();

    timer = window.setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
        updateCountdown();
      } else {
        countdownText.value = '已过期';
        clearInterval(timer);
      }
    }, 1000);
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

function updateCountdown() {
  const minutes = Math.floor(remainingSeconds.value / 60);
  const seconds = remainingSeconds.value % 60;
  countdownText.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const onBack = () => router.push("/orderCenter/orders");

const onSubmitOrder = async () => {
  if (!agree.value || submitting.value) {
    return;
  }

  // 显示加载
  const loading = showLoadingToast({
    message: "创建订单中...",
    forbidClick: true,  // 避免乱点
    duration: 0         // 不自动关闭
  });
  try {
    // 生成支付请求
    // 生成支付请求
    const res = await generateRequestId({
      orderId: orderForConfirm.value.id,
      orderNo: orderForConfirm.value.orderNo,
      channelCode: payMethod.value,
      bizType: 'PAY'
    });
    if (res?.code !== '200') {
      showToast(res?.message || '生成支付请求失败');
      submitting.value = false;
      return;
    }
    const requestId = res.data;

    const ret = await createAndPay({
      orderId: orderForConfirm.value.id,
      orderNo: orderForConfirm.value.orderNo,
      channelCode: payMethod.value,
      requestId: requestId,
      clientType: 'H5',
      bizType: 'PAY',
    });
    if (ret?.code !== '200') {
      showToast(res?.message || '创建支付单失败');
      submitting.value = false;
      return;
    }

    const payResponse = ret.data;
    if (payResponse.internalPaySuccess) {
      // 内部支付成功，刷新页面或跳转到支付结果页
      await router.push(`/order/paySuccess?recordId=${payResponse.paymentRecordId}`);
    } else if (payResponse.payUrl) {
      // 新窗口打开支付页面
      const payWindow = window.open("", "_blank");
      if (payWindow) {
        payWindow.document.write(payResponse.payUrl);
        payWindow.document.close();
      }
      // 自身跳转到支付状态页，轮询支付结果
      await router.replace({
        path: '/pay/paymentResult',
        query: {
          paymentRecordId: payResponse.paymentRecordId,
        }
      });
    }

  } finally {
    submitting.value = false;
    // 关闭 loading
    closeToast();
  }
};
</script>

<style scoped lang="scss">
.order-confirm-container {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 8rem;
  display: flex;
  flex-direction: column;
  height: 100vh;

  .scroll-content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 8rem;
  }

  .card {
    background: #fff;
    margin: 12px;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  /* 商品卡片 */
  .product-card {
    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .product-title {
        font-size: 18px;
        font-weight: bold;
      }

      .expire-countdown {
        font-size: 14px;
        color: #ff4444;
        font-weight: bold;
      }
    }

    .product-cover-wrapper {
      margin: 8px 0;
    }

    .product-cover {
      width: 100%;
      max-height: 180px;
      object-fit: cover;
      border-radius: 12px;
    }

    .product-info {
      display: flex;
      gap: 12px;
      font-size: 16px;
      margin: 8px 0;

      .price-now {
        color: #ff4444;
        font-weight: bold;
      }

      .price-origin {
        color: #999;
        text-decoration: line-through;
      }
    }

    .promo-tag {
      background: #ffece8;
      color: #ff4444;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 8px;
    }

    .product-desc {
      font-size: 14px;
      color: #555;
    }
  }

  .duration-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }

  .benefit-list {
    margin: 12px;
    padding: 12px;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  /* 底部支付 */
  .bottom-pay {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 0.5rem;
    border-radius: 0.5rem 0.5rem 0 0;
    box-shadow: 0 -0.1rem 0.6rem rgba(0, 0, 0, 0.1);

    .card {
      margin: 6px 0;
      padding: 10px;
    }

    .submit-wrapper {
      margin-top: 6px;
    }
  }

  .agreement-wrapper {
    margin: 8px 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .agree-checkbox {
      --icon-size: 8px; // 勾选框大小
      --icon-color: #ff4444; // 勾选颜色
      font-size: 14px; // 文本大小
      line-height: 1.5;
      margin-right: 6px;
    }

    .agreement-link {
      color: #1677FF;
      cursor: pointer;
    }
  }


  .van-cell.active {
    background-color: #fff7f6 !important;
  }

}
</style>
