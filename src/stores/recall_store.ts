import {defineStore} from "pinia";
import {
    useRecommendForUser,
    useSuddenPopularRecommend,
    useGuessYouLikeRecommend
} from "@/api/recall/recall_for_album_api.ts";

/**
 * player store
 */
export const useRecallStore = defineStore({
    id: "recall",
    state: () => {
        return {}

    },
    actions: {
        async recommendForUserTopK(topK: number) {
            const {data} = await useRecommendForUser(topK);
            return data;
        },
        async suddenPopularRecommend(topK: number) {
            const {data} = await useSuddenPopularRecommend(topK);
            return data;
        },
        async guessYouLikeRecommend(topK: number, excludeAlbums: Array<string>) {
            const {data} = await useGuessYouLikeRecommend(topK, excludeAlbums);
            return data;
        },

    }
})