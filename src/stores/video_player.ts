// 视频存储Store
import {defineStore} from "pinia";
import {VideoPlayerState} from "@/models/video_player.ts";
import {MediaBarrage} from "@/models/barrage.ts";
import {useListBarrage, useAddBarrage} from "@/api/creation/barrage_api.ts";
import SoundBarrage from "@/views/sound/SoundBarrage.vue";
import {BarrageType} from "@/models/barrage.ts";
import {useAddListenHistory} from "@/api/member/listen_history_api.ts";
import {MemberListenHistoryCreator} from "@/models/member_listen_history.ts";
import {useUpdateListenHistory} from "@/api/member/listen_history_api.ts";
import {MemberListenHistoryUpdate} from "@/models/member_listen_history.ts";
import {useGetListenHistory} from "@/api/member/listen_history_api.ts";
import {MemberListenHistory} from "@/models/member_listen_history.ts";

/**
 * player store
 */
export const useVideoPlayerStore = defineStore({
    id: "video_player",
    state: () => {
        return {
            // 视频字幕
            videoBarrages: [] as MediaBarrage[],
            // 视频状态
            videoPlayerState: {
                duration: 0,
                paused: true,
                waiting: true,
                barrageSwitch: true,
                fullscreen: false,
                finish: false,
                isShowCover: false,
                isShowControlBar: true,
                isShowPlayBtn: true,
                isLive: false,
                living: false,
            } as VideoPlayerState,
            // 视频引用
            videoRef: null as HTMLVideoElement,
            // 当前播放到时间引用
            currentTimeRef: null as HTMLSpanElement,
            // 进度条引用
            progressRef: null as HTMLDivElement,
            // 直播时长引用
            liveDurationRef: null as HTMLDivElement,
            // 字幕引用
            barrageRef: null as typeof SoundBarrage | null,
            // 媒体字幕列表
            mediaBarrages: [] as MediaBarrage[],
            // 媒体字幕列表切片，表示的是一次循环中用到的字幕
            mediaBarrageSplice: [] as MediaBarrage[],
            // 上一次调用的时间
            lastFindBarrageTime: 0,
            // 是否播放中
            isPlaying: false,
            // 是否已经设置定时器
            hidePlayButtonTimeout: null,
            // 弹幕输入
            barrageInput: null,
            // 展示弹幕对话框
            showDanMuDialog: false,
            // 媒体收听历史
            memberListenHistory: {} as MemberListenHistory,
        }

    },
    actions: {
        /**
         * 显示或隐藏控制器
         */
        showOrHideControls() {
            if (this.videoPlayerState.isShowControlBar) {
                this.videoPlayerState.isShowControlBar = false;
                this.videoPlayerState.isShowPlayBtn = false;
            } else {
                this.videoPlayerState.isShowControlBar = true;
                this.videoPlayerState.isShowPlayBtn = true;
            }
        },
        /**
         * 播放或者暂停
         */
        playOrPause() {
            const video = this.videoRef;
            if (this.videoPlayerState.paused) {
                video.play();
                this.videoPlayerState.paused = false;
                this.videoPlayerState.isShowPlayBtn = true;
                this.videoPlayerState.finish = false;
                // 3秒后播放按钮显示如果显示则隐藏
                setTimeout(() => {
                    if (this.videoPlayerState.isShowPlayBtn === true) {
                        this.videoPlayerState.isShowControlBar = false;
                        this.videoPlayerState.isShowPlayBtn = false;
                    }
                }, 3000);
            } else {
                video.pause();
                this.videoPlayerState.paused = true;
            }
        },
        /**
         * 改变播放位置
         */
        changePlayPosition(e) {
            e.stopPropagation();
            const progressWrapperDOM = e.currentTarget;
            const left = progressWrapperDOM.getBoundingClientRect().left;
            const progress = (e.clientX - left) / progressWrapperDOM.offsetWidth;
            this.videoRef.currentTime = this.videoRef.duration * progress;
            if (!this.isPlaying) {
                this.isPlaying = true;
                try {
                    this.videoRef.play();
                } catch (error) {
                    console.error("Playback failed:", error);
                } finally {
                    this.isPlaying = false;
                }
            }
            this.videoPlayerState.isShowControlBar = false;

            // 清除已有的定时器，防止多次触发
            if (this.hidePlayButtonTimeout) {
                clearTimeout(this.hidePlayButtonTimeout);
            }

            this.hidePlayButtonTimeout = setTimeout(() => {
                if (this.videoPlayerState.isShowPlayBtn) {
                    this.videoPlayerState.isShowPlayBtn = false;
                }
            }, 3000);
            // 一次循环的字幕赋值
            this.mediaBarrageSplice = this.mediaBarrages.slice();
        },
        /**
         * 开启或关闭弹幕
         */
        onOrOff() {
            if (this.videoPlayerState.barrageSwitch) {
                this.barrageRef.clear();
                this.videoPlayerState.barrageSwitch = false;
            } else {
                this.videoPlayerState.barrageSwitch = true;
            }
        },

        /**
         * 进入或退出全屏
         */
        entryOrExitFullscreen() {
            if (this.videoPlayerState.fullscreen) {
                this.videoPlayerState.isShowControlBar = false;
                this.videoPlayerState.isShowPlayBtn = false;
                this.videoPlayerState.fullscreen = false;
            } else {
                this.videoPlayerState.isShowControlBar = false;
                this.videoPlayerState.isShowPlayBtn = false;
                this.videoPlayerState.fullscreen = true;
            }
        },

        async loadMediaBarrages(memberId: string, mediaId: string) {
            const {data} = await useListBarrage(memberId, mediaId);
            const barrageList = [];
            data.forEach((mediaBarrage: MediaBarrage) => {
                barrageList.push({
                    type: mediaBarrage.positionType === 1 ? BarrageType.RANDOM : BarrageType.FIXED,
                    color: "#" + mediaBarrage.decimalColor,
                    content: mediaBarrage.content,
                    time: mediaBarrage.senderBarrageTime,
                });
            });
            this.mediaBarrages = barrageList;
            // 一次循环的字幕赋值
            this.mediaBarrageSplice = this.mediaBarrages.slice();
        },

        findBarrages(time: number) {
            // 查找到的弹幕
            const barrageList = [];
            // 查找到的弹幕索引
            const indexs = [];
            const currentTimeInSeconds = Math.floor(time);
            if (this.lastFindBarrageTime === currentTimeInSeconds) {
                return barrageList;
            }
            // 更新为当前时间
            this.lastFindBarrageTime = currentTimeInSeconds;
            this.mediaBarrageSplice.forEach((barrage, index) => {
                // 换成整数秒
                if (barrage.time === currentTimeInSeconds) {
                    barrageList.push(barrage);
                    indexs.push(index);
                }
            });
            indexs.forEach((index, i) => {
                // 删除掉已经查找到的弹幕
                this.mediaBarrageSplice.splice(index - i, 1);
            });
            return barrageList;
        },

        resetBarrages() {
            this.mediaBarrageSplice = this.mediaBarrages.slice();
        },

        /**
         * 发送字幕
         * @param creatorMemberId 视频的创建者ID
         * @param mediaId 媒体ID
         * @param barrageContent 字幕内容
         * @param senderBarrageTime 发送字幕所在的视频时间
         */
        async sendBarrages(creatorMemberId: string, mediaId: string, barrageContent: string, senderBarrageTime: number) {
            const mediaBarrage = {
                content: barrageContent,
                positionType: BarrageType.RANDOM,
                decimalColor: "ffffff",
                fontSize: 12,
                opacity: 0.5,
                mediaId: mediaId,
                creatorMemberId: creatorMemberId,
                senderBarrageTime: Math.floor(senderBarrageTime) + 3, // 延迟3秒，因为立刻加载会被有可能加载不到
            };
            const {data} = await useAddBarrage(mediaBarrage);
            const mediaBarrageSend = {
                type: mediaBarrage.positionType === 1 ? BarrageType.RANDOM : BarrageType.FIXED,
                color: "#" + mediaBarrage.decimalColor,
                content: mediaBarrage.content,
                time: mediaBarrage.senderBarrageTime,
            }
            this.mediaBarrages.push(mediaBarrageSend);
            this.mediaBarrageSplice.push(mediaBarrageSend);
            return data;
        },
        // 添加收听历史
        async addListenHistory(listenHistoryCreator: MemberListenHistoryCreator) {
            const {data} = await useAddListenHistory(listenHistoryCreator);
            return data;
        },
        // 更新收听历史
        async updateListenHistory(listenHistoryUpdate: MemberListenHistoryUpdate) {
            const {data} = await useUpdateListenHistory(listenHistoryUpdate);
            return data;
        },
        // 获取收听历史
        async getListenHistory(mediaId: string) {
            const {data} = await useGetListenHistory(mediaId);
            return data;
        },
    }
});