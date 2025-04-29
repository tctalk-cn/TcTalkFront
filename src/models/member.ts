export interface UmsMember {
    id: string;
    uid: string;
    /**
     * 会员级别
     */
    memberLevelId: number;
    /**
     * 用户名
     */
    username: string;
    /**
     * 昵称
     */
    nickname: string;
    /**
     * 短名称
     */
    shortUsername: string;
    /**
     * 手机号码
     */
    phone: string;
    /**
     * 帐号启用状态:0->禁用；1->启用
     */
    status: number;
    /**
     * 头像地址
     */
    avatarUrl: string;
    /**
     * 性别：0->未知；1->男；2->女
     */
    gender: number;
    /**
     * 生日
     */
    birthday: string;
    /**
     * 所在城市
     */
    city: string;
    /**
     * 职业
     */
    job: string;
    /**
     * 学校
     */
    school: string;
    /**
     * 个性签名
     */
    personalizedSignature: string;
    /**
     * 积分
     */
    integration: number;
    /**
     * 短描述
     */
    shortDescription: string;
    /**
     * 详细描述
     */
    detailDescription: string;
    /**
     * 个性标签
     */
    tags: string;
    /**
     * 是否已经重置了用户名
     */
    hasResetUsername: number;
    /**
     * 会员等级
     */
    memberLevelName: string;

    /**
     * 二维码
     */
    qrCodeUrl: string;
}
