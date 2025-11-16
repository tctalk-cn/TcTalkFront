<template>
  <div class="plan-category-container">
    <HeaderTop head-title="开通VIP会员" go-back="true" />

    <div class="plan-category-container__tabs">
      <van-tabs
          v-model:active="activeTab"
          swipeable
          animated
          sticky
          color="#2B7CFF"
          title-active-color="#2B7CFF"
          lazy-render
          @clickTab="onTabClick"
      >
        <van-tab
            v-for="cat in categories"
            :title="cat.categoryName"
            :name="cat.categoryCode"
            :key="cat.categoryCode"
        >
          <template #title>
            <van-icon v-if="cat.icon" :name="cat.icon" />
            <div v-else>{{ cat.categoryName }}</div>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 正确的位置：tabs 外面 -->
    <div class="plan-category-container__content">
      <RouterView />
    </div>
  </div>
</template>


<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useProfileStore} from "@/stores/member_store.js";
import HeaderTop from "@/components/layout/header/HeaderTop.vue"; // 你的展示组件

const route = useRoute();
const router = useRouter();

const {listEnabledPlanCategory} = useProfileStore();
// 所有分类
const categories = ref([]);

// 当前 tab 的 name（即 categoryCode）
const activeTab = ref('');

// 获取路由中的 id
const id = route.params.id as string;

watch(
    () => route.path,
    () => {
      const match = categories.value.find(c => c.pagePath === route.path);
      if (match) {
        activeTab.value = match.categoryCode;
      }
    }
);

const onTabClick = (tab) => {
  const cat = categories.value.find(c => c.categoryCode === tab.name);
  if (cat?.pagePath) {
    router.push(cat.pagePath);
  }
};

onMounted(async () => {
  categories.value = await listEnabledPlanCategory();
  if (!categories.value.length) return;

  // 根据路由 id 决定 tab
  const matchedById = categories.value.find(c => c.id === route.params.id);

  if (matchedById) {
    activeTab.value = matchedById.categoryCode;
    router.replace(matchedById.pagePath);
    return;
  }

  // 根据当前 path 匹配
  const matchedByPath = categories.value.find(c => c.pagePath === route.path);
  if (matchedByPath) {
    activeTab.value = matchedByPath.categoryCode;
    return;
  }

  // 默认
  activeTab.value = categories.value[0].categoryCode;
  router.replace(categories.value[0].pagePath);
});


</script>

<style scoped>
.plan-category-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  &__tabs {
    margin-bottom: 0.5rem;
  }

  &__content {
    padding: 0 0.5rem;
  }
}
</style>
