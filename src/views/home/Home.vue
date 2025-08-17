<template>
  <div class="home">
    <div class="home-header">
      <!--search pop-->
      <div class="search">
        <router-link to="/search">
          <van-search
              placeholder="搜索音乐、故事、专辑"
              input-align="center"
              right-icon="audio"
          />
        </router-link>
      </div>
      <!--top bar-->
      <div class="top-bar">
        <!-- 左侧图标 -->
        <van-icon name="apps-o" @click="showChannelSelectDialog=!showChannelSelectDialog" class="nav-icon"/>
        <!-- 中间 Tabs -->
        <div class="center-tabs-container">
          <van-tabs v-model:active="currentKey"
                    lazy-render
                    @click-tab="handleTabClick"
                    sticky
                    class="center-tabs">
            <van-tab v-for="(item) in allCustomizedChannels"
                     :name="`${item.urlPath},${item.channelId}`"
                     :title="item.channelName">
              <template #title>
                {{ item.channelName }}
              </template>
            </van-tab>
          </van-tabs>
        </div>

        <!-- 右侧图标 -->
        <van-icon name="setting-o" @click="showChannelSelectDialog=!showChannelSelectDialog" class="nav-icon"/>
      </div>
    </div>
    <!-- 内容页 -->
    <div class="main">
      <div class="content">
        <!-- 按需缓存需要缓存的页面，在router中设置router的元信息meta的keepAlive -->
        <RouterView/>
      </div>
    </div>
    <!-- 频道选择框 -->
    <section class="channel_select_info">
      <van-popup v-model:show="showChannelSelectDialog" round position="bottom" :style="{height:'45%'}">
        <div class="popup-header">
          <span>全部频道</span>
          <van-icon name="close" @click="showChannelSelectDialog = false" class="close-icon"/>
        </div>
        <div class="popup-content">
          <van-grid :column-num="4" :border="false">
            <van-grid-item v-for="(channel) in allChannels" :key="channel.id">
              <van-button
                  :type="isSelected( channel.id) ? 'danger' : 'default'"
                  :disabled="isDisabledSelect( channel.id)"
                  plain
                  class="w-full"
                  size="small"
                  @click="selectChannel(channel.id,channel.name,channel.urlPath)">
                {{ channel.name }}
              </van-button>
            </van-grid-item>
          </van-grid>
        </div>
        <div>
          <van-button type="primary"
                      round
                      class="mt-2"
                      size="small"
                      block
                      @click="finishedChannelSelect">
            完成
          </van-button>
        </div>
      </van-popup>
    </section>
  </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watch} from "vue";

import {storeToRefs} from "pinia";
import {useRoute, useRouter} from "vue-router";
import {useChannelStore} from "@/stores/channel_store.ts";
import {CustomizedMediaChannelCreator} from "@/models/media_channel.ts";

const {listAllChannel, listCustomizedChannels, createCustomizedChannels} = useChannelStore();
const {
  defaultCustomizedChannels,
  allChannels,
  selectedCustomizedChannels,
} = storeToRefs(useChannelStore());

const router = useRouter();
const route = useRoute();
// 是否显示分类对话框
const showChannelSelectDialog = ref(false);
// 用户定制化的频道列表
const allCustomizedChannels = ref([]);
// 用户正在选择的频道列表
const allSelectingCustomizedChannels = ref([]);

const finishedChannelSelect = async () => {
  var chooseCustomizedChannels = [] as CustomizedMediaChannelCreator[];
  for (let index = 0; index < allSelectingCustomizedChannels.value.length; index++) {
    const channel = allSelectingCustomizedChannels.value[index];
    if (!isDisabledSelect(channel.channelId)) {
      chooseCustomizedChannels.push({
        channelId: channel.channelId,
        sort: index,
      });
    }
  }
  if (chooseCustomizedChannels.length > 0) {
    await createCustomizedChannels(chooseCustomizedChannels);
  }
  showChannelSelectDialog.value = false;
}

const currentKey = ref<string>("");
// 监听路由变化，动态更新 currentKey
watch(
    () => route.fullPath,
    () => {
      const channelId = route.query.channelId as string;
      const urlPath = route.path;

      currentKey.value = `${urlPath},${channelId}`;
    }
);

// tab点击切换页面
const handleTabClick = (tab) => {
  const [urlPath, channelId] = tab.name.split(',');
  currentKey.value = tab.name;
  router.push({path: urlPath, query: {channelId: channelId}});
}

onMounted(async () => {
  // currentKey.value = defaultSelectedTabName.value;
  // Use Promise.all to make both requests concurrently
  await Promise.all([
    listAllChannel(),
    listCustomizedChannels()
  ]);
  const customizedChannelsClone = defaultCustomizedChannels.value.slice();
  customizedChannelsClone.push(...selectedCustomizedChannels.value)
  allSelectingCustomizedChannels.value = customizedChannelsClone;
  allCustomizedChannels.value = customizedChannelsClone;

  const channelId = route.query.channelId as string;
  const urlPath = route.path;

  // 设置 currentKey 格式为 "urlPath,channelId"
  currentKey.value = `${urlPath},${channelId}`;
})

const isSelected = (channelId: string): boolean => {
  // 判断 channelName 是否在 allCustomizedChannels 中
  return allCustomizedChannels.value.some(channel => {
    return channel.channelId === channelId
  });
}

const isDisabledSelect = (channelId: string) => {
  // 判断 channelName 是否在 defaultCustomizedChannels 中
  return defaultCustomizedChannels.value.some(channel => {
    return channel.channelId === channelId
  });
}

const findSelectedIndex = (channelId: string): number => {
  // 判断 channelName 是否在 allCustomizedChannels 中
  return allSelectingCustomizedChannels.value.findIndex(channel => channel.channelId === channelId);
}

// 选择频道
const selectChannel = (chooseChannelId: string, chooseChannelName: string, chooseChannelUrlPath: string) => {
  // 检查 chooseChannelId 在 allCustomizedChannels 中的索引
  const index = findSelectedIndex(chooseChannelId);
  if (index >= 0) {
    // 如果存在则取消选择
    allSelectingCustomizedChannels.value.splice(index, 1);
  } else {
    // 如果不存在则添加到选中数组
    allSelectingCustomizedChannels.value.push({
      channelId: chooseChannelId,
      channelName: chooseChannelName,
      url: chooseChannelUrlPath,
      sort: 0
    });
  }
}


</script>
<style lang="scss" scoped>
.home {

  .home-header {
    .top-bar {
      display: flex;
      align-items: center;
      padding: 0 0.5rem;
      background-color: #fff;

      .nav-icon {
        cursor: pointer;
        padding: 0.5rem;
      }

      .center-tabs-container {
        flex: 1;
        display: flex;
        justify-content: center;
        overflow-x: hidden;


        .center-tabs {
          width: 100%;
          font-size: 1rem;
          font-weight: 500;

          .van-tabs__wrap {
            flex-grow: 1;
          }

          .van-tabs__nav {
            display: flex;
            justify-content: space-around;
            flex-grow: 1;
          }
        }
      }
    }

  }

  .channel_select_info {
    .custom-popup {
      padding: 2rem;
    }

    .popup-header {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-size: 1rem;
      font-weight: bold;
      padding: 0.5rem 0.2rem;
      border-bottom: 0.1rem solid #ebebeb;
    }

    .close-icon {
      position: absolute;
      right: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
    }

    .popup-content {
      //margin-top: 1rem !important;
    }
  }
}
</style>