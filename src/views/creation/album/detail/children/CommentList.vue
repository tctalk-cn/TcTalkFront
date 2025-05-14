<template>
  <div class="album-comment-list-container">
    <div class="album-comment-statistic-info">
      <CommentStatisticCard :total-comments="route.query.commentCount as string"
                            :recommend-percent="route.query.recommendPercent as string"
                            :average-percent="route.query.averagePercent as string"
                            :poor-percent="route.query.poorPercent as string"
                            :recommended-type="albumComment?.recommendType"
                            @feedbackHandler="feedbackHandler"
      />
    </div>
    <div class="album-comment-data">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="loadCommentData('load')"
        >
          <div v-for="(item) in albumComments" :key="item.id" class="comment-msg">
            <div class="avatar">
              <img :src="item.commentAvatarUrl||defaultAvatar" :alt="item.commentNickname"/>
            </div>
            <div class="content-wrapper">
              <div class="header">
                <div class="name">{{ item.commentNickname }}</div>
                <div class="level">{{ item.commentMemberLevelName }}</div>
                <van-tag color="#FF69B4"
                         style="font-size: 0.6rem;
                     display: inline-block;
                     margin-left: 0.2rem"
                         v-if="item.commentMemberId===albumCreatorMemberId">
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
                  <router-link :to="reply.relayMemberId===albumCreatorMemberId?'/creative/center':'/otherProfile'"
                               class="sub-name">
                    {{ reply.relayNickname }}
                    <van-tag color="#FF69B4"
                             class="author-tag"
                             v-if="reply.relayMemberId===albumCreatorMemberId">作者
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
    </div>
  </div>

</template>
<script setup lang="ts">
import {onMounted, ref} from "vue";
import {formatDateTime} from "@/utils/date_utils.ts";
import {useAlbumStore} from "@/stores/album_store.ts";
import {useRoute, useRouter} from "vue-router";
import CommentStatisticCard from "@/components/common/CommentStatisticCard.vue";
import {AlbumComment} from "@/models/album_comment.ts";
import {storeToRefs} from "pinia";

const route = useRoute();
const router = useRouter();

const {defaultAvatar} = storeToRefs(useAlbumStore());

const {listAlbumComment, queryAlbumComment} = useAlbumStore();
const albumId = route.query.albumId as string;
const albumName = route.query.albumName as string;
const albumCreatorMemberId = route.query.albumCreatorMemberId as string;

const albumComments = ref<Array<AlbumComment>>([]);
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const albumComment = ref(null);
const searchParam = {
  toCommentId: "0",
  pageSize: 6,
};
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

const loadCommentData = async (type = 'refresh') => {
  if (type === 'refresh') {
    searchParam.toCommentId = "0";
    // 重置 finished 状态
    finished.value = false;
  }
  try {
    // 数据加载
    const commentList = await listAlbumComment(albumCreatorMemberId, albumId, searchParam.toCommentId, searchParam.pageSize);
    if (type === 'refresh') {
      albumComments.value = commentList;
      // 在数据加载完成后再更新 refreshing 状态
      refreshing.value = false;
      if (!commentList || commentList.length < searchParam.pageSize) {
        finished.value = true;
      }
      if (commentList !== null && commentList.length > 0) {
        searchParam.toCommentId = commentList[commentList.length - 1].id;
      }
    } else {
      // 加载更多时，追加到现有的评论列表
      if (commentList && commentList.length > 0) {
        albumComments.value = albumComments.value.concat(commentList);
        // 更新分页起点
        searchParam.toCommentId = commentList[commentList.length - 1].id;
        // 检查是否加载完全部数据
        if (commentList.length < searchParam.pageSize) {
          finished.value = true; // 没有更多数据了
        }
      } else {
        finished.value = true; // 没有更多数据了
      }
      // 在数据加载完成后再更新 loading 状态
      loading.value = false;

    }
  } catch (error) {
    console.error('加载评论失败:', error);
    loading.value = false;
    refreshing.value = false;
  }
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

const feedbackHandler = (recommendType) => {
  router.push({
    path: '/creative/editAlbumComment',
    query: {
      albumCreatorMemberId: albumCreatorMemberId,
      albumId: albumId,
      albumName: albumName,
      recommendType: recommendType
    }
  })
}

// 初始化加载
onMounted(async () => {
  albumComment.value = await queryAlbumComment(albumCreatorMemberId, albumId);
});

</script>
<style lang="scss" scoped>
.album-comment-list-container {
  height: 100%;
  margin-bottom: 4rem;
  padding: 1rem 0.5rem;

  .album-comment-data {
    .comment-msg {
      display: flex;
      flex-direction: row;
      align-items: flex-start;

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
            font-size: $font-size;
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
          font-size: $font-size;
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
            font-size: $font-size-sm;

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
            font-size: $font-size-sm;

            .sub-name {
              color: #1e90ff;
              text-decoration: none;
              white-space: nowrap;
              margin-right: 0.2rem;

              .author-tag {
                font-size: $font-size-mini;
                display: inline-block;
                margin-left: 0.2rem;
              }
            }

            .sub-content {
              font-size: $font-size;
              margin-top: 0.3rem;
              color: #333;
              line-height: 1rem;
            }
          }

          .sub-total {
            color: #1e90ff;
            font-size: $font-size;
            margin-top: 0.4rem;
            display: inline-block;
          }
        }
      }
    }
  }
}


</style>