<template>
  <div class="alert-container">
    <section class="tip-text-container">
      <div class="tip-icon">
        <span></span>
        <span></span>
      </div>
      <p class="tip-text">{{ alertText }}</p>
      <div class="confirm" @click="emitCloseTipClick">确认</div>
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  alertText: string
}>();

const emits = defineEmits(["closeTip"]);

const emitCloseTipClick = () => {
  emits('closeTip'); // 可选地传递数据给父组件
};

</script>


<style lang="scss" scoped>
@keyframes tipMove {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.alert-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
}

.tip-text-container {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -6rem;
  margin-left: -6rem;
  width: 12rem;
  animation: tipMove 0.4s;
  background-color: rgba(255, 255, 255, 1);
  border: 1px;
  padding-top: 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 0.25rem;

  .tip-icon {
    @include wh(3rem, 3rem);
    border: 0.15rem solid #f8cb86;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    span:nth-of-type(1) {
      @include wh(0.12rem, 1.5rem);
      background-color: #f8cb86;
    }

    span:nth-of-type(2) {
      @include wh(0.2rem, 0.2rem);
      border: 1px;
      border-radius: 50%;
      margin-top: 0.2rem;
      background-color: #f8cb86;
    }
  }

  .tip-text {
    @include sc($font-size, #333);
    line-height: 0.9rem;
    text-align: center;
    margin-top: 0.8rem;
    padding: 0 0.4rem;
  }

  .confirm {
    @include sc($font-size, #fff);
    font-weight: bold;
    margin-top: 0.8rem;
    background-color: #4cd964;
    width: 100%;
    text-align: center;
    line-height: 1.8rem;
    border: 1px;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
}
</style>

