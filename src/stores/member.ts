import {defineStore} from "pinia";
import {UmsMember} from "@/models/member.ts";
import {useMemberInfo} from "@/api/member/member_api.ts";
import {MemberStatisticsInfo} from "@/models/member_statistics_info.ts";
import {useMemberStatisticsInfo} from "../api/member/member_api.ts";

export const useProfileStore = defineStore(
    "userProfile", {

        state: () => ({
            token: '',
            // 你也可以加用户信息等字段
            memberInfo: {} as UmsMember,
            memberStatisticsInfo: {} as MemberStatisticsInfo,
        }),

        getters: {
            isLogin: (state) => !!state.token,
        },
        actions: {
            setToken(token: string) {
                this.token = token;
            },
            clearToken() {
                this.token = '';
            },
            // loadMemberInfo 加载用户信息
            async loadMemberInfo() {
                const data = await useMemberInfo();
                this.memberInfo = data.data;
            },
            // 获取会员统计信息
            async getMemberStatistics() {
                const {data} = await useMemberStatisticsInfo();
                this.memberStatisticsInfo = data;
            },
        },
        // 持久化配置
        persist: {
            key: 'userProfile',
            storage: localStorage,
            paths: ['token', 'memberInfo', 'memberStatisticsInfo'],
        }
    }
)