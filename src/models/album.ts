/**
 * 专辑对象
 */
export interface Album {
    id: string;
    /**
     * 专辑名称
     */
    name: string;
    remark: string;
    /**
     * 企业
     */
    company: string;
    /**
     * 封面地址链接
     */
    coverUrl: string;
    /**
     * 频道ID
     */
    channelId: string;
    channelName: string;
    /**
     * 一级分类ID
     */
    categoryLevel1Id: string;
    /**
     * 一级分类名称
     */
    categoryLevel1Name: string;
    /**
     * 二级分类ID
     */
    categoryLevel2Id: string;
    /**
     * 二级分类名称
     */
    categoryLevel2Name: string;
    /**
     * 三级分类ID
     */
    categoryLevel3Id: string;
    /**
     * 三级分类名称
     */
    categoryLevel3Name: string;
    /**
     * 四级分类ID
     */
    categoryLevel4Id: string;
    /**
     * 四级分类名称
     */
    categoryLevel4Name: string;
    /**
     * 版权
     */
    copyright: string;
    /**
     * 卖点
     */
    sellPoint: string;
    /**
     * 是否付费
     */
    paid: boolean;

    /**
     * 费用类型，枚举：付费、免费、VIP
     */
    feeType: string;
    /**
     * 是否在售
     */
    onSale: boolean;
    /**
     * 会员信息
     */
    creatorMemberId: string;
    /**
     * 用户名
     */
    creatorNickname: string;
    /**
     * 创作团队成员的ID集合
     */
    creatorTeamMemberIds: string;

    /**
     * 评论数
     */
    commentCount: number;

    /**
     * 分享数
     */
    shareCount: number;

    /**
     * 播放量
     */
    viewsCount: number;

    // /**
    //  * 点赞数量
    //  */
    // recommendCount: number;

    /**
     * 订阅数
     */
    subscriptionCount: number;

    /**
     * 权限,0-无限制；1-仅自己可见；2-仅好友可见；3-仅指定人群可见
     */
    permissions: number;

    /**
     * 审核状态
     */
    auditStatus: number;

    /**
     * 是否完结
     */
    finished: boolean;

    /**
     * 是否原创
     */
    original: boolean;

    /**
     * 描述，详细描述卖点
     */
    description: string;

    createTime: string;

    updateTime: string;

    /**
     * 专辑推荐中评估为好的统计数
     */
    recommendCount: number;

    /**
     * 专辑推荐中评估为一般的统计数
     */
    averageCount: number;

    /**
     * 专辑推荐中被评估为不好的统计数
     */
    poorCount: number;

    /**
     * 专辑被推荐占比
     */
    recommendPercent: number;

    /**
     * 专辑推荐中评估为一般的占比
     */
    averagePercent: number;

    /**
     * 专辑推荐中被评估为不好的占比
     */
    poorPercent: number;

    /**
     * 是否为最后选择的专辑
     */
    lastSelected: boolean;

    intellectualPromise: boolean;
    /**
     * 属性值列表
     */
    attributeValues: AlbumAlbumAttributeValueCreator[];
}

export class AlbumCreator {
    /**
     * 专辑名称
     */
    name: string;
    /**
     * 企业
     */
    company: string;
    /**
     * 封面地址链接
     */
    coverUrl: string;
    /**
     * 频道ID
     */
    channelId: string;
    /**
     * 一级分类ID
     */
    categoryLevel1Id: string;
    /**
     * 一级分类名称
     */
    categoryLevel1Name: string;
    /**
     * 二级分类ID
     */
    categoryLevel2Id: string;
    /**
     * 二级分类名称
     */
    categoryLevel2Name: string;
    /**
     * 三级分类ID
     */
    categoryLevel3Id: string;
    /**
     * 三级分类名称
     */
    categoryLevel3Name: string;
    /**
     * 四级分类ID
     */
    categoryLevel4Id: string;
    /**
     * 四级分类名称
     */
    categoryLevel4Name: string;
    /**
     * 版权
     */
    copyright: string;
    /**
     * 卖点
     */
    sellPoint: string;
    /**
     *描述
     */
    description: string;
    /**
     * 是否付费
     */
    paid: boolean;
    /**
     * 是否在售
     */
    onSale: boolean;
    /**
     * 费用类型，枚举：付费、免费、VIP
     */
    feeType: string;
    /**
     * 创作团队成员的ID集合
     */
    creatorTeamMemberIds: string;
    /**
     * 是否原创
     */
    original: boolean;
    /**
     * 权限,0-无限制；1-仅自己可见；
     */
    permissions: number;

    /**
     * 是否填了知识产权
     */
    intellectualPromise: boolean;

    /**
     * 声音类型（男声, 女声, 童声, 磁性, 温柔）
     */
    voiceType: string;

    /**
     * 时长类型(短篇, 中篇, 长篇)
     */
    durationType: string;

    /**
     * 更新频率(连载, 完结, 每日更新)
     */
    updatePreference: string;

    /**
     * 内容类型(有声书, 播客, 新闻, 相声)
     */
    contentType: string;

    /**
     * 属性值列表
     */
    attributeValues: AlbumAlbumAttributeValueCreator[];
}

export class AlbumAlbumAttributeValueCreator {
    /**
     * 属性ID
     */
    attributeId: string;

    /**
     * 属性名称
     */
    attributeName: string;

    /**
     * 值ID
     */
    attributeValueId: string;

    /**
     * 值名称
     */
    attributeValueName: string;

    /**
     * 值顺序
     */
    attributeValueOrder: number;
}

/**
 * 专辑对象
 */
export interface Album {
    id: string;
    /**
     * 专辑名称
     */
    name: string;
    remark: string;
    /**
     * 企业
     */
    company: string;
    /**
     * 封面地址链接
     */
    coverUrl: string;
    /**
     * 频道ID
     */
    channelId: string;
    channelName: string;
    /**
     * 一级分类ID
     */
    categoryLevel1Id: string;
    /**
     * 一级分类名称
     */
    categoryLevel1Name: string;
    /**
     * 二级分类ID
     */
    categoryLevel2Id: string;
    /**
     * 二级分类名称
     */
    categoryLevel2Name: string;
    /**
     * 三级分类ID
     */
    categoryLevel3Id: string;
    /**
     * 三级分类名称
     */
    categoryLevel3Name: string;
    /**
     * 四级分类ID
     */
    categoryLevel4Id: string;
    /**
     * 四级分类名称
     */
    categoryLevel4Name: string;
    /**
     * 版权
     */
    copyright: string;
    /**
     * 卖点
     */
    sellPoint: string;
    /**
     * 是否付费
     */
    paid: boolean;

    /**
     * 费用类型，枚举：付费、免费、VIP
     */
    feeType: string;
    /**
     * 是否在售
     */
    onSale: boolean;
    /**
     * 会员信息
     */
    creatorMemberId: string;
    /**
     * 用户名
     */
    creatorNickname: string;
    /**
     * 创作团队成员的ID集合
     */
    creatorTeamMemberIds: string;

    /**
     * 评论数
     */
    commentCount: number;

    /**
     * 分享数
     */
    shareCount: number;

    /**
     * 播放量
     */
    viewsCount: number;

    // /**
    //  * 点赞数量
    //  */
    // recommendCount: number;

    /**
     * 订阅数
     */
    subscriptionCount: number;

    /**
     * 权限,0-无限制；1-仅自己可见；2-仅好友可见；3-仅指定人群可见
     */
    permissions: number;

    /**
     * 审核状态
     */
    auditStatus: number;

    /**
     * 是否完结
     */
    finished: boolean;

    /**
     * 是否原创
     */
    original: boolean;

    /**
     * 描述，详细描述卖点
     */
    description: string;

    createTime: string;

    updateTime: string;

    /**
     * 专辑推荐中评估为好的统计数
     */
    recommendCount: number;

    /**
     * 专辑推荐中评估为一般的统计数
     */
    averageCount: number;

    /**
     * 专辑推荐中被评估为不好的统计数
     */
    poorCount: number;

    /**
     * 专辑被推荐占比
     */
    recommendPercent: number;

    /**
     * 专辑推荐中评估为一般的占比
     */
    averagePercent: number;

    /**
     * 专辑推荐中被评估为不好的占比
     */
    poorPercent: number;

    /**
     * 是否为最后选择的专辑
     */
    lastSelected: boolean;

    intellectualPromise: boolean;

    /**
     * 声音类型（男声, 女声, 童声, 磁性, 温柔）
     */
    voiceType: string;

    /**
     * 声音类型-文本（男声, 女声, 童声, 磁性, 温柔）
     */
    voiceTypeText: string;

    /**
     * 时长类型(短篇, 中篇, 长篇)
     */
    durationType: string;

    /**
     * 时长类型-文本(短篇, 中篇, 长篇)
     */
    durationTypeText: string;

    /**
     * 更新频率(连载, 完结, 每日更新)
     */
    updateFrequencyType: string;

    /**
     * 文本信息
     */
    updateFrequencyTypeText:string;
    /**
     * 内容类型(有声书, 播客, 新闻, 相声)
     */
    contentType: string;

    /**
     * 属性值列表
     */
    attributeValues: AlbumAlbumAttributeValueCreator[];
}

export class AlbumForRecallResp {
    /**
     * 专辑ID
     */
    albumId: string;
    /**
     * 专辑名称
     */
    albumTitle: string;

    /**
     * 专辑描述
     */
    albumDesc: string;
    /**
     * 企业
     */
    company: string;
    /**
     * 封面地址链接
     */
    coverUrl: string;
    /**
     * 一级分类名称
     */
    categoryLevel1Name: string;
    /**
     * 是否付费
     */
    paid: boolean;
    /**
     * 是否在售
     */
    onSale: boolean;
    /**
     * 费用类型，枚举：付费、免费、VIP
     */
    feeType: string;
    /**
     * 创作团队成员的ID集合
     */
    creatorTeamMemberIds: string;
    /**
     * 是否原创
     */
    original: boolean;
    /**
     * 浏览数
     */
    viewsCount: string;
    /**
     * 订阅数
     */
    subscriptionCount: string;

    /**
     * 字幕数
     */
    barrageCount: string;

    /**
     * 喜欢数
     */
    likeCount: string;

    /**
     * 评论数
     */
    commentCount: string;

    /**
     * 发布时间
     */
    publishTime: string;
    /**
     * 作品创建人
     */
    creatorMemberId: string;
    /**
     * 创建人昵称
     */
    creatorNickname: string;
    /**
     * 声音类型（男声, 女声, 童声, 磁性, 温柔）
     */
    voiceTypes: string;
    /**
     * 时长类型(短篇, 中篇, 长篇)
     */
    durationType: string;
    /**
     * 更新频率(连载, 完结, 每日更新)
     */
    updateFrequencyType: string;

}





