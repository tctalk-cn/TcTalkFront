import http from "@/utils/http.ts";
import {UmsMember} from "@/models/member.ts";
import {MemberStatisticsInfo} from "@/models/member_statistics_info.ts";

export async function useMemberInfo() {
    return await http.get<{
        code: number,
        message: string,
        data: UmsMember,
    }>("/member_api/member/info");
}

export async function useMemberStatisticsInfo() {
    return await http.get<{
        code: number,
        message: string,
        data: MemberStatisticsInfo,
    }>("/member_api/member/getMemberStatistics");
}