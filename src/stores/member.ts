import {defineStore} from "pinia";

export const useProfileStore = defineStore(
    "profile", {

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
            enabled: true,
            strategies: [
                {
                    key: 'profile',
                    storage: localStorage,
                    paths: ['token'], // 只存 token
                }
            ]
        }
    })