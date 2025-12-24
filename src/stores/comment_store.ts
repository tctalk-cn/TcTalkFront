import {defineStore} from "pinia";
import {useAddTransactionComment} from "@/api/order/comment_api.ts";
import {AddTransactionCommentParams} from "@/models/order_comment.ts";

export const useCommentStore = defineStore(
    "commentStore",
    {
        state: () => ({}),
        getters: {},
        actions: {

            // 添加交易订单评论
            async addTransactionComment(params: AddTransactionCommentParams) {
                return await useAddTransactionComment(params);
            },
        },
    }
);