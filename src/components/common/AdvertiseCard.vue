<template>
  <div class="ad-card">
    <van-image
        :src="picUrl"
        fit="cover"
        width="100%"
        :height="`${height}${heightUnit}`"
        radius="0.2rem"
    />
    <!-- 渲染标签 -->
    <template v-if="tagsDisplayRule">
      <el-tag
          v-for="(rule, position) in parseTags(tagsDisplayRule)"
          :key="position"
          :type="rule.type || 'info'"
          :effect="rule.effect || 'light'"
          :round="rule.round === true"
          :size="rule.size || 'default'"
          class="tag"
          :class="[`tag-${position}`]"
      >
        {{ rule.tagName }}
      </el-tag>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  height?: [String, Number],
  heightUnit?: [String, Number],
  tagsDisplayRule: string;
  picUrl?: string;
}>()

const parseTags = (tagsDisplayRule) => {
  if (tagsDisplayRule) {
    try {
      return JSON.parse(tagsDisplayRule);
    } catch (error) {
      console.error("Invalid tagsDisplayRule JSON:", tagsDisplayRule);
      return {};
    }
  } else {
    return {};
  }

}
</script>

<style scoped>
.ad-card {
  position: relative;
}

.tag {
  position: absolute;
  z-index: 10;
}

/* 示例标签位置样式 */
.tag-top-left {
  top: 0.4rem;
  left: 0.4rem;
}

.tag-top-right {
  top: 0.4rem;
  right: 0.4rem;
}

.tag-bottom-left {
  bottom: 0.4rem;
  left: 0.4rem;
}

.tag-bottom-right {
  bottom: 0.4rem;
  right: 0.4rem;
}
</style>