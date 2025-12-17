export interface MemberStatisticsInfo {
    /**
     * 会员ID
     */
    memberId: string;
    /**
     * 累计消费金额
     */
    consumeAmount: number;
    /**
     * 订单数量
     */
    orderCount: number;
    /**
     * 优惠券数量
     */
    couponCount: number;
    /**
     * 评价数
     */
    commentCount: number;
    /**
     * 退货数量
     */
    returnOrderCount: number;
    /**
     * 登录次数
     */
    loginCount: number;
    /**
     * 关注数量
     */
    attendCount: number;
    /**
     * 点赞数
     */
    likesCount: number;
    /**
     * 作品数
     */
    worksCount: number;
    /**
     * 弹幕数
     */
    barrageCount: number;
    /**
     * 动态数
     */
    newsCount: number;
    /**
     * 粉丝数
     */
    fansCount: number;
    /**
     * 收藏作品数
     */
    collectWorksCount: number;
}

/**
 * 会员交易统计数据
 */
export interface MemberTransactionStatistics {
    id: string;

    /**
     * 会员ID
     */
    memberId: string;

    /**
     * 累计消费金额
     */
    consumeAmount: string;

    /**
     * 订单数量
     */
    orderCount: number;

    /**
     * 支付成功订单数
     */
    successfulPaymentCount: number;

    /**
     * 待支付订单数
     */
    pendingPaymentCount: number;

    /**
     * 支付失败订单数
     */
    failedPaymentCount: number;

    /**
     * 优惠券数量
     */
    couponCount: number;

    /**
     * 交易评论数
     */
    commentCount: number;

    /**
     * 交易评论获赞数
     */
    commentLikeCount: number;

    /**
     * 交易评论获评论数
     */
    commentReplyCount: number;

    /**
     * 交易评论被浏览数
     */
    commentViewCount: number;

    /**
     * 退货数量
     */
    returnOrderCount: number;

    /**
     * 总退款金额
     */
    totalRefundAmount: string;

    /**
     * 总支付金额，用于计算平均订单金额
     */
    totalPaymentAmount: string;

    /**
     * 平均订单金额
     */
    averageOrderAmount: string;

    /**
     * 首次下单时间
     */
    firstOrderTime: string;

    /**
     * 最近下单时间
     */
    recentOrderTime: string;

    /**
     * 最近一次交易评论时间
     */
    lastCommentTime: string;

    /**
     * 注册时间
     */
    createTime: string;

    /**
     * 更新时间
     */
    updateTime: string;
}
