<template>
  <div class="children_friend_container">
    <Title title="童年好伙伴" :show-more="true"/>
    <swiper
        :slidesPerView="5"
        :spaceBetween="5"
        effect="coverflow"
        :coverflowEffect="{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
            }">
      <!-- 童年伴侣 -->
      <swiper-slide v-for="(item, index) in childrenAlbums" :key="index"
                    @click="router.push({path: '/creative/albumDetail', query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}})">
        <div class="children_friend_album">
          <div class="children_friend_album_imag">
            <van-image
                round
                width="4rem"
                height="4rem"
                :src="item.coverUrl"
            />
            <van-tag v-if="isNew(item.createTime)" color="#ffe1e1" text-color="#FF0000" class="new-icon" round>新
            </van-tag>
          </div>
          <span class="children_friend_album_name">
            <van-text-ellipsis :content="item.name"/>
          </span>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>
<script setup lang="ts">
import Title from "@/components/common/Title.vue";
import {onMounted, ref} from "vue";
import {useRecommendStore} from "@/stores/recommend_store.ts";
import {Swiper, SwiperSlide} from "swiper/vue";
// 引入 Swiper 样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {useRouter} from "vue-router";
import {Album} from "@/models/album.ts";
import dayjs from "dayjs";

const router = useRouter();
const {childhoodAlbums} = useRecommendStore();
const childrenAlbums = ref([] as Album[]);
onMounted(async () => {
  childrenAlbums.value = await childhoodAlbums();
})

/**
 * 判断是否为一周内创建
 * @param createTime 创建时间字符串
 * @returns 是否为新内容
 */
const isNew = (createTime: string): boolean => {
  const now = dayjs();
  const created = dayjs(createTime);
  return now.diff(created, 'day') <= 7; // 判断是否在7天内
};
</script>

<style lang="scss">
.children_friend_container {
  width: 100%; /* 父容器自适应宽度 */

  .children_friend_album {
    display: flex;
    flex-direction: column;
    align-items: center; /* 居中对齐 */
    text-align: center; /* 文本居中 */

    .children_friend_album_imag {
      position: relative; /* 设置相对定位，便于定位图标 */
      width: 4rem;
      height: 4rem;

      .new-icon {
        position: absolute;
        top: 0.2rem; /* 调整图标位置 */
        right: 0.2rem;
        font-size: 0.6rem;
      }
    }

    .children_friend_album_name {
      font-size: 0.8rem;
      font-weight: 600; /* 使用较细的加粗，保持美观 */
      margin-top: 0.5rem; /* 图片与文字之间的间距 */
      color: #333; /* 可根据需要调整文字颜色 */
      line-height: 1.2; /* 提升文字的行间距，增强可读性 */
      max-width: 4.5rem; /* 限制名称宽度，与图片宽度匹配 */
      word-break: break-word; /* 长文字自动换行 */
    }
  }

}
</style>