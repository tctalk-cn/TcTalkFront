import {defineStore} from "pinia";
import {useGenerateRequestId,useCreateAndPay} from "@/api/order/pay_api.ts";
import {GeneratePayRequestParams,PayParams} from "@/models/pay_record.ts";

export const usePayStore = defineStore(
    "payStore",
    {
        state: () => ({}),
        getters: {},
        actions: {
            // 生成支付请求ID
            async generateRequestId(params: GeneratePayRequestParams) {
                return await useGenerateRequestId(params);
            },

            // 生成支付单
            async createAndPay(params: PayParams) {
                return await useCreateAndPay(params);
            },
        },
    }
);