<template>
  <van-popup
      v-model:show="visible"
      round
      position="bottom"
      :style="{ height: '60vh' }"
  >
    <div class="popup-container">
      <div class="header">
        <div class="title">关于自动续费</div>
        <van-icon name="cross" class="close" @click="close"/>
      </div>

      <div class="content">
        <p class="desc">
          为了不中断会员服务，系统会在会员到期前自动扣费。
          如需停止，请在会员中心关闭自动续费。
        </p>

        <div class="section">
          <div class="section-title">• 扣费说明</div>
          <ul>
            <li>扣费时间：会员有效期结束前 24 小时尝试自动扣费</li>
            <li>扣费金额：¥{{ renewPrice }} / 月</li>
            <li>扣费方式：当前选择的支付方式（微信/支付宝）</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">• 取消自动续费</div>
          <p>可在【我的 → 会员中心 → 自动续费】中关闭。</p>
        </div>

        <div class="section">
          <div class="section-title">• 特别提示</div>
          <p class="highlight">取消自动续费后，已支付周期不受影响。</p>
        </div>
      </div>

      <van-button block type="primary" class="btn" @click="close">我知道了</van-button>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";

const props = defineProps<{
  show: boolean;
  renewPrice: string;
}>();

const emit = defineEmits(["update:show"]);

const visible = ref(props.show);
watch(() => props.show, v => visible.value = v);

const close = () => emit("update:show", false);
</script>

<style scoped lang="scss">
.popup-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;

  .header {
    display: flex;
    justify-content: center;
    position: relative;

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .close {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
    }
  }

  .content {
    margin-top: 10px;
    padding-right: 6px;
    overflow-y: auto;
    flex: 1;

    .desc {
      font-size: 14px;
      color: #555;
      margin-bottom: 12px;
    }

    .section {
      margin-bottom: 16px;

      .section-title {
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 6px;
      }

      ul {
        padding-left: 16px;
        list-style: disc;
        color: #444;
      }

      .highlight {
        color: #ff5555;
        font-weight: bold;
      }
    }
  }

  .btn {
    margin-top: 12px;
  }
}
</style>
