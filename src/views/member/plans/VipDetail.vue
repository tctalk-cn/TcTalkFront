<template>
  VIPDetail
</template>
<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useProfileStore} from "@/stores/member_store.js";
import {MemberPlanRespModel} from "@/models/member_plan.ts";
import {useRoute} from "vue-router";
const route = useRoute();
const {listEnabledPlans} = useProfileStore();

// 从路由 query 获取 categoryCode
const categoryCode = route.query.categoryCode as string;

// 会员计划分类
const memberPlans = ref<MemberPlanRespModel[]>();

onMounted(async () => {
  memberPlans.value = await listEnabledPlans(categoryCode);
});

</script>
<style lang="scss" scoped>
</style>