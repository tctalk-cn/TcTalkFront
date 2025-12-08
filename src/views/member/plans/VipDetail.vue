<template>
  <div class="vip-detail-container">
    <!-- 会员卡片轮播 -->
    <swiper
        ref="swiperRef"
        :slides-per-view="2"
        :space-between="10"
        effect="coverflow"
        :centered-slides="true"
        :loop="false"
        :coverflow-effect="{
        rotate: 30,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true
      }"
    >
      <swiper-slide
          v-for="(plan, index) in memberPlans"
          :key="index"
          class="plan-item"
      >
        <div class="card"
             :class="{ 'card-active': index === activeIndex }"
             @click="onCardClick(index)">
          <!-- 会员名称和类型 -->
          <div class="card-header">
            <div class="plan-name">{{ plan.memberPlan.planName }}</div>
            <div class="plan-type">{{ plan.memberPlan.planType }}</div>
          </div>

          <!-- 价格 -->
          <div class="card-prices">
            <div class="promotion-price">￥{{ plan.memberPlan.promotionPrice }}</div>
            <div class="original-price">原价: ￥{{ plan.memberPlan.originalPrice }}</div>
            <div class="renew-price">次月续费: ￥{{ plan.memberPlan.renewPrice }}</div>
          </div>

          <!-- 促销标签 -->
          <div v-if="plan.memberPlan.promotionLabelDesc" class="promotion-label">
            {{ plan.memberPlan.promotionLabelDesc }}
          </div>

          <!-- 说明 -->
          <div class="plan-desc">{{ plan.memberPlan.planDescription }}</div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- 底部协议 + 开通 -->
    <div class="vip-footer">
      <div class="agreement-wrapper">
        <label class="agreement">
          <input type="checkbox" v-model="checkedAgreement"/>
          我已阅读并同意《会员服务协议》
        </label>
      </div>

      <div class="button-wrapper">
        <van-button
            type="primary"
            block
            :disabled="!checkedAgreement"
            @click="onSubscribe"
        >
          开通会员
        </van-button>
      </div>
    </div>

    <!-- 会员权益对比表 -->
    <MemberBenefitsCompare
        :memberPlans="memberPlans"
        :activeIndex="activeIndex"
    />
    <!--帮助中心-->
    <HelpCenter/>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, computed} from 'vue';
import {useProfileStore} from '@/stores/member_store.js';
import {useRoute, useRouter} from 'vue-router';
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import {Button as VanButton, showToast, Toast} from 'vant';
import MemberBenefitsCompare from "@/views/member/plans/MemberBenefitsCompare.vue";
import HelpCenter from "@/views/member/plans/HelpCenter.vue";
import {useOrderStore} from "@/stores/order_store.ts";

const route = useRoute();
const {listEnabledPlans} = useProfileStore();
const {createVipOrder} = useOrderStore();

const swiperRef = ref<any>(null);
const activeIndex = ref(0);

const categoryCode = route.query.categoryCode as string;
const memberPlans = ref<any[]>([]);
const checkedAgreement = ref(false);
const router = useRouter();
onMounted(async () => {
  memberPlans.value = await listEnabledPlans(categoryCode);
})
// 计算选中的plan
const selectedPlan = computed(() => memberPlans.value[activeIndex.value]);

const onSubscribe = async () => {
  if (!checkedAgreement.value) return;
  // 安全校验：未加载完成
  if (!selectedPlan.value?.memberPlan?.id) {
    Toast.fail("请选择会员方案");
    return;
  }
  try {
    // 选中的方案信息
    const planId = selectedPlan.value.memberPlan.id;
    const creatorMemberId = selectedPlan.value.memberPlan.createBy;
    // 调用后端接口
    const res = await createVipOrder({
      creatorMemberId,
      planId,
    });

    if (!res?.code || res?.code !== "200") {
      showToast(res?.message || "创建订单失败");
      return;
    }
    // 拿到订单号
    const orderId = res.data.id;
    const orderNo = res.data.orderNo;

    // 跳转到订单确认/支付页
    await router.push({
      path: "/vipOrder/confirm",
      query: {
        orderId: orderId,
        orderNo: orderNo,
      },
    });

  } catch (err) {
    console.info(err);
    showToast('网络异常，请稍后重试');
  }
};

const onCardClick = (index: number) => {
  activeIndex.value = index;
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slideToLoop(index);
  }
};
</script>

<style scoped lang="scss">
.vip-detail-container {
  padding: 0.5rem;
  height: 100vh;
  overflow-y: auto;

  .plan-item {
    display: flex;
    justify-content: center;

    .card {
      width: 16rem;
      height: 16rem;
      background: linear-gradient(135deg, #2B7CFF, #63A8FF);
      color: #fff;
      border-radius: 1rem;
      padding: 1rem;
      box-shadow: 0 0.3rem 0.8rem rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      &.card-active {
        background: linear-gradient(135deg, #2B7CFF, #63A8FF);
        transform: scale(1.05);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
      }

      &:not(.card-active) {
        background: linear-gradient(135deg, #a0cfff, #83b8ff);
        transform: scale(0.95);
        opacity: 0.8;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .plan-name {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .plan-type {
          font-size: 0.6rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.1rem 0.5rem;
          border-radius: 0.8rem;
        }
      }

      .card-prices {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;

        .promotion-price {
          font-size: $font-size-lg;
          font-weight: bold;
        }

        .original-price {
          font-size: $font-size;
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.6);
        }

        .renew-price {
          font-size: $font-size;
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .promotion-label {
        display: inline-block;
        background: #ffe7b0;
        color: #ff9500;
        font-size: $font-size;
        padding: 0.1rem 0.5rem;
        border-radius: 0.5rem;
        margin-top: auto;
      }

      .plan-desc {
        font-size: $font-size;
        color: rgba(255, 255, 255, 0.9);
        margin-top: 4px;
      }
    }
  }

  .vip-footer {
    margin-top: 1rem;

    .agreement-wrapper {
      margin-bottom: 0.5rem;

      .agreement {
        display: flex;
        align-items: center;
        font-size: $font-size;
        color: #666;

        input[type="checkbox"] {
          margin-right: 0.5rem;
          width: 0.8rem;
          height: 0.8rem;
        }
      }
    }

    .button-wrapper .van-button {
      border-radius: 8px;
    }
  }

}
</style>
