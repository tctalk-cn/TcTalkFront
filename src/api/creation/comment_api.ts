import http from "@/utils/http.ts";
import {MediaCommentCreator, MediaComment} from "@/models/media_comment.ts";

export async function useAddComment(commentCreator: MediaCommentCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: any,
    }>("/creation_api/comment/addComment", commentCreator);
}

export async function useListComment(mediaCreatorMemberId: string, mediaId: string, mediaType: number, toCommentId: string, pageSize: number) {
    return await http.get<{
        code: number,
        message: string,
        data: Array<MediaComment>,
    }>("/creation_api/comment/list", {
        mediaCreatorMemberId: mediaCreatorMemberId,
        mediaId: mediaId,
        toCommentId: toCommentId,
        pageSize: pageSize,
        mediaType: mediaType,
    });
}
