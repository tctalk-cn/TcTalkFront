<template>
  <div class="bottom-pay">
    <div class="card pay-card">
      <div class="section-title">支付方式</div>
      <van-cell-group :border="false">
        <van-cell
            title="支付宝"
            clickable
            :class="{ active: payMethod === 'ALIPAY' }"
            @click="$emit('update:payMethod', 'ALIPAY')"
            :border="false"
        >
          <template #right-icon>
            <van-icon name="alipay" color="#1677FF"/>
          </template>
        </van-cell>
        <van-cell
            title="微信支付"
            clickable
            :class="{ active: payMethod === 'WECHAT' }"
            @click="$emit('update:payMethod', 'WECHAT')"
            :border="false"
        >
          <template #right-icon>
            <van-icon name="wechat" color="#1AAD19"/>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <div class="card total-card">
      <div class="total-text">应付金额：</div>
      <div class="total-price">¥ {{ amountPayable }}</div>
    </div>

    <div class="agreement-wrapper">
      <van-checkbox :model-value="agree" @update:model-value="$emit('update:agree', $event)" shape="round" class="agree-checkbox">
        <span>我已阅读并同意</span>
        <span @click.stop="router.push('/vipOrder/protocol')" class="agreement-link">《会员服务协议》</span>
      </van-checkbox>
    </div>

    <div class="submit-wrapper">
      <van-button
          type="primary"
          block
          round
          color="#ff4444"
          :disabled="!agree || submitting"
          :loading="submitting"
          @click="$emit('submit-order')"
      >
        提交订单
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

interface Props {
  amountPayable?: string;
  payMethod: 'WECHAT' | 'ALIPAY';
  agree: boolean;
  submitting: boolean;
}

defineProps<Props>();

// 定义 Emits
defineEmits<{
  (e: 'update:payMethod', method: 'WECHAT' | 'ALIPAY'): void;
  (e: 'update:agree', value: boolean): void;
  (e: 'submit-order'): void;
}>();
</script>

<style scoped lang="scss">
.bottom-pay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem 0.5rem 0 0;
  box-shadow: 0 -0.1rem 0.6rem rgba(0, 0, 0, 0.1);

  .card {
    background: #fff;
    margin: 6px 0;
    padding: 10px;
    border-radius: 8px;
    box-shadow: none; // 底部栏卡片阴影去除
    border: 1px solid #eee;
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .submit-wrapper {
    margin-top: 6px;
  }

  .total-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: bold;

    .total-price {
      color: #ff4444;
    }
  }

  .agreement-wrapper {
    margin: 8px 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    // Vant Cell 样式覆盖
    .van-cell {
      padding: 8px 0;
    }

    .agree-checkbox {
      --van-checkbox-icon-size: 16px;
      --van-checkbox-checked-icon-color: #ff4444;
      font-size: 14px;
      line-height: 1.5;
    }

    .agreement-link {
      color: #1677FF;
      cursor: pointer;
    }
  }

  .van-cell.active {
    background-color: #fff7f6 !important;
    border: 1px solid #ff4444;
    border-radius: 8px;
  }

  // 移除 Vant Cell Group 默认的边框
  .van-cell-group {
    background: none;
  }
}
</style>