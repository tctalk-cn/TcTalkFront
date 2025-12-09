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

/**
 * 支付记录
 */
export class PaymentRecord {
    id: string;
    orderId: number;
    orderNo: string;
    bizType: string;
    subject: string;
    clientType: string;
    memberId: string;
    amount: string;
    overpayAmount: string;
    externalAmount: string;
    currency: string;
    estimatedChannelFeeRate: string;
    estimatedFeeAmount: string;
    actualFeeRate: string;
    actualFeeAmount: string;
    settlementAmount: string;
    channel: string;
    channelSubType: string;
    tradeNo: string;
    channelTransactionId: string;
    prepayId: string;
    bankType: string;
    payerUserId: string;
    tradeStatus: number;
    refundStatus: number;
    errorCode: string;
    errorMessage: string;
    requestTime: string;
    responseTime: string;
    paymentTime: string;
    callbackTime: string;
    payingExpireTime: string;
    notifyUrl: string;
    maxRetry: number;
    callbackStatus: number;
    callbackProcessRetryCount: number;
    lastCallbackError: string;
    nextRetryTime: string;
    notifyRetryCount: number;
    statusQueryRetryCount: number;
    requestId: string;
    accountDate: string;
    version: number;
    createTime: string;
    updateTime: string;
    manualIntervention: boolean;
    payRedirectUrl: string;
    callbackBody: string;
    requestBody: string;
    responseBody: string;
}
