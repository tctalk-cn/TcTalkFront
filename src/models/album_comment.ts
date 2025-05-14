import {AlbumReplay} from "@/models/album_replay.ts";

export class AlbumCommentCreator {
    /**
     * 专辑ID
     */
    albumId: string;
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
     * 推荐类型
     */
    recommendType: number;
}

export class AlbumComment {
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
    replies?: Array<AlbumReplay>;
}

