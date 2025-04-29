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
                                path: 'info',// 个人信息详情页
                                name: Pages.memberInfo,
                                component: () => import("@/views/member/children/Info.vue"),
                            },
                        ]
                    }
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
