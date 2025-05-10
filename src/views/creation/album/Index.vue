<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadAlbumData('load')"
    >
      <div v-for="(item) in albumList"
           :key="item.id"
           :title="item.name">
        <AlbumItem
            :id="item.id"
            :name="item.name"
            :cover-url="item.coverUrl"
            :album-creator-member-id="item.creatorMemberId"
            :creator-nickname="item.creatorNickname"
            :show-play-count="true"
            :play-count="item.viewsCount"
            :show-comment-count="true"
            :comment-count="item.commentCount"
            :show-like-count="true"
            :like-count="item.recommendCount"
            :show-subscription-count="true"
            :subscription-count="item.subscriptionCount"
            :update-time="item.updateTime"
            :on-view-data="() => {router.push({path:'/creative/albumData',query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}})}"
            :on-edit="()=>{}"
            :on-more="() => {}"
            :on-share="()=>{}"
        />
      </div>
    </van-list>
  </van-pull-refresh>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useAlbumStore} from "@/stores/album_store.ts";
import {Album} from "@/models/album.ts";
import {useRouter} from "vue-router";
import AlbumItem from "@/views/creation/album/components/AlbumItem.vue";

const router = useRouter();
const {loadAlbums} = useAlbumStore();

const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  beginAlbumId: "0",
  pageSize: 6,
};
const albumList = ref<Album[]>([]);
// 加载专辑数据
const loadAlbumData = async (type = 'refresh') => {
  if (type === 'refresh') {
    searchParam.beginAlbumId = "0";
    refreshing.value = false;
    finished.value = false;  // 确保刷新时重新开始加载
  }
  const albums = await loadAlbums(searchParam.beginAlbumId, searchParam.pageSize);

  if (!albums || albums.length === 0) {
    finished.value = true;  // 确保没有数据时停止加载
    loading.value = false;
    return;
  }

  if (type === 'refresh') {
    albumList.value = albums;
  } else {
    albumList.value = albumList.value.concat(albums);
  }

  searchParam.beginAlbumId = albums[albums.length - 1].id;
  if (albums.length < searchParam.pageSize) {
    finished.value = true;
  }
  loading.value = false;
}

// 刷新
const onRefresh = () => {
  // 清空数据
  finished.value = false;
  // 重新加载
  loading.value = false;
  // 刷新
  refreshing.value = true;
  loadAlbumData();
}

</script>

<style lang="scss" scoped>
.van-divider {
  margin-top: 0.2rem; /* Adjust the top margin as needed */
  margin-bottom: 0.2rem; /* Adjust the bottom margin as needed */
}


</style>