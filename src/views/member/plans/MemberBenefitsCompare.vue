<template>
  <div class="benefit-compare">
    <!-- 标题 -->
    <div class="benefit-title">会员权益对比</div>

    <table>
      <thead>
      <tr>
        <th>权益</th>
        <th v-for="(plan, index) in memberPlans" :key="index"
            :class="{ 'active-column': index === activeIndex }">
          {{ plan.memberPlan.planName }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="benefit in allBenefits" :key="benefit.benefitCode"
          :class="{ 'active-row': activeIndexRow === benefit.benefitCode }">
        <td>{{ benefit.benefitName }}</td>
        <td v-for="(plan, index) in memberPlans" :key="index"
            :class="{ 'active-column': index === activeIndex }">
          <span v-if="planHasBenefit(plan, benefit)">✔</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps} from 'vue';

interface Benefit {
  benefitCode: string;
  benefitName: string;
}

interface Plan {
  memberPlan: any;
  benefits: Benefit[];
}

const props = defineProps<{
  memberPlans: Plan[];
  activeIndex: number;
}>();

// 生成所有可能的权益集合
const allBenefits = computed(() => {
  const benefitMap = new Map<string, Benefit>();
  props.memberPlans.forEach(plan => {
    plan.benefits.forEach(b => {
      if (!benefitMap.has(b.benefitCode)) {
        benefitMap.set(b.benefitCode, b);
      }
    });
  });
  return Array.from(benefitMap.values());
});

// 判断某个 plan 是否包含某个权益
const planHasBenefit = (plan: Plan, benefit: Benefit) => {
  return plan.benefits.some(b => b.benefitCode === benefit.benefitCode);
};
</script>

<style scoped lang="scss">
.benefit-compare {
  margin-top: 1rem;
  overflow-x: auto;

  .benefit-title {
    font-size: $font-size-mx;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  table {
    width: 98%;
    border-collapse: collapse;
    font-size: $font-size-sm;

    th, td {
      border: 0.02rem solid #ddd;
      padding: 0.1rem 0.1rem;
      text-align: center;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    .active-column {
      background-color: #d0ebff;
    }

    .active-row {
      background-color: #ffecec; /* 浅红色选中行 */
    }
  }
}
</style>
