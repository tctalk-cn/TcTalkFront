<template>
  <div class="recommend-container">
    <!--最近收听-->
    <RecentlyListen/>
    <!--童年好伙伴-->
    <ChildrenFriend/>
    <!--你的专属推荐-->
    <PersonalRecommend/>
    <!--排行榜-->
    <Ranking/>
    <!--突然爆火-->
    <SuddenPopularRecommend/>
    <!--猜你喜欢-->
    <GuessYouLike/>
    <!--为你推荐-->
    <RecommendForU/>
    <!-- 回到顶部按钮 -->
    <van-back-top/>
  </div>
</template>
<script setup lang="ts">
import RecentlyListen from "@/views/recommend/RecentlyListen.vue";
import ChildrenFriend from "@/views/recommend/ChildrenFriend.vue";
import Ranking from "@/views/recommend/Ranking.vue";
import GuessYouLike from "@/views/recommend/GuessYouLike.vue";
import PersonalRecommend from "@/views/recommend/PersonalRecommend.vue";
import SuddenPopularRecommend from "@/views/recommend/SuddenPopularRecommend.vue";
import RecommendForU from "@/views/recommend/RecommendForU.vue";
</script>

<style lang="scss">
.recommend-container{
  padding: 0 0.5rem; /* 添加适当的内边距 */
  /* 给容器内的每个直接子元素添加间距 */
  > * {
    margin-bottom: 0.5rem; /* 子组件之间的间距 */
  }

  /* 去掉最后一个的间距 */
  > *:last-child {
    margin-bottom: 0;
  }

}
</style>