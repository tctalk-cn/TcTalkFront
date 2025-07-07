import http from "@/utils/http.ts";
import {Tag} from "@/models/tag.ts";
import {CommonPage} from "@/models/common_page.ts";
import {CategoryTagRelation} from "@/models/tag.ts";

/**
 * 获取便签集合
 */
export async function useListTags(pageNum: number, pageSize: number) {
    return await http.get<{
        data: CommonPage<Tag>
    }>("/category_api/tag/list", {pageNum: pageNum, pageSize: pageSize});
}


/**
 * 根据分类ID查询标签
 */
export async function useListByCategory(categoryId: string) {
    return await http.get<{
        data: CategoryTagRelation[]
    }>("/category_api/tag/listByCategory/" + categoryId);
}