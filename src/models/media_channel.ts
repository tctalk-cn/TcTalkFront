/**
 * 频道对象，此为一级品类
 */
export interface MediaChannel {
    id: string;
    name: string;
    urlPath: string;
}

/**
 * 定制化的会员频道
 */
export interface CustomizedMediaChannel {
    id?: string;
    channelId: string;
    channelName: string;
    urlPath: string;
    sort: number;
}


/**
 * 定制化的会员频道
 */
export class CustomizedMediaChannelCreator {
    channelId: string;
    sort: number;
}