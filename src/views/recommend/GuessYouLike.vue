<template>
  <div class="sudden-popular-recommend-container">
    <Title title="猜你喜欢" :show-arrow="true"/>
    <swiper
        :slidesPerView="1"
        :spaceBetween="5"
        :autoHeight="true"
        :modules="modules"
        @slide-change="onSlideChange">
      <!-- 专属推荐专辑列表 -->
      <swiper-slide
          v-for="(group, groupIndex) in groupedAlbums"
          :key="groupIndex"
          class="swiper-slide">

        <div class="album-card-group">
          <AlbumCard
              v-for="(item) in group"
              :key="item.albumId"
              :album="item"
              :showViewsCount="true"
              :showSubscriptionCount="true"
          />
        </div>
      </swiper-slide>
      <!-- 专辑订阅 -->
      <div v-if="isLastSlide" class="more-listen-button-container">
        <div class="more-listen-next-button">
          <van-icon name="arrow" size="12" @click=""/>
        </div>
      </div>
    </swiper>
  </div>
</template>
<script setup lang="ts">
import Title from "@/components/common/Title.vue";
import {useRouter} from "vue-router";
import {computed, onMounted, ref} from "vue";
// 引入 Swiper 组件
import {Swiper, SwiperSlide} from 'swiper/vue'
// 引入 Swiper 样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// import required modules
import {Pagination} from 'swiper/modules';

const modules = ref([Pagination]);

import {useRecallStore} from "@/stores/recall_store.ts";
import {AlbumForRecallResp} from "@/models/album.ts";
import AlbumCard from "@/components/common/AlbumCard.vue";

const {guessYouLikeRecommend} = useRecallStore();
const recommendAlbums = ref<AlbumForRecallResp[]>([]);
const isLastSlide = ref(false);

// 每页显示 3 个
const groupedAlbums = computed(() => {
  const result: AlbumForRecallResp[][] = [];
  for (let i = 0; i < recommendAlbums.value.length; i += 3) {
    result.push(recommendAlbums.value.slice(i, i + 3));
  }
  return result;
});
onMounted(async () => {
  recommendAlbums.value = await guessYouLikeRecommend(9,[]);
});

// 当 slide 发生变化时，更新 isLastSlide 状态
const onSlideChange = (event) => {
  const totalSlides = event.slides.length;  // 获取总的 slide 数量
  const slidesPerView = event.params.slidesPerView;  // 每页展示的 slide 数量
  const activeIndex = event.activeIndex;  // 当前活跃 slide 的索引
  // 判断是否是最后一页
  // 如果剩余的 slide 数量少于等于每页显示的数量，说明是最后一页
  const remainingSlides = totalSlides - activeIndex; // 剩余的 slide 数量
  isLastSlide.value = remainingSlides <= slidesPerView;
};

</script>

<style lang="scss">
.sudden-popular-recommend-container {
  background-color: #fff;
  overflow-y: auto;
  border-radius: 0.8rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  scrollbar-width: thin; /* 对 Firefox 设置窄滚动条 */
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 滚动条颜色 */

  .swiper-slide {
    display: flex;
    align-items: stretch;
  }

  .album-card-column {
    display: flex;
    flex-direction: column; /* 垂直排列 */
    gap: 0.5rem;           /* 卡片间距 */
  }

  .album-card-column AlbumCard {
    width: 100%; /* 卡片宽度撑满父容器 */
  }

}
</style>