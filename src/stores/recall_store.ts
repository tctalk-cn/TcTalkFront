import {defineStore} from "pinia";
import {useRecommendForUser} from "../api/recall/recall_for_album_api.ts";

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
        }
    }
})