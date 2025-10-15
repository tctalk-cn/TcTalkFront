<template>
  <div class="show-list-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="media-list-header">
        <p>总数量：{{ totalCount }}</p>
        <van-icon
            :name="isAscending ? 'ascending' : 'descending'"
            @click="toggleSortOrder"
            color="#1989fa"
            size="24"
            title="点击切换排序"
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
             :title="item.name">
          <Show
              :title="item.title"
              :description="item.description"
              show-comment-count
              :play-count="item.commentCount"
              showPlayCount
              :media-type="item.mediaType"
              :create-time="item.createTime"
              :duration-in-ms="item.durationInMs"
              :pin2-top="item.position===1"
              :on-play="() => {router.push({path:'/sound/soundDetail',query:{albumId:route.query.albumId as string,mediaId:item.id,creatorMemberId:item.creatorMemberId}})}"
              :on-pin2-top="() => {pin2Top(route.query.albumId as string,item.id)}"
              :on-edit="()=>{router.push({path:'/creative/videoUpload',query:{mediaId:item.id,creatorMemberId:item.creatorMemberId}})}"
              :on-delete="() => {deleteMediaById(item.id);loadMediaData('refresh');}"
          />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useAlbumStore} from "@/stores/album_store.js";
import {useRoute, useRouter} from "vue-router";
import Show from "@/components/common/Show.vue";
import {useVideoStore} from "@/stores/video_store.js";

const {listMediaByAlbum, pin2Top} = useAlbumStore();
const {deleteMediaById} = useVideoStore();
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
    totalCount.value = 0;
    finished.value = false;
    loading.value = false;
  }

  try {
    const medias = await listMediaByAlbum(route.query.albumId as string, searchParam.beginMediaId, searchParam.pageSize, null);
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
  } catch (err) {
    console.error("加载媒体失败：", err);
  } finally {
    // 完成加载操作
    loading.value = false;
    refreshing.value = false;
    loadingInProgress.value = false;
  }
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
};

const sortedList = computed(() => {
  return mediaList.value.slice().sort((a, b) => {
    if (a.position !== b.position) {
      return b.position - a.position;
    }
    return isAscending.value ? a.id - b.id : b.id - a.id;
  });
});
</script>

<style lang="scss" scoped>
.show-list-container {
  margin: 0.4rem 0.2rem;
  background-color: $body-bg;

  .media-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $padding-sm $padding-md;
    font-size: $font-size;
  }
}
</style>