import http from "@/utils/http.ts";
import {CustomizedMediaChannel} from "@/models/media_channel.ts";
import {CustomizedMediaChannelCreator} from "../../models/media_channel.ts";

/**
 * 获取定制化全部频道
 */
export async function useListCustomizedChannels() {
    return await http.get<{
        data: CustomizedMediaChannel[]
    }>("/category_api/customized/channel/list");
}

/**
 * 创建定制化频道列表
 */
export async function useCreateCustomizedChannels(channels: CustomizedMediaChannelCreator[]) {
    return await http.post<{
        code: number,
        message: string,
        data: number,
    }>("/category_api/customized/channel/create", channels);
}