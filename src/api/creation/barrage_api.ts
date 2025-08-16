import http from "@/utils/http.ts";
import {MediaBarrage} from "@/models/barrage.ts";

export async function useAddBarrage(barrage: MediaBarrage) {
    return await http.post<{
        code: number,
        message: string,
        data: any,
    }>("/creation_api/barrage/addBarrage", barrage);
}

export async function useListBarrage(creatorMemberId: string, mediaId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: Array<MediaBarrage>,
    }>("/creation_api/barrage/list", {creatorMemberId: creatorMemberId, mediaId: mediaId});
}
