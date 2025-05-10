import http from "@/utils/http.ts";
import {Album} from "@/models/album.ts";
import {AlbumCreator} from "@/models/album.ts";

/**
 * 上传封面
 * @param formData 图片文件
 */
export async function useUploadCover(formData: FormData) {
    return await http.upload<{
        data: string
    }>("/creation_api/album/uploadCover", formData);
}

/**
 * 获取会员的专辑列表
 */
export async function useListMemberAlbums(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: Album[]
    }>("/creation_api/album/list", {pageNum: pageNum, pageSize: pageSize});
}

export async function useCreateAlbum(album: AlbumCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: number,
    }>("/creation_api/album/add", album);
}

export async function useQueryAlbum(albumCreatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: Album,
    }>("/creation_api/album/query", {albumId: albumId, albumCreatorMemberId: albumCreatorMemberId});
}

export async function useLoadAlbums(beginAlbumId: string, pageSize: number) {
    return await http.get<{
        code: number,
        message: string,
        data: Album[],
    }>("/creation_api/album/load", {beginAlbumId: beginAlbumId, pageSize: pageSize});
}

export async function useUpdateAlbum(album: Album) {
    return await http.post<{
        code: number,
        message: string,
        data: number,
    }>("/creation_api/album/update", album);
}

export async function useDeleteAlbum(albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: number,
    }>("/creation_api/album/delete", {albumId: albumId});
}

export async function useApplyCompleted(albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: boolean,
    }>("/creation_api/album/applyCompleted/" + albumId);
}

export async function useLoadStreamerOtherAlbums(pageSize: number, albumCreatorMemberId: string, currentAlbumId: string) {
    return await http.get<{
        code: number;
        message: string;
        data: Album[]
    }>("/creation_api/album/loadStreamerOtherAlbums", {
        pageSize: pageSize,
        albumCreatorMemberId: albumCreatorMemberId,
        currentAlbumId: currentAlbumId
    });
}


export async function useQueryLastSelected() {
    return await http.get<{
        code: number,
        message: string,
        data: Album,
    }>("/creation_api/album/queryLastSelected");
}