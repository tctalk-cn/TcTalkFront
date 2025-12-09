<template>
  <div class="benefit-section" v-if="benefits?.length">
    <div class="section-title">会员权益</div>

    <div class="benefit-list">
      <div class="benefit-item" v-for="(b, index) in benefits" :key="index">
        <div class="benefit-text">{{ b.benefitName }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  benefits: Array<{ benefitName: string }>
}>();
</script>

<style scoped lang="scss">
.benefit-section {
  background: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 12px;

  .section-title {
    font-size: 16px;
    margin-bottom: 12px;
    font-weight: bold;
  }

  .benefit-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .benefit-item {
      font-size: 14px;
      color: #333;
    }
  }
}
</style>
