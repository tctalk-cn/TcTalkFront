<template>
  <div class="home-advertise">
    <div
        v-for="slot in advertiseSlots"
        :key="slot.region"
        :class="['home-advertise-region', `region-${slot.region}`]"
        :style="{ width: `${slot.width}${slot.widthUnit}`, height: `${slot.height}${slot.heightUnit}` }">
      <!-- 渲染轮番广告 -->
      <template v-if="slot.carouselInterval > 0">
        <div class="swiper-advertise">
          <swiper
              :spaceBetween="1"
              effect="coverflow"
              :autoplay="{
           delay: slot.carouselInterval*1000,
           disableOnInteraction: false,
           pauseOnMouseEnter: true,
           stopOnLastSlide:false,
           reverseDirection:false,
           waitForTransition:false
          } as any"
              :modules="[Autoplay,Controller,Pagination]"
              :loop="true"
              :pagination="{
            el: '.swiper-pagination',
            type: 'bullets',
          } as any"
          >
            <!-- 小说广告 -->
            <swiper-slide v-for="(item, index) in slot.advertisePuts" :key="index"
                          @click="router.push({path: item.targetUrl})">
              <AdvertiseCard
                  :picUrl="item.picUrl"
                  :height="slot.height"
                  :heightUnit="slot.heightUnit"
                  :tagsDisplayRule="item.tagsDisplayRule"
              />
            </swiper-slide>
            <!-- 进度条 -->
            <div class="swiper-pagination"></div>
          </swiper>
        </div>
      </template>
      <!-- 渲染静态广告 -->
      <template v-else>
        <div class="static-advertise" v-for="(item) in slot.advertisePuts" :key="item.id">
          <AdvertiseCard
              :picUrl="item.picUrl"
              :height="slot.height"
              :heightUnit="slot.heightUnit"
              :tagsDisplayRule="item.tagsDisplayRule"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引入 Swiper 样式
import {Autoplay, Controller, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/vue";
import {useRouter} from "vue-router";
// 引入 Swiper 样式
import 'swiper/css';
import "swiper/swiper-bundle.css";
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {AdvertiseSlotResp} from "@/models/channel_home_advertise.ts";
import AdvertiseCard from "@/components/common/AdvertiseCard.vue";

const router = useRouter();
defineProps<{
  advertiseSlots?: AdvertiseSlotResp[],
}>()

// const parseTags = (tagsDisplayRule) => {
//   if (tagsDisplayRule) {
//     try {
//       return JSON.parse(tagsDisplayRule);
//     } catch (error) {
//       console.error("Invalid tagsDisplayRule JSON:", tagsDisplayRule);
//       return {};
//     }
//   } else {
//     return {};
//   }
//
// }
</script>

<style scoped>
.home-advertise {
  display: flex;
  flex-wrap: wrap;
  padding: 0.3rem 0.2rem;
  gap: 0.6rem;

  .home-advertise-region {
    position: relative;
    overflow: hidden;
  }

  .home-advertise-tag {
    position: absolute;
    z-index: 10;
  }

  .home-advertise-tag-top-left {
    top: 0.4rem;
    left: 0.2rem;
  }

  .home-advertise-tag-top-right {
    top: 0.4rem;
    right: 0.2rem;
  }

  .home-advertise-tag-bottom-left {
    bottom: 0.4rem;
    left: 0.2rem;
  }

  .home-advertise-tag-bottom-right {
    bottom: 0.4rem;
    right: 0.2rem;
  }
}

.swiper-slide {
  position: relative; /* 确保子元素可以基于这个容器定位 */
}
</style>

