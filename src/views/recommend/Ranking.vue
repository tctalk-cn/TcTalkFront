<template>
  <div class="ranking_container">
    <swiper
        :slidesPerView="'auto'"
        :spaceBetween="5"
        class="ranking_swiper"
        :modules="modules"
    >
      <swiper-slide clas="swiper-slide">
        <RankingList title="推荐榜" :show-award="true" :show-more="true" :ranking-data-list="recommendAlbums"/>
      </swiper-slide>
      <swiper-slide clas="swiper-slide">
        <RankingList title="儿童榜" :show-balloon="true" :show-more="true" :ranking-data-list="childrenAlbums"/>
      </swiper-slide>
      <swiper-slide clas="swiper-slide">
        <RankingList title="音乐榜" :show-music="true" :show-more="true" :ranking-data-list="musicAlbums"/>
      </swiper-slide>
      <swiper-slide clas="swiper-slide">
        <RankingList title="今日人气最高" :show-fire="true" :show-more="true" :ranking-data-list="popularAlbums"/>
      </swiper-slide>
      <swiper-slide clas="swiper-slide">
        <RankingList title="今日最新热品" :show-hot="true" :show-more="true" :ranking-data-list="latestHotAlbums"/>
      </swiper-slide>
      <swiper-slide clas="swiper-slide">
        <RankingList title="今日好评最多" :show-good="true" :show-more="true"
                     :ranking-data-list="mostPositiveReviewsAlbums"/>
      </swiper-slide>
      <swiper-slide clas="swiper-slide">
        <RankingList title="今日最热免费金品" :show-new="true" :show-more="true"
                     :ranking-data-list="hottestFreeReviewsAlbums"/>
      </swiper-slide>
    </swiper>

  </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Swiper, SwiperSlide} from "swiper/vue";
// 引入 Swiper 样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import 'swiper/css/pagination';

// import required modules
import {Pagination} from 'swiper/modules';

const modules = ref([Pagination]);

import RankingList from "@/components/common/RankingList.vue";
import {Album} from "@/models/album.ts";
import {useRecommendStore} from "@/stores/recommend_store.ts";

const {
  personalRecommendAlbums,
  childrenRecommendAlbums,
  musicRecommendAlbums,
  popularRecommendAlbums,
  latestHotRecommendAlbums,
  mostPositiveReviewsRecommendAlbums,
  hottestFreeReviewsRecommendAlbums
} = useRecommendStore();
const recommendAlbums = ref<Album[]>();
const childrenAlbums = ref<Album[]>();
const musicAlbums = ref<Album[]>();
const popularAlbums = ref<Album[]>();
const latestHotAlbums = ref<Album[]>();
const mostPositiveReviewsAlbums = ref<Album[]>();
const hottestFreeReviewsAlbums = ref<Album[]>();

onMounted(() => {
  personalRecommendAlbums().then(res => {
    recommendAlbums.value = res;
  });
  childrenRecommendAlbums().then(res => {
    childrenAlbums.value = res;
  });
  musicRecommendAlbums().then(res => {
    musicAlbums.value = res;
  });
  popularRecommendAlbums().then(res => {
    popularAlbums.value = res;
  });
  latestHotRecommendAlbums().then(res => {
    latestHotAlbums.value = res;
  });
  mostPositiveReviewsRecommendAlbums().then(res => {
    mostPositiveReviewsAlbums.value = res;
  });
  hottestFreeReviewsRecommendAlbums().then(res => {
    hottestFreeReviewsAlbums.value = res;
  });
})

</script>

<style lang="scss" scoped>
.ranking_container {
  width: 100%; /* 父容器自适应宽度 */
  .ranking_swiper {
    width: 100%;
    height: 100%;
  }
}

.swiper-slide {
  width: 80%;
}
</style>