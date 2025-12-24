import http from "@/utils/http.ts";
import {AddTransactionCommentParams} from "@/models/order_comment.ts";


/**
 * 添加订单评论
 */
export async function useAddTransactionComment(params: AddTransactionCommentParams) {
    return await http.post<{
        code: string,
        message: string,
        data: Boolean
    }>("/cms_api/comment/addTransactionComment", params);
}



