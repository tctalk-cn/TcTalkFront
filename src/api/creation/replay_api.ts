import http from "@/utils/http.ts";
import {MediaReplayCreator} from "@/models/media_replay.ts";

export async function useAddReplay(replayCreator: MediaReplayCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: any,
    }>("/creation_api/replay/addReplay", replayCreator);
}

