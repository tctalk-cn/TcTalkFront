<template>
  <div class="search-result-container">
    <div class="search-result-for-best-match-container" v-if="bestMatchAlbum">
      <Title title="最佳匹配"/>
      <div class="album-card">
        <router-link class="album-image"
                     :to='{path: "/creative/albumDetail", query: {albumId: bestMatchAlbum.id,albumCreatorMemberId:bestMatchAlbum.creatorMemberId}}'>
          <van-image :src="bestMatchAlbum.coverUrl" :alt="bestMatchAlbum.name"/>
        </router-link>
        <div class="album-content">
          <p class="album-title">{{ bestMatchAlbum.name }}</p>
          <p class="album-subtitle">
            <van-text-ellipsis :content="bestMatchAlbum.remark" expand-text="展开" collapse-text="收起" rows="2"/>
          </p>
          <div class="album-footer">
            <van-tag color="#7232dd" round class="tag">好评如潮</van-tag>
            <span class="icon-play"/>
            <span class="play-count">{{ bestMatchAlbum.commentCount }}</span>
          </div>
        </div>
      </div>
      <van-row :gutter="12">
        <van-col span="16">
          <van-button v-if="latestListenHistory!==null&&latestListenHistory?.mediaTitle"
                      icon="play-circle"
                      type="default"
                      size="small"
                      round
                      class="w-full flex items-center justify-center text-xs">
            续播
            <van-divider vertical :hairline="false"/>
            <span>{{ latestListenHistory.mediaTitle }}</span>
          </van-button>
          <van-button v-else
                      icon="play-circle"
                      type="default"
                      size="small"
                      round
                      class="w-full flex items-center justify-center text-xs">
            开始播放
            <van-divider vertical :hairline="false"/>
          </van-button>
        </van-col>
        <van-col span="8">
          <van-button icon="add"
                      type="default"
                      size="small"
                      round
                      class="w-full flex items-center justify-center text-xs"
                      v-if="!isSubscribed"
                      @click="addSubscription(bestMatchAlbum.creatorMemberId,bestMatchAlbum.id)">
            免费订阅
          </van-button>
          <van-button type="default"
                      size="small"
                      round
                      class="w-full flex items-center justify-center text-xs"
                      v-else
                      @click="cancelSubscription(bestMatchAlbum.creatorMemberId,bestMatchAlbum.id)">
            已订阅
          </van-button>
        </van-col>
      </van-row>
    </div>
    <div class="search-result-for-album-container">
      <Title :title="title"/>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadSearchResultData('load')"
        >
          <div v-for="(item,index) in realSearchResult"
               :key="item.id"
               :title="item.name">
            <div class="album-card">

              <div class="rank-indicator">
                <div v-if="index<3">
                  <van-image :src="'../../src/assets/images/rank'+(index+1)+'.png'"/>
                </div>
                <div v-else>
                  {{ index + 1 }}
                </div>
              </div>
              <router-link class="album-image"
                           :to='{path: "/creative/albumDetail", query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
                <van-image :src="item.coverUrl" :alt="item.name"/>
              </router-link>
              <div class="album-content">
                <p class="album-title">{{ item.name }}</p>
                <p class="album-subtitle">
                  <van-text-ellipsis :content="item.remark" expand-text="展开" collapse-text="收起" rows="2"/>
                </p>
                <div class="album-footer">
                  <van-tag v-if="index<3" color="#ffe1e1" text-color="#ad0000" class="mr-1">神仙作品</van-tag>
                  <van-tag v-else color="#7232dd" round class="tag">好评如潮</van-tag>
                  <span class="icon-play"/>
                  <span class="play-count">{{ item.commentCount }}</span>
                </div>
              </div>

            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Album} from "@/models/album.ts";
import Title from "@/components/common/Title.vue";
import {ref, toRefs, watch} from "vue";
import {useRoute} from "vue-router";
import {useSearchStore} from "@/stores/search_store.ts";
import {useAlbumStore} from "@/stores/album_store.ts";
import {useProfileStore} from "@/stores/member_store.ts";
import {MemberListenHistory} from "@/models/member_listen_history.ts";

const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const route = useRoute();
const isSubscribed = ref<Boolean>(false);
const {
  addSubscription,
  cancelSubscription,
  isSubscribedByMember,
  lastListenHistory,
} = useAlbumStore();

const props = defineProps<{
  title: string,
  doRealQuery: string,
}>();

const {
  realSearchByKeyword,
  bestSearchByKeyword
} = useSearchStore();

const {memberInfo} = toRefs(useProfileStore());
const {loadMemberInfo} = useProfileStore();
const channelId = route.query.channelId as string;
const bestMatchAlbum = ref<Album>(null);
const realSearchResult = ref<Album[]>([]);
const searchParam = {pageNum: 0, pageSize: 10,};
const latestListenHistory = ref<MemberListenHistory>(null);

// 加载专辑数据
const loadSearchResultData = async (type = 'refresh') => {
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
    const albums = await realSearchByKeyword(props.doRealQuery, "", searchParam.pageNum, searchParam.pageSize);
    if (type === 'refresh') {
      realSearchResult.value = albums;
    } else {
      realSearchResult.value = realSearchResult.value.concat(albums);
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
    // 可以设置为 true 来阻止继续触发加载
    finished.value = true;
  } finally {
    // 结束加载
    loading.value = false;
    if (type === 'refresh') {
      refreshing.value = false; // 停止下拉刷新状态
    }
  }
};

// 监听 props.doRealQuery 的变化
watch(
    () => props.doRealQuery,
    async (newVal) => {
      if (newVal) {
        await loadMemberInfo();
        bestMatchAlbum.value = await bestSearchByKeyword(newVal, "");
        latestListenHistory.value = await lastListenHistory(bestMatchAlbum.value.id);
        isSubscribed.value = await isSubscribedByMember(memberInfo.value.id, bestMatchAlbum.value.id);
      }
    },
    {immediate: true} // 可选，首次挂载时是否执行
);

// 刷新
const onRefresh = () => {
  // 清空数据
  finished.value = false;
  // 重新加载
  loading.value = false;
  // 刷新
  refreshing.value = true;
  loadSearchResultData();
}
</script>

<style lang="scss" scoped>
.search-result-container {
  width: 100%; /* 父容器自适应宽度 */

  .search-result-for-best-match-container {
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
    overflow-y: auto; /* 允许垂直滚动 */
    scrollbar-width: thin; /* 对 Firefox 设置窄滚动条 */
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 滚动条颜色 */
    padding: 0.4rem;
  }

  .search-result-for-album-container {
    border-radius: 0.2rem;
    box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1);
    overflow-y: auto; /* 允许垂直滚动 */
    scrollbar-width: thin; /* 对 Firefox 设置窄滚动条 */
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 滚动条颜色 */
    padding: 0.4rem;
  }

  .best-match-footer {
    padding: 0.4rem;
  }


  .album-card {
    display: flex; /* 主容器使用 Flex 布局 */
    align-items: center; /* 子元素垂直居中 */
    padding: 0.6rem;
    background-color: #fff;
    border-radius: 0.2rem;
    flex-wrap: nowrap; /* 防止子元素换行 */
    margin: 0.4rem 0;
    transition: all 0.3s;

    .rank-indicator {
      width: 1.4rem;
      text-align: center;
      font-weight: bold;
      color: #999;
      margin-right: 0.5rem;
    }

    .album-image {
      display: block; /* 让 router-link 不占整行 */
      flex-shrink: 0; /* 不允许压缩 */
      width: 5rem;
      height: 5rem;
      border-radius: 0.4rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: 5rem 5rem;
      background-position: center;
      background-repeat: no-repeat;
      margin-left: 0.4rem; /* 增加间距 */
      object-fit: cover;
    }

    .album-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      padding: 0 0.5rem;

      .album-title {
        font-size: 1rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.2rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .album-subtitle {
        font-size: 0.75rem;
        color: #999;
        margin-bottom: 0.4rem;
      }

      .album-footer {
        display: flex;
        align-items: center;

        .tag {
          margin-right: 0.4rem;
        }

        .icon-play {
          width: 0.875rem;
          height: 0.75rem;
          background-size: 100% 100%;
          background-image: url("@/assets/images/ico-play.png");
          margin-right: 0.25rem;
        }

        .play-count {
          font-size: 0.75rem;
          color: #666;
        }
      }
    }
  }
}

</style>
