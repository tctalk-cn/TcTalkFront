<template>
  <router-link :to="to" class="myorder" :style="{ borderBottom: noBorder ? '0' : undefined }">
    <aside>
      <IconPark :icon="icon" theme="filled" fill="#000" class="mr-1" :size="12"/>
    </aside>
    <div class="myorder-div">
      <span>{{ label }}</span>
      <span class="myorder-divsvg">
        <IconPark :icon="Right" theme="filled" fill="#000" class="mr-1" :size="12"/>
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import {Right} from "@icon-park/vue-next";
import IconPark from "@/components/common/IconPark.vue";

defineProps<{ to: string; icon: any; label: string; noBorder?: boolean }>();
</script>
