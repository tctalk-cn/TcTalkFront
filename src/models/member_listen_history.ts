export interface MemberListenHistory {
    id: string;
    /**
     * 会员ID
     */
    memberId: string;
    /**
     * 专辑ID
     */
    albumId: string;
    /**
     * 收听的媒体ID
     */
    mediaId: string;
    /**
     * 收听的媒体名称
     */
    mediaTitle: string;
    /**
     * 收听的媒体URL
     */
    mediaCoverUrl: string;
    /**
     * 收听到的位置
     */
    mediaListenTo: number;

    /**
     * 媒体总时长
     */
    mediaTotalDuration: number;

    /**
     * 创建时间
     */
    createTime: string;

    /**
     * 更新时间
     */
    updateTime: string;
}

// 收听历史的创建对象
export class MemberListenHistoryCreator {
    /**
     * 专辑ID
     */
    albumId: string;
    /**
     * 收听的媒体ID
     */
    mediaId: string;
    /**
     * 收听的媒体名称
     */
    mediaTitle: string;
    /**
     * 收听的媒体URL
     */
    mediaCoverUrl: string;
    /**
     * 收听到的位置
     */
    mediaListenTo: number;

    /**
     * 媒体总时长
     */
    mediaTotalDuration: number;
}

// 更新历史的创建对象
export class MemberListenHistoryUpdate {
    /**
     * 收听的媒体ID
     */
    mediaId: string;
    /**
     * 收听到的位置
     */
    mediaListenTo: number;
}