import http from "@/utils/http.ts";
import {StreamerPerformanceQualityCommentCreator} from "@/models/streamer_performance_quality_comment.ts";

export async function useAddStreamerComment(commentCreator: StreamerPerformanceQualityCommentCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: any,
    }>("/creation_api/album/streamer/comment/add", commentCreator);
}

export async function useQueryStreamerComment(albumCreatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: Array<StreamerPerformanceQualityCommentCreator>,
    }>("/creation_api/album/streamer/comment/query", {
        albumCreatorMemberId: albumCreatorMemberId,
        albumId: albumId,
    });
}
