import http from "@/utils/http.ts";
import {MemberListenHistory, MemberListenHistoryCreator,MemberListenHistoryUpdate} from "@/models/member_listen_history.ts";
import {CommonPage} from "@/models/common_page.ts";

export async function useAddListenHistory(listenHistoryCreator: MemberListenHistoryCreator) {
    return await http.post<{
        code: string,
        message: string,
        data: boolean,
    }>("/member_api/member/listenHistory/add", listenHistoryCreator);
}

export async function useUpdateListenHistory(listenHistoryUpdate: MemberListenHistoryUpdate) {
    return await http.post<{
        code: string,
        message: string,
        data: boolean,
    }>("/member_api/member/listenHistory/update", listenHistoryUpdate);
}

export async function useListListenHistory(toHistoryId: string, pageSize: number) {
    return await http.get<{
        code: number,
        message: string,
        data: CommonPage<MemberListenHistory>,
    }>("/member_api/member/listenHistory/list", {toHistoryId: toHistoryId, pageSize: pageSize});
}

export async function useGetListenHistory(mediaId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MemberListenHistory,
    }>("/member_api/member/listenHistory/getItem", {mediaId: mediaId});
}

export async function useLastListenHistory(albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MemberListenHistory,
    }>("/member_api/member/listenHistory/lastListen", {albumId: albumId});
}