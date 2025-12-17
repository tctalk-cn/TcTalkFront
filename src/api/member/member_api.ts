import http from "@/utils/http.ts";
import {UmsMember} from "@/models/member.ts";
import {MemberStatisticsInfo,MemberTransactionStatistics} from "@/models/member_statistics_info.ts";
import {MemberTag} from "@/models/member_tag.ts";

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

export async function useQueryTransactionStatistics() {
    return await http.get<{
        code: string,
        message: string,
        data: MemberTransactionStatistics,
    }>("/member_api/member/statistics/queryTransactionStatistics");
}

export async function useUploadAvatar(formData: FormData) {
    return await http.upload<{
        data: string,
    }>("/member_api/member/uploadAvatar", formData);
}

export async function useResetUsername(newUsername: string) {
    return await http.post<{
        code: string,
        message: string,
        data: boolean,
    }>("/member_api/member/resetUsername", {username: newUsername});
}

export async function useResetNickname(newNickname: string) {
    return await http.post<{
        code: string,
        message: string,
        data: boolean,
    }>("/member_api/member/resetNickname", {nickName: newNickname});
}

export async function useResetBirthday(birthday: string) {
    return await http.post<{
        code: string,
        message: string,
        data: boolean,
    }>("/member_api/member/resetBirthday", {birthday: birthday});
}

export async function useResetSignature(newSignature: string) {
    return await http.post<{
        code: string,
        message: string,
        data: boolean,
    }>("/member_api/member/resetPersonalizedSignature", {signature: newSignature});
}

export async function useMemberTags() {
    return await http.get<{
        code: number,
        message: string,
        data: MemberTag[],
    }>("/member_api/member/tags/getTags");
}

export async function useResetPwd(username: string, oldPwd: string, newPwd: string, confirmPwd: string, captchaCode: string) {
    return await http.post<{
        code: number,
        message: string,
        data: boolean,
    }>("/member_api/member/resetPwd", {
        username: username,
        oldPwd: oldPwd,
        newPwd: newPwd,
        confirmPwd: confirmPwd,
        captchaCode: captchaCode
    });
}

export async function useResetGender(gender: number) {
    return await http.post<{
        code: string,
        message: string,
        data: boolean,
    }>("/member_api/member/resetGender", {
        gender: gender,
    });
}

export async function useMemberById(memberId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: UmsMember,
    }>("/member_api/member/queryMemberById", {memberId: memberId});
}

export async function useMemberStatisticsInfoById(memberId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MemberStatisticsInfo,
    }>("/member_api/member/statistics/getMemberStatisticsById", {memberId: memberId});
}

export async function useGenerateQrCode() {
    return await http.post<{
        code: string,
        message: string,
        data: string,
    }>("/member_api/member/generateQrCode");
}

/**---------------------------------------会员关注信息---------------------------------------------------------**/

/**
 * 判断登陆用户是否关注了此会员
 * @param followedMemberId 被关注的会员ID
 */
export async function useIsMemberFollowed(followedMemberId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: Boolean,
    }>("/member_api/member/followed/isFollowed", {followedMemberId: followedMemberId});
}

/**
 * 添加关注的会员
 * @param followedMemberId 被关注的会员ID
 */
export async function useAddMemberFollowed(followedMemberId: string) {
    return await http.post<{
        code: number,
        message: string,
        data: number,
    }>("/member_api/member/followed/add", {followedMemberId: followedMemberId});
}