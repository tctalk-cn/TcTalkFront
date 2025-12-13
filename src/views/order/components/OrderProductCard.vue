<template>
  <div class="card product-card">
    <div class="product-header">
      <div class="product-title">{{ productName }}</div>
      <div v-if="countdownText && countdownText !== '已过期'" class="expire-countdown">
        {{ countdownText }}
      </div>
      <div v-else-if="countdownText === '已过期'" class="expired-text">已过期</div>
    </div>

    <div class="product-cover-wrapper">
      <img :src="skuImgUrl || defaultCover" alt="商品封面" class="product-cover"/>
    </div>

    <div class="product-info">
      <span class="price-now">¥{{ promotionAmount }}</span>
      <span class="price-origin">原价 ¥{{ originalPrice }}</span>
    </div>

    <div v-if="promotionLabelDesc" class="promo-tag">
      {{ promotionLabelDesc }}
    </div>

    <div class="product-desc">{{ productDesc }}</div>
  </div>
</template>

<script setup lang="ts">
import defaultCover from '@/assets/images/goods_default.png'; // 确保路径正确

interface Props {
  mode?: 'confirm' | 'detail';
  productName: string;
  skuImgUrl?: string;
  promotionAmount?: string;
  originalPrice?: string;
  promotionLabelDesc?: string;
  productDesc?: string;
  countdownText?: string;
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

.product-card {
  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .product-title {
      font-size: 18px;
      font-weight: bold;
    }

    .expire-countdown {
      font-size: 14px;
      color: #ff4444;
      font-weight: bold;
    }

    .expired-text {
      font-size: 14px;
      color: #999;
    }
  }

  .product-cover-wrapper {
    margin: 8px 0;
  }

  .product-cover {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    border-radius: 12px;
  }

  .product-info {
    display: flex;
    gap: 12px;
    font-size: 16px;
    margin: 8px 0;

    .price-now {
      color: #ff4444;
      font-weight: bold;
    }

    .price-origin {
      color: #999;
      text-decoration: line-through;
    }
  }

  .promo-tag {
    background: #ffece8;
    color: #ff4444;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 8px;
  }

  .product-desc {
    font-size: 14px;
    color: #555;
  }
}
</style>