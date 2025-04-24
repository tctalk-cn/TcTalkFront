<template>
  <div class="menu-card">
    <!-- 左侧标题和描述 -->
    <div class="menu-card__content">
      <div class="menu-card__title">{{ menuTitle }}</div>
      <div class="menu-card__description">{{ menuDescription }}</div>
    </div>
    <!-- 右侧菜单图标 -->
    <div class="menu-card__icon" @click="handleMenuClick">
      <van-image
          :src="dynamicIcon"
          fit="cover"
          width="100%"
          height="2.5rem"
          radius="0.2rem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'; // 引入所有 Element Plus 图标
import {computed} from "vue";

// 定义 props
const props = defineProps<{
  menuTitle: string,
  menuDescription: string,
  targetUrl: string,
  iconName: string,
}>();

const handleMenuClick = () => {

}

// 动态加载 assets/images 下的图片
const dynamicIcon = computed(() => {
  return `src/assets/images/${props.iconName}`;
});

</script>

<style scoped>
.menu-card {
  display: flex;
  justify-content: space-between; /* 内容和图标分开 */
  align-items: center;
  background-color: #fff;
  border: 0.1rem solid #ebeef5; /* 卡片边框 */
  border-radius: 0.3rem;
  padding: 0.2rem 0.5rem;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
  height: 4rem;
  max-height: 4rem;
}

.menu-card__content {
  display: flex;
  flex-direction: column;
}

.menu-card__title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #303133;
  margin-bottom: 0.4rem;
}

.menu-card__description {
  font-size: 0.6rem;
  color: #909399;
}

.menu-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #909399;
  transition: color 0.3s;
}

</style>
