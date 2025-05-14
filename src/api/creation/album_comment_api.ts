import http from "@/utils/http.ts";
import {AlbumCommentCreator, AlbumComment} from "@/models/album_comment.ts";

export async function useAddAlbumComment(commentCreator: AlbumCommentCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: any,
    }>("/creation_api/album/comment/add", commentCreator);
}

export async function useListAlbumComment(albumCreatorMemberId: string, albumId: string, toCommentId: string, pageSize: number) {
    return await http.get<{
        code: number,
        message: string,
        data: Array<AlbumComment>,
    }>("/creation_api/album/comment/list", {
        albumCreatorMemberId: albumCreatorMemberId,
        albumId: albumId,
        toCommentId: toCommentId,
        pageSize: pageSize,
    });
}

export async function useQueryAlbumComment(albumCreatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: Array<AlbumComment>,
    }>("/creation_api/album/comment/query", {
        albumCreatorMemberId: albumCreatorMemberId,
        albumId: albumId,
    });
}
