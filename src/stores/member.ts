import {defineStore} from "pinia";

export const useProfileStore = defineStore(
    "userProfile", {

        state: () => ({
            token: '',
            // 你也可以加用户信息等字段
            // userInfo: null,
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
            }
        },
        // 持久化配置
        persist: {
            key: 'userProfile',
            storage: localStorage,
            paths: ['token'],
        }
    }
)