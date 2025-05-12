import http from "@/utils/http.ts";
import {AlbumSubscription, AlbumSubscriptionCreator} from "@/models/album_subscription.ts";

/**
 * 获取会员的专辑列表
 */
export async function useListMemberAlbumSubscriptions(pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: AlbumSubscription[]
    }>("/creation_api/album/subscription/list", {pageNum: pageNum, pageSize: pageSize});
}

export async function useCreateAlbumSubscription(albumSubscriptionCreator: AlbumSubscriptionCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: number,
    }>("/creation_api/album/subscription/add", albumSubscriptionCreator);
}

export async function useCancelAlbumSubscription(albumSubscriptionCreator: AlbumSubscriptionCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: number,
    }>("/creation_api/album/subscription/cancel", albumSubscriptionCreator);
}

export async function useQueryAlbumSubscription(albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: AlbumSubscription,
    }>("/creation_api/album/subscription/query", {albumId: albumId});
}

export async function useLoadAlbumSubscriptions(beginAlbumSubscriptionId: string, pageSize: number) {
    return await http.get<{
        code: number,
        message: string,
        data: AlbumSubscription[],
    }>("/creation_api/album/subscription/load", {
        beginAlbumSubscriptionId: beginAlbumSubscriptionId,
        pageSize: pageSize
    });
}


export async function useDeleteAlbumSubscription(albumSubscriptionId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: number,
    }>("/creation_api/album/subscription/delete", {albumSubscriptionId: albumSubscriptionId});
}

export async function useIsSubscribed(albumCreatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: Boolean,
    }>("/creation_api/album/subscription/isSubscribed", {albumCreatorMemberId: albumCreatorMemberId, albumId: albumId});
}