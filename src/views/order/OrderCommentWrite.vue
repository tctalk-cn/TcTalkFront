<template>
  <HeaderTop go-back="true" head-title="写评论">
    <template #search>
      <van-icon name="search"/>
    </template>
    <template #actions>
      <van-icon name="newspaper-o"/>
    </template>
  </HeaderTop>
  <div class="order-comment-write">
    <van-field
        v-model="commentContent"
        type="textarea"
        rows="5"
        placeholder="请输入评论内容"
        class="comment-field"
    />

    <div class="rating">
      <span>评分：</span>
      <van-rate v-model="rating" :count="5"/>
    </div>

    <van-button type="primary" block class="submit-btn" @click="submitComment">
      提交评论
    </van-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import {showToast} from 'vant';
import {useCommentStore} from "@/stores/comment_store.ts";
import HeaderTop from "@/components/layout/header/HeaderTop.vue";

const {addTransactionComment} = useCommentStore();

const router = useRouter();
const route = useRoute();

const orderId = route.query.orderId as string;
const ownerMemberId = route.query.ownerMemberId as string;

const commentContent = ref('');
const rating = ref(5);

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    showToast('请输入评论内容');
    return;
  }

  const res = await addTransactionComment({
    orderId,
    ownerMemberId,
    commentContent: commentContent.value,
    commentLocation: "深圳南山区",
    commentCity: "深圳",
    commentSource: "H5",
    commentScore: rating.value,
  });

  if (res?.code === '200') {
    showToast('评论成功');
    router.back();
  } else {
    showToast(res?.message || '评论失败');
  }
};
</script>

<style scoped>
.order-comment-write {
  display: flex;
  flex-direction: column;
  background-color: #f7f8fa;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0.5rem; /* 页面整体内边距 */

  .comment-field {
    margin: 1rem 0;
  }

  .rating {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
  }

  .rating span {
    margin-right: 0.5rem;
    font-weight: 500;
  }


  .submit-btn {
    margin: 0.5rem 1rem; /* 上下留一点距离，左右增加 margin */
    border-radius: 0.5rem;
  }
}


</style>
