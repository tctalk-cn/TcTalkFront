<template>
  <div id="dashboard" :class="{ 'with-footer': showTabBar }">
    <div class="main">
      <!--1.缓存组件状态:使用 <keep-alive> 包裹的组件会在切换时被缓存，而不是被销毁。当切换回该组件时，它会恢复之前的状态，而不需要重新渲染
        2.性能优化： 对于频繁切换的页面或组件，使用 <keep-alive> 可以避免重复渲染，从而提高应用的性能，尤其是在大型应用中。
        3.控制哪些组件被缓存： <keep-alive> 提供了 include 和 exclude 属性，允许开发者指定哪些组件应该被缓存，哪些应该不缓存。
    -->
      <router-view v-slot="{ Component }" v-if="$route.meta.keepAlive">
        <keep-alive>
          <component :is="Component"/>
        </keep-alive>
      </router-view>
      <router-view v-slot="{ Component }" v-if="!$route.meta.keepAlive">
        <component :is="Component"/>
      </router-view>
    </div>
    <!-- 底部导航栏可根据路由 meta 动态控制显示 -->
    <div id="footer" class="footer" v-if="showTabBar">
      <van-tabbar v-model="currentIndex">
        <van-tabbar-item
            v-for="(item, index) in tabBars"
            :key="item.name"
            :id="item.name"
            :info="item?.info"
            :icon="item.icon"
            @click="handleTabClick(index, item.name)"
        />
      </van-tabbar>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const currentIndex = ref(0);
const showTabBar = ref(true);
const tabBars = ref([
  {name: "home", title: "首页", icon: "wap-home"},
  {name: "discover", title: "发现", icon: "eye-o"},
  {name: "setHost", title: "添加", icon: "add-o"},
  {name: "subscriber", title: "订阅", icon: "service-o"},
  {name: "member", title: "我的", icon: "manager-o", info: 10}
]);
// tab点击切换页面
const handleTabClick = (index: number, tabName: string) => {
  // 避免重复跳转
  if (route.name === tabName) {
    return;
  }
  currentIndex.value = index;
  router.push({name: tabName, replace: true,});
}

// 更新索引
const updateCurrentIndex = () => {
  const index = tabBars.value.findIndex(tab => tab.name === route.name);
  if (index !== -1) {
    currentIndex.value = index;
  } else {
    currentIndex.value = 0; // 或者不处理
  }
};
const updateTabBarVisibility = () => {
  // 只要有一层 route 明确要求隐藏 tabbar，就隐藏它
  showTabBar.value = !route.matched.some(record => record.meta.showTabBar === false);
};
onMounted(() => {
  updateCurrentIndex();
  updateTabBarVisibility();
});
// 监听tab变化
watch(() => route.name, () => {
  updateCurrentIndex();
  updateTabBarVisibility();
});
</script>

<style lang="scss" scoped>
#dashboard {
  width: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100vh;
}

#dashboard.with-footer {
  padding-bottom: 5rem;
}

.header {
  flex: 0 0 auto;
}

.main {
  flex: 1 1 auto;
  overflow: auto;
}

.content {
  padding: 2px;
}

.footer {
  flex: 0 0 auto;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  background-color: white;
}


.van-tabbar-item--active {
  color: #F75B52 !important;
}

.van-tabbar-item:active {
  background: #f6f6f6;
}
</style>
