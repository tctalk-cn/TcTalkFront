<template>
  <div class="card duration-card">
    <div class="duration-text">有效期：{{ duration }} 月</div>
    <div class="duration-text">生效时间：支付后立即生效</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  duration: number; // 假设 duration 是月份数
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.card {
  background: #fff;
  margin: 12px;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.duration-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}
</style>