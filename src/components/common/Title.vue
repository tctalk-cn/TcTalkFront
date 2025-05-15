<template>
  <div class="title-container">
    <!-- 左侧标题和图标 -->
    <div class="title-icons">
      <div class="title">{{ title }}</div>
      <div class="filter-attributes" v-if="filterAttributes?.length">
        <a class="filter-attribute"
           v-for="(attribute, index) in filterAttributes"
           :key="index"
           href="javascript:void(0);"
           @click="emits('attrClick',attribute.id)">
          / {{ attribute.val }}
        </a>
      </div>
      <div class="icons">
        <van-icon v-if="showPlay" name="play-circle"/>
        <van-icon v-if="showArrow" name="arrow" size="1rem"/>
        <van-icon v-if="showAward" name="award-o" size="1rem"/>
        <IconPark v-if="showBalloon" :icon="PartyBalloon" theme="outline" class="icon-park" :size="24"/>
        <van-icon v-if="showMusic" name="music-o" size="1rem"/>
        <van-icon v-if="showFire" name="fire-o" size="1rem"/>
        <van-icon v-if="showGood" name="good-job-o" size="1rem"/>
        <van-icon v-if="showHot" name="hot-o" size="1rem"/>
        <van-icon v-if="showNew" name="new-o" size="1rem"/>
      </div>
    </div>
    <div v-if="showMore" class="title-more-actions" @click="emits('moreClick')">
      更多
      <van-icon name="arrow" size="0.7rem"/>
    </div>
    <div v-if="showAll" class="title-more-actions" @click="emits('allClick')">
      查看全部
      <van-icon name="arrow" size="0.7rem"/>
    </div>
  </div>

</template>

<script setup lang="ts">
import {PartyBalloon} from "@icon-park/vue-next";
import IconPark from "@/components/common/IconPark.vue";
import {CtCategoryAttributeValue} from "@/models/category.ts";

defineProps<{
  title: string,
  showPlay?: boolean,
  showArrow?: boolean,
  showMore?: boolean,
  showAward?: boolean,
  showBalloon?: boolean,
  showMusic?: boolean,
  showHot?: boolean,
  showFire?: boolean,
  showGood?: boolean,
  showNew?: boolean,
  showAll?: boolean,
  filterAttributes?: CtCategoryAttributeValue[],
}>()
const emits = defineEmits(["moreClick", "allClick", "attrClick"]);

</script>

<style scoped>
.title-container {
  font-size: 1rem;
  padding-left: 0.5rem; /* 对应 py-3 */
  padding-top: 0.5rem; /* 对应 py-3 */
  margin-top: 0.3rem; /* 对应 mt-2 */
  margin-bottom: 0.6rem; /* 对应 mt-2 */
  display: flex; /* 对应 flex */
  align-items: center; /* 对应 items-center */
  justify-content: space-between; /* 左右内容两端对齐 */

  .title-icons {
    display: flex; /* 标题和图标容器 */
    align-items: center; /* 垂直居中 */

    .title {
      /* 您可以根据需要添加自定义样式 */
      font-weight: bold;
      font-family: Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
      line-height: 1;
    }

    .filter-attributes {
      display: flex;
      margin-left: 0.5rem;

      .filter-attribute {
        padding: 0.1rem 0.2rem;
        background-color: #f5f5f5;
        color: #999999;
        border-radius: 4px;
        font-size: 0.8rem;
        margin-right: 0.2rem;
        white-space: nowrap; /* 防止换行 */
      }
    }

    .icons {
      display: flex;

      > * {
        margin-right: 0.1rem;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .icon-park {
        vertical-align: middle;
        width: 1rem;
        height: 1rem;
        line-height: 1;
      }
    }
  }

  .title-more-actions {
    font-size: 0.7rem; /* 文本大小 */
    color: #666; /* 灰色文本 */
    cursor: pointer; /* 鼠标手势 */
    white-space: nowrap; /* 禁止换行 */
  }
}
</style>