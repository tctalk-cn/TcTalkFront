import http from "@/utils/http.ts";
import {GeneratePayRequestParams, PayParams, PayResponse, PaymentRecord} from "@/models/pay_record.ts";


/**
 * 生成支付请求ID
 */
export async function useGenerateRequestId(params: GeneratePayRequestParams) {
    return await http.post<{
        code: string,
        message: string,
        data: string
    }>("/oms_api/pay/generateRequestId/", params);
}

/**
 * 创建并生成支付链接
 */
export async function useCreateAndPay(params: PayParams) {
    return await http.post<{
        code: string,
        message: string,
        data: PayResponse
    }>("/oms_api/pay/createAndPay/", params);
}

/**
 * 查询支付记录
 */
export async function useFindPayment(paymentRecordId: string) {
    return await http.post<{
        code: string,
        message: string,
        data: PaymentRecord
    }>("/oms_api/pay/findPayment/" + paymentRecordId);
}
