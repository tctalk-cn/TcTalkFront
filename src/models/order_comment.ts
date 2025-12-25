export class AddTransactionCommentParams {
    /**
     * 订单归属会员ID
     */
    ownerMemberId: string;

    /**
     * 订单ID
     */
    orderId: string;

    /**
     * 评分
     */
    commentScore: number;

    /**
     * 评论来源
     */
    commentSource: string;

    /**
     * 定位
     */
    commentLocation: string;

    /**
     * 城市
     */
    commentCity: string;

    /**
     * 评论内容
     */
    commentContent: string;

    /**
     * 设备ID
     */
    deviceId: string;
}
