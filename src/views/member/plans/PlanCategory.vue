<template>
  <div class="plan-category-container">
    <!-- HeaderTop -->
    <HeaderTop head-title="开通VIP会员" go-back="true"/>
    <!-- Tabs 外层加一个 wrapper -->
    <div class="tabs-wrapper">
      <!-- Tabs -->
      <van-tabs
          v-model:active="activeTab"
          swipeable
          animated
          sticky
          lazy-render
          type="line"
          @clickTab="onTabClick"
      >
        <van-tab
            v-for="cat in categories"
            :name="cat.categoryCode"
            :key="cat.categoryCode"
        >
          <template #title>
            <div class="tab-card" :class="{ 'tab-active': activeTab === cat.categoryCode }">
              <div class="tab-name">{{ cat.categoryName }}</div>
              <div class="tab-desc">{{ cat.categoryDesc }}</div>
            </div>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!-- Tab 内容 -->
    <div class="plan-category-container__content">
      <RouterView/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useProfileStore} from "@/stores/member_store.js";
import HeaderTop from "@/components/layout/header/HeaderTop.vue";

const router = useRouter();
const {listEnabledPlanCategory} = useProfileStore();

const categories = ref([]);
const activeTab = ref('');

// 点击 Tab
const onTabClick = (tab) => {
  const cat = categories.value.find(c => c.categoryCode === tab.name);
  if (cat?.pagePath) {
    activeTab.value = cat.categoryCode;
    router.push(cat.pagePath);
  }
};

onMounted(async () => {
  categories.value = await listEnabledPlanCategory();
  if (!categories.value.length) return;
  activeTab.value = categories.value[0].categoryCode;
  router.replace(categories.value[0].pagePath);
});
</script>

<style lang="scss" scoped>
.plan-category-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $bc;

  /* Tabs 样式 */
  :deep(.van-tabs__nav) {
    display: flex;
    gap: 0; /* 去掉默认间隙 */
  }

  :deep(.van-tab) {
    padding: 0 !important;
    margin: 0 !important;
  }

  .tabs-wrapper {
    padding-top: 0.5rem; /* HeaderTop 和 Tabs 之间的间距 */
    background-color: #fff; /* 保持白色背景 */
    padding-bottom: 0.2rem; /* 让tab线条有呼吸感 */
  }

  .tab-card {
    padding: 0.5rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #333;
  }

  .tab-card .tab-name {
    font-weight: 700;
    font-size: $font-size-mx;
  }

  .tab-card .tab-desc {
    font-size: $font-size-sm;
    color: #666;
    margin-top: 0.1rem;
  }

  /* 选中效果 */
  .tab-active {
    color: $blue;
  }

  :deep(.van-tabs__line) {
    background: $blue !important;
    height: 0.2rem !important;
    border-radius: 0.1rem;
  }

  /* 内容区域 */
  &__content {
    flex: 1;
    background-color: #f7faff;
    overflow-y: auto;
    padding: 0.5rem;
  }
}
</style>
