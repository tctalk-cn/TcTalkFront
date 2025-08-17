import http from "@/utils/http.ts";

export async function useClearSearchLog() {
    return await http.post<{
        code: number,
        message: string,
        data: Boolean,
    }>("/member_api/member/searchHistory/clearSearchLog");
}

export async function useAddSearchLog(keyword: string, channelId: string) {
    return await http.post<{
        code: number,
        message: string,
        data: Number,
    }>("/member_api/member/searchHistory/addSearchLog",{keywords:keyword,channelId:channelId});
}