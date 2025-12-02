<template>
  <div class="pay-result-container">
    <van-nav-bar
        title="支付结果"
        left-arrow
        @click-left="onBack"
    />

    <div class="result-card">
      <van-icon
          :name="status === 'success' ? 'success' : 'cross'"
          size="64px"
          :color="status === 'success' ? '#07c160' : '#ff4444'"
      />
      <div class="result-text">
        {{ status === 'success' ? '支付成功' : '支付失败' }}
      </div>

      <div class="order-info" v-if="planName">
        <div>商品: {{ planName }}</div>
        <div>金额: ¥ {{ price }}</div>
      </div>

      <div class="button-group">
        <van-button
            type="primary"
            block
            @click="onGoMember"
            v-if="status === 'success'"
        >查看会员权益</van-button>

        <van-button
            type="default"
            block
            @click="onRetry"
            v-if="status === 'fail'"
        >重新支付</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Toast } from 'vant';

const route = useRoute();
const router = useRouter();

const status = ref<string>('fail');
const planName = ref<string>('');
const price = ref<number>(0);

onMounted(() => {
  status.value = route.query.status as string || 'fail';
  planName.value = route.query.planName as string || '';
  price.value = Number(route.query.price || 0);
});

const onBack = () => router.back();
const onGoMember = () => router.push('/member'); // 会员中心页
const onRetry = () => router.replace('/order/pay' + window.location.search);
</script>

<style scoped lang="scss">
.pay-result-container {
  background: #f8f8f8;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .result-card {
    margin: 40px 12px;
    background: #fff;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    text-align: center;

    .result-text { font-size: 20px; margin: 12px 0; font-weight: bold; }
    .order-info { font-size: 16px; color: #555; margin: 12px 0; }
    .button-group { margin-top: 16px; }
  }
}
</style>
