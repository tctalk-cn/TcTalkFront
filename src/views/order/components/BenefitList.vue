<template>
  <div v-if="benefits?.length" class="benefit-section">
    <div class="section-title">会员权益</div>
    <div class="benefit-list">
      <div v-for="(b, index) in benefits" :key="index" class="benefit-card">
        <div class="benefit-header">
          <span class="benefit-name">{{ b.benefitName }}</span>
          <van-tag type="success">{{ b.benefitType }}</van-tag>
        </div>
        <div class="benefit-desc">{{ b.benefitDesc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "vue";
import {MemberBenefit} from "@/models/order.ts";

const props = defineProps({
  benefits: {
    type: Array as PropType<MemberBenefit[]>,
    default: () => []
  }
});
</script>

<style scoped lang="scss">
.benefit-section {
  margin: 12px;

  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .benefit-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .benefit-card {
      background: #fff;
      padding: 12px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);

      .benefit-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        .benefit-name {
          font-weight: 600;
          font-size: 14px;
        }
      }

      .benefit-desc {
        font-size: 13px;
        color: #666;
        line-height: 1.4;
      }
    }
  }
}
</style>
