<template>
  <div class="profile-page">
    <HeaderTop :head-title="profiletitle">
      <!-- 其他插槽内容... -->
      <template #actions>
        <van-icon class="action-button" name="tv-o"/>
        <van-icon class="action-button" name="setting-o"/>
        <van-icon class="action-button" name="scan"/>
        <van-icon class="action-button" name="bulb-o"/>
      </template>
    </HeaderTop>
    <section>
      <!-- 用户信息 -->
      <section class="profile-number">
        <router-link :to="memberInfo?.id?'/member/info':'/login'" class="profile-link">
          <img :src="memberInfo?.avatarUrl" class="privateImage" alt=""/>
          <div class="user-info">
            <p>{{ memberInfo?.username }}</p>
            <p>
              <span class="user-icon">
                <IconPark :icon="Phone" theme="filled" class="mr-2" :size="12"/>
              </span>
              <span class="icon-mobile-number">{{ memberInfo?.phone }}</span>
            </p>
          </div>
          <span class="arrow">
              <IconPark :icon="Right" theme="filled" fill="#fff" class="mr-1" :size="20"/>
          </span>
        </router-link>
      </section>
      <!-- 统计数据 -->
      <section class="info-data">
        <ul class="clear">
          <li v-for="(item, index) in statisticsItems" :key="index" class="info-data-link">
            <router-link :to="item.to">
              <span class="info-data-top"><b>{{ item.value }}</b>个</span>
              <span class="info-data-bottom">{{ item.label }}</span>
            </router-link>
          </li>
        </ul>
      </section>
      <!-- 常用服务 -->
      <ServiceSection title="常用服务" :items="navItems" :length="navItems.length"
                      @item-click="()=>handleRecentlyUseClick"/>

      <!-- 创作中心 -->
      <ServiceSection title="创作中心" :items="createItems" :length="createItems.length"
                      @item-click="()=>handleCreativeClick"/>

      <!-- 推荐服务 -->
      <ServiceSection title="推荐服务" :items="recommendServiceItems" :length="4"
                      @item-click="()=>handleCreativeClick"/>
      <!-- 订单、积分商城、会员卡、服务中心、下载APP -->
      <ActionList :actions="actionList"/>
    </section>
    <router-view v-slot="{ Component }">
      <transition name="router-slid" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useProfileStore} from "@/stores/member.ts";
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {storeToRefs} from "pinia";
import {Application, DownloadFour, Order, Phone, Right, SixPoints, Vip} from "@icon-park/vue-next";
import IconPark from "@/components/common/IconPark.vue";
import {useRouter} from "vue-router";
import ServiceSection from "@/views/member/components/ServiceSection.vue";
import ActionList from "@/views/member/components/ActionList.vue";

const {getMemberStatistics} = useProfileStore();
const {memberInfo, memberStatisticsInfo} = storeToRefs(useProfileStore());
const profiletitle = ref('我的');

// 统计模块
const statisticsItems = computed(() => [
  {label: '动态', value: memberStatisticsInfo.value?.newsCount || 0, to: '/balance'},
  {label: '关注', value: memberStatisticsInfo.value?.attendCount || 0, to: '/benefit'},
  {label: '粉丝', value: memberStatisticsInfo.value?.fansCount || 0, to: '/points'},
]);

const navItems = ref([
  {
    icon: "down",
    text: "离线缓存",
    to: "/",
  },
  {
    icon: "browsing-history-o",
    text: "历史记录",
    to: "/readHistory",
    badge: ""
  },
  {
    icon: "replay",
    text: "稍后在看",
    to: "/",
    badge: ""
  },
  {
    icon: "star-o",
    text: "我的收藏",
    to: "/creative/center/favorites",
  },
]);

const createItems = ref([
  {
    icon: "bulb-o",
    text: "创作中心",
    to: "/creative/center",
    badge: ""
  },
  {
    icon: "todo-list-o",
    text: "稿件管理",
    to: "/user/config",
    badge: ""
  },
  {
    icon: "points",
    text: "限时福利",
    to: "/",
    badge: "1"
  },
  {
    icon: "cash-o",
    text: "有奖活动",
    to: "/",
    badge: ""
  },
]);

const recommendServiceItems = ref([
  {
    icon: "user-circle-o",
    text: "我的课程",
    to: "/live/hot",
    badge: ""
  },
  {
    icon: "chart-trending-o",
    text: "看视频免流量",
    to: "/live/newperson",
    badge: ""
  },

  {
    icon: "orders-o",
    text: "个性装扮",
    to: "/live/vicinity",
    badge: ""
  },
  {
    icon: "pending-payment",
    text: "我的钱包",
    to: "/live/music",
    badge: ""
  },
  {
    icon: "cash-back-record-o",
    text: "游戏中心",
    to: "/",
    badge: ""
  },
  {
    icon: "shop-collect-o",
    text: "会员购中心",
    to: "/msite",
    badge: ""
  },
  {
    icon: "new-arrival-o",
    text: "我的直播",
    to: "/",
    badge: ""
  },
  {
    icon: "hot-sale-o",
    text: "漫画",
    to: "/",
    badge: ""
  },
  {
    icon: "hot-o",
    text: "必火推广",
    to: "/",
    badge: ""
  },
  {
    icon: "comment-o",
    text: "社区中心",
    to: "/",
    badge: ""
  },
  {
    icon: "like-o",
    text: "同辰公益",
    to: "/",
    badge: ""
  },
  {
    icon: "hot-sale-o",
    text: "能量加油站",
    to: "/",
    badge: ""
  },
]);

// const recommendServiceItems = ref([
//   {
//     gridItems: [
//       {
//         icon: "user-circle-o",
//         text: "我的课程",
//         to: "/live/hot",
//         badge: ""
//       },
//       {
//         icon: "chart-trending-o",
//         text: "看视频免流量",
//         to: "/live/newperson",
//         badge: ""
//       },
//
//       {
//         icon: "orders-o",
//         text: "个性装扮",
//         to: "/live/vicinity",
//         badge: ""
//       },
//       {
//         icon: "pending-payment",
//         text: "我的钱包",
//         to: "/live/music",
//         badge: ""
//       },
//     ]
//   },
//   {
//     gridItems: [
//       {
//         icon: "cash-back-record-o",
//         text: "游戏中心",
//         to: "/",
//         badge: ""
//       },
//       {
//         icon: "shop-collect-o",
//         text: "会员购中心",
//         to: "/msite",
//         badge: ""
//       },
//       {
//         icon: "new-arrival-o",
//         text: "我的直播",
//         to: "/",
//         badge: ""
//       },
//       {
//         icon: "hot-sale-o",
//         text: "漫画",
//         to: "/",
//         badge: ""
//       },
//     ]
//   },
//   {
//     gridItems: [
//       {
//         icon: "hot-o",
//         text: "必火推广",
//         to: "/",
//         badge: ""
//       },
//       {
//         icon: "comment-o",
//         text: "社区中心",
//         to: "/",
//         badge: ""
//       },
//       {
//         icon: "like-o",
//         text: "同辰公益",
//         to: "/",
//         badge: ""
//       },
//       {
//         icon: "hot-sale-o",
//         text: "能量加油站",
//         to: "/",
//         badge: ""
//       },
//     ]
//   }
// ]);

// 下面是"我的订单"、"积分商城"、"会员卡"等列表
const actionList = ref([
  {to: '/order', icon: Order, text: '我的订单', isLink: true, isSvg: true},
  {to: '/shop', icon: SixPoints, text: '积分商城', isLink: true, isSvg: true},
  {to: '/vipcard', icon: Vip, text: '会员卡', isLink: true, isSvg: true},
  {to: '/service', icon: Application, text: '服务中心', isLink: true, isSvg: true},
  {to: '/download', icon: DownloadFour, text: '下载同辰APP', isLink: true, isSvg: true},
]);


const router = useRouter();
const handleRecommendServiceClick = (to) => {
  router.push({path: to});
}
const handleCreativeClick = (to) => {
  router.push({path: to});
}


const handleRecentlyUseClick = (to) => {
  router.push({path: to});
}

onMounted(() => {
  getMemberStatistics();
});

</script>
<style lang="scss" scoped>
.profile-page {
  .profile-number {
    padding-top: 1.95rem;

    .profile-link {
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      background: $blue;
      padding: .666667rem .6rem;

      .privateImage {
        display: inline-block;
        @include wh(2.5rem, 2.5rem);
        border-radius: 50%;
        vertical-align: middle;

        .privateImage-svg {
          background: $fc;
          border-radius: 50%;
          @include wh(2.5rem, 2.5rem);
        }
      }

      .user-info {
        margin-left: .48rem;
        -webkit-box-flex: 1;
        flex-grow: 1;

        p {
          font-weight: 700;
          @include sc(.8rem, $fc);

          .user-icon {
            @include wh(0.5rem, 0.75rem);
            display: inline-block;
            vertical-align: middle;
            line-height: 0.75rem;

            .icon-mobile {
              @include wh(100%, 100%);
            }
          }

          .icon-mobile-number {
            display: inline-block;
            margin-left: 0.2rem;
            @include sc(.57333rem, $fc);

          }
        }

      }

      .arrow {
        @include wh(.46667rem, .98rem);
        display: inline-block;

        svg {
          @include wh(100%, 100%);
        }
      }
    }
  }

  .info-data {
    margin-top: .2rem;
    background: $fc;

    ul {
      .info-data-link {
        width: 33%;
        display: inline-block;
        border-right: 1px solid #f1f1f1;

        span {
          display: block;
          width: 100%;
          text-align: center;
        }

        .info-data-top {
          @include sc(.55rem, #333);
          padding: .853333rem 0 .453333rem;

          b {
            display: inline-block;
            @include sc(1.2rem, #f90);
            font-weight: 700;
            line-height: 1rem;
          }
        }

        .info-data-bottom {
          @include sc(.57333rem, #666);
          font-weight: 400;
          padding-bottom: .453333rem;

        }
      }

      .info-data-link:nth-of-type(2) {
        .info-data-top {
          b {
            color: #ff5f3e;
          }
        }

      }

      .info-data-link:nth-of-type(3) {
        border: 0;

        .info-data-top {
          b {
            color: #6ac20b;
          }
        }
      }
    }
  }

  .spike {
    margin-top: 0.2rem;
    background: $fc;

    &-header {
      padding-left: 0.2rem;
      display: inline-block;

      &-title {
        display: inline-block;
        height: 1.0rem;
        line-height: 1.0rem;
        font-size: 12px;
        font-weight: bold;
      }

      &-countdown {
        float: left;

        &-lt {
          margin-top: 1px;
          margin-left: 10px;
          font-size: 12px;
          border: 1px solid #FB0017;
          border-right: none;
          border-bottom-left-radius: 22px;
          border-top-left-radius: 22px;
          height: 18px;
          line-height: 18px;
          padding: 0 3px;
          color: #ffffff;
          background: #FB0017;
          float: left;
        }

        &-rt {
          margin-top: 1px;
          font-size: 12px;
          float: left;
          border: 1px solid #FB0017;
          border-bottom-right-radius: 22px;
          border-top-right-radius: 22px;
          height: 18px;
          line-height: 18px;
          padding: 0 3px;
        }
      }

      &-more {
        float: right;

        &-text {
          height: 20px;
          line-height: 15px;
          font-size: 10px;
        }

        .van-icon {
          margin-left: 2px;
          height: 10px;
          line-height: 10px;
          float: right;
        }
      }
    }

    &-content {
      height: auto;

      .van-card-full {
        background-color: #f1f1f1;
      }
    }
  }

  .profile-1reTe {
    margin-top: .2rem;
    background: $fc;

    .myorder {
      padding-left: 1.6rem;
      display: flex;
      align-items: center;

      aside {
        @include wh(.7rem, .7rem);
        margin-left: -.866667rem;
        margin-right: .266667rem;
        display: flex;
        align-items: center;

        svg {
          @include wh(100%, 100%);
        }
      }

      .myorder-div {
        width: 100%;
        border-bottom: 1px solid #f1f1f1;
        padding: .433333rem .266667rem .433333rem 0;
        @include sc(.7rem, #333);
        display: flex;
        justify-content: space-between;

        span {
          display: block;
        }

        .myorder-divsvg {
          @include wh(.46667rem, .466667rem);

          svg {
            @include wh(100%, 100%);
          }
        }
      }
    }

    .myorder:nth-of-type(3) .myorder-div {
      border: 0;
    }
  }

  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }

  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }

  .head_menu_slot {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 0.4rem;
    margin-top: 0.4rem;
    white-space: nowrap; /* 防止换行 */
  }

  .menu-item {
    margin-left: 1rem;
    color: #fff;
  }

  .action-button {
    margin-left: .1rem; /* 添加左侧边距 */
    margin-right: .1rem; /* 添加右侧边距 */
  }

  .switch {
    position: absolute;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    border-radius: 50%;

    .van-icon-play {
      color: #fff;
      transform: rotate(90deg);
      vertical-align: 17%;
    }
  }
}
</style>
