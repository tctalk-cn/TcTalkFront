<template>
  <div class="vip-detail-container">
    <swiper
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
          <div v-if="plan.memberPlan.promotionLabel" class="promotion-label">
            {{ plan.memberPlan.promotionLabel }}
          </div>

          <!-- 说明 -->
          <div class="plan-desc">{{ plan.memberPlan.planDescription }}</div>
        </div>
      </swiper-slide>
    </swiper>

    <!-- 底部协议 + 开通 -->
    <div class="vip-footer">
      <!-- checkbox 单独一行 -->
      <div class="agreement-wrapper">
        <label class="agreement">
          <input type="checkbox" v-model="checkedAgreement"/>
          我已阅读并同意《会员服务协议》
        </label>
      </div>

      <!-- 按钮单独一行 -->
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
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useProfileStore} from '@/stores/member_store.js';
import {useRoute} from 'vue-router';
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import {Button as VanButton} from 'vant';

const route = useRoute();
const {listEnabledPlans} = useProfileStore();
const swiperRef = ref<any>(null);
const activeIndex = ref(0); // 当前选中卡片

const categoryCode = route.query.categoryCode as string;
const memberPlans = ref<any[]>([]);
const checkedAgreement = ref(false);

onMounted(async () => {
  memberPlans.value = await listEnabledPlans(categoryCode);
});

const onSubscribe = () => {
  if (!checkedAgreement.value) return;
  console.log('开通会员', categoryCode);
};

const onCardClick = (index: number) => {
  activeIndex.value = index;
  // 同步 Swiper 的当前 slide
  if (swiperRef.value && swiperRef.value.swiper) {
    swiperRef.value.swiper.slideToLoop(index); // 使用 slideToLoop 支持 loop 模式
  }
};
</script>

<style scoped lang="scss">
.vip-detail-container {
  padding: 0.5rem;

  .plan-item {
    display: flex;
    justify-content: center;

    .card {
      width: 220px;
      height: 220px;
      background: linear-gradient(135deg, #2B7CFF, #63A8FF);
      color: #fff;
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      gap: 6px;

      &.card-active {
        background: linear-gradient(135deg, #2B7CFF, #63A8FF); /* 高亮颜色 */
        transform: scale(1.05); /* 放大效果 */
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
      }

      &:not(.card-active) {
        background: linear-gradient(135deg, #a0cfff, #83b8ff); /* 未选中颜色淡化 */
        transform: scale(0.95);
        opacity: 0.8;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .plan-name {
          font-size: 14px;
          font-weight: bold;
        }

        .plan-type {
          font-size: 8px;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 12px;
        }
      }

      .card-prices {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .promotion-price {
          font-size: 18px;
          font-weight: bold;
        }

        .original-price {
          font-size: 12px;
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.6);
        }

        .renew-price {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .promotion-label {
        display: inline-block;
        background: #ffe7b0;
        color: #ff9500;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 6px;
        margin-top: auto; /* 推到卡片底部 */
      }

      .plan-desc {
        font-size: 12px;
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
        font-size: 12px;
        color: #666;

        input[type="checkbox"] {
          margin-right: 6px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .button-wrapper {
      .van-button {
        border-radius: 8px;
      }
    }
  }
}
</style>
