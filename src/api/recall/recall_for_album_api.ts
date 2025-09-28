import http from "@/utils/http.ts";

import {AlbumForRecallResp} from "@/models/album.ts";

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