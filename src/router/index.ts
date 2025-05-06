import {createRouter, createWebHashHistory} from "vue-router";
import {Pages} from "@/router/pages"
import {useProfileStore} from "@/stores/member.ts";

const router = createRouter({
        history: createWebHashHistory(import.meta.env.BASE_URL),
        routes: [
            // 登录注册页
            {
                path: '/login',
                name: Pages.login,
                component: () => import("@/views/login/Login.vue"),
            },
            {
                path: '/',
                name: Pages.index,
                component: () => import("@/views/Root.vue"),
                redirect: {name: Pages.home},
                children: [
                    // 主站首页
                    {
                        path: '/home',
                        name: Pages.home,
                        component: () => import("@/views/home/Home.vue"),
                        redirect: {name: Pages.recommend},
                        // meta: {
                        //     keepAlive: false,
                        //     showTabBar: false // 不显示 TabBar
                        // },
                        children: [
                            {
                                path: "recommend",
                                name: Pages.recommend,
                                component: () => import('@/views/recommend/Recommend.vue'),
                            },
                        ]
                    },
                    // 会员首页
                    {
                        path: '/member',
                        name: Pages.member,
                        component: () => import("@/views/member/Profile.vue"),
                        children: [
                            {
                                // 个人信息详情页
                                path: 'info',
                                name: Pages.memberInfo,
                                component: () => import("@/views/member/children/Info.vue"),
                            },
                            {
                                // 设置用户名称
                                path: 'setUsername',
                                name: Pages.profileSetUsername,
                                component: () => import("@/views/member/children/SetUsername.vue"),
                            },
                            {
                                // 设置昵称
                                path: 'setNickname',
                                name: Pages.profileSetNickname,
                                component: () => import("@/views/member/children/SetNickname.vue"),
                            },
                            {
                                // 设置电话
                                path: 'setPhone',
                                name: Pages.profileSetPhone,
                                component: () => import("@/views/member/children/SetPhone.vue"),
                            },
                            {
                                // 设置电话
                                path: 'setPassword',
                                name: Pages.profileSetPassword,
                                component: () => import("@/views/member/children/SetPassword.vue"),
                            },

                        ]
                    },

                ]
            }
        ]
    }
)
// 路由守卫
router.beforeEach((to, from, next) => {
    const profileStore = useProfileStore();
    const token = profileStore.token;

    if (to.name === Pages.login) {
        return next();
    }
    if (!token) {
        return next({name: Pages.login});
    }
    next();
});
export default router;
