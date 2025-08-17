import {defineStore} from "pinia";
import {useListAllChannels} from "@/api/category/channel_api.ts";
import {MediaChannel} from "@/models/media_channel.ts";
import {useListCustomizedChannels} from "@/api/category/customized_channel_api.ts";
import {CustomizedMediaChannel} from "@/models/media_channel.ts";
import {useCreateCustomizedChannels} from "@/api/category/customized_channel_api.ts";
import {CustomizedMediaChannelCreator} from "@/models/media_channel.ts";

// 频道Store
export const useChannelStore = defineStore({
    id: "channel",
    state: () => ({
        defaultSelectedTabName: "推荐",
        defaultChannels: [
            {
                id: "-3",
                name: "直播",
                urlPath: '/home/live',
            },
            {
                id: "-2",
                name: "热点",
                urlPath: '/home/hot',
            },
            {
                id: "-1",
                name: "推荐",
                urlPath: '/home/recommend',
            },
            {
                id: "0",
                name: "会员",
                urlPath: '/home/member',
            }
        ] as MediaChannel[],
        allChannels: [] as MediaChannel[],// 全部的候选频道
        defaultCustomizedChannels: [
            {
                id: "-3",
                channelId: "-3",
                channelName: "直播",
                urlPath: '/home/live',
                sort: -3,
            },
            {
                id: "-2",
                channelId: "-2",
                channelName: "热点",
                urlPath: '/home/hot',
                sort: -2,
            },
            {
                id: "-1",
                channelId: "-1",
                channelName: "推荐",
                urlPath: '/home/recommend',
                sort: -1,
            },
            {
                id: "0",
                channelId: "0",
                channelName: "会员",
                urlPath: '/home/member',
                sort: 0,
            }
        ] as CustomizedMediaChannel[], // 定制化的频道列表
        selectedCustomizedChannels: [] as CustomizedMediaChannel[], // 已经选择的定制化频道列表
    }),
    actions: {
        // 枚举全部的频道
        async listAllChannel() {
            try {
                const res = await useListAllChannels();
                const channelsClone = this.defaultChannels.slice();
                channelsClone.push(...res.data);
                this.allChannels = channelsClone;
            } catch (err) {
                console.error("Error fetching channels:", err);
            }
        },

        // 获取当前用户的定制化频道
        async listCustomizedChannels() {
            try {
                const res = await useListCustomizedChannels();
                this.selectedCustomizedChannels.push(...res.data)
            } catch (err) {
                console.error("Error fetching channels:", err);
            }
        },

        // 创建用户自定义频道
        async createCustomizedChannels(channels: CustomizedMediaChannelCreator[]) {
            const {data} = await useCreateCustomizedChannels(channels);
            return data;
        },

    }
});