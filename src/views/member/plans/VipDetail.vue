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
import {useRoute} from 'vue-router';
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import {Button as VanButton} from 'vant';
import MemberBenefitsCompare from "@/views/member/plans/MemberBenefitsCompare.vue";
import HelpCenter from "@/views/member/plans/HelpCenter.vue";

const route = useRoute();
const {listEnabledPlans} = useProfileStore();
const swiperRef = ref<any>(null);
const activeIndex = ref(0);

const categoryCode = route.query.categoryCode as string;
const memberPlans = ref<any[]>([]);
const checkedAgreement = ref(false);

onMounted(async () => {
  memberPlans.value = await listEnabledPlans(categoryCode);
});

// 生成所有可能的权益集合
const allBenefits = computed(() => {
  const benefitMap = new Map<string, any>();
  memberPlans.value.forEach(plan => {
    plan.benefits.forEach(b => {
      if (!benefitMap.has(b.benefitCode)) {
        benefitMap.set(b.benefitCode, b);
      }
    });
  });
  return Array.from(benefitMap.values());
});

// 判断某个 plan 是否包含某个权益
const planHasBenefit = (plan: any, benefit: any) => {
  return plan.benefits.some((b: any) => b.benefitCode === benefit.benefitCode);
};

const onSubscribe = () => {
  if (!checkedAgreement.value) return;
  console.log('开通会员', categoryCode);
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

        .plan-name { font-size: 1.2rem; font-weight: bold; }
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
        gap:0.1rem;

        .promotion-price { font-size: $font-size-lg; font-weight: bold; }
        .original-price { font-size: $font-size; text-decoration: line-through; color: rgba(255,255,255,0.6); }
        .renew-price { font-size: $font-size; color: rgba(255,255,255,0.8); }
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

      .plan-desc { font-size: $font-size; color: rgba(255,255,255,0.9); margin-top: 4px; }
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

        input[type="checkbox"] { margin-right: 0.5rem; width: 0.8rem; height: 0.8rem; }
      }
    }

    .button-wrapper .van-button { border-radius: 8px; }
  }

}
</style>
