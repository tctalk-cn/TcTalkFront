<template>
  <div class="search-container">
    <div class="search-header">
      <van-search
          v-model="realQuery"
          show-action
          placeholder="搜索音乐、故事、专辑"
          @input="onInput"
          @cancel="onCancel"
          @search="onSearch"
          @clear="onClear"
          input-align="center"
          right-icon="audio"
      />
    </div>
    <div class="search-main" v-if="!realQuery">
      <div class="search-history">
        <div class="search-title">
          <div class="title">
            搜索历史
          </div>
          <div class="icons">
            <van-icon name="delete-o" @click="clearSearchHistory"/>
          </div>
        </div>
        <div class="search-list">
          <van-grid :column-num="3" :border="false">
            <van-grid-item v-for="(item) in recentlySearchHistory" :key="item"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
              <van-button
                  :type="'default'"
                  round
                  plain
                  class="w-full"
                  size="mini"
                  @click="handleHistoryClick(item)">
                {{ item }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <div class="search-suggest">
        <div class="suggest-title">
          推荐搜索
        </div>
        <div class="suggest-list">
          <van-grid :column-num="3" :border="false">
            <van-grid-item v-for="(item) in suggestSearchHistory" :key="item"
                           style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.4rem;">
              <van-button
                  :type="'default'"
                  plain
                  round
                  class="w-full"
                  size="mini"
                  @click="handleHistoryClick(item)">
                {{ item }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <div class="hot-search">
        <van-tabs v-model:active="searchKey" lazy-render @clickTab="onTabClick" animated scrollspy>
          <van-tab v-for="(item) in searchTab" :key="item.name" :name="item.name">
            <template #title>
              <van-icon v-if="item.icon" :name="item.icon"/>
              <div v-if="!item.icon"> {{ item.label }}</div>
            </template>
          </van-tab>
        </van-tabs>
        <div class="mt-0.5">
          <RouterView/>
        </div>
      </div>
    </div>
    <div class="search-autocomplete" v-else-if="realQuery&&searchAutoCompleteResult.length>0">
      <div v-for="(item,index) in searchAutoCompleteResult"
           :key="item.id" class="search-item">
        <van-cell :title="item.name" url="/pages/dashboard/index"/>
      </div>
    </div>
    <div class="search-result" v-else-if="doRealQuery">
      <SearchResult :do-real-query="doRealQuery" title="专辑"></SearchResult>
    </div>
  </div>

</template>

<script setup lang="ts">
import {SearchHotDetail} from "@/models/search_hot_detail.ts";
import {onMounted, ref, watch} from "vue";
import {useSearchStore} from "@/stores/search_store.ts";
import {useRoute, useRouter} from "vue-router";
import {Pages} from "@/router/pages.ts";
import {Album} from "@/models/album.ts";
import {debounce} from "lodash";
import {useProfileStore} from "@/stores/member_store.ts";
import SearchResult from "@/views/search/components/SearchResult.vue";

const {
  searchHotDetail,
  recentlySearchLog,
  suggestSearch,
  searchByKeyword,
  clearSearchLog,
} = useSearchStore();
const {addSearchLog} = useProfileStore();

const route = useRoute();
const router = useRouter();
const searchAutoCompleteResult = ref<Album[]>([]);
const realSearchResult = ref<Album[]>([]);
const realQuery = ref("");
const doRealQuery = ref("");
const onFocus = () => {

}
// 使用 lodash.debounce 创建一个防抖的搜索函数
const debouncedSearch = debounce(async () => {
  doRealQuery.value = "";
  searchAutoCompleteResult.value = await searchByKeyword(realQuery.value, "");
}, 500); // 500ms 延迟

const onInput = async (event) => {
  debouncedSearch();
}

const onSearch = async (event) => {
  searchAutoCompleteResult.value = [];
  doRealQuery.value = realQuery.value;
  // 记录搜索日志
  await addSearchLog(event, "-1");
  // 查询搜索结果
}

const handleHistoryClick = async (item: string) => {
  realQuery.value = item;
  searchAutoCompleteResult.value = [];
  doRealQuery.value = realQuery.value;
  // 记录搜索日志
  await addSearchLog(item, "-1");
  // 查询搜索结果
}
const onClear = () => {
  realQuery.value = "";
  searchAutoCompleteResult.value = [];
  doRealQuery.value = "";
  realSearchResult.value = [];
}

const onCancel = () => {
  realQuery.value = "";
  router.push({name: Pages.home});
}
const recentlySearchHistory = ref<string[]>([]);
const suggestSearchHistory = ref<string[]>([]);
const clearSearchHistory = () => {
  recentlySearchHistory.value = [];
  clearSearchLog();
}
const searchHot = ref<SearchHotDetail[]>([])

const searchKey = ref<string>(route.meta.menu as string);
const searchTab = [
  {
    id: 1,
    label: '热搜',
    icon: '',
    name: 'hotSearch',
  },
  {
    id: 2,
    label: '热点',
    icon: '',
    name: 'hotspotSearch',
  },
  {
    id: 3,
    label: '儿童',
    icon: '',
    name: 'childSearch',
  },
  {
    id: 4,
    label: '有声书',
    icon: '',
    name: 'audioBook',
  },
  {
    id: 5,
    label: '历史',
    icon: '',
    name: 'historySearch',
  },
];

watch(
    () => route.meta.menu,
    (menu) => {
      searchKey.value = menu as string;
    }
);
// tab点击切换页面
const onTabClick = (tab) => {
  searchKey.value = tab.name;
  router.push({name: tab.name});
}

onMounted(async () => {
  searchHot.value = await searchHotDetail("", "");
  suggestSearchHistory.value = await suggestSearch("", "");
  recentlySearchHistory.value = await recentlySearchLog();
});
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  height: 100vh;

  .search-header {
  }

  .search-main {
    overflow-y: auto;
    padding: 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .search-history {
      padding: 0.5rem 0;

      .search-title {
        display: flex; /* 标题和图标容器 */
        align-items: center; /* 垂直居中 */
        justify-content: space-between; /* 使 title 在左，icons 在右 */

        .title {
          /* 您可以根据需要添加自定义样式 */
          font-weight: bold;
          font-family: Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
          line-height: 1;
          margin-top: 0.3rem; /* 对应 mt-2 */
          margin-bottom: 0.6rem; /* 对应 mt-2 */
        }

        .icons {
          display: flex;
        }
      }

      .search-list {

      }
    }

    .search-suggest {

      .suggest-title {
        /* 您可以根据需要添加自定义样式 */
        font-weight: bold;
        font-family: Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
        line-height: 1;
        margin-top: 0.3rem; /* 对应 mt-2 */
        margin-bottom: 0.6rem; /* 对应 mt-2 */
      }

      .suggest-list {

      }
    }

    .hot-search {
    }
  }

  .search-autocomplete {
    padding: 0 1rem;

    .search-item {
      border-bottom: 1px solid #ebedf0; /* Vant 默认边框颜色 */
    }
  }

  .search-result {
    padding: 0 1rem;

    .search-item {
      border-bottom: 1px solid #ebedf0; /* Vant 默认边框颜色 */
    }
  }
}
</style>
