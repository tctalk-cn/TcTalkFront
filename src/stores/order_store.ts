import {defineStore} from "pinia";
import {CreateVipOrderParams} from "@/models/order.ts";
import {useCreateVipOrder, useFindVipOrderDetail,useLoadOrders} from "@/api/order/order_api.ts";

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

            // 查询订单
            async findVipOrderDetail(orderId: string, orderNo: string) {
                return await useFindVipOrderDetail(orderId, orderNo);
            },

            // 分页查询用户订单
            async loadOrders(beginOrderId: string, pageSize: number) {
                return await useLoadOrders(beginOrderId, pageSize);
            },

        },
    }
);