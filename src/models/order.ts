export class CreateVipOrderParams {
    /**
     * 作品创建人
     */
    creatorMemberId: string;

    /**
     * 会员付费方案ID
     */
    planId: string;
}


export class OrderDTO {
    /**
     * 订单ID
     */
    id: string;

    /**
     * 唯一订单号
     */
    orderNo: string;

    /**
     * 图片链接
     */
   orderImgUrl:string;

    /**
     * SKU数量
     */
   skuCount:number;

    /**
     * 产品名称
     */
   productName:string;

    /**
     * 产品描述
     */
    productDesc:string;

    /**
     * 用户ID
     */
    memberId: string;

    /**
     * 订单类型：vip, album, reward等
     */
    orderType: string;

    /**
     * 订单总金额
     */
    amountTotal: string;

    /**
     * 优惠金额
     */
    amountDiscount: string;

    /**
     * 实际支付金额
     */
    amountPaid: string;

    /**
     * 优惠券抵扣
     */
    couponAmount: string;

    /**
     * 订单状态：创建、待支付、支付中、支付成功、支付失败、取消
     */
    orderStatus: number;

    /**
     * 未支付订单过期时间（如15分钟）
     */
    expireTime: string;

    /**
     * 更新时间
     */
    updateTime:string;

    /**
     * 支付状态：0未支付，1已支付，2已退款
     */
    paymentStatus: number;

    /**
     * 支付方式：wechat, alipay
     */
    paymentMethod: string;

    /**
     * 支付时间
     */
    paymentTime: string;

    /**
     * 币种类型
     */
    currencyType: string;


    /**
     * 版本号
     */
    version: string;

    /**
     * 订单评论状态：0=未评论, 1=已评论（可追评）, 2=追评完成或超时不可评论
     */
     commentStatus:number;

    /**
     * 订单累计评论次数（含追评）
     */
     commentCount:number;

    /**
     * 订单最后一次评论时间
     */
    lastCommentTime:string;

    /**
     * 评论截止时间（支付后或首次评论后计算）
     */
    commentDeadline:string;

    /**
     * 订单允许的最大评论次数（含追评）
     */
     maxCommentCount:number;

    /**
     * 退款是否禁止评论
     */
     refundBlock:boolean;

    /**
     * sku
     */
    items: Array<OrderItemDTO>;
}

export class OrderItemDTO {
    /**
     * 关联 oms_product_sku.id
     */
    skuId: string;

    /**
     * 快照SKU编码
     */
    skuCode: string;

    /**
     * 快照商品类型
     */
    productType: string;

    /**
     * 业务表ID，如album.id / vip_plan.id
     */
    bizId: string;

    /**
     * 购买数量
     */
    quantity: number;

    /**
     * 下单价格
     */
    price: string;


    /**
     * sku名称
     */
    skuName: string;

    /**
     * 原价（快照）
     */
    originalPrice: string;

    /**
     * 分摊优惠金额
     */
    discountAmount: string;

    /**
     * 分摊券抵扣金额
     */
    couponAmount: string;

    /**
     * 分摊促销金额
     */
    promotionAmount: string;

    /**
     * SKU 最终支付金额（已分摊）
     */
    payAmount: string;

    skuImgUrl: string;
}

export class MemberBenefit {
    benefitCode: string;
    benefitName: string;
    benefitType: string;
    benefitDesc: string;
}

export class OrderVipExtDTO {
    /**
     * 订单ID
     */
    orderId: string;

    /**
     * 唯一订单号
     */
    orderNo: string;

    /**
     * VIP计划ID
     */
    vipId: string;

    /**
     * 购买时长（月）
     */
    duration: number;

    /**
     * 开始时间
     */
    startTime: string;

    /**
     * 结束时间
     */
    endTime: string;

    /**
     * 优惠标签，用于在类型层级展示，如 双11限时优惠
     */
    promotionLabel: string;

    /**
     * 优惠标签描述，前端可以展示多条促销信息
     */
    promotionLabelDesc: string;

    /**
     * 计费模式：ONCE一次性/RECURRING自动续费/TRIAL试用/INTRO首月优惠
     */
    billingMode: string;

    /**
     * 订阅须知/自动续费说明等 JSON 数组
     */
    noticesJson: string;

    /**
     * 会员权益JSON
     */
    benefits: MemberBenefit[];

    /**
     * 续费价
     */
    renewPrice: string;

    /**
     * 自动续费状态
     */
    autoRenewStatus: boolean;
}

export class VipOrderDTO {
    /**
     * 订单ID
     */
    id: string;

    /**
     * 唯一订单号
     */
    orderNo: string;

    /**
     * 产品名称
     */
    productName: string;

    /**
     * 产品描述
     */
    productDesc: string;

    /**
     * 用户ID
     */
    memberId: string;

    /**
     * 购买账号展示（脱敏）
     * 如：137****5678
     */
    accountDisplay: string;

    /**
     * 订单类型：vip, album, reward等
     */
    orderType: string;

    /**
     * 订单总金额
     */
    amountTotal: string;

    /**
     * 优惠金额
     */
    amountDiscount: string;

    /**
     * 实际待支付金额（最终价）
     */
    amountPayable: string;

    /**
     * 优惠券抵扣
     */
    couponAmount: string;

    /**
     * 订单状态：创建、待支付、支付中、支付成功、支付失败、取消
     */
    orderStatus: number;

    /**
     * 下单时间（时间戳）
     */
    createTime: string;

    /**
     * 更新时间
     */
    updateTime:string;

    /**
     * 未支付订单过期时间（如15分钟）
     */
    expireTime: string;

    /**
     * 展示倒计时（精确秒）
     */
    expireSeconds: number;

    /**
     * 支付状态：0未支付，1已支付，2已退款
     */
    paymentStatus: number;

    /**
     * 支付方式：wechat, alipay
     */
    paymentMethod: string;

    /**
     * 支付时间
     */
    paymentTime: string;

    /**
     * 币种类型
     */
    currencyType: string;


    /**
     * 版本号
     */
    version: string;

    /**
     * sku
     */
    orderItemDTO: OrderItemDTO;

    /**
     * vip信息
     */
    orderVipExtDTO: OrderVipExtDTO;
}