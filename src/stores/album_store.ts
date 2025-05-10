// 专辑存储Store
import {defineStore} from "pinia";

import {
    useLoadAlbums,
    useUploadCover,
    useCreateAlbum,
    useQueryAlbum,
    useApplyCompleted,
    useLoadStreamerOtherAlbums,
    useQueryLastSelected
} from "@/api/creation/album_api";

export const useAlbumStore = defineStore({
        id: "album",
        state: () => ({}),
        actions: {

            // 加载专辑数据
            async loadAlbums(beginAlbumId: string, pageSize: number) {
                const {data} = await useLoadAlbums(beginAlbumId, pageSize);
                return data;
            },
        }

    })
;