<template>
  <div class="media-list-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="media-list-header">
        <p>总数量：{{ totalCount }}</p>
        <van-icon
            :name="isAscending ? 'ascending' : 'descending'"
            @click="toggleSortOrder"
            color="#1989fa"
            size="24"
        />
      </div>
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMediaData('load')"
      >
        <div v-for="(item) in sortedList"
             :key="item.id"
             :title="item.name"
             @click="router.push({path:'/sound/soundDetail',query:{albumId:route.query.albumId as string,mediaId:item.id,creatorMemberId:item.creatorMemberId}})">
          <VideoPlay :pic-url="item.coverUrl"
                     :title="item.title"
                     :description="item.description"
                     show-comment-count
                     :play-count="item.commentCount"
                     showPlayCount
                     :video="item.mediaType===0"/>
          <van-divider/>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref} from "vue";
import {useAlbumStore} from "@/stores/album_store.ts";
import {useRoute, useRouter} from "vue-router";
import VideoPlay from "@/components/common/VideoPlay.vue";

const {listMediaByAlbum} = useAlbumStore();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const route = useRoute();
const router = useRouter();
// 防止并发标志
const loadingInProgress = ref(false);

const searchParam = {
  albumId: route.query.albumId as string,
  beginMediaId: "0",
  pageSize: 6,
};

// 媒体数据列表
const mediaList = ref([]);
// 总数量
const totalCount = ref(0);
// 排序状态
const isAscending = ref(false);
// 加载专辑数据
const loadMediaData = async (type = 'refresh') => {
  // 如果有请求正在进行中，直接返回
  if (loadingInProgress.value) {
    return;
  }
  // 开始加载
  loadingInProgress.value = true;
  if (type === 'refresh') {
    // 刷新时重置所有数据和状态
    mediaList.value = [];
    searchParam.beginMediaId = "0";
    finished.value = false;
    loading.value = false;
  }

  const medias = await listMediaByAlbum(route.query.albumId as string, searchParam.beginMediaId, searchParam.pageSize, 0);
  if (medias.list && medias.list.length > 0) {
    if (type === 'refresh') {
      mediaList.value = medias.list; // 刷新时替换数据
    } else {
      mediaList.value = [...new Set([...mediaList.value, ...medias.list])]; // 加载更多时追加数据
    }

    // 更新 `beginMediaId` 为最后一项的 ID
    searchParam.beginMediaId = medias.list[medias.list.length - 1].id > medias.list[0].id ? medias.list[medias.list.length - 1].id : medias.list[0].id;

    // 仅在首次加载或数据变化时更新 `totalCount`
    if (type === 'refresh' || totalCount.value === 0) {
      totalCount.value = medias.total;
    }
  }
  // 判断是否没有更多数据了
  finished.value = !medias.list || medias.list.length < searchParam.pageSize;
  // 每次加载完成后更新排序
  updateSortedList();

  // 完成加载操作
  loading.value = false;
  refreshing.value = false;
  loadingInProgress.value = false;
}

// 刷新
const onRefresh = () => {
  // 清空数据
  finished.value = false;
  // 重新加载
  loading.value = false;
  // 刷新
  refreshing.value = true;
  loadMediaData();
}
// 切换排序时重新计算排序列表
const toggleSortOrder = () => {
  isAscending.value = !isAscending.value;
  updateSortedList();
};

const sortedList = ref([]); // 用 ref 存储已排序的列表

// 更新排序后的列表
const updateSortedList = () => {
  sortedList.value = mediaList.value.slice().sort((a, b) => {
    // 置顶的项始终在前面
    // 先按 position 降序排序
    if (a.position !== b.position) {
      return b.position - a.position; // position 越大，越靠前
    }
    return isAscending.value ? a.id - b.id : b.id - a.id;
  });
};


</script>

<style lang="scss" scoped>
.media-list-container {
  margin: 0.4rem 0.2rem;
  background-color: #fff;

  .media-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

.van-dropdown-menu {
  background-color: #f5f5f5; /* 背景色 */
  font-size: $font-size; /* 字体大小 */
  color: #333; /* 字体颜色 */
  border-radius: 1rem; /* 圆角边框 */
  padding: 0.2rem;

  .van-dropdown-item__title {
    color: #007aff; /* 标题颜色 */
  }
}


</style>