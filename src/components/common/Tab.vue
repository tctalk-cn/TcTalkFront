<template>
<!--  <div class="tab-container">-->
<!--    <div class="tab-item-container">-->
<!--      <div :class="activeIndex===0?'tab-item active':'tab-item'" @click="setIndex(0)">简介</div>-->
<!--      <div :class="activeIndex===1?'tab-item active':'tab-item'" @click="setIndex(1)">评论-->
<!--        <span v-if="commentCount>0" style="font-size: 10px">{{ commentCount }}</span>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>
<script setup lang="ts">
const props = defineProps<{
  description: string;
  mediaId: number,
  creatorMemberId: number,
  videoPlayer?: any;
  activeIndex: number;
  commentCount: number;
}>()

</script>
<style lang="scss" scoped>
.tab-container {
  width: 100%;
  height: 100%;
  position: relative;

  .tab-item-container {
    display: flex;
    justify-content: space-between;

    .tab-item {
      flex: 1;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      color: #666666;
      position: relative;

      &:active {
        color: #ffffff !important;
        background-color: #fb7299;
      }

      &.active {
        color: #fb7299;

        &:after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 50px;
          height: 2px;
          margin-left: -25px;
          background-color: #fb7299;
        }
      }
    }


  }
}
</style>