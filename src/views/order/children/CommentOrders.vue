<template>

  <!-- 顶部评价统计 -->
  <CommentSummary :memberTransactionStatistics="memberTransactionStatistics" :avatar-url="memberInfo?.avatarUrl"/>

  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多可评价订单了"
        @load="loadCommentOrderData('load')"
    >
      <OrderItem
          v-for="order in orderList"
          :key="order.id"
          :order="order"
          :show-pay="false"
          :show-detail="true"
          :show-comment="true"
          @comment="handleComment(order)"
          @detail="handleDetail(order)"
      />

      <van-empty
          v-if="!loading && orderList.length === 0"
          description="暂无可评价订单"
      />
    </van-list>
  </van-pull-refresh>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {showToast} from "vant";
import OrderItem from "@/views/order/components/OrderItem.vue";
import {useOrderStore} from "@/stores/order_store";
import {OrderDTO} from "@/models/order";
import CommentSummary from "@/views/order/components/CommentSummary.vue";
import {storeToRefs} from "pinia";
import {useProfileStore} from "@/stores/member_store.ts";
import {MemberTransactionStatistics} from "@/models/member_statistics_info.ts";

const {memberInfo} = storeToRefs(useProfileStore());

const router = useRouter();
const {loadCommentOrders} = useOrderStore();
const {queryTransactionStatistics} = useProfileStore();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);

const searchParam = {
  beginOrderId: "0",
  pageSize: 6,
};

const orderList = ref<OrderDTO[]>([]);
// 会员交易统计信息
const memberTransactionStatistics = ref<MemberTransactionStatistics>({} as MemberTransactionStatistics);

/**
 * 加载可评论订单
 */
const loadCommentOrderData = async (type: "refresh" | "load" = "refresh") => {
  if (type === "refresh") {
    searchParam.beginOrderId = "0";
    finished.value = false;
  }

  const res = await loadCommentOrders(
      searchParam.beginOrderId,
      searchParam.pageSize
  );

  if (!res || res.code !== "200") {
    showToast(res?.message || "获取评论订单失败");
    loading.value = false;
    refreshing.value = false;
    return;
  }

  const data = res.data || [];

  if (type === "refresh") {
    orderList.value = data;
  } else {
    orderList.value = orderList.value.concat(data);
  }

  if (data.length === 0 || data.length < searchParam.pageSize) {
    finished.value = true;
  } else {
    searchParam.beginOrderId = data[data.length - 1].id;
  }

  loading.value = false;
  refreshing.value = false;
};

const loadSummary = async () => {
  const res = await queryTransactionStatistics();
  if (!res || res.code !== "200") {
    showToast(res?.message || "获取会员交易统计数据失败");
    return;
  }
  memberTransactionStatistics.value = res.data;
};

/**
 * 下拉刷新
 */
const onRefresh = () => {
  refreshing.value = true;
  loadCommentOrderData("refresh");
};

onMounted(() => {
  loadSummary();
})

/**
 * 处理评价 / 追评
 */
const handleComment = (order: OrderDTO) => {
  router.push({
    path: "/orderComment/write",
    query: {
      orderId: order.id,
      ownerMemberId: order.memberId,
    },
  });
};

/**
 * 查看详情
 */
const handleDetail = (order: OrderDTO) => {
  router.push({
    path: "/orderCenter/orderDetail",
    query: {
      orderId: order.id,
      orderNo: order.orderNo,
    },
  });
};
</script>
