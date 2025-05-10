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


const share = (id: string) => {

}

const viewData = (id: string) => {

}

const edit = (id: string) => {

}

const more = (id: string) => {

}
</script>

<style lang="scss" scoped>
.album-container {
  background-color: #fff;
  overflow-y: auto;

  .album-info {
    display: flex;
    margin: 0.2rem 0.2rem;
    border-radius: 0.4rem;
    box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
    padding: 0.5rem 1rem;
    flex-grow: 1;
    flex-direction: column;
    overflow: hidden;


    .album-header {
      display: flex;
      justify-content: space-between; /* 让标题和日期分开 */
      align-items: center;
      margin-bottom: 0.4rem;

      .cover-image-container {
        width: 7rem;
        height: 5rem;
        border-radius: 0.2rem;
        overflow: hidden;
        background-color: #e7e7e7;
        background-image: url("@/assets/images/tv.png");
        background-size: 4rem 4rem;
        background-position: 1.5rem 0;
        background-repeat: no-repeat;
      }

      .album-info-wrapper {
        flex-grow: 1; /* 让标题占满剩余空间 */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        p {
          margin-top: 0.2rem;
          height: 2.2rem;
          line-height: 1.1rem;
          overflow: hidden;
          font-size: 0.9rem;
          color: #212121;
          display: flex;
          align-items: center;
          justify-content: space-between;
          word-break: break-all;
          width: 100%;
        }

        .update-time {
          flex-shrink: 0; /* 防止被挤压 */
          font-size: 0.8rem !important;
          color: #999;
          margin-left: 1rem;
        }

        .owner-wrapper {
          height: 1.4rem;
          line-height: 1.4rem;

          .icon-up {
            display: inline-block;
            width: 0.8rem;
            height: 0.8rem;
            background-image: url("@/assets/images/ico-up.png");
            background-size: 100% 100%;
            background-position: center center;
            vertical-align: middle;
          }

          .owner {
            font-size: 0.8rem;
            color: #999999;
            margin-left: 0.4rem;
            vertical-align: middle;
          }
        }
      }

      .count-info {
        display: flex;
        align-items: center;
        margin-top: auto; /* Pushes the footer to the bottom */
        width: 100%; /* 让 footer 占满 .program-description */

        .icon-play {
          width: 0.875rem;
          height: 0.75rem;
          background-size: 100% 100%;
          background-position: left center;
          background-image: url("@/assets/images/ico-play.png");
        }

        .icon-barrage {
          width: 0.875rem; // Converted 14px to rem
          height: 0.75rem; // Converted 12px to rem
          background-size: 100% 100%;
          background-position: left center;
          margin-left: 0.625rem; // Converted 10px to rem
          background-image: url("@/assets/images/ico-danmu.png");
        }

        .play-count {
          margin-left: 0.375rem; // Converted 6px to rem
          font-size: 0.6875rem; // Converted 11px to rem
        }

        .barrage-count {
          margin-left: 0.375rem; // Converted 6px to rem
          font-size: 0.6875rem; // Converted 11px to rem
        }

        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
}

.van-divider {
  margin-top: 0.2rem; /* Adjust the top margin as needed */
  margin-bottom: 0.2rem; /* Adjust the bottom margin as needed */
}


</style>