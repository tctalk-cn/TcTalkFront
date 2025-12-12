<template>
  <div class="order-container">
    <HeaderTop go-back="true" :head-title="orderTitle" go-back-url="/member">
      <!-- 其他插槽内容... -->
      <template #actions>
        <van-icon class="action-button" name="newspaper-o"/>
      </template>
    </HeaderTop>
    <!-- 内容区域-->
    <div class="order-container__tabs">
      <van-tabs v-model:active="currentTab" lazy-render @clickTab="onTabClick" animated scrollspy>
        <van-tab v-for="(item) in orderTabs" :key="item.name" :name="item.name">
          <template #title>
            <van-icon v-if="item.icon" :name="item.icon"/>
            <div v-if="!item.icon"> {{ item.label }}</div>
          </template>
        </van-tab>
      </van-tabs>
    </div>
    <div class="order-container__content">
      <RouterView/>
    </div>
  </div>
</template>
<script setup lang="ts">
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/stores/member_store.ts";
import {useRoute, useRouter} from "vue-router";
import UploadPopup from "@/views/creation/components/UploadPopup.vue";

const router = useRouter();
const route = useRoute();
const orderTitle = ref("我的订单");

const orderTabs: MenuItem[] = [
  {id: 1, label: '全部', name: 'allOrders'},
  {id: 2, label: '待付款', name: 'pendingPaymentOrders'},
  {id: 3, label: '待分享', name: 'pendingShareOrders'},
  {id: 4, label: '评价', name: 'remarkOrders'},
];
const currentTab = ref<MenuItem["name"]>(route.meta.menu as MenuItem["name"]);

watch(
    () => route.meta.menu,
    (menu) => {
      currentTab.value = menu as MenuItem["name"];
    }
);

// tab点击切换页面
interface TabClickEvent {
  name: MenuItem["name"];
  title: string;
}

const onTabClick = (tab: TabClickEvent) => {
  currentTab.value = tab.name;
  router.push({name: tab.name});
};
</script>

<style lang="scss" scoped>
.order-container {
  display: flex;
  flex-direction: column;

  &__tabs {
    margin-bottom: 0.5rem;
  }

  &__content {
    padding: 0 0.5rem;
  }

  .content-container {
    flex: 1;
    overflow-y: auto;
  }
}
</style>