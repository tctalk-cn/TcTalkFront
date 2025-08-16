<template>
  <div class="sound-info-container">
    <div class="d-title" v-html="title"/>
    <div class="d-description" v-html="description"/>
    <van-divider/>
    <div class="d-actions">
      <van-icon @click="emits('handlePraised')" name="good-job" size="20"
                :color=" '#f9476f'"/>
      <van-icon @click="emits('handleLikes')" name="like-o" size="20" :color="'#B3C0D1'"/>
      <van-icon @click="emits('handleCollection')" name="star" size="20"
                :color="'#ffb701'"/>
      <van-icon @click="emits('handleShare')" name="share" size="20" color="#1989fa"/>
    </div>
    <!--推荐列表-->
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  mediaId: string,
  mediaCreatorMemberId: string,
  description: string;
  title: string;
}>();

// 定义父组件方法
const emits = defineEmits(["handleLikes", "handlePraised", "handleCollection", "handleShare"]);

</script>
<style lang="scss" scoped>
.sound-info-container {
  height: 100%;
  padding-left: 1rem !important;

  .d-title {
    font-weight: bold;
    padding: 0.5rem;
    text-align: left;
    font-size: 1.2rem;
  }

  .d-description {
    text-align: left;
    font-size: 0.7rem;
  }

  .d-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 50px;
    margin-right: 50px;

    .icon {
      margin-right: 10px; /* 增加图标之间的右侧间距 */
      padding: 2px 2px;
      flex-shrink: 0;
    }
  }
}
</style>