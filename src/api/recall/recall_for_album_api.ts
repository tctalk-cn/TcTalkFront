import http from "@/utils/http.ts";

import {AlbumForRecallResp} from "@/models/album.ts";
import {CommonPage} from "@/models/common_page.ts";

/**
 * 猜你喜欢搜索
 */
export async function useRecommendForUser(topK: number) {
    return await http.get<{
        code: number;
        message: string;
        data: AlbumForRecallResp[];
    }>("/recall_api/album/recall/recommendForUserTopK/" + topK);
}

export async function useAlbumSimilarRecommend(albumCreatorMemberId: string, currentAlbumId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<AlbumForRecallResp>
    }>("/recall_api/album/recall/similarRecommend", {
        albumCreatorMemberId: albumCreatorMemberId,
        currentAlbumId: currentAlbumId,
        pageNum: pageNum,
        pageSize: pageSize
    });
}