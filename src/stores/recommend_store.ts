import {defineStore} from "pinia";
import {useListListenHistory} from "@/api/member/listen_history_api.ts";
import {useLoadAlbumSubscriptions} from "@/api/creation/album_subscription_api.ts";
import {
    useChildhoodAlbums,
    usePersonalRecommendAlbums,
    useChildrenRecommendAlbums,
    useHottestFreeReviewsRecommendAlbums,
    useLatestHotRecommendAlbums, useMostPositiveReviewsRecommendAlbums,
    useMusicRecommendAlbums,
    usePopularRecommendAlbums,
    useGuessYouLikeRecommendAlbums,
    useFinishedNovelRecommendAlbums,
    useHitFreeNovelRecommendAlbums,
    useHotNovelRecommendAlbums,
    useGuessYouLikeNovelRecommendAlbums,
    useGuessYouLikeChildrenRecommendAlbums
} from "@/api/recommend/recommend_api.ts";

/**
 * player store
 */
export const useRecommendStore = defineStore({
    id: "recommend",
    state: () => {
        return {
            // 媒体收听历史
            // memberListenHistories: [] as MemberListenHistory[],
        }

    },
    actions: {
        // 获取收听历史
        async listListenHistory(toHistoryId: string, pageSize: number) {
            const {data} = await useListListenHistory(toHistoryId, pageSize);
            return data.list;
        },
        // 获取订阅专辑
        async listAlbumSubscriptions(toAlbumSubscriptionId: string, pageSize: number) {
            const {data} = await useLoadAlbumSubscriptions(toAlbumSubscriptionId, pageSize);
            return data;
        },
        // 获取童年相关专辑
        async childhoodAlbums() {
            const {data} = await useChildhoodAlbums(1, 10);
            return data.list;
        },
        // 获取个性化相关专辑
        async personalRecommendAlbums() {
            const {data} = await usePersonalRecommendAlbums(1, 10);
            return data.list;
        },
        // 获取儿童相关专辑
        async childrenRecommendAlbums() {
            const {data} = await useChildrenRecommendAlbums(1, 10);
            return data.list;
        },
        // 音乐榜推荐
        async musicRecommendAlbums() {
            const {data} = await useMusicRecommendAlbums(1, 10);
            return data.list;
        },
        // 人气榜推荐
        async popularRecommendAlbums() {
            const {data} = await usePopularRecommendAlbums(null, 1, 10);
            return data.list;
        },
        // 最新热品推荐
        async latestHotRecommendAlbums() {
            const {data} = await useLatestHotRecommendAlbums(null, 1, 10);
            return data.list;
        },

        // 好评最多推荐
        async mostPositiveReviewsRecommendAlbums() {
            const {data} = await useMostPositiveReviewsRecommendAlbums(1, 10);
            return data.list;
        },
        // 最热免费推荐
        async hottestFreeReviewsRecommendAlbums() {
            const {data} = await useHottestFreeReviewsRecommendAlbums(1, 10);
            return data.list;
        },

        // 猜你喜欢推荐
        async guessYouLikeRecommendAlbums(pageNum: number, pageSize: number) {
            const {data} = await useGuessYouLikeRecommendAlbums(pageNum, pageSize);
            return data.list;
        },
        // 完结小说推荐
        async finishedNovelRecommendAlbums() {
            const {data} = await useFinishedNovelRecommendAlbums(1, 6);
            return data.list;
        },
        // 爆款免费小说推荐
        async hitFreeNovelRecommendAlbums() {
            const {data} = await useHitFreeNovelRecommendAlbums(1, 6);
            return data.list;
        },
        // 热门小说推荐
        async hotNovelRecommendAlbums(filterAttributeValId: string) {
            const {data} = await useHotNovelRecommendAlbums(filterAttributeValId, 1, 6);
            return data.list;
        },
        // 热门小说推荐
        async guessYouLikeNovelRecommendAlbums(pageNum: number, pageSize: number,
                                               sortType: number, filterType: number, novelType: number,
                                               preachingType: number, paidType: number, finishedType: number,
                                               newNovel: number) {
            const {data} = await useGuessYouLikeNovelRecommendAlbums(pageNum, pageSize,
                sortType, filterType, novelType, preachingType, paidType, finishedType, newNovel);
            return data.list;
        },
        // 热门儿童推荐
        async guessYouLikeChildrenRecommendAlbums(channelId: string, pageNum: number, pageSize: number,
                                                  sortType: number, filterType: number, novelType: number,
                                                  preachingType: number, paidType: number, finishedType: number,
                                                  newNovel: number) {
            const {data} = await useGuessYouLikeChildrenRecommendAlbums(channelId, pageNum, pageSize,
                sortType, filterType, novelType, preachingType, paidType, finishedType, newNovel);
            return data.list;
        },
    }
});