<template>
  <div class="card status-card">
    <div class="status-row">
      <span class="status">{{ statusText }}</span>
      <span v-if="warning" class="countdown flashing">
        {{ countdownText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  statusText: string
  countdownText?: string
  warning?: boolean
}>()
</script>

<style scoped lang="scss">
.status-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
}

.countdown {
  color: #f44336;
}

.flashing {
  animation: flash 1s infinite;
}

@keyframes flash {
  50% { opacity: 0.3; }
}
</style>
