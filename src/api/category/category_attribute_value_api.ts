import http from "@/utils/http.ts";
import {CtCategoryAttributeValue,CtCategoryAttributeWithValue} from "@/models/category.ts";


/**
 * 根据频道ID获取热点属性值
 */
export async function useGetHotAttributesByChannel(channelId: string) {
    return await http.get<{
        data: CtCategoryAttributeValue[]
    }>("/category_api/categoryAttributeValue/getHotAttributesByChannel/" + channelId);
}


/**
 * 根据频道ID获取分类对应的以及属性值
 */
export async function useGetListByChannel(channelId: string, categoryId: string, pageSize: number) {
    return await http.get<{
        data: CtCategoryAttributeValue[]
    }>("/category_api/categoryAttributeValue/getListByChannel/" + channelId + "/" + categoryId + "/" + pageSize);
}


/**
 * 根据频道ID获取区间属性值
 */
export async function useGetRangeAttributesByChannel(channelId: string) {
    return await http.get<{
        data: CtCategoryAttributeValue[]
    }>("/category_api/categoryAttributeValue/getRangeAttributesByChannel/" + channelId);
}

/**
 * 根据频道ID获取性别属性值
 */
export async function useGetGenderAttributesByChannel(channelId: string) {
    return await http.get<{
        data: CtCategoryAttributeValue[]
    }>("/category_api/categoryAttributeValue/getGenderAttributesByChannel/" + channelId);
}

/**
 * 根据频道获取全部属性及对应的值
 */
export async function useGetCategoryAttributesWithValueByChannelId(channelId: string) {
    return await http.get<{
        data: CtCategoryAttributeWithValue[]
    }>("/category_api/categoryAttribute/getCategoryAttributesWithValueByChannelId/" + channelId);
}