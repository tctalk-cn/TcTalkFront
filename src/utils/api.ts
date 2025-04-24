import {SongUrl} from "@/models/song_url.ts";
import http from "@/utils/http";
import {Song} from "@/models/song.ts";
import {SearchHotDetail, SearchSuggest} from "@/models/search.ts";
import {Banner} from "@/models/banner.ts";
import {DjProgram, Personalized, PersonalizedMv, PersonalizedNewSong} from "@/models/personalized.ts";
import {PlayListDetail, PlaylistHighqualityTag} from "@/models/playlist.ts";
import {TopListDetail} from "@/models/toplist_detail.ts";
import {PersonalizedPrivateContent, Video, VideoGroup} from "@/models/video.ts";
import {MvUrl} from "@/models/mv.ts";
import {Artist, Mv} from "@/models/artist.ts";
import {ArtistDesc, ArtistDetail} from "@/models/artist_detail.ts";
import {Album} from "@/models/album.ts";
import {TopCategory} from "@/models/category.ts";
import {RoomInfo, RoomPlayUrl} from "@/models/room_info.ts";
import {UpUser} from "@/models/up_user.ts";
import {Gift} from "@/models/gift.ts";

export async function useLogin(phone: string, password: string) {
    return await http.get<{
        code: number,
        cookie: string,
        token: string,
    }>("api/login/cellphone", {phone: phone, password: password})
}


export async function useSearchHotDetail() {
    const {data} = await http.get<{ data: SearchHotDetail[] }>('api/search/hot/detail')
    return data
}

export async function useSearchSuggest(keywords: string) {
    const {result} = await http.get<{ result: SearchSuggest }>('api/search/suggest', {keywords: keywords})
    return result
}

export async function useDetail(id: number) {
    const {songs} = await http.get<{ songs: Song[] }>('api/song/detail', {ids: id})
    return songs.first()
}

export async function useBanner() {
    const {banners} = await http.get<{ banners: Banner[] }>('api/banner', {type: 1});
    return banners;
}

export async function usePersonalized() {
    const {result} = await http.get<{ result: Personalized[] }>('api/personalized')
    return result
}

export async function usePersonalizedNewSong() {
    const {result} = await http.get<{ result: PersonalizedNewSong[] }>('api/personalized/newsong')
    return result
}

export async function useTopCategoryNewSong() {
    const {result} = await http.get<{ result: TopCategory[] }>('api/tccategoty/toplist')
    return result
}


export async function usePlayListDetail(id: number, s: number = 8) {
    const {playlist} = await http.get<{ playlist: PlayListDetail }>('api/playlist/detail', {id: id, s: s})
    return playlist
}

export async function usePersonalizedDjProgram() {
    const {result} = await http.get<{ result: DjProgram[] }>('api/personalized/djprogram')
    return result
}

export async function useTopListDetail() {
    const {list} = await http.get<{ list: TopListDetail[] }>('api/toplist/detail')
    return list
}

export async function useSongUrl(id: number) {
    const {data} = await http.get<{ data: SongUrl[] }>('api/song/url', {id: id})
    return data.first()
}


export async function useVideoTimelineRecommend(offset: number = 0) {
    const {datas} = await http.get<{ datas: Video[] }>('api/video/timeline/recommend', {offset: offset})
    return datas
}


export async function usePersonalizedPrivateContentList(limit: number = 10, offset: number = 0) {
    const {result} = await http.get<{ result: PersonalizedPrivateContent[] }>('api/personalized/privatecontent/list', {
        limit: limit,
        offset: offset
    })
    return result
}


export async function usePersonalizedMv() {
    const {result} = await http.get<{ result: PersonalizedMv[] }>('api/personalized/mv')
    return result
}

export async function useVideoGroupList() {
    const {data} = await http.get<{ data: VideoGroup[] }>('api/video/group/list')
    return data
}

export async function useMvUrl(id: number) {
    const {data} = await http.get<{ data: MvUrl }>("api/mv/url", {id: id})
    return data
}

export async function usePlayListTrackAll(id: number) {

    const {songs} = await http.get<{ songs: Song[] }>('api/playlist/track/all', {id: id})
    return songs
}

export async function useVideoGroup(id?: number, offset?: number) {
    const {datas} = await http.get<{ datas: Video[] }>(id ? 'api/video/group' : 'api/video/timeline/all', {
        id: id,
        offset: offset
    })
    return datas
}


export async function userArtistList(pageData: {
    type: number,
    area: number,
    initial: string,
    page: number,
    limit: number
}) {
    const res = await http.get<{ artists: Artist[] }>('api/artist/list', {
        type: pageData.type,
        area: pageData.area,
        initial: pageData.initial,
        limit: pageData.limit,
        offset: (pageData.page - 1) * pageData.limit
    })

    return res.artists
}

export async function useArtistDetail(id: number) {
    const {data} = await http.get<{ data: ArtistDetail }>('api/artist/detail', {id: id})
    return data
}

export async function useArtistAlbum(id: number, limit: number = 10, offset: number = 0) {
    return await http.get<{ hotAlbums: Album[] }>('api/artist/album', {id: id, limit: limit, offset: offset})
}

export async function useArtistDesc(id: number) {
    return await http.get<ArtistDesc>('api/artist/desc', {id: id})
}

export async function useArtistSongs(id: number, order: string = 'time', limit: number = 10, offset: number = 0) {
    return await http.get<{ songs: Song[] }>('api/artist/songs', {id: id, order: order, limit: limit, offset: offset})
}

export async function useArtistMv(id: number, limit: number = 10, offset: number = 0) {
    return await http.get<{ mvs: Mv[] }>('api/artist/mv', {id: id, limit: limit, offset: offset})
}

export async function usePlaylistHighqualityTags() {
    const {tags} = await http.get<{ tags: PlaylistHighqualityTag[] }>("api/playlist/highquality/tags")
    return tags
}

export async function useTopPlaylistHighquality(params?: { limit?: number, before?: number, cat: string }) {
    return await http.get<{
        playlists: PlayListDetail[],
        total: number,
        more: boolean,
        lasttime: number
    }>("api/top/playlist/highquality", params)

}

export async function useRoomInfo(roomId: number) {
    const {roomInfo} = await http.get<{ roomInfo: RoomInfo }>("api/live/room/info", {roomId: roomId})
    return roomInfo
}

export async function usePlayUrl(roomId: number) {
    const {playUrl} = await http.get<{ playUrl: RoomPlayUrl }>("api/live/room/play_url", {roomId: roomId})
    return playUrl
}


/**
 * 获取up主信息
 */
export async function useUserInfo(mId: number) {
    const {upUser} = await http.get<{ upUser: UpUser }>('api/live/up/' + mId)
    return upUser
}

// /**
//  * 获取弹幕
//  */
// export async function useVideoBarrage(cId: number) {
//     const {barrageDatas} = await http.get<{ barrageDatas: VideoBarrage[] }>('api/av/barrage/' + cId)
//     return barrageDatas
// }


// 获取礼物
export async function useRoomGifts(){
    const {gifts} = await http.get<{ gifts: Gift[] }>("api/live/room/gifts")
    return gifts
}