<template>
  <div class="auto-renew-card card">
    <van-icon name="warning" color="#ff9900" />
    <div class="renew-content">
      <div class="title">关于自动续费</div>
      <p class="desc">
        为了不中断会员服务，系统会在会员到期前自动扣费。已支付周期不受影响，可随时取消。
      </p>

      <ul class="info-list">
        <li>扣费金额：¥{{ renewPrice }} / 月</li>
        <li>扣费时间：会员有效期结束前 24 小时尝试自动扣费</li>
        <li>扣费方式：当前选择的支付方式（微信/支付宝）</li>
        <li>取消方法：我的 → 会员中心 → 自动续费</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  renewPrice: string | number;
}>();
</script>

<style scoped lang="scss">
.auto-renew-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff7f6;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  margin: 12px;

  .renew-content {
    flex: 1;

    .title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 6px;
    }

    .desc {
      font-size: 14px;
      color: #555;
      margin-bottom: 8px;
      line-height: 1.5;
    }

    .info-list {
      padding-left: 16px;
      list-style: disc;
      font-size: 14px;
      color: #444;

      li {
        margin-bottom: 4px;
      }
    }
  }
}
</style>
