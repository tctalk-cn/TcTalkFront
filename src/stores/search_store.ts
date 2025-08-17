import {defineStore} from "pinia";
import type {SearchSuggest} from "@/models/search";
import {
    useSearchHotDetail,
    useSuggestSearch,
    useSearchByKeyword,
    useRealSearchByKeyword,
    useBestSearchByKeyword,
} from "@/api/recommend/hot_search_api";
import {useRecentlySearchLog} from "@/api/recommend/search_history_api.ts";
import {useClearSearchLog} from "@/api/member/search_history_api.ts";
import {useSearchSuggest} from "@/api/recommend/recommend_api.ts";

export const useSearchStore = defineStore("search", {
        state: () => {
            return {
                showSearchView: false,
                searchKeyword: '',
                suggestData: {} as SearchSuggest,
            }
        },
        getters: {
            showHot: state => {
                return state.searchKeyword == ''
            }
        },
        actions: {
            async suggest() {
                this.suggestData = await useSearchSuggest(this.searchKeyword)
            },
            // 获取个性化相关专辑
            async searchHotDetail(keyword: string, channelId: string) {
                const {data} = await useSearchHotDetail(keyword, channelId, 10);
                return data;
            },
            async recentlySearchLog() {
                const {data} = await useRecentlySearchLog();
                return data;
            },
            async suggestSearch(keyword: string, channelId: string) {
                const {data} = await useSuggestSearch(keyword, channelId, 10);
                return data;
            },
            async searchByKeyword(keyword: string, channelId: string) {
                const {data} = await useSearchByKeyword(keyword, channelId, 15);
                return data;
            },
            async clearSearchLog() {
                const {data} = await useClearSearchLog();
                return data;
            },
            async realSearchByKeyword(keyword: string, channelId: string, pageNum: number, pageSize: number) {
                const {data} = await useRealSearchByKeyword(keyword, channelId, pageNum, pageSize);
                return data.list;
            },
            async bestSearchByKeyword(keyword: string, channelId: string) {
                const {data} = await useBestSearchByKeyword(keyword, channelId);
                return data;
            },
        }
    }
)
