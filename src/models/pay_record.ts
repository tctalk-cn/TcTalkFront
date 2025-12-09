/**
 * 生成支付请求参数
 */
export class GeneratePayRequestParams {
    /**
     * 渠道Code
     */
    channelCode: string;

    /**
     * 业务类型
     */
    bizType: string;
    /**
     * 订单ID
     */
    orderId: string;

    /**
     * 订单号
     */
    orderNo: string;
}

/**
 * 支付请求参数
 */
export class PayParams {
    /**
     * 渠道Code
     */
    channelCode: string;

    /**
     * 业务类型
     */
    bizType: string;
    /**
     * 订单ID
     */
    orderId: string;

    /**
     * 订单号
     */
    orderNo: string;

    /**
     * 客户端类型：H5/APP/PC/MP
     */
    clientType: string;

    /**
     * 支付请求ID
     */
    requestId: string;
}

/**
 * 支付返回
 */
export class PayResponse {
    paymentRecordId: string;
    payUrl: string;
    internalPaySuccess: boolean;
}