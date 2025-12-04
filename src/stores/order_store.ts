import {defineStore} from "pinia";
import {CreateVipOrderParams} from "@/models/order.ts";
import {useCreateVipOrder} from "@/api/order/order_api.ts";

export const useOrderStore = defineStore(
    "orderStore",
    {
        state: () => ({}),
        getters: {},
        actions: {

            // 创建会员类型订单
            async createVipOrder(params: CreateVipOrderParams) {
                 return await useCreateVipOrder(params);
            },
        },
    }
);