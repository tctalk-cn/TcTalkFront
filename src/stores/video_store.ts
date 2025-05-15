// 视频存储Store
import {MediaData} from "@/models/media.ts";
import {defineStore} from "pinia";
import {useDeleteMediaById} from "@/api/creation/video_api.ts";

export const useVideoStore = defineStore(
    "video", {
        state: () => {
            return {
                permissionsVal: "公开",
                permissions: 0,
                usedTags: [],
                usedAlbumId: '',
                videoDescription: '',
                title: '',
                mediaData: {} as MediaData,
            }
        },
        actions: {

            // 评论回复
            async deleteMediaById(mediaId: string) {
                const {data} = await useDeleteMediaById(mediaId);
                return data;
            },
        }
    })