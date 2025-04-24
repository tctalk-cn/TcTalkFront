<template>
  <div class="children-list-container">
    <div class="children-attributes">
      <swiper :slidesPerView="6" :spaceBetween="1" :loop="false">
        <!-- 属性集合 -->
        <swiper-slide v-for="(item, index) in attributes" :key="index">
          <div class="children_friend_album_filter">
            <el-button round  plain size="small" type="info" @click="emitAttributeClick(item.id)">{{ item.val }}</el-button>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="children-list">
      <van-grid :column-num="3" :border="true"
                style="--van-grid-item-content-background: transparent; --van-grid-item-content-padding: 0.2rem;">
        <van-grid-item v-for="(item) in dataList" :key="item.id">
          <router-link class="children-album-info"
                       :to='{path: "/creative/albumDetail",
                     query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
            <div class="children-cover-image-container">
              <van-image :src="item.coverUrl" :alt="item.name"/>
            </div>
            <div class="children-album-info-wrapper">
              <div class="children-album-title">
                <van-text-ellipsis rows="2" :content="assembleTile(item)"/>
              </div>
              <div class="ranking-actions">
                <span style="padding-right: 0.2rem" v-if="!item.paid"><van-tag type="success" plain
                                                                               size="medium">限免</van-tag></span>
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
  dataList?: Album[],
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
  const name = albumItem.name || '';
  const tagsName = albumItem.tagsName || '';
  return ` ${name} | ${tagsName}`.trim();
};
</script>

<style lang="scss" scoped>
.children-list-container {
  width: 100%; /* 父容器自适应宽度 */
  padding: 0.5rem 0.5rem; /* 添加适当的内边距 */
  background: #FFFFFF;

  .children_friend_album_filter {
  }

  .children-album-info {
    align-items: center; /* 子元素垂直居中 */
    margin-top: 0.2rem;
    flex-wrap: nowrap; /* 防止子元素换行 */


    .children-cover-image-container {
      flex-shrink: 0; /* 不允许压缩 */
      width: 7rem;
      height: 7rem;
      border-radius: 0.6rem;
      overflow: hidden;
      background-color: #e7e7e7;
      background-image: url("@/assets/images/tv.png");
      background-size: 7rem 7rem;
      background-position: center;
      background-repeat: no-repeat;
    }

    .children-album-info-wrapper {
      overflow: hidden; /* 防止内容超出 */
      .children-album-title {
        font-size: 0.8rem;
        font-weight: bold;
        align-items: center;
      }

      .ranking-actions {
        color: #999999;
        display: flex;
        align-items: center; /* 子元素垂直居中 */

        span {
          margin-right: 0.3rem;
        }

        span:last-child {
          margin-right: 0; /* 移除最后一个 span 的右边距 */
        }

        .icon-play {
          width: 0.875rem; // Converted 14px to rem
          height: 1rem; // Converted 12px to rem
          background-size: 100% 100%;
          background-position: left center;
          background-image: url("@/assets/images/ico-play.png");
        }

        .play-count {
          font-size: 1rem;
        }
      }
    }
  }

}


</style>
