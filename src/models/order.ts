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

export class OrderDTO{
    /**
     * 订单ID
     */
    id:string;

    /**
     * 唯一订单号
     */
    orderNo:string;

    /**
     * 用户ID
     */
   memberId:string;

    /**
     * 订单类型：vip, album, reward等
     */
     orderType:string;

    /**
     * 订单总金额
     */
     amountTotal:string;

    /**
     * 优惠金额
     */
     amountDiscount:string;

    /**
     * 实际支付金额
     */
     amountPaid:string;

    /**
     * 优惠券抵扣
     */
     couponAmount:string;

    /**
     * 订单状态：创建、待支付、支付中、支付成功、支付失败、取消
     */
     orderStatus:number;

    /**
     * 未支付订单过期时间（如15分钟）
     */
    expireTime:string;

    /**
     * 支付状态：0未支付，1已支付，2已退款
     */
     paymentStatus:number;

    /**
     * 支付方式：wechat, alipay
     */
    paymentMethod:string;

    /**
     * 支付时间
     */
     paymentTime:string;

    /**
     * 币种类型
     */
     currencyType:string;


    /**
     * 版本号
     */
     version:string;

    /**
     * sku
     */
      items:Array<OrderItemDTO>;
}

export class OrderItemDTO {
    /**
     * 关联 oms_product_sku.id
     */
     skuId:string;

    /**
     * 快照SKU编码
     */
    skuCode:string;

    /**
     * 快照商品类型
     */
     productType:string;

    /**
     * 业务表ID，如album.id / vip_plan.id
     */
    bizId:string;

    /**
     * 购买数量
     */
   quantity:number;

    /**
     * 下单价格
     */
     price:string;


    /**
     * sku名称
     */
    skuName:string;

    /**
     * 原价（快照）
     */
    originalPrice:string;

    /**
     * 分摊优惠金额
     */
     discountAmount:string;

    /**
     * 分摊券抵扣金额
     */
   couponAmount:string;

    /**
     * 分摊促销金额
     */
    promotionAmount:string;

    /**
     * SKU 最终支付金额（已分摊）
     */
     payAmount:string;

    skuImgUrl:string;
}