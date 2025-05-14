export class StreamerPerformanceQualityCommentCreator {
    /**
     * 专辑ID
     */
    albumId: string;
    /**
     * 媒体的创建者用户ID
     */
    creatorMemberId: string;
    /**
     * 推荐类型
     */
    performanceQualityType: number;
}

export class StreamerPerformanceQualityComment {
    id: string;
    /**
     * 媒体ID
     */
    albumId: string;
    /**
     * 专辑的创建者用户ID
     */
    creatorMemberId: string;

    /**
     * 推荐类型
     */
    performanceQualityType: number;
}

