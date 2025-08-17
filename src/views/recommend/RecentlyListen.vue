<template>
  <div class="recently_listen_container">
    <Title title="最近收听" :show-arrow="true"/>
    <swiper
        :slidesPerView="3"
        :spaceBetween="5"
        @slide-change="onSlideChange">
      <!-- 收听历史 -->
      <swiper-slide v-for="(item, index) in memberListenHistories" :key="index"
                    @click="router.push({path:'/sound/soundDetail',query:{mediaId:item.mediaId,creatorMemberId:item.memberId}})">
        <ListenPlay :title="item.mediaTitle"
                    :picUrl="item.mediaCoverUrl"
                    :description="item.mediaTitle"
                    :media-listen-to="item.mediaListenTo"
                    :media-total-duration="item.mediaTotalDuration"
                    :index="index"
                    :update-time="item.updateTime"
                    :typ="1"
        />
      </swiper-slide>
      <!-- 专辑订阅 -->
      <swiper-slide v-for="(item, index) in memberAlbumSubscriptions" :key="index"
                    @click="router.push({path:'/creative/albumDetail',query:{albumId: item.id}})">
        <ListenPlay :title="item.subscribedAlbumName"
                    :picUrl="item.subscribedAlbumCoverUrl"
                    :description="item.subscribedAlbumName"
                    :update-time="item.updateTime"
                    :typ="2"
        />
      </swiper-slide>
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
import {useRecommendStore} from "@/stores/recommend_store.ts";
import {onMounted, ref} from "vue";
import {MemberListenHistory} from "@/models/member_listen_history.ts";
import {AlbumSubscription} from "@/models/album_subscription.ts";
import ListenPlay from "@/components/common/ListenPlay.vue";
// 引入 Swiper 组件
import {Swiper, SwiperSlide} from 'swiper/vue'
// 引入 Swiper 样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const router = useRouter();

const {listListenHistory, listAlbumSubscriptions} = useRecommendStore();
const memberListenHistories = ref<MemberListenHistory[]>([]);
const memberAlbumSubscriptions = ref<AlbumSubscription[]>([])
const isLastSlide = ref(false);
onMounted(async () => {
  memberListenHistories.value = await listListenHistory("0", 6);
  memberAlbumSubscriptions.value = await listAlbumSubscriptions("0", 4);
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
.recently_listen_container {
  width: 100%; /* 父容器自适应宽度 */
  padding: 0 0.5rem; /* 添加适当的内边距 */
}


.more-listen-button-container {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%; /* 确保容器高度和 swiper 一致 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1; /* 确保按钮在 Swiper 上方 */
  background-color: rgba(0, 0, 0, 0.4); /* 给按钮容器添加透明背景色 */

  .more-listen-next-button {
    background-color: rgba(201, 201, 201, 0.8); /* 给按钮添加透明背景色 */
    color: #FFFFFF;
    width: 0.5rem; /* 控制按钮宽度 */
    border-radius: 0.8rem;
    cursor: pointer;
    text-align: center;
    box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.9; /* 使按钮稍微透明 */
  }
}

</style>