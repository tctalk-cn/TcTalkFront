<template>
  <div class="search">
    <form action="/">
      <van-search
          v-model="value"
          show-action
          placeholder="搜索音乐、MV、歌单"
          @focus="showSearchView=true"
          @blur="showSearchView=false"
          @input="searchInput"
          input-align="center"
          right-icon="audio"
      />
    </form>
  </div>
  <div class="searchPop">
    <van-popup v-model:show="showSearchView" position="bottom"
               :style="{ 'max-width': 'auto', padding: '0',height: '100%' }" closeable>
      <div v-if="showHot">
        <VanCellGroup inset title="热门搜索">
          <VanList v-for="(item,index) in searchHot" :key="item.searchWord" @click="hotClick(item.searchWord)"
                   class="py-2.5 px-2.5 hover-text cursor-pointer flex justify-between items-center text-xs">
            <VanCell :value="item.score.numberFormat()">
              <!-- 使用 title 插槽来自定义标题 -->
              <template #title>
                <span class="primary">{{ index + 1 }}.</span>
                <span class="custom-title">{{ item.searchWord }}</span>
              </template>
            </VanCell>
          </VanList>
        </VanCellGroup>
      </div>
      <SearchSuggest v-else/>
    </van-popup>
  </div>

</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";

const value = ref('');
import {debounce} from 'lodash'
import SearchSuggest from "@/components/layout/header/SearchSuggest.vue";
import {storeToRefs} from "pinia";
import {useSearchStore} from "@/stores/search.ts";
import {SearchHotDetail} from "@/models/search.ts";
import {useSearchHotDetail} from "@/utils/api.ts";

const {showSearchView, searchKeyword, showHot} = storeToRefs(useSearchStore())
const {suggest} = useSearchStore()

const hotClick = (text: string) => {
  searchKeyword.value = text
  suggest()
  showSearchView.value = true
}

const searchInput = debounce((value: string | number) => suggest(), 500, {'maxWait': 1000})

const searchHot = ref<SearchHotDetail[]>([])
onMounted(async () => {
  searchHot.value = await useSearchHotDetail()
})

</script>

<style lang="scss">
.custom-title {
  margin-right: 4px;
  vertical-align: middle;
}

.search-icon {
  font-size: 16px;
  line-height: inherit;
}
</style>
