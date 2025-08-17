/**
 * 热点搜索
 */
export interface SearchHotDetail {
    id: string;
    /**
     * 搜索关键词
     */
    keywords: string;

    /**
     * 搜索统计计数
     */
    searchCount: number;

    /**
     * 搜索来源
     */
    channelId: string;
}

// 1. alg（Algorithm）
// 代表该推荐词的推荐算法来源。
// 不同的 alg 可能对应不同的推荐策略，例如：
// popular: 基于全网热度的推荐
// user_profile: 基于用户个人搜索历史的推荐
// collaborative_filtering: 基于协同过滤的推荐
// content_based: 基于内容相似度的推荐
// 这个字段可以用于日志分析，或者调整推荐策略。
// 2. feature
// 代表该推荐词的特征信息，通常是额外的元数据，帮助优化搜索推荐体验。
// 可能的用途：
// 推荐来源（例如："来自最近搜索"、"热门推荐"）
// 个性化标签（例如："你的兴趣"、"猜你喜欢"）
// 其他模型特征（例如，表示该关键词的权重、类别等
export interface SuggestItem {
    keyword: string
    type: number
    alg: string
    lastKeyword: string
    feature: string
}

// SearchDefault 默认搜索
export interface SearchDefault {
    showKeyword: string;
    realKeyword: string;
    searchType: number;
    action: number;
    alg: string;
    gap: number;
    source?: any;
}

export interface HotSearchItem {
    searchWord: string
    score: number
    content: string
    source: number
    iconType: number
    iconUrl?: string
    url: string
    alg: string
}



