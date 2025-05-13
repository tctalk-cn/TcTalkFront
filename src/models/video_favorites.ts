export interface VideoFavorites {
    id?: number;
    title?: string;
    /**
     * 视频ID
     */
    videoId: number;

    /**
     * 发布评论的用户ID
     */
    visitorMemberId: number;
    /**
     * 封面地址链接
     */
    coverUrl?: string;
    /**
     * 视频播放地址
     */
    videoUrl?: string;
    /**
     * 创建时间
     */
    createTime?: string;

    creatorNickname?: string;

    playCount?: number;

    barrageCount?: number;
}