import {MediaReplay} from "@/models/media_replay.ts";

export class MediaCommentCreator {
    /**
     * 媒体ID
     */
    mediaId: string;
    /**
     * 媒体的创建者用户ID
     */
    creatorMemberId: string;
    /**
     * 定位
     */
    location: string;
    /**
     * 评论内容
     */
    content: string;
    /**
     * 媒体类型：1-专辑，2-音频，3-视频，4-ppt，999-其他
     */
    mediaType: number;
}

export class MediaComment {
    id: string;
    /**
     * 媒体ID
     */
    mediaId: string;
    /**
     * 媒体的创建者用户ID
     */
    creatorMemberId: string;
    /**
     * 发布评论的用户ID
     */
    commentMemberId: string;
    /**
     * 发布评论的用户昵称
     */
    commentNickname?: string;
    /**
     * 发布评论的用户头像链接
     */
    commentAvatarUrl?: string;
    /**
     * 级别名称
     */
    commentMemberLevelName?: string;
    /**
     * 定位
     */
    location: string;
    /**
     * 评论内容
     */
    content: string;
    /**
     * 评论数
     */
    commentCount: number;
    /**
     * 差评数
     */
    negativeFeedbackCount?: number;
    /**
     * 分享数
     */
    shareCount: number;
    /**
     * 点赞数量
     */
    praisedCount: number;
    /**
     * 创建时间
     */
    createTime: string;
    /**
     * 评论回复
     */
    replies?: Array<MediaReplay>;
}

