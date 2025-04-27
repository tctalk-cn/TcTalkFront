<template>
  <section class="action-list">
    <ul>
      <li v-for="(action, index) in actions" :key="index" class="action-item" @click="handleClick(action)">
        <div class="action-icon">
          <component :is="action.icon" v-if="!action.isSvg" theme="filled" size="12" fill="#333"/>
          <component :is="action.icon" v-else class="svg-icon"/>
        </div>
        <div class="action-text">{{ action.text }}</div>
        <van-icon name="arrow" size="12"/>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';

interface ActionItem {
  text: string;
  icon: any; // svg组件或者icon-park组件
  to?: string;
  href?: string;
  isSvg?: boolean;
  isLink?: boolean;
}

const props = defineProps<{
  actions: ActionItem[];
}>();

const router = useRouter();

const handleClick = (action: ActionItem) => {
  if (action.href) {
    window.location.href = action.href;
  } else if (action.to) {
    router.push(action.to);
  }
};
</script>

<style lang="scss" scoped>
.action-list {
  margin-top: 0.2rem;
  background: $fc;
  overflow: hidden;
  margin-left: 0.3rem;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.6rem;
  border-bottom: 0.05rem solid #eee;
}

.action-item:last-child {
  border-bottom: none;
}

.action-icon {
  margin-right: 0.2rem;
}

.action-text {
  flex: 1;
  font-size: 0.7rem;
  color: #333;
}

/* 处理SVG图标样式 */
.svg-icon {
  width: 1rem;
  height: 1rem;
  fill: #333;
}
</style>
