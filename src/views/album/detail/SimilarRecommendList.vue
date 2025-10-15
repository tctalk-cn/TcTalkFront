<template>
  <Title title="主播的其他专辑" :show-more="true"/>
  <van-grid :column-num="3" :border="true"
            :gutter="4"
            style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
    <van-grid-item v-for="(item) in streamerOtherAlbums" :key="item.id">
      <router-link class="similar-album-info"
                   :to='{path: "/creative/albumDetail",
                     query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
        <div class="similar-cover-image-container">
          <van-image :src="item.coverUrl" :alt="item.name"/>
        </div>
        <div class="similar-album-info-wrapper">
          <div class="similar-album-title">
            <van-text-ellipsis rows="2" :content="formatAlbumTitle(item)"/>
          </div>
        </div>
      </router-link>
    </van-grid-item>
  </van-grid>
  <Title title="收听本专辑的人也在听"/>
  <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="loadRecommendAlbumData('load')"
  >
    <van-grid :column-num="3" :border="true"
              style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
      <van-grid-item v-for="(item) in similarRecommendAlbums" :key="item.id">
        <router-link class="similar-album-info"
                     :to='{path: "/creative/albumDetail",
                     query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
          <div class="similar-cover-image-container">
            <van-image :src="item.coverUrl" :alt="item.name"/>
          </div>
          <div class="similar-album-info-wrapper">
            <div class="similar-album-title">
              <van-text-ellipsis rows="2" :content="formatAlbumTitle2(item)"/>
            </div>
          </div>
        </router-link>
      </van-grid-item>
    </van-grid>
  </van-list>
</template>
<script setup lang="ts">
import Title from "@/components/common/Title.vue";
import {useAlbumStore} from "@/stores/album_store.js";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {Album, AlbumForRecallResp} from "@/models/album.js";

const {listStreamerOtherAlbums, similarRecommend} = useAlbumStore();
const similarRecommendAlbums = ref([] as AlbumForRecallResp[]);

const route = useRoute();
const albumId = route.query.albumId as string;
const albumCreatorMemberId = route.query.albumCreatorMemberId as string;
const streamerOtherAlbums = ref([] as Album[]);
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  pageNum: 0,
  pageSize: 6,
};
onMounted(async () => {
  streamerOtherAlbums.value = await listStreamerOtherAlbums(albumCreatorMemberId, albumId);
});


// 定义动态拼接函数
const formatAlbumTitle = (album: Album) => {
  const prefix = album.paid ? '' : '【免费】';
  return `${prefix} ${album.name ?? ''}`;
};


// 定义动态拼接函数
const formatAlbumTitle2 = (album: AlbumForRecallResp) => {
  const prefix = album.paid ? '' : '【免费】';
  return `${prefix} ${album.albumTitle ?? ''}`;
};


// 加载专辑数据
const loadRecommendAlbumData = async (type = 'refresh') => {
  if (type === 'refresh') {
    // 重置分页和状态
    searchParam.pageNum = 1;
    finished.value = false; // 确保可以重新加载更多数据
  } else {
    searchParam.pageNum++; // 加载下一页
  }

  // 开始加载数据
  loading.value = true;
  try {
    const albums = await similarRecommend(albumCreatorMemberId, albumId, searchParam.pageNum, searchParam.pageSize);
    if (type === 'refresh') {
      similarRecommendAlbums.value = albums;
    } else {
      similarRecommendAlbums.value = similarRecommendAlbums.value.concat(albums);
    }

    // 判断是否还有更多数据
    if (!albums || albums.length < searchParam.pageSize) {
      finished.value = true; // 数据已全部加载完毕
    }
  } catch (error) {
    console.error("加载数据失败：", error);
    if (type !== 'refresh') {
      searchParam.pageNum--; // 回滚页码，避免跳过页
    }
  } finally {
    // 结束加载
    loading.value = false;
    if (type === 'refresh') {
      refreshing.value = false; // 停止下拉刷新状态
    }
  }
};
</script>
<style lang="scss" scoped>

.similar-album-info {
  display: flex;
  flex-direction: column;

  .similar-cover-image-container {
    flex-shrink: 0; /* 不允许压缩 */
    height: 6rem;
    border-radius: $border-radius-mx;
    overflow: hidden;
    background-color: #e7e7e7;
    background-image: url("@/assets/images/tv.png");
    background-size: 6rem 6rem;
    background-position: center;
    background-repeat: no-repeat;
  }

  .similar-album-info-wrapper {
    overflow: hidden; /* 防止内容超出 */
    .similar-album-title {
      font-size: $font-size;
      font-weight: bold;
      align-items: center;
    }
  }
}


</style>