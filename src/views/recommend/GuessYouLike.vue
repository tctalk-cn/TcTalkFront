<template>
  <div class="guess-you-like-container">
    <Title title="猜你喜欢"/>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadRecommendAlbumData('load')"
      >
        <div v-for="(item) in guessYouLikeAlbums"
             :key="item.id"
             :title="item.name">
          <router-link class="guess-content"
                       :to='{path: "/creative/albumDetail", query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
            <div class="guess-image-container">
              <van-image :src="item.coverUrl" :alt="item.name"/>
            </div>
            <div class="guess-album-info-wrapper">
              <div>
                <p style="font-weight: bold">{{ item.name }}</p>
              </div>
              <div>
                <p class="guess-category-wrapper">{{ item.name }}</p>
              </div>
              <div class="count-info">
                <span class="icon-play"/>
                <span class="play-count">{{ item.commentCount }}</span>
                <span class="icon-barrage"/>
                <span class="barrage-count">{{ item.commentCount }}</span>
              </div>
              <div class="guess-owner-wrapper">
                <span class="guess-icon-up"></span>
                <span class="owner">{{ item.creatorNickname }}</span>
              </div>
              <div class="action-buttons">
                <van-button hairline round size="mini" @click="more(item.id)">...</van-button>
              </div>
            </div>
          </router-link>
          <van-divider/>
        </div>
      </van-list>
    </van-pull-refresh>

  </div>
</template>
<script setup lang="ts">
import Title from "@/components/common/Title.vue";
import {useRecommendStore} from "@/stores/recommend_store.ts";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {Album} from "@/models/album.ts";
import {formatDate} from "date-fns";

const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  pageNum: 0,
  pageSize: 6,
};

const {
  guessYouLikeRecommendAlbums
} = useRecommendStore();
const router = useRouter();
const guessYouLikeAlbums = ref<Album[]>([]);
// 加载专辑数据
const loadRecommendAlbumData = async (type = 'refresh') => {
  if (type === 'refresh') {
    searchParam.pageNum = 1;
    refreshing.value = false;
  } else {
    searchParam.pageNum++;
  }
  const albums = await guessYouLikeRecommendAlbums(searchParam.pageNum, searchParam.pageSize);
  if (type === 'refresh') {
    guessYouLikeAlbums.value = albums;
    // 在数据加载完成后再更新 refreshing 状态
    refreshing.value = false;
    if (albums === null || albums.length === 0) {
      finished.value = true;
    }
  } else {
    if (albums && albums.length > 0) {
      guessYouLikeAlbums.value = guessYouLikeAlbums.value.concat(albums);
    } else {
      // 如果没有更多数据，则回滚页码
      searchParam.pageNum--;
      finished.value = true;
    }
    // 在数据加载完成后再更新 loading 状态
    loading.value = false;
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
  loadRecommendAlbumData();
}

const formatDateTime = (time: string) => {
  if (time == null || time === '') {
    return 'N/A';
  }
  const currentTime = new Date().getTime();
  const updateDate = new Date(time).getTime();
  const diffInMs = currentTime - updateDate;
  const diffInMin = diffInMs / (1000 * 60);
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  // 如果小于1min，显示"刚刚更新"
  if (diffInMin < 1) {
    return `刚刚更新`;
  }
  // 如果在60分钟内，显示"X分钟前"
  if (diffInMin < 60) {
    return `${Math.floor(diffInMin)}分钟前更新`;
  }
  // 如果在24小时以内，显示"X小时前"
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}小时前更新`;
  }

  // 如果在30天以内，显示"X天前"
  if (diffInDays < 30) {
    return `${Math.floor(diffInDays)}天前更新`;
  }

  // 如果大于30天，显示"YYYY-MM-DD"
  return formatDate(updateDate, 'yyyy-MM-dd');
}

const more = (id) => {

}

</script>

<style lang="scss" scoped>
.guess-you-like-container {
  background-color: #fff;
  overflow-y: auto;

  .guess-content {
    overflow-y: auto;
    display: flex; /* 主容器使用 Flex 布局 */
    align-items: center; /* 子元素垂直居中 */
    padding: 0.2rem 0.4rem;
    flex-wrap: nowrap; /* 防止子元素换行 */


    .guess-image-container {
      width: 6rem;
      height: 6rem;
      border-radius: 0.8rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: 6rem 6rem;
      background-position: center;
      background-repeat: no-repeat;
      margin-left: 0.4rem; /* 增加间距 */
    }

    .guess-album-info-wrapper {
      margin-top: 0.2rem;
      flex: 1; /* 占据剩余空间 */
      display: flex;
      flex-direction: column; /* 内容垂直排列 */
      justify-content: center; /* 垂直居中 */
      overflow: hidden; /* 防止内容超出 */
      padding: 0 0.8rem;

      p {
        height: 1.1rem;
        line-height: 1.1rem;
        overflow: hidden;
        font-size: 0.9rem;
        font-weight: 400;
        color: #212121;
        display: flex;
        align-items: center;
        justify-content: space-between;
        word-break: break-all;
        width: 100%;
      }

      .guess-category-wrapper {
        height: 1.4rem;
        line-height: 1.4rem;
        font-size: 0.8rem;
        color: #999999;
        vertical-align: middle;
      }

      .guess-owner-wrapper {
        height: 1.4rem;
        line-height: 1.4rem;

        .guess-icon-up {
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

      .count-info {
        margin-top: 0.125rem;
        color: #999999;
        font-size: 0;

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