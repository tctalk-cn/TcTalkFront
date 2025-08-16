<template>
  <div class="comment-list-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadCommentData('load')"
      >
        <div v-for="(item,index) in mediaComments" :key="index" class="comment-msg">
          <div class="avatar">
            <img :src=item.commentAvatarUrl :alt="item.commentNickname"/>
          </div>
          <div class="content-wrapper">
            <div class="header">
              <div class="name">{{ item.commentNickname }}</div>
              <div class="level">{{ item.commentMemberLevelName }}</div>
              <van-tag color="#FF69B4"
                       style="font-size: 0.6rem;
                     display: inline-block;
                     margin-left: 0.2rem"
                       v-if="item.commentMemberId===mediaCreatorMemberId">
                作者
              </van-tag>
            </div>
            <div class="info">
              日期：{{ formatDateTime(item.createTime, "yyyy-MM-dd HH:mm") }}
              &nbsp;&nbsp;IP属地：{{ item.location }}
            </div>
            <div class="content">
              <van-text-ellipsis :content="item.content" expand-text="展开" collapse-text="收起" rows="3"/>
            </div>
            <div class="actions">
              <van-icon name="good-job-o" class="icon" size="15">
              <span v-if="item.praisedCount>0">
                {{ item.praisedCount }}
              </span>
              </van-icon>
              <van-icon name="share-o" class="icon" size="15">
               <span v-if="item.shareCount>0">
                {{ item.shareCount }}
              </span>
              </van-icon>
              <van-icon name="comment-o" size="15"
                        @click="replayClick(item.id,item.commentMemberId,item.commentNickname,0)">
              </van-icon>
            </div>
            <!-- 子评论列表 -->
            <div class="sub-comments" v-if="item.replies && item.replies.length > 0">
              <div v-for="(reply, replyIndex) in item.replies" :key="replyIndex" class="sub-comment">
                <router-link :to="reply.relayMemberId===mediaCreatorMemberId?'/creative/center':'/otherProfile'"
                             class="sub-name">
                  {{ reply.relayNickname }}
                  <van-tag color="#FF69B4"
                           style="font-size: 0.4rem;
                                 display: inline-block;
                                  margin-left: 0.2rem"
                           v-if="reply.relayMemberId===mediaCreatorMemberId">作者
                  </van-tag>
                </router-link>
                <div class="sub-content">
                  <van-text-ellipsis :content="reply.replayContent" expand-text="展开" collapse-text="收起" rows="3"/>
                </div>
              </div>
              <router-link to="/replaylist" class="sub-total" v-if="item.commentCount>3">共{{ item.commentCount }}条回复&nbsp;&gt;
              </router-link>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!-- 底部输入框 -->
    <div class="comment-input-container">
      <van-field
          v-model="commentInput"
          placeholder="善语结善缘，恶语伤人心"
          class="comment-input"
          @click="commentPopupVisible=true">
        <!-- 右侧图标按钮插槽 -->
        <template #button>
          <div class="comment-input-icons">
            <!-- 表情图标按钮 -->
            <van-icon name="smile-o" @click="showEmojiPicker"/>
            <!-- 图片选择图标按钮 -->
            <van-icon name="photo-o" @click="selectCommentImage"/>
            <!-- @提及图标按钮 -->
            <van-icon name="at" @click="mentionFriends">@</van-icon>
            <!-- 发送按钮 -->
            <van-button type="primary" round size="mini">发送</van-button>
          </div>
        </template>
      </van-field>
    </div>
    <!--输出弹出框-->
    <van-popup
        v-model:show="commentPopupVisible"
        position="bottom"
        :style="{ height: '55%' }"
    >
      <div class="pop-comment-container">
        <van-field
            v-model="commentInput"
            placeholder="善语结善缘，恶语伤人心"
            rows="8"
            maxlength="512"
            show-word-limit
            type="textarea">
        </van-field>
        <div class="pop-comment-input-icons">
          <!-- 表情图标按钮 -->
          <van-icon name="smile-o" @click="showEmojiPicker"/>
          <!-- 图片选择图标按钮 -->
          <van-icon name="photo-o" @click="selectCommentImage"/>
          <!-- @提及图标按钮 -->
          <van-icon name="at" @click="mentionFriends">@</van-icon>
          <!--插入内容-->
          <van-icon name="add-o" class="icon"/>
          <!-- 发送按钮 -->
          <van-button type="primary" round size="mini" class="send-button" @click="sendComment">发送</van-button>
        </div>
      </div>
    </van-popup>
    <!-- 底部弹出-回复 -->
    <van-popup
        v-model:show="replayPopupVisible"
        position="bottom"
        :style="{ height: '55%' }">
      <div class="pop-replay-container">
        <van-field
            v-model="replayMsg"
            rows="8"
            maxlength="512"
            show-word-limit
            :placeholder="replayPlaceHolder"
            type="textarea"
        />
        <div class="pop-replay-input-icons">
          <label class="forward-to">
            <input type="radio" name="radio" class="radio" value=""/>
            转到动态
          </label>
          <van-icon name="notes-o"/>
          <van-icon name="">@</van-icon>
          <van-icon name="location-o"/>
          <van-icon name="photo-o"/>
          <van-icon name="add-o"/>
          <van-button class="replay-button" size="mini" color="#ff6034" @click="publishReplay">发布</van-button>
        </div>
      </div>
    </van-popup>
  </div>

</template>
<script setup lang="ts">
import {ref} from "vue";
import {useVideoStore} from "@/stores/video_store.ts";
import {MediaComment, MediaCommentCreator} from "@/models/media_comment.ts";
import {formatDateTime} from "@/utils/date_utils.ts";
import {MediaReplayCreator} from "@/models/media_replay.ts";

const {listComment, addComment, addReplay} = useVideoStore();
const props = defineProps<{
  mediaId: string,
  mediaCreatorMemberId: string,
}>();
const mediaComments = ref<Array<MediaComment>>([]);
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  beginCommentId: "0",
  pageSize: 6,
};
// 评论输入
const commentInput = ref(null);
// 回复
const replayPopupVisible = ref<boolean>(false);
const replayMsg = ref<string>();
const replayPlaceHolder = ref<string>();
const replayToComment = ref<string>();
const relayMemberId = ref<string>();
const relayNickname = ref<string>();
const parentReplay = ref<number>();
const commentPopupVisible = ref(false);
const replayClick = (commentId: string, relayToMemberId: string, relayToNickname: string, parentReplayId: number) => {
  replayPopupVisible.value = true;
  replayPlaceHolder.value = "回复 @" + relayToNickname + ":";
  relayMemberId.value = relayToMemberId;
  relayNickname.value = relayToNickname;
  replayToComment.value = commentId;
  parentReplay.value = parentReplayId;
}

const publishReplay = async () => {
  addReplay({
        mediaId: props.mediaId,
        creatorMemberId: props.mediaCreatorMemberId,
        location: '匿名',
        commentId: replayToComment.value,
        replayContent: replayMsg.value,
      } as MediaReplayCreator
  ).then((res) => {
    replayMsg.value = "";
    replayPopupVisible.value = false;
    loadCommentData('refresh');
  });
}

const loadCommentData = async (type = 'refresh') => {
  if (type === 'refresh') {
    searchParam.beginCommentId = "0";
    refreshing.value = false;
    // 重置 finished 状态
    finished.value = false;
  }
  // 数据加载
  const commentList = await listComment(props.mediaCreatorMemberId, props.mediaId, 3, searchParam.beginCommentId, searchParam.pageSize);
  if (!commentList || commentList.length === 0) {
    finished.value = true;  // 确保没有数据时停止加载
    loading.value = false;
    return;
  }
  if (type === 'refresh') {
    mediaComments.value = commentList;
  } else {
    mediaComments.value = mediaComments.value.concat(commentList);
  }

  searchParam.beginCommentId = commentList[commentList.length - 1].id;
  if (commentList.length < searchParam.pageSize) {
    finished.value = true;
  }
  loading.value = false;
};

// 刷新
const onRefresh = () => {
  // 清空数据
  finished.value = false;
  // 重新加载
  loading.value = false;
  // 刷新
  refreshing.value = true;
  loadCommentData();
};

/**
 *  展示emoji图标
 */
const showEmojiPicker = () => {

}

/**
 * 打开图片选择器
 */
const selectCommentImage = () => {

}

/**
 * 显示朋友
 */
const mentionFriends = () => {

}

/**
 * 发送评论
 */
const sendComment = () => {
  addComment(
      {
        mediaId: props.mediaId,
        creatorMemberId: props.mediaCreatorMemberId,
        location: '匿名',
        content: commentInput.value,
        mediaType: 3,
      } as MediaCommentCreator
  ).then((res) => {
    commentInput.value = "";
    commentPopupVisible.value = false;
    loadCommentData('refresh');
  });
}
</script>
<style lang="scss" scoped>
.comment-list-container {
  height: 100%;
  margin-bottom: 2rem;

  .comment-msg {
    display: flex;
    flex-direction: row; // 将布局改为水平
    align-items: flex-start;
    padding: 1rem 0.5rem;
    border-bottom: 1px solid #ebebeb;

    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background-color: #dddddd;
      overflow: hidden;
      flex-shrink: 0; // 保持头像大小不变
    }

    .content-wrapper {
      margin-left: 0.8rem; // 设置右侧内容距离头像的间距
      flex: 1;

      .header {
        display: flex;
        align-items: center;

        .name {
          color: #333;
          font-size: 0.9rem;
          margin-right: 0.2rem;
        }

        .level {
          color: #666;
          font-size: 0.4rem;
          margin-right: 0.2rem;
        }

        .van-tag {
          font-size: 0.7rem;
          margin-left: 0.2rem;
          display: inline-block;
        }
      }

      .info {
        color: #999;
        font-size: 0.75rem;
        margin-top: 0.3rem;
      }

      .content {
        margin-top: 0.3rem;
        color: #333;
        line-height: 1.5;
        font-size: 0.9rem;
      }

      .actions {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;

        .icon {
          margin-right: 1rem;
          display: flex;
          align-items: center;
          color: #999;
          font-size: 0.8rem;

          span {
            margin-left: 0.2rem;
          }
        }
      }

      .sub-comments {
        background-color: #f9f9f9;
        padding: 0.5rem;
        border-radius: 0.2rem;
        margin-top: 0.5rem;

        .sub-comment {
          align-items: center;
          margin-bottom: 0.4rem;
          font-size: 0.8rem;

          .sub-name {
            color: #1e90ff;
            text-decoration: none;
            white-space: nowrap;
            margin-right: 0.2rem;
          }

          .sub-content {
            font-size: 0.85rem;
            margin-top: 0.3rem;
            color: #333;
            line-height: 1rem;
          }
        }

        .sub-total {
          color: #1e90ff;
          font-size: 0.85rem;
          margin-top: 0.4rem;
          display: inline-block;
        }
      }
    }
  }

  /* 底部输入框样式 */
  .comment-input-container {
    position: absolute;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 1.5rem;
    margin: 0 auto;
    background-color: #fff;
    bottom: 0;

    .comment-input {
      color: #333;
      font-size: 0.8rem;
      border-radius: 0.8rem; /* 添加圆角以增加视觉柔和感 */
      background-color: #f0f0f0; /* 灰色背景 */
      padding: 0.1rem 0.2rem; /* 减少上下内边距 */
      height: 2.1rem; /* 控制输入框高度 */
      border: none;
      outline: none;
      display: flex;
      align-items: center; /* 居中内容 */

      van-button {
        height: 100%;
        padding: 0 0.5rem;
        display: flex;
        align-items: center;
        border-radius: 0.5rem;
        margin-left: 0.3rem; /* 与图标间隔 */
        color: #fff;
        background-color: #007bff;
      }

      .comment-input-icons {
        display: flex;
        align-items: center;
        gap: 0.5rem; /* 图标之间的间距 */

        .van-icon {
          font-size: 1.2rem; /* 调整图标大小 */
          color: #666;
          cursor: pointer;
        }
      }
    }
  }

  .pop-comment-container {
    height: 100%;
    overflow: hidden;
    position: relative;

    /** 底部评论container **/
    .pop-comment-input-icons {
      display: flex;
      align-items: center;
      gap: 2rem; /* 控制图标之间的间距 */
      padding: 0 1rem; /* 可选：为左右添加内边距 */
      position: absolute;
      bottom: 0; /* 距离底部的间距 */
      left: 0;
      width: 100%;
      background-color: #fff; /* 可选：为图标栏设置背景色 */
      margin-bottom: 0.2rem;

      .send-button {
        margin-left: auto; /* 将发送按钮对齐到最右侧 */
      }
    }
  }

  .pop-replay-container {
    height: 100%;
    overflow: hidden;
    position: relative;

    /** 底部评论container **/
    .pop-replay-input-icons {
      display: flex;
      align-items: center;
      gap: 0.85rem; /* 控制图标之间的间距 */
      padding: 0 1rem; /* 可选：为左右添加内边距 */
      position: absolute;
      bottom: 0; /* 距离底部的间距 */
      left: 0;
      width: 100%;
      background-color: #fff; /* 可选：为图标栏设置背景色 */
      margin-bottom: 0.2rem;

      .forward-to {
        font-size: 0.85rem;
        color: #333;
      }

      .replay-button {
        margin-left: auto; /* 将发送按钮对齐到最右侧 */
      }
    }
  }


}


</style>