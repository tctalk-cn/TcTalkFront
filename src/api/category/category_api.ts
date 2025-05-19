import http from "@/utils/http.ts";
import {Category, CategoryWithChildrenItem} from "@/models/category.ts";
import {NovelCustomizedCategory, CustomizedCategoryCreator} from "@/models/category.ts";
import {CtCategoryAttributeValue} from "@/models/category.ts";
import {CtCategoryAttribute} from "@/models/category.ts";
import {CtCategoryAttributeWithValue} from "@/models/category.ts";


/**
 * 根据频道ID，父品类ID，获取品类明细
 */
export async function useGetCategoryByChannel(channelId: string, parentCategoryId: string) {
    return await http.get<{
        data: Category[]
    }>("/category_api/category/getCategoryByChannel/" + channelId + "/" + parentCategoryId);
}

/**
 * 根据频道ID获取全部子分类
 */
export async function useGetAllChildrenCategoryByChannel(channelId: string) {
    return await http.get<{
        data: Category[]
    }>("/category_api/category/getAllChildrenCategoryByChannel/" + channelId);
}

/**
 * 根据频道ID获取全部子分类
 */
export async function useGetChildrenCategoryByChannel(channelId: string, parentCategoryId: string, pageSize: number) {
    return await http.get<{
        data: Category[]
    }>("/category_api/category/getChildrenCategoryByChannel/" + channelId + "/" + parentCategoryId, {pageSize: pageSize});
}

/**
 * 获取频道被推荐的分类
 */
export async function useGetRecommendByChannel(channelId: string) {
    return await http.get<{
        data: Category[]
    }>("/category_api/category/getRecommendByChannel/" + channelId );
}

/**
 * 根据频道ID获取全部子分类及Tag
 */
export async function useGetAllChildrenCategoryWithTagByChannel(channelId: string, parentCategoryId: string) {
    return await http.get<{
        data: CategoryWithChildrenItem[]
    }>("/category_api/category/getAllChildrenCategoryWithTagByChannel/" + channelId + "/" + parentCategoryId);
}

/**
 * 创建个性化分类
 */
export async function useCreateCustomizedCategory(customizedCategoryCreator: CustomizedCategoryCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: number,
    }>("/category_api/customized/category/create", customizedCategoryCreator);
}

/**
 * 加载个性化分类
 */
export async function useLoadCustomizedCategory(channelId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: NovelCustomizedCategory,
    }>("/category_api/customized/category/loadSimpleBy/" + channelId);
}

/**
 * 根据分类获取全部属性
 */
export async function useGetCategoryAttributesByCategoryId(categoryId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: CtCategoryAttribute[],
    }>("/category_api/categoryAttribute/getCategoryAttributesByCategoryId/" + categoryId);
}

/**
 * 根据属性ID获取属性值
 */
export async function useGetListByAttribute(attributeId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: CtCategoryAttributeValue[],
    }>("/category_api/categoryAttributeValue/getListByAttribute/" + attributeId);
}


/**
 * 根据属性ID获取属性及值
 */
export async function useGetCategoryAttributesWithValueByCategoryId(categoryId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: CtCategoryAttributeWithValue[],
    }>("/category_api/categoryAttribute/getCategoryAttributesWithValueByCategoryId/" + categoryId);
}


