<template>
  <div class="order-container">
    <HeaderTop go-back="true" :head-title="orderTitle" go-back-url="/member">
      <template #search>
        <van-icon name="search"/>
      </template>
      <template #actions>
        <van-icon name="newspaper-o"/>
      </template>
    </HeaderTop>

    <van-tabs v-model="currentTab" lazy-render @clickTab="onTabClick" animated scrollspy>
      <van-tab v-for="tab in orderTabs" :key="tab.name" :name="tab.name">
        <template #title>{{ tab.label }}</template>
      </van-tab>
    </van-tabs>

    <RouterView/>
  </div>
</template>

<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const orderTitle = ref("我的订单");

const orderTabs = [
  { id: 1, label: '全部', name: 'allOrders' },
  { id: 2, label: '待付款', name: 'pendingPaymentOrders' },
  { id: 3, label: '待分享', name: 'pendingShareOrders' },
  { id: 4, label: '评价', name: 'remarkOrders' },
];

const currentTab = ref(route.meta.menu ?? 'allOrders');

watch(() => route.meta.menu, (menu) => {
  currentTab.value = menu ?? 'allOrders';
});

const onTabClick = (tab: any) => {
  currentTab.value = tab.name;
  router.push({ name: tab.name });
};
</script>

<style scoped lang="scss">
.order-container { display: flex; flex-direction: column; }
</style>
