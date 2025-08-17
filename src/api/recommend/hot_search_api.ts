import http from "@/utils/http.ts";
import {SearchHotDetail} from "@/models/search_hot_detail.ts";
import {Album} from "@/models/album.ts";
import {CommonPage} from "@/models/common_page.ts";

/**
 * 查询热点词
 */
export async function useSearchHotDetail(keyword: string, channelId: string, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: SearchHotDetail[];
    }>("/recommend_api/search/hot/detail", {keyword: keyword, channelId: channelId, pageSize: pageSize});
}

/**
 * 查询热点词
 */
export async function useSuggestSearch(keyword: string, channelId: string, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: string[];
    }>("/recommend_api/search/suggestSearch", {keyword: keyword, channelId: channelId, pageSize: pageSize});
}

/**
 * 根据关键词查询
 */
export async function useSearchByKeyword(keyword: string, channelId: string, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: Album[];
    }>("/recommend_api/search/searchByKeyword", {keyword: keyword, channelId: channelId, pageSize: pageSize});
}

/**
 * 根据关键词查询
 */
export async function useRealSearchByKeyword(keyword: string, channelId: string, pageNum: number, pageSize: number) {
    return await http.get<{
        code: number;
        message: string;
        data: CommonPage<Album>;
    }>("/recommend_api/search/realSearchByKeyword", {
        keyword: keyword,
        channelId: channelId,
        pageNum: pageNum,
        pageSize: pageSize
    });
}


/**
 * 最佳匹配查询
 */
export async function useBestSearchByKeyword(keyword: string, channelId: string) {
    return await http.get<{
        code: number;
        message: string;
        data: Album;
    }>("/recommend_api/search/bestSearchByKeyword", {
        keyword: keyword,
        channelId: channelId,
    });
}