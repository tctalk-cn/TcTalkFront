<template>
  <div class="plan-category-section">
    <swiper
        :slidesPerView="2"
        :spaceBetween="10"
        effect="coverflow"
        :coverflowEffect="{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
            }">
      <swiper-slide v-for="(item, index) in planCategories"
                    class="plan-item"
                    :key="index"
                    @click="goDetail(item)">
        <div class="plan-type">{{ item.categoryName }}</div>
        <div class="plan-desc">
          {{ item.bestPlanPromotionLabel }}
          <van-icon name="arrow" size="12"/>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {Swiper, SwiperSlide} from "swiper/vue";
// 引入 Swiper 样式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import {MemberPlanCategory} from "@/models/member_plan_category.ts";
import {useProfileStore} from "@/stores/member_store.ts";

const {listEnabledPlanCategory} = useProfileStore();

const router = useRouter();

const categories = ref([
  {id: 1, type: 'VIP会员', description: '享受基础权益'},
  {id: 2, type: 'VIP儿童', description: '儿童专属权益'},
  {id: 3, type: 'VIP白金', description: '高级权益套餐'},
  {id: 4, type: 'SVIP', description: '顶级会员服务'},
]);

const swiperWidth = ref(0);
// 会员计划分类
const planCategories = ref<MemberPlanCategory[]>();

onMounted(async () => {
  // 保证屏幕展示2个slide
  swiperWidth.value = window.innerWidth * 0.48;
  planCategories.value = await listEnabledPlanCategory();
});

const goDetail = (item) => {
  router.push(`/member/plan/${item.id}`);
};
</script>

<style lang="scss" scoped>
.plan-category-section {
  margin-top: 0.2rem;
  padding: 0 0.2rem;
}

.plan-item {
  background: rgba(255, 255, 255, 0.15); /* 半透明白色，和蓝色背景协调 */
  border-radius: 0.5rem;
  padding: 0.5rem 0.8rem;
  color: $fc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 3rem;
  box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.2);
}

.plan-type {
  font-size: $font-size; /* 稍小字体 */
  font-weight: 600;
}

.plan-desc {
  font-size: $font-size-sm;
  opacity: 0.9;
  margin-top: 0.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
