import {defineStore} from "pinia";
import {UmsMember} from "@/models/member.ts";
import {useMemberInfo} from "@/api/member/member_api.ts";

export const useProfileStore = defineStore(
    "userProfile", {

        state: () => ({
            token: '',
            // 你也可以加用户信息等字段
            memberInfo: {} as UmsMember,
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
                this.memberInfo = await useMemberInfo();
            },
        },
        // 持久化配置
        persist: {
            key: 'userProfile',
            storage: localStorage,
            paths: ['token', 'memberInfo'],
        }
    }
)