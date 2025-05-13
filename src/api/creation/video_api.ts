import http from "@/utils/http.ts";
import {VideoData, VideoDataCreator} from "@/models/video.ts";
import {CommonPage} from "@/models/common_page.ts";
import {MediaData} from "@/models/media.ts";
import {MediaSummary} from "@/models/media_summary.ts";

export async function useUploadVideo(formData: FormData) {
    return await http.upload<{
        data: {
            videoUrl: string,
            height: number,
            width: number,
            sizeInBytes: number,
            durationInSec: number,
        },
    }>("/creation_api/media/creation/uploadVideo", formData);
}

export async function useUploadCover(formData: FormData) {
    return await http.upload<{
        data: string,
    }>("/creation_api/media/creation/uploadCover", formData);
}

export async function useVideoCreator(videoData: VideoDataCreator) {
    return await http.post<{
        code: number,
        message: string,
        data: any,
    }>("/creation_api/media/creation/add", videoData);
}

export async function useMemberWorks(pageNum: number, pageSize: number, memberId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: CommonPage<VideoData>,
    }>("/creation_api/media/creation/list", {pageNum: pageNum, pageSize: pageSize, memberId: memberId});
}


export async function useQueryMediaById(creatorMemberId: string, mediaId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MediaData,
    }>("/creation_api/media/creation/queryById", {creatorMemberId: creatorMemberId, mediaId: mediaId});
}

export async function useIncrPlayCount(mediaId: number) {
    return await http.get<{
        code: number,
        message: string,
        data: any,
    }>("/creation_api/media/creation/incrPlayCount", {mediaId: mediaId});
}


export async function useListMediaByAlbum(albumId: string, beginMediaId: string, pageSize: number, mediaType: number) {
    return await http.get<{
        code: number,
        message: string,
        data: CommonPage<MediaData>,
    }>("/creation_api/media/creation/loadByAlbum", {
        albumId: albumId,
        beginMediaId: beginMediaId,
        pageSize: pageSize,
        mediaType: mediaType
    });
}

export async function usePin2Top(albumId: string, mediaId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: CommonPage<Boolean>,
    }>("/creation_api/media/creation/pin2Top", {
        albumId: albumId,
        mediaId: mediaId,
    });
}

export async function useDeleteMediaById(mediaId: string) {
    return await http.post<{
        code: number,
        message: string,
        data: MediaData,
    }>("/creation_api/media/creation/delete?mediaId=" + mediaId);
}

export async function useLatest7DayPlayStats(creatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MediaSummary,
    }>("/creation_api/media/play/latest7DayPlayStats?creatorMemberId=" + creatorMemberId + "&albumId=" + albumId);
}

export async function useYesterdayPlayStats(creatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MediaSummary,
    }>("/creation_api/media/play/yesterdayPlayStats?creatorMemberId=" + creatorMemberId + "&albumId=" + albumId);
}

export async function useLatest30DayPlayStats(creatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MediaSummary,
    }>("/creation_api/media/play/latest30DayPlayStats?creatorMemberId=" + creatorMemberId + "&albumId=" + albumId);
}

export async function useLatestOneYearDayPlayStats(creatorMemberId: string, albumId: string) {
    return await http.get<{
        code: number,
        message: string,
        data: MediaSummary,
    }>("/creation_api/media/play/latestYearPlayStats?creatorMemberId=" + creatorMemberId + "&albumId=" + albumId);
}