import {createRouter, createWebHashHistory} from "vue-router";
import {Pages} from "@/router/pages"
import {useProfileStore} from "@/stores/member_store.ts";

const router = createRouter({
        history: createWebHashHistory(import.meta.env.BASE_URL),
        routes: [
            // 登录注册页
            {
                path: '/login',
                name: Pages.login,
                component: () => import("@/views/login/Login.vue"),
            },
            // 作品明细
            {
                path: '/sound/soundDetail',
                name: Pages.soundDetail,
                component: () => import("@/views/sound/SoundDetail.vue"),
                children: [
                    {
                        path: 'mediaComments',
                        name: Pages.mediaComments,
                        component: () => import("@/views/sound/comment/CommentList.vue"),
                    }
                ],
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
                    // 创作中心
                    {
                        path: '/creative/center',
                        name: Pages.creativeCenter,
                        component: () => import("@/views/creation/Center.vue"),
                        meta: {
                            keepAlive: true,
                            showTabBar: false
                        },
                        redirect: {name: Pages.myAlbum},
                        children: [
                            {
                                path: 'myAlbum',
                                name: Pages.myAlbum,
                                component: () => import("@/views/creation/album/Index.vue"),
                            },
                        ]
                    },
                    // 创作中心-专辑明细
                    {
                        path: '/creative/albumCreativeDetail',
                        name: Pages.albumCreativeDetail,
                        component: () => import("@/views/creation/album/detail/AlbumDetail.vue"),
                        redirect: {name: Pages.albumCreativeVideoList},
                        children: [
                            {
                                path: 'albumCreativeVideoList',
                                name: Pages.albumCreativeVideoList,
                                component: () => import("@/views/creation/album/detail/children/MediaList.vue"),
                                meta: {menu: Pages.albumCreativeVideoList},
                            },
                            {
                                path: 'albumCreativeCommentList',
                                name: Pages.albumCreativeCommentList,
                                component: () => import("@/views/creation/album/detail/children/CommentList.vue"),
                                meta: {menu: Pages.albumCreativeCommentList},
                            },
                            {
                                path: 'albumCreativeShowList',
                                name: Pages.albumCreativeShowList,
                                component: () => import("@/views/creation/album/detail/children/ShowList.vue"),
                                meta: {menu: Pages.albumCreativeShowList},
                            },
                        ],
                    },
                    // 创作中心-专辑创作
                    {
                        path: '/creative/albumCreate',
                        name: Pages.albumCreate,
                        component: () => import("@/views/creation/album/Create.vue"),
                        children: [
                            {
                                path: 'albumSetTitle',
                                name: Pages.albumSetTitle,
                                component: () => import("@/views/creation/album/children/SetTitle.vue"),
                            },
                            {
                                path: 'albumSetRemark',
                                name: Pages.albumSetRemark,
                                component: () => import("@/views/creation/album/children/SetRemark.vue"),
                            },
                            {
                                path: 'albumSetAttributes',
                                name: Pages.albumSetAttributes,
                                component: () => import("@/views/creation/album/children/SetAttributes.vue"),
                            },
                        ],
                    },
                    // 创作中心-专辑数据分析
                    {
                        path: '/creative/albumStatistic',
                        name: Pages.albumStatistic,
                        component: () => import("@/views/creation/album/Statistic.vue"),
                        redirect: {name: Pages.basicData},
                        children: [
                            {
                                path: 'basicData',
                                name: Pages.basicData,
                                component: () => import("@/views/creation/album/statistic/BasicData.vue"),
                            },
                            {
                                path: 'audienceAnalysis',
                                name: Pages.audienceAnalysis,
                                component: () => import("@/views/creation/album/statistic/AudienceData.vue"),
                            }
                        ],
                    },
                    // 创作中心-视频上传
                    {
                        path: '/creative/videoUpload',
                        name: Pages.videoUpload,
                        component: () => import("@/views/creation/video/upload/Upload.vue"),
                        children: [
                            {
                                path: 'videoDescription',
                                name: Pages.videoDescription,
                                component: () => import("@/views/creation/video/upload/children/VideoDescription.vue"),
                            },
                            {
                                path: 'setTitle',
                                name: Pages.videoSetTitle,
                                component: () => import("@/views/creation/video/upload/children/SetTitle.vue"),
                            },
                        ],
                    },
                    // 作品中心-专辑明细
                    {
                        path: '/album/albumDetail',
                        name: Pages.albumDetail,
                        component: () => import("@/views/album/AlbumDetail.vue"),
                        redirect: {name: Pages.albumVideoList},
                        children: [
                            {
                                path: 'albumVideoList',
                                name: Pages.albumVideoList,
                                component: () => import("@/views/album/detail/MediaList.vue"),
                                meta: {menu: Pages.albumVideoList},
                            },
                            {
                                path: 'albumCommentList',
                                name: Pages.albumCommentList,
                                component: () => import("@/views/album/detail/CommentList.vue"),
                                meta: {menu: Pages.albumCommentList},
                            },
                            {
                                path: 'albumSimilarRecommendListForRecall',
                                name: Pages.albumSimilarRecommendListForRecall,
                                component: () => import("@/views/album/detail/SimilarRecommendList.vue"),
                                meta: {menu: Pages.albumSimilarRecommendListForRecall},
                            },
                            {
                                path: 'albumShowList',
                                name: Pages.albumShowList,
                                component: () => import("@/views/album/detail/ShowList.vue"),
                                meta: {menu: Pages.albumShowList},
                            },
                        ],
                    },
                ]

            },
            //会员付费产品方案
            {
                path: '/member/planCategory/:id',
                name: Pages.planCategory,
                component: () => import("@/views/member/plans/PlanCategory.vue"),
                redirect: {name: Pages.vipPlatinumDetail},
                children: [
                    {
                        path: 'vipPlatinumDetail',
                        name: Pages.vipPlatinumDetail,
                        component: () => import("@/views/member/plans/VipPlatinumDetail.vue"),
                        meta: {menu: Pages.planCategory},
                    },
                    {
                        path: 'vipDetail',
                        name: Pages.vipDetail,
                        component: () => import("@/views/member/plans/VipDetail.vue"),
                        meta: {menu: Pages.planCategory},
                    },
                    {
                        path: 'sVipDetail',
                        name: Pages.sVipDetail,
                        component: () => import("@/views/member/plans/SVipDetail.vue"),
                        meta: {menu: Pages.planCategory},
                    },
                    {
                        path: 'courseDetail',
                        name: Pages.courseDetail,
                        component: () => import("@/views/member/plans/CourseDetail.vue"),
                        meta: {menu: Pages.planCategory},
                    },
                    {
                        path: 'familyDetail',
                        name: Pages.familyDetail,
                        component: () => import("@/views/member/plans/FamilyDetail.vue"),
                        meta: {menu: Pages.planCategory},
                    },
                    {
                        path: 'kidsDetail',
                        name: Pages.kidsDetail,
                        component: () => import("@/views/member/plans/KidsDetail.vue"),
                        meta: {menu: Pages.planCategory},
                    },

                ],
            },
            // VIP订单中心
            {
                path: '/vipOrder/confirm',
                name: Pages.vipOrderConfirm,
                component: () => import("@/views/order/VipOrderConfirm.vue"),
                children: [],
            },
            // 会员协议
            {
                path: '/vipOrder/protocol',
                name: Pages.vipProtocol,
                component: () => import("@/views/order/components/MemberProtocol.vue"),
                children: [],
            },
            // 支付结果查看页
            {
                path: '/pay/paymentResult',
                name: Pages.paymentResult,
                component: () => import("@/views/order/OrderPayResult.vue"),
                children: [],
            },

            // 订单列表
            {
                path: '/orderCenter/orders',
                name: Pages.orderCenter,
                component: () => import("@/views/member/orders/Orders.vue"),
                redirect: {name: Pages.allOrders},
                children: [
                    {
                        path: 'allOrders',
                        name: Pages.allOrders,
                        component: () => import("@/views/member/orders/children/AllOrders.vue"),
                        meta: {menu: Pages.orderCenter},
                    },
                    {
                        path: 'pendingPaymentOrders',
                        name: Pages.pendingPaymentOrders,
                        component: () => import("@/views/member/orders/children/PendingPaymentOrders.vue"),
                        meta: {menu: Pages.orderCenter},
                    },
                ],
            },
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
