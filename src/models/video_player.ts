/**
 * 播放器状态
 */
export interface VideoPlayerState {
    /**
     * 总播放时长
     */
    duration: number;
    /**
     * 是否暂停
     */
    paused: boolean;
    /**
     * 是否等待中
     */
    waiting: boolean;
    /**
     * 打开/关闭字幕开关
     */
    barrageSwitch: boolean;
    /**
     * 是否全屏
     */
    fullscreen: boolean;
    /**
     * 是否播放完成
     */
    finish: boolean;
    /**
     * 是否显示遮掩面
     */
    isShowCover: boolean;
    /**
     * 是否展示控制按钮
     */
    isShowControlBar: boolean;
    /**
     * 是否展示模仿按钮
     */
    isShowPlayBtn: boolean;
    /**
     * 是否为直播
     */
    isLive: boolean;
}