/**
 * 媒体播放统计数据
 */
export interface MediaSummary {
    /**
     * 专辑ID
     */
    albumId: string;

    /**
     * 音频ID
     */
    mediaId: string;

    /**
     * 媒体的创建者用户ID
     */
    creatorMemberId: string;

    /**
     * 播放日期
     */
    playDate: string[];

    /**
     * 播放次数
     */
    playCount: number[];

    /**
     * 完整播放次数
     */
    finishPlayCount: number[];

    /**
     * 平均播放时长（秒）
     */
    avgDuration: number[];
    /**
     * 总播放时长（秒）
     */
    totalDuration: number[];

    /**
     * 播放用户数
     */
    uniqueUsers: number[];

    /**
     * 复听用户数
     */
    returningListenUsers: number[];

    /**
     * 增长粉丝数
     */
    incFansCounts: number[];

    /**
     * 减少粉丝数
     */
    decFansCounts: number[];

    /**
     * 曝光数
     */
    exposureCounts: number[];

    /**
     * 浏览数
     */
    viewCounts: number[];

    /**
     * 点赞数
     */
    praisedCounts: number[];

    /**
     * 评论数
     */
    favoritesCounts: number[];

    /**
     * 分享数
     */
    shareCounts: number[];

    /**
     * 评论数
     */
    commentCounts: number[];

    /**
     * 观众所属地区
     */
    audienceRegion: string;

    /**
     * 观众地区数
     */
    audienceRegionCounts: number[];

    /**
     * 观众性别统计数
     */
    audienceSexCounts: number[];

    /**
     * 观众年龄区间统计数
     */
    audienceAgeRegionCounts: number[];

    /**
     * 不感兴趣统计数
     */
    noInterestedCounts: number[];

    /**
     * 订阅
     */
    subscriptionCount: number[];

    /**
     * 新增订阅
     */
    incSubscriptionCount: number[];

    /**
     * 取消订阅
     */
    decSubscriptionCount: number[];
}