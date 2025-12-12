<template>
  <div class="order-container">
    <HeaderTop go-back="true"  :head-title="orderTitle" go-back-url="/member">
      <template #search>
        <van-icon name="search"/>
      </template>
      <template #actions>
        <van-icon name="newspaper-o"/>
      </template>
    </HeaderTop>

    <van-tabs
        v-model="currentTab"
        lazy-render
        @clickTab="onTabClick"
        animated
        scrollspy
        sticky
    >
      <van-tab v-for="tab in orderTabs" :key="tab.name" :name="tab.name">
        <template #title>{{ tab.label }}</template>
      </van-tab>
    </van-tabs>

    <div class="mt-0.5">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const orderTitle = ref("我的订单");

// 明确 Tab 类型
interface OrderTab {
  id: number;
  label: string;
  name: string; // 对应路由 name
}

const orderTabs: OrderTab[] = [
  { id: 1, label: '全部', name: 'allOrders' },
  { id: 2, label: '待付款', name: 'pendingPaymentOrders' },
  { id: 3, label: '待分享', name: 'pendingShareOrders' },
  { id: 4, label: '评价', name: 'remarkOrders' },
];

// 初始化当前 Tab，兜底为 'allOrders'
const currentTab = ref<string>(route.meta.menu as string || 'allOrders');

// 监听路由变化（如通过浏览器前进/后退）
watch(() => route.meta.menu, (menu) => {
  if (menu) {
    currentTab.value = menu as string;
  }
});

// 点击 Tab 切换路由
const onTabClick = (tab: { name: string }) => {
  currentTab.value = tab.name;
  router.push({ name: tab.name }).catch(() => {}); // 避免重复导航警告
};
</script>

<style scoped lang="scss">
.order-container {
  display: flex;
  flex-direction: column;
  overflow: visible;
}
</style>
