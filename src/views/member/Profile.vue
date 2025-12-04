<template>
  <div class="profile-page">
    <HeaderTop :head-title="profileTitle">
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
        <!--会员产品方案-->
        <PlanCategorySection/>
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
                      @item-click="handleRecentlyUseClick"/>

      <!-- 创作中心 -->
      <ServiceSection title="创作中心" :items="createItems" :length="createItems.length"
                      @item-click="handleCreativeClick"/>

      <!-- 推荐服务 -->
      <ServiceSection title="推荐服务" :items="recommendServiceItems" :length="4"
                      @item-click="handleCreativeClick"/>
      <!-- 订单、积分商城、会员卡、服务中心、下载APP -->
      <ActionList :actions="actionList"/>
    </section>
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import {computed, markRaw, onMounted, ref} from "vue";
import {useProfileStore} from "@/stores/member_store.ts";
import HeaderTop from "@/components/layout/header/HeaderTop.vue";
import {storeToRefs} from "pinia";
import {Application, DownloadFour, Order, Phone, Right, SixPoints, Vip} from "@icon-park/vue-next";
import IconPark from "@/components/common/IconPark.vue";
import {useRouter} from "vue-router";
import ServiceSection from "@/views/member/components/ServiceSection.vue";
import ActionList from "@/views/member/components/ActionList.vue";
import PlanCategorySection from "@/views/member/components/PlanCategorySection.vue";

const {getMemberStatistics} = useProfileStore();
const {memberInfo, memberStatisticsInfo} = storeToRefs(useProfileStore());
const profileTitle = ref('我的');

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
// 下面是"我的订单"、"积分商城"、"会员卡"等列表
const actionList = ref([
  {to: '/order', icon: markRaw(Order), text: '我的订单', isLink: true, isSvg: true},
  {to: '/shop', icon: markRaw(SixPoints), text: '积分商城', isLink: true, isSvg: true},
  {to: '/vipcard', icon: markRaw(Vip), text: '会员卡', isLink: true, isSvg: true},
  {to: '/service', icon: markRaw(Application), text: '服务中心', isLink: true, isSvg: true},
  {to: '/download', icon: markRaw(DownloadFour), text: '下载同辰APP', isLink: true, isSvg: true},
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

onMounted(async () => {
  getMemberStatistics();
});

</script>
<style lang="scss" scoped>
.profile-page {
  width: 100%;
  overflow-x: hidden; /* 隐藏水平滚动条 */

  .profile-number {
    background: $blue;  // 整个 section 蓝色
    padding: 0.6rem 0.6rem 0.2rem; // 底部留给卡片
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
          @include sc($font-size, $fc);

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
}
</style>
