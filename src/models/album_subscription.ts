/**
 * 专辑订阅对象
 */
export interface AlbumSubscription {
    id: string;
    /**
     * 订阅者用户ID
     */
    subscriberMemberId: string;
    /**
     * 订阅者专辑ID
     */
    subscribedAlbumId: string;
    /**
     * 订阅的专辑专辑名称
     */
    subscribedAlbumName: string;
    /**
     * 订阅的专辑封面地址链接
     */
    subscribedAlbumCoverUrl: string;
    /**
     * 订阅者专辑创建者用户ID
     */
    subscribedCreatorMemberId: string;
    /**
     * 订阅日期
     */
    subscriptionDate: string;

    /**
     * 订阅到期时间
     */
    subscriptionExpiryDate: string;
    /**
     * 订阅状态，表示订阅是否仍然有效。可以是：活跃（active），取消（cancelled），或已过期（inactive）
     */
    subscriptionStatus: number;
    /**
     * 是否启用提醒
     */
    reminderEnabled: Boolean;
    /**
     * 提醒时间
     */
    reminderTime: string;

    createTime: string;

    updateTime: string;
}

export class AlbumSubscriptionCreator {
    /**
     * 订阅者专辑ID
     */
    subscribedAlbumId: string;
    /**
     * 订阅者专辑创建者用户ID
     */
    subscribedCreatorMemberId: string;
}
