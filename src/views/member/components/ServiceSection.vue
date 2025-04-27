<template>
  <section class="spike">
    <div class="spike-header">
      <span class="spike-header-title">{{ title }}</span>
    </div>
    <div class="spike-content">
      <van-grid :column-num="length" :border="false" :square="false">
        <van-grid-item
            v-for="(item, idx) in items"
            :key="idx"
            :icon="item.icon"
            :text="item.text"
            :badge="item.badge"
            @click="$emit('itemClick', item.to)"
        />
      </van-grid>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; items: any[]; length: number }>();
defineEmits(["itemClick"]);
</script>

<style lang="scss" scoped>
.spike {
  margin-top: 0.2rem;
  background: $fc;

  &-header {
    padding-left: 0.2rem;
    display: inline-block;

    &-title {
      display: inline-block;
      height: 1.0rem;
      line-height: 1.0rem;
      font-size: 12px;
      font-weight: bold;
    }

    &-countdown {
      float: left;

      &-lt {
        margin-top: 1px;
        margin-left: 10px;
        font-size: 12px;
        border: 1px solid #FB0017;
        border-right: none;
        border-bottom-left-radius: 22px;
        border-top-left-radius: 22px;
        height: 18px;
        line-height: 18px;
        padding: 0 3px;
        color: #ffffff;
        background: #FB0017;
        float: left;
      }

      &-rt {
        margin-top: 1px;
        font-size: 12px;
        float: left;
        border: 1px solid #FB0017;
        border-bottom-right-radius: 22px;
        border-top-right-radius: 22px;
        height: 18px;
        line-height: 18px;
        padding: 0 3px;
      }
    }

    &-more {
      float: right;

      &-text {
        height: 20px;
        line-height: 15px;
        font-size: 10px;
      }

      .van-icon {
        margin-left: 2px;
        height: 10px;
        line-height: 10px;
        float: right;
      }
    }
  }

  &-content {
    height: auto;

    .van-card-full {
      background-color: #f1f1f1;
    }
  }
}
</style>
