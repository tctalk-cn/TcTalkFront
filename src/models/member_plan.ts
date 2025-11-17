/**
 * 会员计划对象
 */
export interface MemberPlanModel {
    id: string;
    /**
     * 产品线编码
     */
    categoryCode:string;
    /**
     * 计划编码，如 GOLD_MONTHLY
     */
    planCode: string;

    /**
     * 计划名称，如黄金会员月卡
     */
    planName: string;

    /**
     * 类型：月卡/年卡/季卡
     */
    planType: string;
    /**
     * 计划说明
     */
    planDescription: string;
    /**
     * 当前生效版本号
     */
    currentVersionNo: number;
    /**
     * 原价（非促销价）
     */
    originalPrice: string;
    /**
     * 当前促销价
     */
    promotionPrice: string;

    /**
     * 首月优惠价
     */
    firstMonthPrice:string;

    /**
     * 续费价
     */
    renewPrice:string;

    /**
     * 促销开始时间
     */
    promotionStartTime:string;

    /**
     * 促销结束时间
     */
    promotionEndTime:string;
    /**
     * 促销说明
     */
    promotionDesc: string;
    /**
     * 有效期天数
     */
    durationDays: number;
    /**
     * 会员权益JSON
     */
    benefitsJson: string;
    /**
     * 上下架状态：0下架 1上架
     */
    shelfStatus: boolean;
    /**
     * 审核状态：0待审核 1通过 2拒绝
     */
    auditStatus: number;
    /**
     * 审核人
     */
    auditBy: string;
    /**
     * 审核时间
     */
    auditTime: string;
    /**
     * 审核备注
     */
    auditRemark: string;
    /**
     * 是否启用
     */
    enableStatus: boolean;

    createBy: string;

    createTime: string;

    updateTime: string;

    updateBy: string;

    /**
     * 优惠标签，用于在类型层级展示，如 双11限时优惠
     */
    promotionLabel:string;

    /**
     * 优惠标签描述，前端可以展示多条促销信息
     */
    promotionLabelDesc:string;

    /**
     * 价格提示，如 低于五折，每日仅需0.8 等
     */
    priceHintDesc:string;

    /**
     * 续费提示，如 次月续费20
     */
    renewHintDesc:string;
}

export interface MemberBenefitModel {
    id: string;
    /**
     * 权益编码，如 FREE_SHIPPING, DISCOUNT_5_PERCENT
     */
    benefitCode: string;

    /**
     * 权益名称，如包邮、95折
     */
    benefitName: string;

    /**
     * 权益类型，如 discount / coupon / privilege / points
     */
    benefitType: string;
    /**
     * 权益配置（如折扣比例、次数限制等）
     */
    configJson: string;
    /**
     * 权益描述
     */
    benefitDesc: number;
    /**
     * 是否启用
     */
    enableStatus: boolean;

    createBy: string;

    createTime: string;

    updateTime: string;

    updateBy: string;
}

/**
 * 会员付费方案返回对象
 */
export interface MemberPlanRespModel {
    memberPlan: MemberPlanModel;
    benefits: Array<MemberBenefitModel>;
}