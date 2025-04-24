<template>
  <div class="children-swiper-list-container">
    <div class="children-attributes">
      <swiper :slidesPerView="6" :loop="false">
        <!-- 属性集合 -->
        <swiper-slide v-for="(item, index) in attributes" :key="index">
          <div class="children_friend_album_filter">
            <el-button round plain size="small" type="info" @click="emitAttributeClick(item.id)">
              {{ item.val }}
            </el-button>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="children-swiper-list">
      <Swiper :slidesPerView="'auto'" :spaceBetween="2" class="ranking_swiper" :modules="modules">
        <!-- 遍历分组后的数组 -->
        <SwiperSlide v-for="(group, groupIndex) in groupedDataList" :key="groupIndex">
          <div v-for="(item) in group" :key="item.id">
            <router-link class="children-content"
                         :to='{path: "/creative/albumDetail", query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}}'>
              <div class="children-image-container">
                <van-image :src="item.coverUrl" :alt="item.name"/>
              </div>
              <div class="children-swiper-album-info-wrapper">
                <div>
                  <p style="font-weight: bold">{{ item.name }}</p>
                </div>
                <div>
                  <p class="children-category-wrapper">
                    <van-text-ellipsis :content="item.description"/>
                  </p>
                </div>
                <div class="count-info">
                  <span style="padding-right: 0.2rem" v-if="!item.paid">
                    <van-tag type="success" plain size="medium">限免</van-tag>
                  </span>
                  <span class="icon-play"/>
                  <span class="play-count">{{ item.commentCount }}</span>
                  <span class="icon-barrage"/>
                  <span class="barrage-count">{{ item.commentCount }}</span>
                </div>
                <div class="children-owner-wrapper">
                  <span class="children-icon-up"></span>
                  <span class="owner">{{ item.creatorNickname }}</span>
                </div>
              </div>
            </router-link>
            <van-divider/>
          </div>
        </SwiperSlide>
      </Swiper>
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

// import required modules
import {Pagination} from 'swiper/modules';
import {computed, ref} from "vue";

const modules = ref([Pagination]);
const props = defineProps<{
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

// 分组函数：每组包含固定数量的元素
const groupDataList = (list: Album[] | undefined, groupSize: number) => {
  if (!list) return [];
  const grouped: Album[][] = [];
  for (let i = 0; i < list.length; i += groupSize) {
    grouped.push(list.slice(i, i + groupSize));
  }
  return grouped;
};

// 计算属性：分组后的 dataList，每组包含 3 个元素
const groupedDataList = computed(() => groupDataList(props.dataList, 3));

</script>

<style lang="scss" scoped>
.children-swiper-list-container {
  background-color: #fff;
  width: 100%;

  .ranking_swiper {
    width: 100%;
    height: 100%;
  }

  .children-swiper-list {
    padding: 0.2rem 0;

    .children-content {
      overflow-y: auto;
      display: flex; /* 主容器使用 Flex 布局 */
      align-items: center; /* 子元素垂直居中 */
      padding: 0.2rem 0.4rem;
      flex-wrap: nowrap; /* 防止子元素换行 */


      .children-image-container {
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

      .children-swiper-album-info-wrapper {
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

        .children-category-wrapper {
          font-size: 0.6rem;
          color: #999999;
          vertical-align: middle;
        }

        .children-owner-wrapper {
          .children-icon-up {
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

  }
}

.swiper-slide {
  width: 80%;
}

.van-divider {
  margin-top: 0.2rem; /* Adjust the top margin as needed */
  margin-bottom: 0.2rem; /* Adjust the bottom margin as needed */
}

/* 按钮样式 */
.danger-button {
  background-color: transparent !important;
  border-color: #f56c6c !important; /* Danger 色 */
  color: #f56c6c !important;
}

.info-button {
  background-color: transparent !important;
  border-color: #909399 !important; /* Info 色 */
  color: #4C4D4F !important;
}

</style>
