import {MediaChannel} from "@/models/media_channel.ts";
import http from "@/utils/http.ts";

/**
 * 获取全部频道
 */
export async function useListAllChannels() {
    return await http.get<{
        data: MediaChannel[]
    }>("/category_api/channel/listAll");
}