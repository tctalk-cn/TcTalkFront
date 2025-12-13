import http from "@/utils/http.ts";
import {CreateVipOrderParams, OrderDTO,VipOrderDTO} from "@/models/order.ts";


/**
 * 创建VIP订单
 */
export async function useCreateVipOrder(params: CreateVipOrderParams) {
    return await http.post<{
        code: string,
        message: string,
        data: OrderDTO
    }>("/oms_api/order/createVip/", params);
}

/**
 * 查询订单明细
 */
export async function useFindPendingVipOrderDetail(orderId: string, orderNo: string) {
    return await http.post<{
        code: string,
        message: string,
        data: VipOrderDTO
    }>("/oms_api/order/findPendingVipOrderDetail/" + orderId + "/" + orderNo);
}

/**
 * 查询用户订单
 */
export async function useLoadOrders(beginOrderId: string, pageSize: number){
    return await http.get<{
        code: string,
        message: string,
        data: OrderDTO[],
    }>("/oms_api/order/loadOrders", {beginOrderId: beginOrderId, pageSize: pageSize});
}

/**
 * 查询VIP订单信息
 */
export async function useFindVipOrderDetail(orderId: string, orderNo: string) {
    return await http.post<{
        code: string,
        message: string,
        data: VipOrderDTO
    }>("/oms_api/order/findVipOrderDetail/" + orderId + "/" + orderNo);
}

