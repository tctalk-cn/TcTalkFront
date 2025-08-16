export interface MediaBarrage {
    /**
     * id
     */
    id?: number;
    /**
     * 弹幕内容
     */
    content: string;
    /**
     * 类型，0:随机位置，1:固定在中间
     */
    positionType: number;
    /**
     * 弹幕颜色
     */
    decimalColor: string;
    /**
     * 字体大小
     */
    fontSize: number;
    /**
     * 透明度
     */
    opacity: number;
    /**
     * 视频ID
     */
    mediaId: string;
    /**
     * 媒体创建者的用户ID
     */
    creatorMemberId: string;

    /**
     * 在视频什么时间发送弹幕
     */
    senderBarrageTime: number;
}

/**
 * 弹幕类型
 * RANDOM: 随机位置
 * FIXED: 固定在中间
 */
export enum BarrageType {
    RANDOM = 1,
    FIXED
}