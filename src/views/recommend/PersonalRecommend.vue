<template>
  <div class="personal-recommend-container">
    <Title title="你的专属推荐" :show-arrow="true"/>
    <swiper
        :slidesPerView="1"
        :spaceBetween="5"
        :autoHeight="true"
        :modules="modules"
        @slide-change="onSlideChange">
      <!-- 专属推荐专辑列表 -->
      <swiper-slide class="swiper-slide"
                    v-for="(item, index) in recommendAlbums" :key="index"
                    @click="router.push({path:'/sound/soundDetail',query:{mediaId:item.albumId,creatorMemberId:item.creatorMemberId}})">
        <AlbumCard
            :album="item"
            :showPlayCount="true"
            :showCommentCount="true"
            :showBarrageCount="true"
            :showLikeCount="true"
            :showViewsCount="true"
            :showSubscriptionCount="true"
        />
      </swiper-slide>
      <!-- 专辑订阅 -->
      <!-- Next button, only visible when the last slide is reached -->
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
import {onMounted, ref} from "vue";
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

const router = useRouter();

const {recommendForUserTopK} = useRecallStore();
const recommendAlbums = ref<AlbumForRecallResp[]>([]);
const isLastSlide = ref(false);
onMounted(async () => {
  recommendAlbums.value = await recommendForUserTopK(9);
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
.personal-recommend-container {
  background-color: #fff;
  overflow-y: auto;
  padding: 0 0.5rem; /* 添加适当的内边距 */
  border-radius: 0.8rem;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.1);
  scrollbar-width: thin; /* 对 Firefox 设置窄滚动条 */
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent; /* 滚动条颜色 */
  height: 15rem;

  .swiper-slide {
    display: flex;
    align-items: stretch;
  }
}
</style>