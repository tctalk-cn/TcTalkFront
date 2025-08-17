<template>
  <!--最近收听-->
  <RecentlyListen/>
  <!--童年好伙伴-->
  <ChildrenFriend/>
  <!--排行榜-->
  <Ranking/>
  <!--猜你喜欢-->
  <GuessYouLike/>
  <!-- 回到顶部按钮 -->
  <van-back-top/>
</template>
<script setup lang="ts">
import RecentlyListen from "@/views/recommend/RecentlyListen.vue";
import ChildrenFriend from "@/views/recommend/ChildrenFriend.vue";
import Ranking from "@/views/recommend/Ranking.vue";
import GuessYouLike from "@/views/recommend/GuessYouLike.vue";
</script>