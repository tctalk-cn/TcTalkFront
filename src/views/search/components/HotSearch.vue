<template>
  <div class="hot-search-list">
    <VanList v-for="(item,index) in searchHot" :key="item.id" @click="hotClick(item.keywords)">
      <VanCell :value="item.searchCount" :border="false">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="primary">{{ index + 1 }}. </span>
          <span class="custom-title">{{ item.keywords }}</span>
        </template>
      </VanCell>
    </VanList>
  </div>

</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {SearchHotDetail} from "@/models/search_hot_detail.ts";
import {useSearchStore} from "@/stores/search_store.ts";

const {searchHotDetail} = useSearchStore();
const searchHot = ref<SearchHotDetail[]>([])
onMounted(async () => {
  searchHot.value = await searchHotDetail("", "");
});

const hotClick = (keywords: string) => {

}
</script>
<style lang="scss" scoped>
.hot-search-list {
  background: linear-gradient(to bottom, rgba(255, 182, 193, 0.1), rgba(255, 255, 255, 0.1));
  border-radius: 0.4rem; /* 圆角 */
  padding: 0.5rem; /* 内边距 */
  margin-top: 0.5rem; /* 与标题间距 */
}
</style>