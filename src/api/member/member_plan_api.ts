import http from "@/utils/http.ts";
import {MemberPlanCategory} from "@/models/member_plan_category.ts";


export async function useListEnabledPlanCategory() {
    return await http.get<{
        code: number,
        message: string,
        data: MemberPlanCategory[],
    }>("/member_api/member/planCategory/listEnabledPlanCategory");
}
