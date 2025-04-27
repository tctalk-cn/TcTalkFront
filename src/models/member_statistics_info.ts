export interface MemberStatisticsInfo {
    /**
     * 会员ID
     */
    memberId: number;
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
