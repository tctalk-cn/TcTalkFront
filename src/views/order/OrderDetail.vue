<template>
  <div v-if="vipOrder" class="order-detail-container">
    <HeaderTop go-back="true" head-title="订单详情"/>

    <div class="scroll-content">

      <!-- 顶部状态 -->
      <OrderStatusHero
          :order-status="vipOrder.orderStatus"
          :payment-status="vipOrder.paymentStatus"
          :countdown-text="displayStatus === 'WAIT_PAY' ? countdownText : ''"
      />

      <!-- 商品卡片 -->
      <OrderProductCard
          orderType="vip"
          :productName="vipOrder.productName"
          :skuImgUrl="vipOrder.orderItemDTO?.skuImgUrl"
          :promotionAmount="vipOrder.orderItemDTO?.promotionAmount"
          :originalPrice="vipOrder.orderItemDTO?.originalPrice"
          :promotionLabelDesc="vipOrder.orderVipExtDTO?.promotionLabelDesc"
          :productDesc="vipOrder.productDesc"
          :display-status="displayStatus"
          :countdownText="countdownText"
      />

      <OrderDurationCard
          v-if="vipOrder.orderVipExtDTO"
          :duration="vipOrder.orderVipExtDTO.duration"
      />

      <BenefitList
          v-if="vipOrder.orderVipExtDTO"
          :benefits="vipOrder.orderVipExtDTO.benefits"
          class="card"
      />

      <AutoRenewNotice
          v-if="vipOrder.orderVipExtDTO?.billingMode === 'RECURRING'"
          :renewPrice="vipOrder.orderVipExtDTO.renewPrice"
      />

      <OrderBaseInfoCard :order="vipOrder"/>
    </div>

    <!-- 底部操作 -->
    <OrderDetailActionBar
        :show-pay="showPay"
        :show-cancel="showPay"
        @pay="handlePay(vipOrder)"
        @cancel="handleCancel(vipOrder)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

import HeaderTop from '@/components/layout/header/HeaderTop.vue'
import OrderStatusHero from '@/views/order/components/OrderStatusHero.vue'
import OrderProductCard from '@/views/order/components/OrderProductCard.vue'
import OrderDurationCard from '@/views/order/components/OrderDurationCard.vue'
import BenefitList from '@/views/order/components/BenefitList.vue'
import AutoRenewNotice from '@/views/order/components/AutoRenewNotice.vue'
import OrderBaseInfoCard from '@/views/order/components/OrderBaseInfoCard.vue'
import OrderDetailActionBar from '@/views/order/components/OrderDetailActionBar.vue'

import { useOrderStore } from '@/stores/order_store'
import { VipOrderDTO } from '@/models/order'

// ================== 页面状态 ===================
type DisplayStatus =
    | 'WAIT_PAY'
    | 'PAYING'
    | 'SUCCESS'
    | 'FAILED'
    | 'CLOSED'

const route = useRoute()
const router = useRouter()
const { findVipOrderDetail } = useOrderStore()

const vipOrder: Ref<VipOrderDTO | null> = ref(null)

// ================== 前端展示态 ===================
const displayStatus = computed<DisplayStatus>(() => {
  if (!vipOrder.value) return 'WAIT_PAY'

  const { orderStatus, paymentStatus } = vipOrder.value

  if (orderStatus === 3 || orderStatus === 8) return 'SUCCESS'
  if (orderStatus === 4 || orderStatus === 7) return 'FAILED'
  if (orderStatus === 5 || orderStatus === 6) return 'CLOSED'

  if (
      paymentStatus === 10 ||
      paymentStatus === 11 ||
      paymentStatus === 20
  ) {
    return 'PAYING'
  }

  return 'WAIT_PAY'
})

// ================== 支付按钮 ===================
const showPay = computed(() => displayStatus.value === 'WAIT_PAY')

// ================== 倒计时 ===================
const remainingSeconds = ref(0)
const countdownText = ref('')
let timer: number | undefined

function initCountdown() {
  if (!vipOrder.value) return

  //非待支付状态，不显示倒计时
  if (displayStatus.value !== 'WAIT_PAY') {
    countdownText.value = ''
    remainingSeconds.value = 0
    return
  }

  if (!vipOrder.value.expireTime) return

  const expireTimestamp = new Date(vipOrder.value.expireTime).getTime()
  const now = Date.now()
  remainingSeconds.value = Math.max(
      Math.floor((expireTimestamp - now) / 1000),
      0
  )

  updateCountdown()

  if (remainingSeconds.value > 0) {
    timer = window.setInterval(() => {
      remainingSeconds.value--
      updateCountdown()

      if (remainingSeconds.value <= 0 && timer) {
        clearInterval(timer)
      }
    }, 1000)
  }
}

function updateCountdown() {
  if (displayStatus.value !== 'WAIT_PAY') {
    countdownText.value = ''
    return
  }

  if (remainingSeconds.value <= 0) {
    countdownText.value = '已过期'
    return
  }

  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  countdownText.value = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
}

// ================== 生命周期 ===================
onMounted(async () => {
  const orderId = route.query.orderId as string
  const orderNo = route.query.orderNo as string

  if (timer) clearInterval(timer)

  const res = await findVipOrderDetail(orderId, orderNo)

  if (res?.code !== '200' || !res.data) {
    showToast(res?.message || '获取订单失败')
    await router.replace('/orderCenter/orders')
    return
  }

  vipOrder.value = res.data
  initCountdown()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ================== 操作 ===================
const handlePay = (order: VipOrderDTO) => {
  router.push({
    path: '/vipOrder/confirm',
    query: {
      orderId: order.id,
      orderNo: order.orderNo,
    },
  })
}

const handleCancel = (order: VipOrderDTO) => {
  // TODO
}
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
}
</style>
