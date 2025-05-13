/**
 * 媒体数据
 */
export interface MediaData {
    id: string;
    coverUrl: string;
    playUrl: string;
    height: number;
    width: number;
    title: string;
    durationInMs: number;
    description?: any;
    commentCount: number;
    shareCount: number;
    playCount: number;
    barrageCount: number;
    collectionCount: number;
    createTime: string;
    /**
     * 点赞数量
     */
    praisedCount: number;
    creatorUsername: string;
    creatorMemberId: string;
    creatorNickname: string;
    mediaType: number;
    position: number;
    albumId: string;
    albumName: string;
    permissions: number;
}