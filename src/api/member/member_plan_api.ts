import http from "@/utils/http.ts";
import {MemberPlanCategory} from "@/models/member_plan_category.ts";
import {MemberPlanRespModel} from "@/models/member_plan.ts";


export async function useListEnabledPlanCategory() {
    return await http.get<{
        code: number,
        message: string,
        data: MemberPlanCategory[],
    }>("/member_api/member/planCategory/listEnabledPlanCategory");
}


export async function useListEnabledPlans(categoryCode:string) {
    return await http.get<{
        code: number,
        message: string,
        data: MemberPlanRespModel[],
    }>("/member_api/member/paidPlan/listEnabledPlans/"+categoryCode);
}