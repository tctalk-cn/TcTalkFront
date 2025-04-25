import http from "@/utils/http.ts";
import {UmsMember} from "@/models/member.ts";

export async function useMemberInfo() {
    return await http.get<{
        code: number,
        message: string,
        data: UmsMember,
    }>("/member_api/member/info");
}