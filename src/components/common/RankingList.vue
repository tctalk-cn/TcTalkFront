<template>
  <div class="ranking-list-container">
    <Title :title="title" :show-more="showMore"
           :show-award="showAward"
           :show-balloon="showBalloon"
           :show-fire="showFire"
           :show-music="showMusic"
           :show-hot="showHot"
           :show-good="showGood"
           :show-new="showNew"
    />
    <div v-for="(item,index) in rankingDataList"
         :key="item.id"
         :title="item.name">
      <router-link class="ranking-album-info"
                   :to='{path: "/creative/albumDetail", query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
        <div class="ranking-sort">
          <div v-if="index<3">
            <van-image :src="'../../src/assets/images/rank'+(index+1)+'.png'"/>
          </div>
          <div v-else>
            {{ index + 1 }}
          </div>
        </div>
        <div class="ranking-cover-image-container">
          <van-image :src="item.coverUrl" :alt="item.name"/>
        </div>
        <div class="ranking-album-info-wrapper">
          <div>
            <p>{{ item.name }}</p>
          </div>
          <div>
            <p class="ranking-category">{{ item.name }}</p>
          </div>
          <div class="ranking-actions">
            <van-tag v-if="index<3" color="#ffe1e1" text-color="#ad0000" class="mr-1">神仙作品</van-tag>
            <van-tag v-else color="#7232dd" round class="mr-1">好评如潮</van-tag>
            <span class="icon-play"/>
            <span class="play-count">{{ item.commentCount }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import Title from "@/components/common/Title.vue";
import {Album} from "@/models/album.ts";

defineProps<{
  title: string,
  rankingDataList?: Album[],
  showPlay?: boolean,
  showArrow?: boolean,
  showMore?: boolean,
  showAward?: boolean,
  showBalloon?: boolean,
  showMusic?: boolean,
  showHot?: boolean,
  showFire?: boolean,
  showGood?: boolean,
  showNew?: boolean,
}>()
</script>

<style lang="scss" scoped>
.ranking-list-container {
  width: 100%; /* 父容器自适应宽度 */
  height: 21rem;
  padding: 0 0.5rem; /* 添加适当的内边距 */
  background: #FFFFFF;
  border-radius: 0.8rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* 允许垂直滚动 */
  scrollbar-width: thin; /* 对 Firefox 设置窄滚动条 */
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 滚动条颜色 */

  .ranking-album-info {
    display: flex; /* 主容器使用 Flex 布局 */
    align-items: center; /* 子元素垂直居中 */
    padding: 0.2rem 0.4rem;
    flex-wrap: nowrap; /* 防止子元素换行 */

    .ranking-sort {
      flex-shrink: 0; /* 不允许压缩 */
      width: 1.6rem;
      line-height: 1rem;
      text-align: center;
      color: #999999;
      font-size: 1.2rem;
    }

    .ranking-cover-image-container {
      flex-shrink: 0; /* 不允许压缩 */
      width: 5rem;
      height: 5rem;
      border-radius: 0.8rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: 5rem 5rem;
      background-position: center;
      background-repeat: no-repeat;
      margin-left: 0.4rem; /* 增加间距 */
    }

    .ranking-album-info-wrapper {
      flex: 1; /* 占据剩余空间 */
      display: flex;
      flex-direction: column; /* 内容垂直排列 */
      justify-content: center; /* 垂直居中 */
      overflow: hidden; /* 防止内容超出 */
      padding: 0 0.5rem;


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


      .ranking-category {
        height: 1.4rem;
        line-height: 1.4rem;
        font-size: 0.8rem;
        color: #999999;
        vertical-align: middle;
      }

      .ranking-actions {
        margin-top: 0.125rem;
        color: #999999;

        .ranking-tags {
          font-size: 0.75rem;
          font-weight: bold;
          margin-right: 0.2rem;
        }

        .icon-play {
          width: 0.875rem; // Converted 14px to rem
          height: 0.75rem; // Converted 12px to rem
          background-size: 100% 100%;
          background-position: left center;
          background-image: url("@/assets/images/ico-play.png");
        }

        .play-count {
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

}
.ranking-list-container::-webkit-scrollbar {
  width: 0.1rem; /* 滚动条宽度 */
}

.ranking-list-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2); /* 滚动条滑块颜色 */
  border-radius: 0.1rem; /* 滚动条滑块圆角 */
}

.ranking-list-container::-webkit-scrollbar-track {
  background: transparent; /* 滚动条轨道背景 */
}

</style>
