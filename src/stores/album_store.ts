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

export const useAlbumStore = defineStore({
        id: "albumStore",
        state: () => ({
            albumInfo: {
                id: "",
                name: "",
                remark: "",
                company: "",
                coverUrl: "",
                channelId: "",
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
                attributeValues: [] as AlbumAlbumAttributeValueCreator[],
            } as Album,
            isSubscribed: false as Boolean,
        }),
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
        },
        // 持久化配置
        persist: {
            key: 'albumStore',
            storage: localStorage,
            paths: ['albumInfo',],
        }

    })
;