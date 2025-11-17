import {defineStore} from "pinia";
import nofaceImage from '@/assets/images/noface.gif';
import {
    useMemberInfo, useGenerateQrCode,
    useMemberStatisticsInfo, useResetBirthday,
    useResetGender, useResetNickname,
    useResetSignature, useResetUsername, useUploadAvatar,
    useMemberById, useMemberStatisticsInfoById,
    useAddMemberFollowed, useIsMemberFollowed
}
    from "@/api/member/member_api.ts";
import {useAddSearchLog} from "@/api/member/search_history_api.ts";
import {useListEnabledPlanCategory,useListEnabledPlans} from "@/api/member/member_plan_api.ts";

export const useProfileStore = defineStore(
    "userProfile", {

        state: () => ({
            token: '',
            // 用户手机
            show: false, // 显示提示框
            isEnter: true,  //是否登录
            isLeave: false, //是否退出
            showAlert: false,
            alertText: null,
            // 你也可以加用户信息等字段
            memberInfo: {
                id: "",
                uid: "",
                memberLevelId: 0,
                username: "",
                nickname: "",
                shortUsername: "",
                phone: "",
                status: 1,
                avatarUrl: "",
                gender: 0,
                birthday: "",
                city: "",
                job: "",
                school: "",
                personalizedSignature: "",
                integration: 0,
                shortDescription: "",
                detailDescription: "",
                tags: "",
                hasResetUsername: 0,
                memberLevelName: "",
                qrCodeUrl: "",
            },
            memberStatisticsInfo: {
                memberId: 0,
                consumeAmount: 0,
                orderCount: 0,
                couponCount: 0,
                commentCount: 0,
                returnOrderCount: 0,
                loginCount: 0,
                attendCount: 0,
                likesCount: 0,
                worksCount: 0,
                barrageCount: 0,
                newsCount: 0,
                fansCount: 0,
                collectWorksCount: 0
            },
        }),

        getters: {
            isLogin: (state) => !!state.token,
            getAvatarUrl: (state) => state.memberInfo?.avatarUrl || nofaceImage,
            getNickname: (state) => state.memberInfo?.nickname || "暂未设置",
            getUsername: (state) => state.memberInfo?.username || "登录/注册",
            getGender: (state) => {
                const gender = state.memberInfo?.gender;
                if (gender === 0) {
                    return "保密";
                } else if (gender === 1) {
                    return "男";
                } else if (gender === 2) {
                    return "女";
                } else {
                    return "保密"; // 默认值，防止为空
                }
            },
            getBirthday: (state) => {
                const birthday = state.memberInfo?.birthday;
                if (!birthday) {
                    return "生日当天会收到祝福～";
                }
                const date = new Date(birthday);
                const y = date.getFullYear();
                const m = (date.getMonth() + 1).toString().padStart(2, '0');
                const d = date.getDate().toString().padStart(2, '0');
                return `${y}-${m}-${d}`;
            },

            getPersonalizedSignature: (state) => {
                return state.memberInfo?.personalizedSignature || '介绍一下自己吧';
            },
            getSchool: (state) => {
                return state.memberInfo?.school || '填写学校发现更多校友~';
            },
            getUid: (state) => {
                return state.memberInfo?.uid || '';
            },
            getMemberLevelName: (state) => {
                return state.memberInfo?.memberLevelName || '普通会员';
            },
            getQrCodeUrl: (state) => {
                return state.memberInfo?.qrCodeUrl || '';
            },
            getPhone: (state) => {
                return state.memberInfo?.phone || '';
            },
            hasResetUsername: (state) => {
                return state.memberInfo?.hasResetUsername || 0;
            },
            getWorksCount: (state) => {
                return state.memberStatisticsInfo?.worksCount || 0;
            },
            getNewsCount: (state) => {
                return state.memberStatisticsInfo?.newsCount || 0;
            },
            getAttendCount: (state) => {
                return state.memberStatisticsInfo?.attendCount || 0;
            },
            getLikesCount: (state) => {
                return state.memberStatisticsInfo?.likesCount || 0;
            },
            getBarrageCount: (state) => {
                return state.memberStatisticsInfo?.barrageCount || 0;
            },
            getFansCount: (state) => {
                return state.memberStatisticsInfo?.fansCount || 0;
            },
            getCollectWorksCount: (state) => {
                return state.memberStatisticsInfo?.collectWorksCount || 0;
            },
        },
        actions: {
            setToken(token: string) {
                this.token = token;
            },
            clearToken() {
                this.token = '';
            },
            // loadMemberInfo 加载用户信息
            async loadMemberInfo() {
                const data = await useMemberInfo();
                this.memberInfo = data.data;
            },
            // 获取会员统计信息
            async getMemberStatistics() {
                const {data} = await useMemberStatisticsInfo();
                this.memberStatisticsInfo = data;
            },
            // 退出登录
            async signOut() {
                this.waitingThing();
                this.clearToken();
                this.memberInfo = {};
                this.memberStatisticsInfo = {};
            },

            async exitLogin() {
                this.show = true;
                this.isEnter = true;
                this.isLeave = true;
            },

            waitingThing() {
                // 取消退出
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.isEnter = false;
                this.isLeave = true;
                this.timer = setTimeout(() => {
                    clearTimeout(this.timer);
                    this.show = false;
                }, 200);
            },

            changePhone(phone: string) {
                this.showAlert = true;
                this.alertText = '请在手机APP中设置';
            },

            // 上传头像
            async uploadAvatar() {
                console.info(this.memberInfo);
                if (this.memberInfo) {
                    let input = document.querySelector('.profile__upload') as HTMLInputElement;
                    let formData = new FormData();
                    formData.append('file', input.files[0]);
                    try {
                        const {data} = await useUploadAvatar(formData);
                        this.memberInfo.avatarUrl = data;
                        this.avatarUrl = data;
                    } catch (err) {
                        this.showAlert = true;
                        this.alertText = '上传失败';
                        throw new Error(err);
                    }
                }
            },

            // 重置用户名
            async resetUsername(newUsername: string) {
                await useResetUsername(newUsername);
                this.memberInfo.username = newUsername;
                this.memberInfo.hasResetUsername = 1;
            },

            // 重置昵称
            async resetNickname(nickname: string) {
                await useResetNickname(nickname);
                this.memberInfo.nickname = nickname;
            },

            // 重置生日
            async resetBirthday(birthday: string) {
                await useResetBirthday(birthday);
                this.memberInfo.birthday = birthday;
            },

            // 重置签名
            async resetSignature(signature: string) {
                await useResetSignature(signature);
                this.memberInfo.signature = signature;
            },

            // 生成二维码
            async generateQrCode() {
                let {data} = await useGenerateQrCode();
                this.memberInfo.qrCodeUrl = data;
            },
            // 改性别
            async resetGender(gender: number) {
                const {code, message} = await useResetGender(gender);
                this.memberInfo.gender = gender;
                return {code, message};
            },
            // 修改密码
            async updatePassword(pwd: string) {
                this.alertText = '暂不支持';
            },
            async queryMemberById(memberId: string) {
                const {data} = await useMemberById(memberId);
                return data;
            },
            // 标签页返回的信息处理
            tagList() {
                let str = "";
                if (this.selectedTag) {
                    str += this.selectedTag + ", ";
                }
                // 是否有自定义tag，分开处理
                if (this.inputTag) {
                    return str + this.inputTag;
                }
                return str.substr(0, str.lastIndexOf(", "));
            },
            // 获取会员统计信息
            async getMemberStatisticsById(memberId: string) {
                const {data} = await useMemberStatisticsInfoById(memberId);
                return data;
            },
            // 判断是否已经关注
            async isFollowed(followedMemberId: string) {
                if (followedMemberId === this.mId) {
                    return true;
                }
                const {data} = await useIsMemberFollowed(followedMemberId);
                return data;
            },
            // 判断是不是当前登陆人自身
            async isSelf(followedMemberId: string) {
                return followedMemberId === this.memberInfo.id;
            },
            // 添加关注
            async addMemberFollowed(followedMemberId: string) {
                const {data} = await useAddMemberFollowed(followedMemberId);
                return data;
            },
            // 添加搜索记录
            async addSearchLog(keyword: string, channelId: string) {
                const {data} = await useAddSearchLog(keyword, channelId);
                return data;
            },
            // 列举全量的会员产品方案
            async listEnabledPlanCategory() {
                const {data} = await useListEnabledPlanCategory();
                return data;
            },
            // 按照分类码查询会员付费方案
            async listEnabledPlans(categoryCode:string) {
                const {data} = await useListEnabledPlans(categoryCode);
                return data;
            },
        },
        // 持久化配置
        persist: {
            key: 'userProfile',
            storage: localStorage,
            paths: ['token', 'memberInfo', 'memberStatisticsInfo'],
        }
    }
)