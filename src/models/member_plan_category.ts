export interface MemberPlanCategory {
    /**
     * 会员计划产品ID
     */
    id: string;
    /**
     * 分类编码
     */
    categoryCode: string;
    /**
     * 分类名称
     */
    categoryName: string;
    /**
     * 分类描述
     */
    categoryDesc: string;
    /**
     * 展示顺序
     */
    sortOrder: number;
    /**
     * 是否启用
     */
    enableStatus: boolean;
    /**
     * 当前分类下最优 plan 的促销标签
     */
    bestPlanPromotionLabel: string;
}
