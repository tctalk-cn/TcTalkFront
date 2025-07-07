// 专辑存储Store
import {defineStore} from "pinia";

import {
    useLoadAlbums,
    useUploadCover,
    useCreateAlbum,
    useQueryAlbum,
    useApplyCompleted,
    useLoadStreamerOtherAlbums,
    useQueryLastSelected
} from "@/api/creation/album_api";
import {Album, AlbumAlbumAttributeValueCreator} from "@/models/album.ts";
import {
    useIsSubscribed,
    useCreateAlbumSubscription,
    useCancelAlbumSubscription
} from "@/api/creation/album_subscription_api.ts";
import {useLastListenHistory} from "@/api/member/listen_history_api.ts";
import {
    useListMediaByAlbum, usePin2Top, useLatest30DayPlayStats, useLatest7DayPlayStats,
    useLatestOneYearDayPlayStats,
    useYesterdayPlayStats
} from "@/api/creation/video_api.ts";
import {AlbumCommentCreator} from "@/models/album_comment.ts";
import {MediaCommentCreator} from "@/models/media_comment.ts";
import {StreamerPerformanceQualityCommentCreator} from "@/models/streamer_performance_quality_comment.ts";
import {useAddAlbumComment, useListAlbumComment, useQueryAlbumComment} from "@/api/creation/album_comment_api.ts";
import {useAddStreamerComment, useQueryStreamerComment} from "@/api/creation/streamer_comment_api.ts";
import {useAddComment} from "@/api/creation/comment_api.ts";
import defaultAvatar from '@/assets/images/avatar_default.png';
import {
    useAlbumSimilarRecommend,
    useQueryHotWordsByAlbumId,
    useQueryRegionsByAlbumId
} from "@/api/recommend/recommend_api.ts";
import {AlbumCreator} from "@/models/album.ts";
import {useListAllChannels} from "@/api/category/channel_api.ts";
import {
    useGetCategoryAttributesByCategoryId,
    useGetCategoryAttributesWithValueByCategoryId,
    useGetCategoryByChannel, useGetChildrenCategoryByChannel,
    useGetListByAttribute
} from "@/api/category/category_api.ts";
import {useListByCategory} from "@/api/category/tag_api.ts";

// album_store.ts
function createEmptyAlbum(): Album {
    return {
        id: "",
        name: "",
        remark: "",
        company: "",
        coverUrl: "",
        channelId: "",
        channelName: "",
        categoryLevel1Id: "",
        categoryLevel1Name: "",
        categoryLevel2Id: "",
        categoryLevel2Name: "",
        categoryLevel3Id: "",
        categoryLevel3Name: "",
        categoryLevel4Id: "",
        categoryLevel4Name: "",
        copyright: "",
        sellPoint: "",
        paid: false,
        feeType: "",
        onSale: false,
        creatorMemberId: "",
        creatorNickname: "",
        creatorTeamMemberIds: "",
        commentCount: 0,
        shareCount: 0,
        viewsCount: 0,
        subscriptionCount: 0,
        permissions: 0,
        auditStatus: 0,
        finished: false,
        original: true,
        description: "",
        createTime: "",
        updateTime: "",
        recommendCount: 0.0,
        averageCount: 0.0,
        poorCount: 0.0,
        recommendPercent: 0.0,
        averagePercent: 0.0,
        poorPercent: 0.0,
        lastSelected: true,
        intellectualPromise: false,
        attributeValues: [] as AlbumAlbumAttributeValueCreator[],
    };
}

export const useAlbumStore = defineStore(
        "albumStore",
        {
            state: () => ({
                defaultAvatar: defaultAvatar,
                tagIds: [],
                tagNames: [],
                attrWithVals: [] as AlbumAlbumAttributeValueCreator[],
                albumInfo: createEmptyAlbum(),
                draftAlbumInfo: createEmptyAlbum(),
                isSubscribed: false as Boolean,
            }),
            getters: {},
            actions: {

                // 加载专辑数据
                async loadAlbums(beginAlbumId: string, pageSize: number) {
                    const {data} = await useLoadAlbums(beginAlbumId, pageSize);
                    return data;
                },

                /**
                 * 查看专辑信息
                 * @param albumId 专辑ID
                 * @param albumCreatorMemberId 专辑创建者ID
                 */
                async queryAlbum(albumCreatorMemberId: string, albumId: string) {
                    const {data} = await useQueryAlbum(albumCreatorMemberId, albumId);
                    this.albumInfo = data;
                },
                /**
                 * 专辑是否被当前用户订阅
                 * @param albumId 专辑ID
                 * @param albumCreatorMemberId 专辑创建者会员ID
                 */
                async isSubscribedByMember(albumCreatorMemberId: string, albumId: string) {
                    const {data} = await useIsSubscribed(albumCreatorMemberId, albumId);
                    return data;
                },
                /**
                 * 订阅当前专辑
                 @param albumCreatorMemberId 专辑创建者会员ID
                 * @param albumId 专辑ID
                 */
                async addSubscription(albumCreatorMemberId: string, albumId: string) {
                    const {data} = await useCreateAlbumSubscription({
                        subscribedAlbumId: albumId,
                        subscribedCreatorMemberId: albumCreatorMemberId,
                    });
                    this.isSubscribed = true;
                    this.albumInfo.subscriptionCount += 1;
                    return data;
                },
                /**
                 * 取消订阅当前专辑
                 * @param albumCreatorMemberId 专辑创建者会员ID
                 * @param albumId 专辑ID
                 */
                async cancelSubscription(albumCreatorMemberId: string, albumId: string) {
                    const {data} = await useCancelAlbumSubscription({
                        subscribedAlbumId: albumId,
                        subscribedCreatorMemberId: albumCreatorMemberId,
                    });
                    this.isSubscribed = false;
                    this.albumInfo.subscriptionCount -= 1;
                    return data;
                },

                async lastListenHistory(albumId: string) {
                    const {data} = await useLastListenHistory(albumId);
                    return data;
                },
                async applyCompleted(albumId: string) {
                    const {data} = await useApplyCompleted(albumId);
                    return data;
                },
                /**
                 * 列举专辑下的媒体数据
                 * @param albumId 专辑ID
                 * @param beginMediaId 开始的媒体ID
                 * @param pageSize 分页大小
                 */
                async listMediaByAlbum(albumId: string, beginMediaId: string, pageSize: number, mediaType: number) {
                    const {data} = await useListMediaByAlbum(albumId, beginMediaId, pageSize, mediaType);
                    return data;
                },
                // listAlbumComment 列举专辑的评论列表
                async listAlbumComment(mediaCreatorMemberId: string, mediaId: string, toCommentId: string, pageSize: number) {
                    const {data} = await useListAlbumComment(mediaCreatorMemberId, mediaId, toCommentId, pageSize);
                    return data;
                },
                // 添加评论
                async addComment(commentCreator: MediaCommentCreator) {
                    const {data} = await useAddComment(commentCreator);
                    return data;
                },
                async queryAlbumComment(albumCreatorMemberId: string, albumId: string) {
                    const {data} = await useQueryAlbumComment(albumCreatorMemberId, albumId);
                    return data;
                },
                // 添加评论
                async addAlbumComment(commentCreator: AlbumCommentCreator) {
                    const {data} = await useAddAlbumComment(commentCreator);
                    return data;
                },
                async queryStreamerComment(albumCreatorMemberId: string, albumId: string) {
                    const {data} = await useQueryStreamerComment(albumCreatorMemberId, albumId);
                    return data;
                },
                // 添加主播人评论
                async addStreamerComment(commentCreator: StreamerPerformanceQualityCommentCreator) {
                    const {data} = await useAddStreamerComment(commentCreator);
                    return data;
                },

                async listStreamerOtherAlbums(albumCreatorMemberId: string, currentAlbumId: string) {
                    const {data} = await useLoadStreamerOtherAlbums(3, albumCreatorMemberId, currentAlbumId);
                    return data;
                },

                async pin2Top(albumId: string, mediaId: string) {
                    const {data} = await usePin2Top(albumId, mediaId);
                    return data.list;
                },

                async similarRecommend(albumCreatorMemberId: string, currentAlbumId: string, pageNum: number, pageSize: number) {
                    const {data} = await useAlbumSimilarRecommend(albumCreatorMemberId, currentAlbumId, pageNum, pageSize);
                    return data.list;
                },
                // 专辑播放统计
                async latest7DayPlayStats(creatorMemberId: string, albumId: string) {
                    const {data} = await useLatest7DayPlayStats(creatorMemberId, albumId);
                    return data;
                },
                // 专辑播放统计
                async yesterdayPlayStats(creatorMemberId: string, albumId: string) {
                    const {data} = await useYesterdayPlayStats(creatorMemberId, albumId);
                    return data;
                },
                // 专辑播放统计
                async latest30DayPlayStats(creatorMemberId: string, albumId: string) {
                    const {data} = await useLatest30DayPlayStats(creatorMemberId, albumId);
                    return data;
                },

                // 专辑播放统计
                async latestOneYearDayPlayStats(creatorMemberId: string, albumId: string) {
                    const {data} = await useLatestOneYearDayPlayStats(creatorMemberId, albumId);
                    return data;
                },
                async queryHotWordsByAlbumId(creatorMemberId: string, albumId: string) {
                    const {data} = await useQueryHotWordsByAlbumId(creatorMemberId, albumId);
                    return data;
                },

                async queryRegionsByAlbumId(creatorMemberId: string, albumId: string) {
                    const {data} = await useQueryRegionsByAlbumId(creatorMemberId, albumId);
                    return data;
                },
                // 上传专辑封面
                async uploadCover(file: File) {
                    let formData = new FormData();
                    formData.append('file', file);
                    try {
                        const {data} = await useUploadCover(formData);
                        return data;
                    } catch (err) {
                        throw new Error(err);
                    }
                },
                // 枚举全部的频道
                async listAllChannel() {
                    const {data} = await useListAllChannels();
                    return data;
                },
                // 修改权限
                async resetPermission(permissions: number) {
                    this.permissions = permissions;
                    if (permissions === 0) {
                        this.permissionsVal = "公开";
                    } else {
                        this.permissionsVal = "仅自己可见";
                    }
                },

                /**
                 * 创建专辑
                 * @param album 专辑信息
                 */
                async createAlbum(album: AlbumCreator) {
                    const {data} = await useCreateAlbum(album);
                    return data;
                },
                // 根据频道ID，父品类ID，获取品类明细
                async getCategoryByChannel(channelId: string, parentCategoryId: string) {
                    const {data} = await useGetCategoryByChannel(channelId, parentCategoryId);
                    return data;
                },

                async getTagsByCategory(categoryId: string) {
                    const {data} = await useListByCategory(categoryId);
                    return data;
                },
                async getChildrenCategoryByChannel(channelId: string, parentCategoryId: string) {
                    const {data} = await useGetChildrenCategoryByChannel(channelId, parentCategoryId, 10000);
                    return data;
                },
                async getCategoryAttributesByCategoryId(categoryId: string) {
                    const {data} = await useGetCategoryAttributesByCategoryId(categoryId);
                    return data;
                },
                async getListByAttribute(attributeId: string) {
                    const {data} = await useGetListByAttribute(attributeId);
                    return data;
                },

                async getCategoryAttributesWithValueByCategoryId(categoryId: string) {
                    const {data} = await useGetCategoryAttributesWithValueByCategoryId(categoryId);
                    return data;
                },
            },
            // 持久化配置
            persist: {
                key: 'albumStore',
                storage: localStorage,
                paths: ['albumInfo', 'draftAlbumInfo'],
            }
        }
    )
;