<template>
  <div class="novel-list-container">
    <div class="novel-attributes">
      <swiper :slidesPerView="6" :spaceBetween="1" :loop="false">
        <!-- 属性集合 -->
        <swiper-slide v-for="(item, index) in attributes" :key="index">
          <div class="children_friend_album_imag">
            <el-button round plain size="small" @click="emitAttributeClick(item.id)">{{ item.val }}</el-button>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="novel-list">
      <van-grid :column-num="3" :border="true"
                style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
        <van-grid-item v-for="(item) in novelDataList" :key="item.id">
          <router-link class="novel-album-info"
                       :to='{path: "/creative/albumDetail",
                     query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
            <div class="novel-cover-image-container">
              <van-image :src="item.coverUrl" :alt="item.name"/>
            </div>
            <div class="novel-album-info-wrapper">
              <div class="novel-album-title">
                <van-text-ellipsis rows="2" :content="assembleTile(item)"/>
              </div>
              <div class="ranking-actions">
                <span class="icon-play"/>
                <span class="play-count">{{ item.viewsCount }}</span>
              </div>
            </div>
          </router-link>
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>
<script setup lang="ts">
import {Album} from "@/models/album.ts";
import {CtCategoryAttributeValue} from "@/models/category.ts";
// 引入 Swiper 样式
import 'swiper/css';
import "swiper/swiper-bundle.css";
import {Swiper, SwiperSlide} from "swiper/vue";

defineProps<{
  novelDataList?: Album[],
  attributes?: CtCategoryAttributeValue[],
  showMusic?: boolean,
  showHot?: boolean,
  showFire?: boolean,
  showGood?: boolean,
  showNew?: boolean,
}>()

const emits = defineEmits(["filterAttributeHandler"]);

// 触发属性过滤handler
const emitAttributeClick = (attributeValId: string) => {
  emits("filterAttributeHandler", attributeValId);
}

// 定义动态拼接函数
const assembleTile = (albumItem: Album): string => {
  const freeLabel = albumItem.paid ? '' : '【免费】';
  const name = albumItem.name || '';
  const tagsName = albumItem.tagsName || '';
  return `${freeLabel} ${name} | ${tagsName}`.trim();
};
</script>

<style lang="scss" scoped>
.novel-list-container {
  width: 100%; /* 父容器自适应宽度 */
  padding: 0.5rem 0.5rem; /* 添加适当的内边距 */
  background: #FFFFFF;

  .novel-album-info {
    align-items: center; /* 子元素垂直居中 */
    padding: 0 0.1rem;
    flex-wrap: nowrap; /* 防止子元素换行 */


    .novel-cover-image-container {
      flex-shrink: 0; /* 不允许压缩 */
      width: 6rem;
      height: 6rem;
      border-radius: 0.6rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: 6rem 6rem;
      background-position: center;
      background-repeat: no-repeat;
    }

    .novel-album-info-wrapper {
      overflow: hidden; /* 防止内容超出 */
      .novel-album-title {
        font-size: 0.8rem;
        font-weight: bold;
        align-items: center;
      }

      .ranking-actions {
        color: #999999;
        display: flex;
        align-items: center; /* 子元素垂直居中 */

        .icon-play {
          width: 0.875rem; // Converted 14px to rem
          height: 0.75rem; // Converted 12px to rem
          background-size: 100% 100%;
          background-position: left center;
          background-image: url("@/assets/images/ico-play.png");
        }

        .play-count {
          margin-left: 0.1rem;
          font-size: 0.75rem;
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
