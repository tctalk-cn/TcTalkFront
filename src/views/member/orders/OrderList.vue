<template>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="loadOrderData('load')"
    >
      <div v-for="(item) in orderList"
           :key="item.id"
           :title="item.name">
        <AlbumItem
            :id="item.id"
            :name="item.name"
            :cover-url="item.coverUrl"
            :album-creator-member-id="item.creatorMemberId"
            :creator-nickname="item.creatorNickname"
            :show-play-count="true"
            :play-count="item.viewsCount"
            :show-comment-count="true"
            :comment-count="item.commentCount"
            :show-like-count="true"
            :like-count="item.recommendCount"
            :show-subscription-count="true"
            :subscription-count="item.subscriptionCount"
            :update-time="item.updateTime"
            :on-view-data="() => {router.push({path:'/creative/albumStatistic',query: {albumId: item.id,albumCreatorMemberId:item.creatorMemberId}})}"
            :on-edit="()=>{}"
            :on-more="() => {}"
            :on-share="()=>{}"
        />
        <van-divider/>
      </div>
    </van-list>
  </van-pull-refresh>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";
import AlbumItem from "@/views/creation/album/components/AlbumItem.vue";
import {useOrderStore} from "@/stores/order_store.ts";
import {OrderDTO} from "@/models/order.ts";
import {showToast} from "vant";

const router = useRouter();
const {loadOrders} = useOrderStore();

const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  beginOrderId: "0",
  pageSize: 6,
};
const orderList = ref<OrderDTO[]>([]);
// 加载专辑数据
const loadOrderData = async (type = 'refresh') => {
  if (type === 'refresh') {
    searchParam.beginOrderId = "0";
    refreshing.value = false;
    finished.value = false;
  }
  const res = await loadOrders(searchParam.beginOrderId, searchParam.pageSize);
  if (!res?.code || res?.code !== "200") {
    showToast(res?.message || "获取订单列表失败");
    return;
  }

  if (!res.data || res.data.length === 0) {
    // 确保没有数据时停止加载
    finished.value = true;
    loading.value = false;
    return;
  }

  if (type === 'refresh') {
    orderList.value = res.data;
  } else {
    orderList.value = orderList.value.concat(res.data);
  }

  searchParam.beginOrderId = res.data[res.data.length - 1].id;
  if (res.data.length < searchParam.pageSize) {
    finished.value = true;
  }
  loading.value = false;
}

// 刷新
const onRefresh = () => {
  // 清空数据
  finished.value = false;
  // 重新加载
  loading.value = false;
  // 刷新
  refreshing.value = true;
  loadOrderData();
}

</script>

<style lang="scss" scoped>
</style>