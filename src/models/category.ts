/**
 * 顶级分类信息
 */
export interface TopCategory {
    id: number;
    name: string;
    updateTime: number;
    urlPath: string;
}

/**
 * 分类信息
 */
export interface Category {
    id: string;
    name: string;
    urlPath: string;
    channelId?: string,
    parentCategoryId?: string;
    updateTime?: number;
}


/**
 * 分类信息
 */
export interface CustomizedCategory {
    id: string;
    name: string;
    urlPath: string;
    channelId?: string,
    parentCategoryId?: string;
    updateTime?: number;
}


export interface CategoryTagRelation {
    id: string;
    categoryId: string;
    tagId: string;
    tagName: string;
}


/**
 * 分类及Tag信息
 */
export interface CategoryWithChildrenItem {
    id: string;
    name: string;
    urlPath: string;
    channelId?: string,
    parentCategoryId?: string;
    updateTime?: number;
    children: CategoryWithChildrenItem[];
}

/**
 * 定制化分类信息
 */
export interface NovelCustomizedCategory {
    id: string;
    channelId: string;
    categoryId: string;
    categoryName: string;
    memberId?: string;
}

/**
 * 定制化分类信息Creator
 */
export interface CustomizedCategoryCreator {
    id: string;
    channelId: string;
    categoryId: string;
}


export interface CtCategoryAttributeValue {
    id: string;

    attributeId: string;

    val: string;

    valueLabel: string;

    valueOrder: number;

    isDefault: boolean;

    isHot: boolean;

    status: boolean;
}


export interface CtCategoryAttribute {
    id: string;

    categoryId: string;

    parentAttributeId: string;

    attributeName: string;

    attributeGroup: number;

    attributeType: string;

    selectionType: number;

    maxSelection: number;

    isFilterable: boolean;
}

export interface CtCategoryAttributeWithValue {
    categoryAttribute: CtCategoryAttribute;
    attributeValues: CtCategoryAttributeValue[];
}