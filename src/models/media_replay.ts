/**
 * 评论回复
 */
export class MediaReplayCreator {
    /**
     * 媒体ID
     */
    mediaId: string;

    /**
     * 媒体的创建者用户ID
     */
    creatorMemberId: string;

    /**
     * 评论ID
     */
    commentId: string;
    /**
     * 回复内容
     */
    replayContent?: string;
    /**
     * 定位
     */
    location?: string;
}

/**
 * 回复对象
 */
export interface MediaReplay {
    id?: number;
    /**
     * 媒体ID
     */
    mediaId: string;

    /**
     * 媒体的创建者用户ID
     */
    creatorMemberId: string;

    /**
     * 评论ID
     */
    commentId: string;
    /**
     * 回复内容
     */
    replayContent?: string;
    /**
     * 回复会员ID
     */
    relayMemberId?: string;
    /**
     * 回复的会员昵称
     */
    relayNickname?: string;
    /**
     * 定位
     */
    location?: string;
    /**
     * 创建时间
     */
    createTime?: string;

    /**
     * 评论数
     */
    commentCount?: number;

    /**
     * 差评数
     */
    negativeFeedbackCount?: number;

    /**
     * 分享数
     */
    shareCount?: number;

    /**
     * 点赞数量
     */
    praisedCount?: number;
    /**
     * 父评论回复ID，默认为空，表示没有对回复在回复
     */
    parentReplayId?: number;
}