// 视频存储Store
import {MediaData} from "@/models/media.ts";
import {defineStore} from "pinia";
import {useDeleteMediaById} from "@/api/creation/video_api.ts";
import {useUploadVideo} from "@/api/creation/video_api.ts";
import {useUploadCover} from "@/api/creation/video_api.ts";
import {useAddComment, useListComment} from "@/api/creation/comment_api.ts";
import {useQueryMediaById, useVideoCreator} from "@/api/creation/video_api.ts";
import {MediaReplayCreator} from "@/models/media_replay.ts";
import {MediaCommentCreator} from "@/models/media_comment.ts";
import {VideoDataCreator} from "@/models/video.ts";
import {useAddReplay} from "@/api/creation/replay_api.ts";
import {useProxyM3u8} from "../api/creation/video_api.ts";

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
            // 上传视频数据
            async uploadVideo(file: File) {
                let formData = new FormData();
                formData.append('file', file);
                try {
                    const {data} = await useUploadVideo(formData);
                    return data;
                } catch (err) {
                    throw new Error(err);
                }
            },
            // 上传视频封面
            async uploadCover(file: File) {
                let formData = new FormData();
                formData.append('file', file);
                try {
                    const {data} = await useUploadCover(formData);
                    return data;
                } catch (err) {
                    throw new Error(err);
                }
            },
            // 添加视频作品
            async videoCreator(videoDataCreator: VideoDataCreator) {
                const {data} = await useVideoCreator(videoDataCreator);
                return data;
            },
            // 获取作品明细
            async queryMediaById(memberId: string, mediaId: string) {
                const {data} = await useQueryMediaById(memberId, mediaId);
                return data;
            },
            // 数据还原
            resetState() {
                this.permissionsVal = "公开";
                this.permissions = 0;
                this.usedTags = [];
                this.videoDescription = '';
                this.title = '';
                this.usedAlbumId = '';
            },
            // listComment 列举媒体的评论列表
            async listComment(mediaCreatorMemberId: string, mediaId: string, mediaType: number, toCommentId: string, pageSize: number) {
                const {data} = await useListComment(mediaCreatorMemberId, mediaId, mediaType, toCommentId, pageSize);
                return data;
            },
            // 添加评论
            async addComment(commentCreator: MediaCommentCreator) {
                const {data} = await useAddComment(commentCreator);
                return data;
            },
            // 评论回复
            async addReplay(replayCreator: MediaReplayCreator) {
                const {data} = await useAddReplay(replayCreator);
                return data;
            },

            // 修改权限
            async resetPermission(permissions: number) {
                this.permissions = permissions;
                if (permissions === 0) {
                    this.permissionsVal = "公开";
                } else if (permissions === 1) {
                    this.permissionsVal = "仅自己可见";
                } else if (permissions === 2) {
                    this.permissionsVal = "仅好友可见";
                } else {
                    this.permissionsVal = "仅指定人群可见";
                }
            },
            // 评论回复
            async deleteMediaById(mediaId: string) {
                const {data} = await useDeleteMediaById(mediaId);
                return data;
            },

            async proxyM3u8(mediaId: string,creatorMemberId: string) {
                const {data} = await useProxyM3u8(mediaId,creatorMemberId);
                return data;
            },
        }
    })