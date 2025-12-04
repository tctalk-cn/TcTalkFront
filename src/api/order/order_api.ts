import http from "@/utils/http.ts";
import {CreateVipOrderParams, OrderDTO} from "@/models/order.ts";


/**
 * 根据频道ID，父品类ID，获取品类明细
 */
export async function useCreateVipOrder(params:CreateVipOrderParams) {
    return await http.post<{
        code: string,
        message: string,
        data: OrderDTO
    }>("/oms_api/order/createVip/",params);
}




