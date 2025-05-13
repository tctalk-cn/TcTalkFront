export interface VideoViews {
    id?: number;
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
     * 视频播放时长
     */
    videoDurationInSec?: number;
    /**
     * 用户使用的设备类型（0:未知，1:手机，2:平板电脑，3:电脑等)
     */
    deviceType?: number;
    /**
     * 定位
     */
    location?: string;
    /**
     * 创建时间
     */
    createTime?: string;

    title?: string;

    creatorNickname?: string;

    playCount?: number;

    barrageCount?: number;
}