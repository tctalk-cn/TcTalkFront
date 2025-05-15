import http from "@/utils/http.ts";
import {Album} from "@/models/album.ts";
import {CommonPage} from "@/models/common_page.ts";

/**
 * 获取童年相关的专辑列表
 */
export async function useChildhoodAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/childhood", {pageNum: pageNum, pageSize: pageSize});
}


/**
 * 获取个性化推荐的专辑列表
 */
export async function usePersonalRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/personalRecommend", {pageNum: pageNum, pageSize: pageSize});
}

/**
 * 获取儿童推荐的专辑列表
 */
export async function useChildrenRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/childrenRecommend", {pageNum: pageNum, pageSize: pageSize});
}

/**
 * 音乐榜推荐
 */
export async function useMusicRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/musicRecommend", {pageNum: pageNum, pageSize: pageSize});
}

/**
 * 人气榜推荐
 */
export async function usePopularRecommendAlbums(channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/popularRecommend", {channelId: channelId, pageNum: pageNum, pageSize: pageSize});
}

/**
 * 最新热品推荐
 */
export async function useLatestHotRecommendAlbums(channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/latestHotRecommend", {
        channelId: channelId,
        pageNum: pageNum,
        pageSize: pageSize
    });
}

/**
 * 好评最多推荐
 */
export async function useMostPositiveReviewsRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/mostPositiveReviewsRecommend", {pageNum: pageNum, pageSize: pageSize});
}

/**
 * 好评最多推荐
 */
export async function useMostPositiveReviewsWithChannelRecommendAlbums(channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/mostPositiveReviewsRecommend", {
        channelId: channelId,
        pageNum: pageNum,
        pageSize: pageSize
    });
}

/**
 * 最热免费推荐
 */
export async function useHottestFreeReviewsRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/hottestFreeReviewsRecommend", {pageNum: pageNum, pageSize: pageSize});
}


/**
 * 猜你喜欢推荐
 */
export async function useGuessYouLikeRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/guessYouLikeRecommend", {pageNum: pageNum, pageSize: pageSize});
}


/**
 * 完结小说推荐
 */
export async function useFinishedNovelRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/novel/album/finishedNovel", {pageNum: pageNum, pageSize: pageSize});
}

/**
 * 爆款免费小说推荐
 */
export async function useHitFreeNovelRecommendAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/novel/album/hitFreeNovel", {pageNum: pageNum, pageSize: pageSize});
}

/**
 * 热门小说推荐
 */
export async function useHotNovelRecommendAlbums(filterAttributeValId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/novel/album/hotNovel", {
        filterAttributeValId: filterAttributeValId,
        pageNum: pageNum,
        pageSize: pageSize
    });
}

/**
 * 猜你喜欢的小说推荐
 */
export async function useGuessYouLikeNovelRecommendAlbums(pageNum: number, pageSize: number,
                                                          sortType: number, filterType: number, novelType: number,
                                                          preachingType: number, paidType: number, finishedType: number,
                                                          newNovel: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/novel/album/guessYouLikeRecommend", {
        pageNum: pageNum, pageSize: pageSize,
        sortType: sortType, filterType, novelType: novelType,
        preachingType: preachingType, paidType: paidType, finishedType: finishedType,
        newNovel: newNovel
    });
}

/**
 * 猜你喜欢的儿童类推荐
 */
export async function useGuessYouLikeChildrenRecommendAlbums(channelId: string, pageNum: number, pageSize: number,
                                                             sortType: number, filterType: number, novelType: number,
                                                             preachingType: number, paidType: number, finishedType: number,
                                                             newNovel: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/guessYouLikeRecommendByChannel", {
        channelId: channelId,
        pageNum: pageNum, pageSize: pageSize,
        sortType: sortType, filterType, novelType: novelType,
        preachingType: preachingType, paidType: paidType, finishedType: finishedType,
        newNovel: newNovel
    });
}

/**
 * 本周热门
 */
export async function usePopularInWeekRecommend(channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/popularInWeekRecommend", {
        channelId: channelId,
        pageNum: pageNum, pageSize: pageSize,
    });
}

/**
 * 人物传记
 */
export async function useIndividualBiographiesRecommend(channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/individualBiographiesRecommend", {
        channelId: channelId,
        pageNum: pageNum, pageSize: pageSize,
    });
}

/**
 * 先秦推荐
 */
export async function useQinhanRecommend(channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/qinhanRecommend", {
        channelId: channelId,
        pageNum: pageNum, pageSize: pageSize,
    });
}

/**
 * 未解之谜推荐
 */
export async function useUnsolvedMysteryRecommend(channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/unsolvedMysteryRecommend", {
        channelId: channelId,
        pageNum: pageNum, pageSize: pageSize,
    });
}

/**
 * 根据类目推荐
 */
export async function useAlbumsRecommendByCategory(channelId: string, categoryId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/albumsRecommendByCategory", {
        channelId: channelId,
        categoryId: categoryId,
        pageNum: pageNum, pageSize: pageSize,
    });
}

/**
 * 人气榜推荐
 */
export async function useAlbumSimilarRecommend(albumCreatorMemberId: string, currentAlbumId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>
    }>("/recommend_api/recommend/album/similarRecommend", {
        albumCreatorMemberId: albumCreatorMemberId,
        currentAlbumId: currentAlbumId,
        pageNum: pageNum,
        pageSize: pageSize
    });
}

/**
 * 查询专辑热点词
 */
export async function useQueryHotWordsByAlbumId(creatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number;
        message: string;
        data: Map<string, number>
    }>("/recommend_api/recommend/album/comment/queryHotWordsByAlbumId", {
        albumId: albumId,
        creatorMemberId: creatorMemberId,
    });
}

/**
 * 查询专辑评论所在城市
 */
export async function useQueryRegionsByAlbumId(creatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number;
        message: string;
        data: Map<string, number>
    }>("/recommend_api/recommend/album/comment/queryRegionsByAlbumId", {
        albumId: albumId,
        creatorMemberId: creatorMemberId,
    });
}